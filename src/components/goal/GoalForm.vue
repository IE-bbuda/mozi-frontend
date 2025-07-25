<template>
  <div class="goal-form-container">
    <div class="page-header">
      <h1 class="page-title">
        {{ presetData?.goalName ? `${presetData.goalName} 설정` : '나의 목표' }}
      </h1>
      <!-- 1억 모으기 프리셋일 때 특별한 아이콘 표시 -->
      <div v-if="presetData?.goalName === '1억 모으기'" class="billion-icon">
        <i class="fas fa-star"></i>
      </div>
    </div>

    <!-- 1억 모으기 안내 메시지 -->
    <div v-if="presetData?.goalName === '1억 모으기'" class="preset-notice">
      <div class="notice-content">
        <i class="fas fa-info-circle"></i>
        <span
          >1억 모으기 도전에 참가하시는군요! 목표를 향해 함께 달려봐요 🎯</span
        >
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="goal-form">
      <!-- 목표명 -->
      <div class="form-group">
        <label for="goalName">목표명</label>
        <input
          id="goalName"
          type="text"
          v-model="form.goalName"
          placeholder="목표명을 입력하세요"
          :readonly="!!presetData?.goalName"
          :class="{ 'preset-input': !!presetData?.goalName }"
          required
        />
      </div>

      <!-- 목표 금액 -->
      <div class="form-group">
        <label for="targetAmount">목표 금액</label>
        <div class="amount-input">
          <input
            id="targetAmount"
            type="number"
            v-model="form.targetAmount"
            placeholder="0"
            min="0"
            :readonly="!!presetData?.targetAmount"
            :class="{ 'preset-input': !!presetData?.targetAmount }"
            required
          />
          <span class="currency">원</span>
        </div>
        <div v-if="presetData?.targetAmount" class="preset-info">
          <i class="fas fa-lock"></i>
          <span>프리셋으로 설정된 금액입니다</span>
        </div>
      </div>

      <!-- 현재 금액 (수정 모드일 때만 표시) 진행률 바 테스트용 추후 계좌 연결시 삭제 -->
      <div v-if="isEdit" class="form-group">
        <label for="currentAmount">현재 금액</label>
        <div class="amount-input">
          <input
            id="currentAmount"
            type="number"
            v-model="form.currentAmount"
            placeholder="0"
            min="0"
          />
          <span class="currency">원</span>
        </div>
      </div>

      <!-- 목표 기간 -->
      <div class="form-group">
        <label for="targetDate">목표 기간</label>
        <input id="targetDate" type="date" v-model="form.targetDate" required />
      </div>

      <!-- 목표 키워드 -->
      <div class="form-group">
        <label>목표 키워드</label>
        <div class="keyword-buttons">
          <button
            type="button"
            v-for="keyword in keywords"
            :key="keyword"
            :class="[
              'keyword-btn',
              {
                active: form.keyword === keyword,
                preset:
                  presetData?.keyword === keyword && form.keyword === keyword,
              },
            ]"
            @click="form.keyword = keyword"
          >
            # {{ keyword }}
          </button>
        </div>
        <div
          v-if="presetData?.keyword && form.keyword === presetData.keyword"
          class="preset-info"
        >
          <i class="fas fa-star"></i>
          <span>추천 키워드가 선택되었습니다</span>
        </div>
      </div>

      <!-- 추가 메모 -->
      <div class="form-group">
        <label for="memo">추가 메모</label>
        <textarea
          id="memo"
          v-model="form.memo"
          :placeholder="
            presetData?.goalName === '1억 모으기'
              ? 'ex. 1억을 모아서 꿈을 이루겠어!'
              : isEdit
              ? form.memo || 'ex. 꼭 집을 사겠어'
              : 'ex. 꼭 집을 사겠어'
          "
          rows="3"
          maxlength="50"
        ></textarea>
        <div class="char-count">{{ form.memo.length }}/50</div>
      </div>

      <!-- 포함된 계좌 (간단한 체크박스로 표시) 현재는 그냥 예시용 더미 추후 계좌 연결시 추가예정-->
      <div class="form-group">
        <label>포함된 계좌</label>
        <div class="account-list">
          <div class="account-item">
            <label class="checkbox-label">
              <input type="checkbox" value="1" />
              <span class="checkmark"></span>
              <div class="account-info">
                <span class="bank-name">KB국민은행</span>
                <span class="account-number">****-****-1234</span>
                <span class="balance">5,000,000원</span>
              </div>
            </label>
          </div>
          <div class="account-item">
            <label class="checkbox-label">
              <input type="checkbox" value="2" />
              <span class="checkmark"></span>
              <div class="account-info">
                <span class="bank-name">신한은행</span>
                <span class="account-number">****-****-5678</span>
                <span class="balance">3,000,000원</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="form-actions">
        <button type="button" class="cancel-btn" @click="handleCancel">
          취소
        </button>
        <button
          type="submit"
          :class="[
            'submit-btn',
            { 'billion-submit': presetData?.goalName === '1억 모으기' },
          ]"
        >
          {{ isEdit ? '수정' : '등록' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';

// Props 정의
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  goalData: {
    type: Object,
    default: () => ({}),
  },
  presetData: {
    type: Object,
    default: null,
  },
});

// Emits 정의
const emit = defineEmits(['submit', 'cancel']);

// 키워드 목록
const keywords = ['결혼', '취업', '내집마련', '여행', '학자금', '취미'];

// 폼 데이터
const form = reactive({
  goalName: '',
  targetAmount: '',
  currentAmount: '',
  targetDate: '',
  keyword: '',
  memo: '',
  selectedAccounts: [],
});

// 폼 초기화 (수정 모드일 때 또는 프리셋 데이터가 있을 때)
const initializeForm = () => {
  // 프리셋 데이터가 있는 경우 (1억 모으기 등)
  if (props.presetData) {
    form.goalName = props.presetData.goalName || '';
    form.targetAmount = props.presetData.targetAmount || '';
    form.keyword = props.presetData.keyword || '';
    form.memo = props.presetData.memo || '';
  }

  // 수정 모드인 경우 (기존 데이터 우선)
  if (props.isEdit && props.goalData) {
    form.goalName = props.goalData.name || '';
    form.targetAmount = props.goalData.targetAmount || '';
    form.currentAmount = props.goalData.currentAmount || 0;
    form.targetDate = props.goalData.targetDate || '';
    form.keyword = props.goalData.keyword || '';
    form.memo = props.goalData.memo || '';
    form.selectedAccounts = props.goalData.selectedAccounts || [];
  }
};

// 폼 제출
const handleSubmit = () => {
  if (!validateForm()) return;

  const formData = {
    goalName: form.goalName,
    targetAmount: parseInt(form.targetAmount),
    currentAmount: props.isEdit ? parseInt(form.currentAmount || 0) : 0,
    targetDate: form.targetDate,
    keyword: form.keyword,
    memo: form.memo,
    selectedAccounts: form.selectedAccounts,
  };

  emit('submit', formData);
};

// 취소
const handleCancel = () => {
  emit('cancel');
};

// 폼 유효성 검사
const validateForm = () => {
  if (!form.goalName.trim()) {
    alert('목표명을 입력해주세요.');
    return false;
  }
  if (!form.targetAmount || form.targetAmount <= 0) {
    alert('올바른 목표 금액을 입력해주세요.');
    return false;
  }
  if (!form.targetDate) {
    alert('목표 기간을 설정해주세요.');
    return false;
  }
  if (!form.keyword) {
    alert('목표 키워드를 선택해주세요.');
    return false;
  }
  return true;
};

// props 변경 감지
watch(
  () => props.presetData,
  () => {
    initializeForm();
  },
  { immediate: true }
);

// 컴포넌트 마운트 시 폼 초기화
onMounted(() => {
  initializeForm();
});
</script>

<style scoped>
.goal-form-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.billion-icon {
  color: #ffd700;
  font-size: 20px;
  animation: sparkle 2s ease-in-out infinite alternate;
}

@keyframes sparkle {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.preset-notice {
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
  border: 1px solid #ffd700;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.notice-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #b8860b;
  font-size: 14px;
  font-weight: 500;
}

.notice-content i {
  color: #ffd700;
}

.goal-form {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.preset-input {
  background-color: #f8f9fa !important;
  border-color: #ffd700 !important;
  color: #666 !important;
}

.preset-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 12px;
  color: #b8860b;
}

.preset-info i {
  color: #ffd700;
}

.amount-input {
  position: relative;
}

.currency {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 14px;
}

.keyword-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.keyword-btn:hover {
  border-color: #007bff;
  color: #007bff;
}

.keyword-btn.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.keyword-btn.preset {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border-color: #ffd700;
  color: #b8860b;
  font-weight: 600;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12px;
}

.checkbox-label input[type='checkbox'] {
  width: auto;
  margin: 0;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bank-name {
  font-weight: 500;
  color: #333;
}

.account-number {
  font-size: 12px;
  color: #666;
}

.balance {
  font-size: 13px;
  color: #007bff;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn,
.submit-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.submit-btn {
  background: #666;
  color: white;
}

.submit-btn:hover {
  background: #555;
}

.billion-submit {
  background: linear-gradient(135deg, #ffd700, #ffed4e) !important;
  color: #b8860b !important;
  font-weight: 600 !important;
}

.billion-submit:hover {
  background: linear-gradient(135deg, #ffed4e, #ffd700) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .goal-form-container {
    padding: 15px;
  }

  .goal-form {
    padding: 20px;
  }

  .keyword-buttons {
    gap: 6px;
  }

  .keyword-btn {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
