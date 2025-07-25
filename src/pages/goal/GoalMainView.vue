<template>
  <div class="goal-main-container">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <h1 class="page-title">나의 목표</h1>
      <router-link :to="{ name: 'goalCreate' }" class="add-button">
        <i class="fas fa-plus"></i>
      </router-link>
    </div>

    <!-- 1억 모으기 배너 (1억 모으기 목표가 없을 때만 표시) -->
    <div
      v-if="!hasBillionGoal"
      class="banner-section"
      @click="goToBillionGoalCreate"
    >
      <div class="banner-content">
        <div class="banner-icon">
          <i class="fas fa-star"></i>
        </div>
        <div class="banner-text">
          <div class="banner-title">'1억 모으기'에 참가하시겠습니까?</div>
          <div class="banner-subtitle">지금 시작해서 목표를 달성해보세요!</div>
        </div>
        <div class="banner-arrow">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>

    <!-- 목표 카드 리스트 -->
    <div class="goals-container">
      <div v-if="goals.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-flag"></i>
        </div>
        <p>아직 설정된 목표가 없습니다.</p>
        <p>첫 번째 목표를 설정해보세요!</p>
      </div>

      <div v-else class="goals-list">
        <GoalCard
          v-for="goal in sortedGoals"
          :key="goal.goal_id"
          :goal="transformGoal(goal)"
          @click="goToGoalDetail(goal.goal_id)"
          @delete="handleDeleteGoal"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GoalCard from '../../components/goal/GoalCard.vue';
import mockData from '../../data/db.json';

const router = useRouter();

// 목표 데이터
const goals = ref([]);

// 1억 모으기 목표가 있는지 확인
const hasBillionGoal = computed(() => {
  return goals.value.some(
    (goal) =>
      goal.goal_name === '1억 모으기' && goal.target_amount === 100000000
  );
});

// 1억 모으기 목표들을 찾기
const billionGoals = computed(() => {
  return goals.value.filter(
    (goal) =>
      goal.goal_name === '1억 모으기' && goal.target_amount === 100000000
  );
});

// 목표 정렬 (1억 모으기 목표를 최상단에 배치)
const sortedGoals = computed(() => {
  return [...goals.value].sort((a, b) => {
    const aIsBillion =
      a.goal_name === '1억 모으기' && a.target_amount === 100000000;
    const bIsBillion =
      b.goal_name === '1억 모으기' && b.target_amount === 100000000;

    // 1억 모으기 목표를 최상단에 배치
    if (aIsBillion && !bIsBillion) return -1;
    if (!aIsBillion && bIsBillion) return 1;

    // 나머지는 생성일 순으로 정렬
    return new Date(b.created_at) - new Date(a.created_at);
  });
});

// 목표 데이터 로드
const loadGoals = () => {
  // 로컬 스토리지에서 먼저 확인
  const storedData = localStorage.getItem('moziGoals');

  if (storedData) {
    goals.value = JSON.parse(storedData);
  } else {
    // 로컬 스토리지가 없으면 mockData로 초기화
    goals.value = mockData.goals;
    localStorage.setItem('moziGoals', JSON.stringify(mockData.goals));
  }
};

// 목표 데이터 변환 (GoalCard 컴포넌트 형식에 맞게)
const transformGoal = (goal) => {
  return {
    id: goal.goal_id,
    name: goal.goal_name,
    currentAmount: goal.current_amount,
    targetAmount: goal.target_amount,
    progress: (goal.current_amount / goal.target_amount) * 100,
    targetDate: goal.goal_date,
    memo: goal.memo,
  };
};

// 1억 모으기 목표 생성 페이지로 이동
const goToBillionGoalCreate = () => {
  router.push({
    name: 'goalCreate',
    query: { preset: 'billion' },
  });
};

// 목표 삭제 처리
const handleDeleteGoal = (goalId) => {
  const index = goals.value.findIndex((g) => g.goal_id === goalId);
  if (index > -1) {
    goals.value.splice(index, 1);
    // 로컬 스토리지 업데이트
    localStorage.setItem('moziGoals', JSON.stringify(goals.value));
  }
};

// 목표 상세 페이지로 이동
const goToGoalDetail = (goalId) => {
  router.push({ name: 'goalDetail', params: { goalId } });
};

// 컴포넌트 마운트 시 실행
onMounted(() => {
  loadGoals();
});

// 페이지 포커스 시 데이터 새로고침 (다른 페이지에서 수정 후 돌아왔을 때)
window.addEventListener('focus', loadGoals);
</script>

<style scoped>
.goal-main-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 5px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.add-button {
  color: #333;
  font-size: 18px;
  text-decoration: none;
  padding: 8px;
}

.banner-section {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.banner-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
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

.banner-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  z-index: 1;
}

.banner-icon {
  font-size: 24px;
  color: #b8860b;
  animation: sparkle 2s ease-in-out infinite alternate;
}

.banner-text {
  flex: 1;
}

.banner-title {
  font-size: 16px;
  font-weight: 600;
  color: #b8860b;
  margin-bottom: 4px;
}

.banner-subtitle {
  font-size: 13px;
  color: #996f00;
}

.banner-arrow {
  font-size: 16px;
  color: #b8860b;
}

.goals-container {
  flex: 1;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state p {
  margin: 10px 0;
  font-size: 16px;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 480px) {
  .goal-main-container {
    padding: 15px;
  }

  .page-header {
    margin-bottom: 15px;
  }

  .page-title {
    font-size: 16px;
  }

  .banner-content {
    gap: 12px;
  }

  .banner-title {
    font-size: 14px;
  }

  .banner-subtitle {
    font-size: 12px;
  }

  .goals-list {
    gap: 15px;
  }
}
</style>
