<template>
  <div v-if="goalStore.loading" class="loading-container">
    <div class="loading-spinner">목표 정보를 불러오는 중...</div>
  </div>

  <div v-else-if="goalStore.error" class="error-container">
    <div class="error-message">목표 정보를 불러올 수 없습니다.</div>
    <button @click="loadGoalData" class="retry-button">다시 시도</button>
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
import { useGoalStore } from '@/stores/goalStore';
import { getAccountsByGoal, updateAccountsByGoal } from '@/api/accountApi';
import GoalForm from '../../components/goal/GoalForm.vue';

const router = useRouter();
const route = useRoute();
const goalStore = useGoalStore();

const goalData = ref(null);

// 목표 ID
const goalId = parseInt(route.params.goalId);

// 목표 데이터 로드 - goalStore 사용
const loadGoalData = async () => {
  try {
    // 1. 목표 상세 정보 조회
    await goalStore.getGoal(goalId);
    const goal = goalStore.selectedGoal;

    if (!goal) {
      throw new Error('목표를 찾을 수 없습니다.');
    }

    // 2. 목표에 연결된 계좌 목록 조회
    let linkedAccounts = [];
    let currentAmount = 0;

    try {
      const accountsResponse = await getAccountsByGoal(goalId);
      linkedAccounts = accountsResponse.accountList || [];

      // 연결된 계좌들의 잔액 합계 계산
      currentAmount = linkedAccounts.reduce((sum, account) => {
        return sum + (account.balance || 0);
      }, 0);

      console.log('연결된 계좌들:', linkedAccounts);
      console.log('현재 달성 금액:', currentAmount);
    } catch (accountError) {
      console.error('계좌 정보 조회 실패:', accountError);
      // 계좌 정보 조회 실패해도 목표 수정은 가능하도록 진행
    }

    // 3. GoalForm 컴포넌트 형식에 맞게 데이터 변환
    goalData.value = {
      id: goal.goalId,
      name: goal.goalName,
      targetAmount: goal.targetAmount,
      currentAmount: currentAmount, // 계좌 잔액 합계로 설정
      // 날짜 포맷 변환: "yyyy-MM-dd HH:mm:ss" -> "yyyy-MM-dd"
      targetDate: goal.goalDate
        ? goal.goalDate.split(' ')[0].split('T')[0]
        : '',
      keyword: goal.keyword,
      memo: goal.memo,
      //수정: accountNumber 배열로 전달
      selectedAccountNumbers: linkedAccounts.map(
        (account) => account.accountNumber
      ),
    };
  } catch (error) {
    console.error('Error loading goal:', error);

    // goalStore의 에러가 404인 경우 메인 페이지로 리다이렉트
    if (goalStore.error?.response?.status === 404) {
      alert('존재하지 않는 목표입니다.');
      router.push({ name: 'goalMain' });
    }
  }
};

// 목표 수정 처리 - goalStore 사용
const handleUpdateGoal = async (formData) => {
  try {
    // 1. 목표 정보 수정 (계좌 데이터 제외)
    const goalPayload = {
      goalName: formData.goalName,
      targetAmount: formData.targetAmount,
      goalDate: formData.goalDate,
      keyword: formData.keyword,
      memo: formData.memo,
    };

    await goalStore.updateGoal(goalId, goalPayload);
    console.log('Goal updated successfully');

    // 2. 계좌 연결 업데이트 (계좌팀 요청 형식)
    if (formData.accountData && formData.accountData.accountNumberList) {
      try {
        // 계좌팀 요청 형식: { goalId: 5, accountNumberList: ['111-222-333', '444-555-666'] }
        const accountLinkData = {
          goalId: goalId,
          accountNumberList: formData.accountData.accountNumberList,
        };

        await updateAccountsByGoal(accountLinkData);
        console.log('Accounts updated successfully');
      } catch (accountError) {
        console.error('계좌 연결 업데이트 실패:', accountError);
        alert('목표는 수정되었지만 계좌 연결 업데이트에 실패했습니다.');
      }
    }

    // 목표 메인 페이지로 이동
    router.push({ name: 'goalMain' });
  } catch (error) {
    console.error('Error updating goal:', error);

    // goalStore의 에러 처리
    if (goalStore.error) {
      alert('목표 수정 중 오류가 발생했습니다.');
    }
  }
};

// 취소 처리
const handleCancel = () => {
  router.push({ name: 'goalMain' });
};

// 컴포넌트 마운트 시 실행
onMounted(() => {
  if (!goalId || isNaN(goalId)) {
    alert('잘못된 목표 ID입니다.');
    router.push({ name: 'goalMain' });
    return;
  }

  loadGoalData();
});
</script>

<style scoped>
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  gap: 16px;
  background-color: #f5f5f7;
}

.loading-spinner {
  font-size: 16px;
  color: #6b7684;
}

.error-message {
  font-size: 16px;
  color: #dc3545;
  text-align: center;
}

.retry-button {
  padding: 10px 20px;
  background-color: #2f9b78;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.retry-button:hover {
  background-color: #237a5f;
}
</style>
