<template>
  <div v-if="loading" class="loading-container">
    <div class="loading-spinner">목표를 생성하는 중...</div>
  </div>

  <GoalForm
    v-else
    :is-edit="false"
    :preset-data="presetData"
    @submit="handleCreateGoal"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGoalStore } from '@/stores/goalStore';
import { updateAccountsByGoal } from '@/api/accountApi';
import GoalForm from '../../components/goal/GoalForm.vue';

const router = useRouter();
const route = useRoute();
const goalStore = useGoalStore();

const loading = ref(false);

// 1억 모으기 프리셋 데이터
const presetData = computed(() => {
  if (route.query.preset === 'billion') {
    return {
      goalName: '1억 모으기',
      targetAmount: 100000000,
    };
  }
  return null;
});

// 목표 생성 처리 - goalStore 사용
const handleCreateGoal = async (formData) => {
  try {
    loading.value = true;

    // 1. 목표 생성 (계좌 데이터 제외)
    const goalPayload = {
      goalName: formData.goalName,
      targetAmount: formData.targetAmount,
      goalDate: formData.goalDate,
      keyword: formData.keyword,
      memo: formData.memo,
      goalStatus: true, // ← 명시적으로 true 설정
    };

    const createdGoal = await goalStore.createGoal(goalPayload);
    console.log('Goal created successfully:', createdGoal);

    // 2. 선택된 계좌가 있으면 연결 (계좌팀 요청 형식)
    if (
      formData.accountData &&
      formData.accountData.accountNumberList &&
      formData.accountData.accountNumberList.length > 0
    ) {
      try {
        // 계좌팀 요청 형식: { goalId: 5, accountNumberList: ['111-222-333', '444-555-666'] }
        const accountLinkData = {
          goalId: createdGoal.goalId,
          accountNumberList: formData.accountData.accountNumberList,
        };

        await updateAccountsByGoal(accountLinkData);
        console.log('Accounts linked to goal successfully');
      } catch (accountError) {
        console.error('계좌 연결 실패:', accountError);
        // 목표는 생성되었지만 계좌 연결 실패 시 알림
        alert(
          '목표는 생성되었지만 계좌 연결에 실패했습니다. 나중에 수정에서 계좌를 연결해주세요.'
        );
      }
    }

    // 목표 메인 페이지로 이동
    router.push({ name: 'goalMain' });
  } catch (error) {
    console.error('Error creating goal:', error);

    // goalStore의 에러 처리
    if (goalStore.error) {
      alert('목표 생성 중 오류가 발생했습니다.');
    }
  } finally {
    loading.value = false;
  }
};

// 취소 처리
const handleCancel = () => {
  router.push({ name: 'goalMain' });
};
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  background-color: #f5f5f7;
}

.loading-spinner {
  font-size: 16px;
  color: #6b7684;
}
</style>
