<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getMainBankSummary } from '@/api/accountApi';
import { useBankStore } from '@/stores/bank';
import { useGoalStore } from '@/stores/goalStore';
import PolicyCard from '@/pages/search/policySearch/policyCard.vue';
import FinancialCard from '@/pages/search/financialSearch/financialCard.vue';
import GoalCard from '@/components/goal/GoalCard.vue';
import GoalEmptyCard from '@/components/goal/GoalEmptyCard.vue';
import goalApi from '@/api/goalApi';

const router = useRouter();
const route = useRoute();
const goalStore = useGoalStore();
const bankStore = useBankStore();

const bankSummaryList = ref(null);
const isUnlinked = ref(false);
const isMainBank = ref(false);
const isLoading = ref(true);

const banks = bankStore.banks;

function goToAccountAuth() {
  router.push('/account/AccountAgreementPage');
}

function goToTotalPage() {
  router.push('/account/BankSummaryPage');
}

function goToGoalPage() {
  router.push('/goal');
}
function goToFinancialPage() {
  router.push('/financialSearch/FinancialSearchPage');
}
function goToPolicyPage() {
  router.push('/policySearch/PolicySearchPage');
}

// 목표 정렬 (1억 모으기 우선)
const sortedGoals = computed(() => {
  return [...goalStore.goals].sort((a, b) => {
    const aIsBillion =
      a.goalName === '1억 모으기' && a.targetAmount === 100000000;
    const bIsBillion =
      b.goalName === '1억 모으기' && b.targetAmount === 100000000;

    if (aIsBillion && !bIsBillion) return -1;
    if (!aIsBillion && bIsBillion) return 1;

    return new Date(b.createdAt) - new Date(a.createdAt);
  });
});

// 목표 로딩
const loadGoals = async () => {
  try {
    await goalStore.getGoals();

    for (const goal of goalStore.goals) {
      try {
        const currentAmount = await goalApi.getCurrentAmountByGoal(goal.goalId);
        goal.currentAmount = currentAmount;
      } catch (error) {
        console.error(`목표 ${goal.goalId}의 현재 금액 조회 실패:`, error);
        goal.currentAmount = 0;
      }
    }
  } catch (error) {
    console.error('목표 로딩 실패:', error);
  }
};

// GoalCard 형식으로 변환
const transformGoal = (goal) => {
  return {
    id: goal.goalId,
    name: goal.goalName,
    currentAmount: goal.currentAmount || 0,
    targetAmount: goal.targetAmount,
    progress:
      goal.currentAmount && goal.targetAmount
        ? Math.floor((goal.currentAmount / goal.targetAmount) * 100)
        : 0,
    targetDate: goal.goalDate,
    memo: goal.memo,
  };
};

const goToBillionGoalCreate = () => {
  router.push({ name: 'goalCreate', query: { preset: 'billion' } });
};

const handleDeleteGoal = async (goalId) => {
  if (!confirm('정말로 이 목표를 삭제하시겠습니까?')) return;

  try {
    await goalStore.deleteGoal(goalId);
    console.log('목표가 성공적으로 삭제되었습니다.');
  } catch (error) {
    console.error('목표 삭제 실패:', error);
    alert('목표 삭제에 실패했습니다.');
  }
};

const goToGoalDetail = (goalId) => {
  router.push({ name: 'goalDetail', params: { goalId } });
};

// 은행 로고
const bankLogoUrl = computed(() => {
  const bank = banks.find((b) => b.code === bankSummaryList.value?.bankCode);
  return bank?.logo || '/images/financial/default.png';
});

// 요약 불러오기
const loadSummary = async () => {
  isLoading.value = true;
  try {
    const response = await getMainBankSummary();
    if (!response.success) {
      isUnlinked.value = true;
      return;
    }
    bankSummaryList.value = response.mainBankSummary ?? null;
    isUnlinked.value = false;
    isMainBank.value = !!response.mainBankCode;
  } catch (e) {
    isUnlinked.value = true;
    console.error('계좌 조회 실패:', e);
  } finally {
    isLoading.value = false;
  }
};

// 샘플 정책 데이터 (예시용)
const samplePolicies = ref([
  {
    plcyNo: 1,
    title: '청년 지원 정책',
    description: '청년을 위한 다양한 지원 사업입니다.',
    bookmarked: true,
  },
]);

// 샘플 금융상품 데이터 (예시용)
const sampleProductList = ref([
  {
    savingId: 1, // 적금 ID (depositId 대신 savingId 등 명확히)
    productName: '청년 희망 적금',
    bankCode: 'KB', // 은행 코드 (로고 출력용)
    bankName: '국민은행',
    options: [
      {
        intrRate: 3.5, // 기본 금리
        intrRate2: 4.0, // 최고 금리
        saveTrm: 12, // 기간(개월)
      },
    ],
    bookmarked: true,
    target: '청년', // 대상 정보
  },
]);

onMounted(() => {
  loadSummary();
  loadGoals();
});

watch(
  () => route.query.refresh,
  (val) => {
    if (val === 'true') {
      loadSummary();
      loadGoals();
    }
  }
);
</script>

<template>
  <!-- 목표 리스트 -->
  <div style="display: flex">
    <p
      style="margin: 10px 10px -30px 25px; color: #6b7684; font-weight: bolder"
    >
      나의 목표
    </p>
    <i
      class="fa-solid fa-angle-right fa-sm"
      @click="goToGoalPage"
      style="color: #d9d9d9; cursor: pointer; margin: 23px 0 5px 0"
    ></i>
  </div>

  <div class="goal-main-container">
    <div class="goals-container">
      <!-- 목표가 없을 때: GoalEmptyCard 컴포넌트 사용 -->
      <GoalEmptyCard
        v-if="goalStore.goals.length === 0"
        @click="goToGoalPage"
      />

      <!-- 목표가 있을 때: 기존 GoalCard -->
      <div v-else class="goals-grid">
        <GoalCard
          v-if="sortedGoals.length > 0"
          :goal="transformGoal(sortedGoals[0])"
          @click="goToGoalDetail(sortedGoals[0].goalId)"
          @delete="handleDeleteGoal"
        />
      </div>
    </div>
  </div>

  <!-- 계좌 정보 -->
  <div style="display: flex">
    <p style="margin: 10px 10px 5px 25px; color: #6b7684; font-weight: bolder">
      나의 계좌
    </p>
    <i
      class="fa-solid fa-angle-right fa-sm"
      @click="goToTotalPage"
      style="color: #d9d9d9; cursor: pointer; margin: 23px 0 5px 0"
    ></i>
  </div>

  <div>
    <div v-if="isUnlinked" class="card">
      <div style="font-size: 10px">연동시 더 많은 기능을</div>
      <div style="font-size: 10px">이용할 수 있어요!</div>
      <button
        class="card-btn"
        @click="goToAccountAuth"
        style="position: relative; bottom: 7px"
      >
        <div style="font-size: 10px; color: #6b7684">계좌연동</div>
      </button>
    </div>

    <div v-else-if="bankSummaryList" class="card">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <img
          :src="bankLogoUrl"
          alt="은행 로고"
          style="height: 64px; margin: 0; align-self: flex-start"
        />
        <div style="text-align: left; margin: 10px 0 25px -80px">
          <div style="font-size: 16px; font-weight: 500; margin-bottom: -3px">
            {{
              bankSummaryList?.totalBalance
                ? bankSummaryList.totalBalance.toLocaleString()
                : '0'
            }}원
          </div>
          <div style="font-size: 12px; color: #555">
            {{ bankSummaryList?.representativeAccountName }}외
            {{ (bankSummaryList?.accountCount || 1) - 1 }}개 계좌
          </div>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          "
        >
          <span v-if="isMainBank">
            <i
              class="fa-solid fa-star"
              style="color: #ffd43b; position: relative; top: -30px; left: 8px"
            ></i>
          </span>
        </div>
      </div>
    </div>

    <div v-else class="card">
      <p>로딩 중...</p>
    </div>
  </div>

  <!-- 인기 정책 -->
  <div style="display: flex">
    <p
      style="margin: 10px 10px -30px 25px; color: #6b7684; font-weight: bolder"
    >
      인기 정책
    </p>
    <i
      class="fa-solid fa-angle-right fa-sm"
      @click="goToPolicyPage"
      style="color: #d9d9d9; cursor: pointer; margin: 23px 0 5px 0"
    ></i>
  </div>

  <!-- 샘플 정책 -->
  <div style="margin: 20px">
    <PolicyCard
      v-for="policy in samplePolicies"
      :key="policy.plcyNo"
      :policy="policy"
      :isScrapped="policy.bookmarked"
    />
  </div>

  <!-- 금융 상품 -->
  <div style="display: flex">
    <p
      style="margin: 10px 10px -30px 25px; color: #6b7684; font-weight: bolder"
    >
      금융 상품
    </p>
    <i
      class="fa-solid fa-angle-right fa-sm"
      @click="goToFinancialPage"
      style="color: #d9d9d9; cursor: pointer; margin: 23px 0 5px 0"
    ></i>
  </div>

  <!-- 샘플 상품 -->
  <div style="margin: 20px">
    <FinancialCard
      v-for="(item, index) in sampleProductList"
      :key="index"
      :deposit="item"
      :productType="currentCategory"
    />
  </div>
</template>

<style scoped>
.card {
  width: 350px;
  height: 80px;
  margin: auto;
  padding: 8px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: #fff;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.card-btn {
  display: block;
  width: 200px;
  height: 30px;
  margin: 10px auto 0 auto;
  padding: 6px 0;
  border-radius: 8px;
  border: 1.5px solid #f2f4f6;
  background: #f2f4f6;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  font-size: 14px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.card-btn:active {
  box-shadow: 0 0.5px 2px rgba(0, 0, 0, 0.12);
  background: #e0e0e0;
  transform: scale(0.98);
  transition: box-shadow 0.1s, background 0.1s, transform 0.1s;
}

.goal-main-container {
  padding: 20px;
  background-color: #f8f9fa;
}

.goals-container {
  flex: 1;
}

.goals-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
