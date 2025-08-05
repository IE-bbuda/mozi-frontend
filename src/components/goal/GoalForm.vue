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

      <!-- 현재 금액 (수정 모드일 때만 표시) -->
      <div v-if="isEdit" class="form-group">
        <label for="currentAmount">현재 금액</label>
        <div class="amount-input">
          <input
            id="currentAmount"
            type="number"
            v-model="form.currentAmount"
            placeholder="0"
            min="0"
            readonly
          />
          <span class="currency">원</span>
        </div>
        <div class="preset-info">
          <i class="fas fa-info-circle"></i>
          <span>연결된 계좌 잔액의 합계입니다</span>
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
            :key="keyword.key"
            :class="[
              'keyword-btn',
              {
                active: form.keyword === keyword.key,
                preset:
                  presetData?.keyword === keyword.key &&
                  form.keyword === keyword.key,
              },
            ]"
            @click="form.keyword = keyword.key"
          >
            # {{ keyword.label }}
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

      <!-- 포함된 계좌 -->
      <div class="form-group">
        <label>포함된 계좌</label>
        <div v-if="loading" class="loading-accounts">
          계좌 정보를 불러오는 중...
        </div>
        <div v-else-if="accountList.length === 0" class="no-accounts">
          연결 가능한 계좌가 없습니다.
        </div>
        <div v-else class="account-list">
          <div
            v-for="account in accountList"
            :key="account.accountId"
            :class="[
              'account-item',
              {
                selected: form.selectedAccountNumbers.includes(
                  account.accountNumber
                ),
                'linked-to-other':
                  accountGoalInfo[account.accountNumber] &&
                  !form.selectedAccountNumbers.includes(account.accountNumber),
              },
            ]"
          >
            <label class="checkbox-label">
              <input
                type="checkbox"
                :value="account.accountNumber"
                v-model="form.selectedAccountNumbers"
                @change="updateCurrentAmount"
                :disabled="
                  accountGoalInfo[account.accountNumber] &&
                  !form.selectedAccountNumbers.includes(account.accountNumber)
                "
              />
              <span class="checkmark"></span>
              <div class="account-info">
                <span class="bank-name">{{
                  account.bankName || account.bankCode
                }}</span>
                <span class="account-number">{{
                  maskAccountNumber(account.accountNumber)
                }}</span>
                <span class="balance">{{
                  formatAmount(account.balance || 0)
                }}</span>
                <!-- 다른 목표에 연결된 계좌 표시 -->
                <div
                  v-if="accountGoalInfo[account.accountNumber]"
                  class="linked-goal-info"
                >
                  <i class="fas fa-link"></i>
                  <span
                    >"{{ accountGoalInfo[account.accountNumber].goalName }}"에
                    연결됨</span
                  >
                </div>
              </div>
            </label>
            <div
              v-if="form.selectedAccountNumbers.includes(account.accountNumber)"
              class="selected-indicator"
            >
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
        </div>
        <div
          v-if="form.selectedAccountNumbers.length > 0"
          class="selected-summary"
        >
          <i class="fas fa-check-circle"></i>
          <span>{{ form.selectedAccountNumbers.length }}개 계좌 선택됨</span>
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
          :disabled="loading"
        >
          {{ isEdit ? '수정' : '등록' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';

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

// API 임포트
import goalApi from '@/api/goalApi';
import { getAccountList, getAccountsByGoal } from '@/api/accountApi';

// 계좌 목록 상태
const accountList = ref([]);
const loading = ref(false);
const accountGoalInfo = ref({}); // 계좌별 목표 연결 정보

// 키워드 목록 - goalApi의 getKeywordLabel 메서드와 매칭
const keywords = [
  { key: 'MARRIAGE', label: '결혼' },
  { key: 'EMPLOYMENT', label: '취업' },
  { key: 'HOME_PURCHASE', label: '내집마련' },
  { key: 'TRAVEL', label: '여행' },
  { key: 'EDUCATION_FUND', label: '학자금' },
  { key: 'HOBBY', label: '취미' },
];

// 폼 데이터
const form = reactive({
  goalName: '',
  targetAmount: '',
  currentAmount: 0,
  targetDate: '',
  keyword: '',
  memo: '',
  selectedAccountNumbers: [], //변경: accountId 대신 accountNumber 사용
});

//  선택된 계좌들의 잔액 합계 계산
const updateCurrentAmount = () => {
  if (props.isEdit) {
    const selectedAccounts = accountList.value.filter((account) =>
      form.selectedAccountNumbers.includes(account.accountNumber)
    );
    form.currentAmount = selectedAccounts.reduce(
      (sum, account) => sum + (account.balance || 0),
      0
    );
  }
};

// 계좌별 연결된 목표 정보 조회
const loadAccountGoalInfo = async () => {
  try {
    // 모든 목표 조회
    const goalsResponse = await goalApi.getGoals();
    const goals = goalsResponse || [];

    const goalInfo = {};

    // 각 목표별로 연결된 계좌 조회
    for (const goal of goals) {
      try {
        const linkedResponse = await getAccountsByGoal(goal.goalId);
        const linkedAccounts = linkedResponse.accountList || [];

        // 각 계좌에 목표 정보 매핑
        linkedAccounts.forEach((account) => {
          if (goal.goalId !== props.goalData?.id) {
            // 현재 수정 중인 목표 제외
            goalInfo[account.accountNumber] = {
              goalId: goal.goalId,
              goalName: goal.goalName,
            };
          }
        });
      } catch (error) {
        console.error(`목표 ${goal.goalId}의 계좌 조회 실패:`, error);
      }
    }

    accountGoalInfo.value = goalInfo;
  } catch (error) {
    console.error('계좌-목표 연결 정보 조회 실패:', error);
  }
};

// 계좌 목록 로드 함수
const loadAccounts = async () => {
  loading.value = true;
  try {
    const response = await getAccountList();
    accountList.value = response.accountList || [];

    // 계좌별 목표 연결 정보 로드
    await loadAccountGoalInfo();

    // 수정 모드이고 goalId가 있으면 연결된 계좌 정보 가져오기
    if (props.isEdit && props.goalData?.id) {
      const linkedResponse = await getAccountsByGoal(props.goalData.id);
      const linkedAccounts = linkedResponse.accountList || [];

      // 연결된 계좌번호 목록 설정
      form.selectedAccountNumbers = linkedAccounts.map(
        (acc) => acc.accountNumber
      );

      // 현재 금액 업데이트
      updateCurrentAmount();
    }
  } catch (error) {
    console.error('계좌 목록 로드 실패:', error);
    accountList.value = [];
  } finally {
    loading.value = false;
  }
};

// 날짜 포맷 변환 함수 (LocalDateTime -> yyyy-MM-dd)
const formatDateForInput = (dateString) => {
  if (!dateString) return '';

  // "2024-12-31 23:59:59" 또는 "2024-12-31T23:59:59" 형식을 "2024-12-31"로 변환
  return dateString.split(' ')[0].split('T')[0];
};

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
    // 날짜 포맷 변환 적용
    form.targetDate = formatDateForInput(props.goalData.targetDate) || '';
    form.keyword = props.goalData.keyword || '';
    form.memo = props.goalData.memo || '';
  }
};

// 폼 제출
const handleSubmit = () => {
  if (!validateForm()) return;

  // goalApi의 formatGoalData 사용하여 데이터 포맷팅
  const formData = goalApi.formatGoalData({
    goalName: form.goalName,
    targetAmount: parseInt(form.targetAmount),
    currentAmount: props.isEdit ? parseInt(form.currentAmount || 0) : 0,
    goalDate: form.targetDate,
    keyword: form.keyword,
    memo: form.memo,
  });

  // 계좌팀 요청 형식으로 데이터 구성
  const accountData = {
    goalId: props.goalData?.id || null,
    accountNumberList: form.selectedAccountNumbers,
  };

  emit('submit', { ...formData, accountData });
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

// goalApi의 금액 포맷팅 사용
const formatAmount = (amount) => {
  return goalApi.formatAmount(amount);
};

// 키워드 한글 라벨 가져오기
const getKeywordLabel = (keywordKey) => {
  return goalApi.getKeywordLabel(keywordKey);
};

// 계좌번호 마스킹 처리 함수
const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  const length = accountNumber.length;
  if (length <= 4) return accountNumber;

  const firstPart = accountNumber.slice(0, 4);
  const lastPart = accountNumber.slice(-4);
  const middlePart = '*'.repeat(Math.max(0, length - 8));

  return `${firstPart}${middlePart}${lastPart}`;
};

// 컴포넌트 마운트 시 폼 초기화 및 계좌 로드
onMounted(() => {
  initializeForm();
  loadAccounts();
});
</script>

<style scoped>
.goal-form-container {
  padding: 20px;
  background-color: #f5f5f7;
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
  color: #2f9b78;
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
  background: #d2f5e9;
  border: 1px solid #2f9b78;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.notice-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2f9b78;
  font-size: 14px;
  font-weight: 500;
}

.notice-content i {
  color: #2f9b78;
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
  border-color: #2f9b78;
}

.preset-input {
  background-color: #d2f5e9 !important;
  border-color: #2f9b78 !important;
  color: #2f9b78 !important;
}

.preset-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 12px;
  color: #2f9b78;
}

.preset-info i {
  color: #2f9b78;
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
  border-color: #2f9b78;
  color: #2f9b78;
}

.keyword-btn.active {
  background: #2f9b78;
  border-color: #2f9b78;
  color: white;
}

.keyword-btn.preset {
  background: linear-gradient(135deg, #2f9b78, #d2f5e9);
  border-color: #2f9b78;
  color: #ffffff;
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

.loading-accounts,
.no-accounts {
  padding: 20px;
  text-align: center;
  color: #6b7684;
  font-size: 14px;
  background-color: #f2f4f6;
  border-radius: 8px;
}

.account-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.2s ease;
  background-color: white;
  position: relative;
}

.account-item:hover {
  border-color: #2f9b78;
  background-color: #d2f5e9;
}

.account-item.selected {
  border-color: #2f9b78;
  background-color: #d2f5e9;
  box-shadow: 0 2px 8px rgba(47, 155, 120, 0.2);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12px;
}

.checkbox-label input[type='checkbox'] {
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
  accent-color: #2f9b78;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
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
  color: #2f9b78;
  font-weight: 500;
}

.account-item.linked-to-other {
  background-color: #f8f9fa;
  border-color: #dee2e6;
  opacity: 0.7;
}

.account-item.linked-to-other .checkbox-label {
  cursor: not-allowed;
}

.account-item.linked-to-other input[type='checkbox'] {
  cursor: not-allowed;
}

.linked-goal-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 11px;
  color: #6c757d;
  font-style: italic;
}

.linked-goal-info i {
  color: #6c757d;
  font-size: 10px;
}

@keyframes checkAnimation {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.selected-summary {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #d2f5e9;
  border-radius: 6px;
  font-size: 13px;
  color: #2f9b78;
}

.selected-summary i {
  color: #2f9b78;
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
  background: #f2f4f6;
  color: #6b7684;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.submit-btn {
  background: #6b7684;
  color: white;
}

.submit-btn:hover {
  background: #555;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.billion-submit {
  background: linear-gradient(135deg, #2f9b78, #d2f5e9) !important;
  color: #ffffff !important;
  font-weight: 600 !important;
}

.billion-submit:hover {
  background: linear-gradient(135deg, #237a5f, #2f9b78) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(47, 155, 120, 0.3);
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
