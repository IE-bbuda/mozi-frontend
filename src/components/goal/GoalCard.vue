<template>
  <div
    :class="['goal-card', { 'billion-goal': isBillionGoal }]"
    @click="handleCardClick"
  >
    <!-- 목표 이름과 버튼 -->
    <div class="card-header">
      <div class="goal-info">
        <h3 class="goal-name">
          <i v-if="isBillionGoal" class="fas fa-star billion-star"></i>
          {{ goal.name }}
        </h3>
      </div>
      <div class="action-buttons">
        <button class="edit-btn" @click.stop="goToEdit" aria-label="목표 수정">
          <i class="fas fa-edit"></i>
        </button>
        <button
          class="delete-btn"
          @click.stop="showDeleteModal = true"
          aria-label="목표 삭제"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <!-- 진행률 바 -->
    <div class="progress-section">
      <ProgressBar
        :current="goal.currentAmount"
        :target="goal.targetAmount"
        :progress="goal.progress"
        :is-billion-goal="isBillionGoal"
      />
    </div>

    <!-- 금액 정보 -->
    <div class="amount-info">
      <span class="current-amount">{{
        formatCurrency(goal.currentAmount)
      }}</span>
      <span class="divider">/</span>
      <span class="target-amount">{{ formatCurrency(goal.targetAmount) }}</span>
    </div>

    <!-- 1억 모으기 특별 메시지 -->
    <div v-if="isBillionGoal" class="billion-message">
      <i class="fas fa-medal"></i>
      <span>1억 모으기 도전 중!</span>
    </div>
  </div>

  <!-- 삭제 확인 모달 -->
  <div
    v-if="showDeleteModal"
    class="modal-overlay"
    @click="showDeleteModal = false"
  >
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>목표 삭제</h3>
      </div>
      <div class="modal-body">
        <p>'{{ goal.name }}' 목표를 정말 삭제하시겠습니까?</p>
        <p class="warning-text">삭제된 목표는 복구할 수 없습니다.</p>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="showDeleteModal = false">
          취소
        </button>
        <button class="confirm-btn" @click="confirmDelete">삭제</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ProgressBar from './ProgressBar.vue';

const router = useRouter();
const showDeleteModal = ref(false);

// Props 정의
const props = defineProps({
  goal: {
    type: Object,
    required: true,
  },
});

// Emits 정의
const emit = defineEmits(['delete', 'click']);

// 1억 모으기 목표인지 확인
const isBillionGoal = computed(() => {
  return (
    props.goal.name === '1억 모으기' && props.goal.targetAmount === 100000000
  );
});

// 카드 클릭 핸들러
const handleCardClick = () => {
  emit('click', props.goal.id);
};

// 수정 페이지로 이동
const goToEdit = () => {
  router.push({
    name: 'goalEdit',
    params: { goalId: props.goal.id },
  });
};

// 삭제 확인
const confirmDelete = () => {
  emit('delete', props.goal.id);
  showDeleteModal.value = false;
};

// 금액 포맷팅 함수
const formatCurrency = (amount) => {
  // amount가 undefined나 null인 경우 처리
  if (amount == null || amount === undefined) {
    return '0원';
  }

  // 숫자가 아닌 경우 처리
  const numAmount = Number(amount);
  if (isNaN(numAmount)) {
    return '0원';
  }

  if (numAmount >= 100000000) {
    return `${(numAmount / 100000000).toFixed(1)}억원`;
  } else if (numAmount >= 10000) {
    return `${(numAmount / 10000).toFixed(0)}만원`;
  } else {
    return `${numAmount.toLocaleString()}원`;
  }
};
</script>

<style scoped>
.goal-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e9ecef;
  position: relative;
}

.goal-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* 1억 모으기 특별 스타일 */
.billion-goal {
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
  border: 2px solid #ffd700;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.2);
}

.billion-goal:hover {
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.3);
  transform: translateY(-3px);
}

.billion-goal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffd700, #ffed4e, #ffd700);
  border-radius: 12px 12px 0 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.goal-info {
  display: flex;
  align-items: center;
}

.goal-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.billion-star {
  color: #ffd700;
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

.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #666;
}

.edit-btn:hover {
  background-color: #f8f9fa;
  color: #333;
}

.delete-btn:hover {
  background-color: #fff5f5;
  color: #dc3545;
}

.progress-section {
  margin-bottom: 12px;
}

.amount-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.current-amount {
  font-weight: 600;
  color: #333;
}

.billion-goal .current-amount {
  color: #b8860b;
}

.divider {
  color: #999;
}

.target-amount {
  color: #666;
}

.billion-message {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(90deg, #ffd700, #ffed4e);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #b8860b;
  justify-content: center;
}

.billion-message .fas {
  color: #b8860b;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 320px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 0 0 10px;
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

.warning-text {
  font-size: 14px !important;
  color: #dc3545 !important;
}

.modal-footer {
  padding: 10px 20px 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.cancel-btn,
.confirm-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #666;
}

.cancel-btn:hover {
  background-color: #e9ecef;
}

.confirm-btn {
  background-color: #dc3545;
  color: white;
}

.confirm-btn:hover {
  background-color: #c82333;
}
</style>
