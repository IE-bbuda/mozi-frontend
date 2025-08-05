<template>
  <div class="goal-empty-card">
    <div class="card-icon">
      <i class="fas fa-rocket"></i>
    </div>
    <div class="card-content">
      <h3 class="card-title">1억 모으기에 참가하시겠습니까?</h3>
      <p class="card-description">
        지금 시작하면 꿈의 목표를 달성 주선할 수 있어요!
      </p>
      <button @click="handleClick" class="goal-setup-btn">목표 설정하기</button>
    </div>
  </div>
</template>

<script setup>
// 부모 컴포넌트에 클릭 이벤트 전달
const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>

<style scoped>
.goal-empty-card {
  background: linear-gradient(135deg, #36c18c 0%, #4dd4a8 100%);
  border-radius: 16px;
  padding: 16px 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(54, 193, 140, 0.3);
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.goal-empty-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.card-icon {
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 6px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 3px 0;
  line-height: 1.2;
}

.card-description {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.goal-setup-btn {
  background: #ffffff;
  color: #36c18c;
  border: none;
  border-radius: 18px;
  padding: 6px 16px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.goal-setup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #f8f9fa;
}

.goal-setup-btn:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}
</style>
