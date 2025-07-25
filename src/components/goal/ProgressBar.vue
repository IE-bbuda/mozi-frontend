<template>
  <div class="progress-container">
    <!-- 진행률 바 -->
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: `${actualProgress}%` }"
        :class="progressClass"
      ></div>

      <!-- 진행률 아이콘 -->
      <div
        class="progress-icon"
        :style="{ left: `${Math.max(0, Math.min(actualProgress - 2, 96))}%` }"
      >
        <div class="runner-icon">🏃</div>
      </div>
    </div>

    <!-- 진행률 퍼센티지 -->
    <div class="progress-text">
      <span class="progress-percentage"
        >{{ Math.round(actualProgress) }}% 달성</span
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props 정의
const props = defineProps({
  current: {
    type: Number,
    required: true,
    default: 0,
  },
  target: {
    type: Number,
    required: true,
    validator: (value) => value > 0,
  },
  progress: {
    type: Number,
    default: null,
  },
});

// 실제 진행률 계산
const actualProgress = computed(() => {
  // props.progress가 있고 유효한 숫자인 경우 우선 사용
  if (
    props.progress !== null &&
    props.progress !== undefined &&
    !isNaN(props.progress)
  ) {
    return Math.min(Math.max(props.progress, 0), 100);
  }

  // current와 target을 안전하게 숫자로 변환
  const current = Number(props.current) || 0;
  const target = Number(props.target) || 1;

  // target이 0이면 진행률 0%
  if (target === 0) return 0;

  // 진행률 계산
  const calculated = (current / target) * 100;

  // NaN 체크 및 범위 제한 (0-100%)
  if (isNaN(calculated)) return 0;
  return Math.min(Math.max(calculated, 0), 100);
});

// 진행률에 따른 색상 클래스
const progressClass = computed(() => {
  const progress = actualProgress.value;

  if (progress >= 100) return 'complete';
  if (progress >= 80) return 'high';
  if (progress >= 50) return 'medium';
  if (progress >= 30) return 'low';
  return 'very-low';
});
</script>

<style scoped>
.progress-container {
  width: 100%;
  padding-top: 20px;
  position: relative;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: visible;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s ease-in-out;
  position: relative;
}

/* 진행률별 색상 */
.progress-fill.very-low {
  background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
}

.progress-fill.low {
  background: linear-gradient(90deg, #ffa726, #ffb74d);
}

.progress-fill.medium {
  background: linear-gradient(90deg, #42a5f5, #64b5f6);
}

.progress-fill.high {
  background: linear-gradient(90deg, #66bb6a, #81c784);
}

.progress-fill.complete {
  background: linear-gradient(90deg, #4caf50, #66bb6a);
  animation: pulse 2s infinite;
}

/* 완료 시 펄스 애니메이션 추후 추가, 완료시 팝업까지 생각*/
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

.progress-icon {
  position: absolute;
  top: -20px;
  transform: translateX(-50%);
  transition: left 0.6s ease-in-out;
  z-index: 10;
}

.runner-icon {
  font-size: 18px;
  transform: scaleX(-1);
  filter: grayscale(100%) brightness(0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.progress-text {
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-percentage {
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

/* 진행률 100% 달성 시 텍스트 색상 변경 */
.progress-container:has(.complete) .progress-percentage {
  color: #4caf50;
  font-weight: 600;
}
</style>
