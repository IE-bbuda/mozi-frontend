<template>
  <div v-if="loading" class="loading-container">
    <div class="loading-spinner">로딩 중...</div>
  </div>

  <GoalForm
    v-else-if="goalData"
    :is-edit="true"
    :goal-data="goalData"
    @submit="handleUpdateGoal"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import GoalForm from '../../components/goal/GoalForm.vue';
import mockData from '../../data/db.json';

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const goalData = ref(null);

// 목표 ID
const goalId = parseInt(route.params.goalId);

// 목표 데이터 로드
const loadGoalData = () => {
  try {
    loading.value = true;

    // 로컬 스토리지에서 데이터 가져오기 추후 백 연결시 변경예정
    const storedData = localStorage.getItem('moziGoals');
    const goals = storedData ? JSON.parse(storedData) : mockData.goals;

    const goal = goals.find((g) => g.goal_id === goalId);

    if (goal) {
      // GoalForm 컴포넌트 형식에 맞게 변환
      goalData.value = {
        id: goal.goal_id,
        name: goal.goal_name,
        targetAmount: goal.target_amount,
        currentAmount: goal.current_amount,
        targetDate: goal.goal_date,
        keyword: goal.keyword,
        memo: goal.memo,
        selectedAccounts: [],
      };
    } else {
      throw new Error('목표를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('Error loading goal:', error);
    alert('목표 정보를 불러올 수 없습니다.');
    router.push({ name: 'goalMain' });
  } finally {
    loading.value = false;
  }
};

// 목표 수정 처리
const handleUpdateGoal = (formData) => {
  try {
    // 로컬 스토리지에서 데이터 가져오기 추후 백 연결시 변경예정
    const storedData = localStorage.getItem('moziGoals');
    const goals = storedData ? JSON.parse(storedData) : mockData.goals;

    const index = goals.findIndex((g) => g.goal_id === goalId);

    if (index > -1) {
      // 기존 데이터 유지하면서 업데이트
      goals[index] = {
        ...goals[index],
        goal_name: formData.goalName,
        target_amount: formData.targetAmount,
        current_amount: formData.currentAmount,
        goal_date: formData.targetDate,
        keyword: formData.keyword,
        memo: formData.memo,
      };

      localStorage.setItem('moziGoals', JSON.stringify(goals));
      console.log('Goal updated:', goals[index]);
    }

    router.push({ name: 'goalMain' });
  } catch (error) {
    console.error('Error updating goal:', error);
    alert('목표 수정 중 오류가 발생했습니다.');
  }
};

// 취소 처리
const handleCancel = () => {
  router.push({ name: 'goalMain' });
};

// 컴포넌트 마운트 시 실행
onMounted(() => {
  loadGoalData();
});
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.loading-spinner {
  font-size: 16px;
  color: #666;
}
</style>
