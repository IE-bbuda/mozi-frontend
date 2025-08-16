<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getMainBankSummary } from '@/api/accountApi';
import { useBankStore } from '@/stores/bank';
import { useGoalStore } from '@/stores/goalStore';
import FinancialCard from '@/pages/search/financialSearch/financialCard.vue';
import GoalCard from '@/components/goal/GoalCard.vue';
import GoalEmptyCard from '@/components/goal/GoalEmptyCard.vue';
import goalApi from '@/api/goalApi';
import { getScrappedPolicyIds } from '@/api/scrapApi';
import policyApi from '@/api/policyApi';
import { getTopSavings, getTopDeposits } from '@/api/financialApi';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { useAuthStore } from '@/stores/auth';
import PersonalInfoPrompt from '@/components/profile/PersonalInfoPrompt.vue';

import RecommendPolicyCard from './recommend/policy/recommendPolicyCard.vue';

const router = useRouter();
const route = useRoute();
const goalStore = useGoalStore();
const bankStore = useBankStore();

const bankSummaryList = ref(null);
const isUnlinked = ref(false);
const isMainBank = ref(false);
const isLoading = ref(true);
const products = ref([]);

const banks = bankStore.banks;

const deadlinePolicies = ref([]);

const authStore = useAuthStore();
const showPersonalPrompt = ref(false);
const remainingDays = ref(0);

// 퍼스널 정보 상태 체크
const checkPersonalInfoNeeded = async () => {
  try {
    console.log('🔥 퍼스널 정보 필요 여부 확인');

    // 현재 사용자별 다시 보지 않기 설정 확인
    const userInfo = authStore.userInfo;
    const loginId = userInfo?.loginId;

    if (loginId) {
      const neverShow = localStorage.getItem(
        `personalInfoPromptNeverShow_${loginId}`
      );
      if (neverShow === 'true') {
        console.log(
          '🔥 퍼스널 정보 프롬프트 다시 보지 않기 설정됨 - 사용자:',
          loginId
        );
        return;
      }
    }

    const status = await authStore.checkPersonalInfoStatus();
    console.log('🔥 퍼스널 정보 상태:', status);

    const needsPrompt = status.needs_prompt || status.needsPrompt;
    const daysRemaining = status.days_remaining || status.daysRemaining || 0;

    if (needsPrompt) {
      showPersonalPrompt.value = true;
      remainingDays.value = daysRemaining;
      console.log('🔥 퍼스널 정보 프롬프트 표시:', {
        show: true,
        remainingDays: daysRemaining,
      });
    }
  } catch (error) {
    console.error('🔥 퍼스널 정보 상태 확인 실패:', error);
  }
};

const handlePromptDismiss = () => {
  showPersonalPrompt.value = false;
  console.log('🔥 퍼스널 정보 프롬프트 닫기');
};
// 새로운 함수 추가
const handlePromptNeverShow = () => {
  showPersonalPrompt.value = false;
  // localStorage에 다시 보지 않기 설정 저장
  localStorage.setItem('personalInfoPromptNeverShow', 'true');
  console.log('🔥 퍼스널 정보 프롬프트 다시 보지 않기 설정');
};

function goToAccountAuth() {
  router.push({
    path: '/account/AccountAgreementPage',
    query: {
      mode: 'first',
      redirect: route.fullPath, // 돌아갈 곳 저장(메인 or 요약)
    },
  });
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

// 🎯 개선: 메인페이지에서 목표 상세보기로 이동 시 from=main 쿼리 추가
const goToGoalDetail = (goalId) => {
  router.push({
    path: `/goal/${goalId}`,
    query: { from: 'main' }, // 메인페이지에서 왔다는 정보 추가
  });
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

const loadDeadlinePolicies = async () => {
  try {
    const [result, scrapped] = await Promise.all([
      policyApi.getDeadlinePolicies(31),
      getScrappedPolicyIds(),
    ]);
    const nos = (scrapped ?? []).map((n) => String(n).trim());
    deadlinePolicies.value = (result ?? []).map((p) => {
      const no = String(p.plcyNo ?? '').trim();
      return { ...p, plcyNo: no, bookmarked: nos.includes(no) };
    });
  } catch (error) {
    console.error('🔥 마감 임박 정책 로딩 실패:', error);
  }
};

const props = defineProps({
  deadlinePolicies: {
    type: Array,
    required: true,
  },
});

// 샘플 금융상품 데이터 (예시용)
const sampleProductList = ref([
  {
    savingId: 1, // 적금 ID (depositId 대신 savingId 등 명확히)
    productName: '청년 희망 적금',
    bankCode: '0010927', // 은행 코드 (로고 출력용)
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
  loadDeadlinePolicies();

  // 퍼스널 정보 체크 (인증된 사용자인 경우에만)
  if (authStore.isAuthenticated) {
    // 약간의 지연을 두고 체크 (다른 API 호출 완료 후)
    setTimeout(async () => {
      await checkPersonalInfoNeeded();
    }, 1000);
  }
});

onMounted(async () => {
  try {
    const [depositData, savingData] = await Promise.all([
      getTopDeposits(),
      getTopSavings(),
    ]);

    // 데이터 합치기 (type 필드 추가)
    products.value = [
      ...depositData.map((d) => ({ ...d, type: '예금' })),
      ...savingData.map((s) => ({ ...s, type: '적금' })),
    ];
  } catch (err) {
    console.error('금융 상품 불러오기 실패:', err);
  }
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
  <!-- 퍼스널 정보 입력 프롬프트 (최상단에 배치) -->
  <PersonalInfoPrompt
    v-if="showPersonalPrompt"
    :remaining-days="remainingDays"
    @dismiss="handlePromptDismiss"
    @never-show="handlePromptNeverShow"
  />

  <!-- 목표 리스트 -->
  <div class="section-header">
    <p class="section-title">나의 목표</p>
    <i
      class="fa-solid fa-angle-right fa-sm section-arrow"
      @click="goToGoalPage"
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
  <div class="section-header">
    <p class="section-title">나의 자산</p>
    <i
      class="fa-solid fa-angle-right fa-sm section-arrow"
      @click="goToTotalPage"
    ></i>
  </div>

  <div class="section-content">
    <div v-if="isUnlinked" class="card card-unlinked">
      <div class="card-text">연동시 더 많은 기능을 이용할 수 있어요!</div>
      <button class="card-btn" @click="goToAccountAuth">계좌 연동</button>
    </div>

    <div v-else-if="bankSummaryList" class="card">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          min-width: 0;
        "
      >
        <img
          :src="bankLogoUrl"
          alt="은행 로고"
          style="height: 47px; margin: 0"
        />
        <div
          style="text-align: left; margin-left: 12px; flex: 1 1 0; min-width: 0"
        >
          <div style="font-size: 16px; font-weight: 500; margin-bottom: -3px">
            {{
              bankSummaryList?.totalBalance
                ? bankSummaryList.totalBalance.toLocaleString()
                : '0'
            }}원
          </div>
          <div
            style="
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 12px;
              color: #555;
              margin-top: 3px;
            "
          >
            <!-- 계좌명만 말줄임 -->
            <span
              style="
                flex: 0 1 auto;
                min-width: 0; /* 카드 폭에 맞게 조절 */
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
              "
            >
              {{ bankSummaryList?.representativeAccountName }}
            </span>

            <!-- 외 N개 계좌는 항상 보이게 -->
            <span style="flex: 0 0 auto">
              외 {{ (bankSummaryList?.accountCount || 1) - 1 }}개
            </span>
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
              style="color: #ffd43b; position: relative; top: -20px; left: 4px"
            ></i>
          </span>
        </div>
      </div>
    </div>

    <div v-else class="card">
      <!-- <p>로딩 중...</p> -->
    </div>
  </div>

  <!-- 마감임박 정책 -->
  <div class="section-header">
    <p class="section-title">마감 임박 정책</p>
    <i
      class="fa-solid fa-angle-right fa-sm section-arrow"
      @click="goToPolicyPage"
    ></i>
  </div>
  <!-- 정책 카드뷰 -->
  <div class="section-content">
    <Swiper
      v-if="deadlinePolicies.length > 0"
      :slides-per-view="'auto'"
      :space-between="16"
      :pagination="{ clickable: true }"
      :modules="[Pagination]"
      class="policy-swiper"
    >
      <SwiperSlide
        v-for="policy in deadlinePolicies"
        :key="policy.plcyNo || policy.policyId"
        class="policy-slide"
      >
        <RecommendPolicyCard
          :policy="policy"
          :is-scrapped="policy.bookmarked"
          :showDday="true"
          sourceTab="main"
          @bookmark-changed="
            ({ plcyNo, bookmarked }) => {
              const i = deadlinePolicies.value.findIndex(
                (p) => String(p.plcyNo).trim() === String(plcyNo).trim()
              );
              if (i !== -1) deadlinePolicies.value[i].bookmarked = bookmarked;
            }
          "
        />
      </SwiperSlide>
    </Swiper>
  </div>

  <!-- 금융 상품 -->
  <div class="section-header">
    <p class="section-title">금융 상품</p>
    <i
      class="fa-solid fa-angle-right fa-sm section-arrow"
      @click="goToFinancialPage"
    ></i>
  </div>

  <!-- 예, 적금 우대 금리 상위 2개 상품 출력 -->
  <div class="section-content">
    <Swiper
      v-if="products.length > 0"
      :slides-per-view="'auto'"
      :space-between="16"
      :pagination="{ clickable: true }"
      :modules="[Pagination]"
      class="financial-swiper"
    >
      <SwiperSlide
        v-for="(item, index) in products"
        :key="index"
        class="financial-slide"
      >
        <FinancialCard
          :deposit="item"
          :productType="item.type"
          sourceTab="main"
          
        />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped>
/* 섹션 헤더 통일 스타일 */
.section-header {
  display: flex;
  align-items: center;
  padding: 8px 20px 8px 20px;
  gap: 8px;
}

.section-title {
  color: #6b7684;
  font-weight: bold;
  font-size: 16px;
  margin: 0;
}

.section-arrow {
  color: #d9d9d9;
  cursor: pointer;
  font-size: 12px;
}

/* 섹션 콘텐츠 통일 스타일 */
.section-content {
  padding: 0 20px 8px 20px;
}

.card {
  width: 100%;
  height: 80px;
  margin: auto;
  padding: 0px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: #fff;
  text-align: center;
  border: 1px solid #e0e0e0;
}
.card-unlinked {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80px;
  gap: 8px;
}

.card-text {
  font-size: 11px;
  text-align: center;
  white-space: nowrap;
}
.card-btn {
  background: #f2f4f6;
  color: #6b7684;
  border: 1.5px solid #f2f4f6;
  border-radius: 18px;
  padding: 6px 16px;
  font-size: 11px; /* 목표 버튼과 동일 */
  font-weight: 600;
  width: 105px; /* 목표 버튼 기준 정확히 일치 (or 100%면 wrapper로 통일) */
  height: 25px; /* 명시적 높이 부여 */
  line-height: 1;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-btn:hover {
  transform: translateY(-2px);
  background: #e0e0e0;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-btn:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

.goal-main-container {
  padding: 0 20px 0px 20px;
  margin-bottom: 12px;
}

.goals-container {
  flex: 1;
}

.goals-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.financial-swiper {
  width: 100%;

}

.financial-slide {
  width: 100%; /* 화면의 90% 너비 */
}

::v-deep(.financial-swiper .swiper-pagination) {
  position: static !important;
  margin-top: -1px;
  padding-top: 0px;
}

.policy-swiper {
  width: 100%;
 
}
.policy-slide {
  width: 100%;
}
::v-deep(.policy-swiper .swiper-pagination) {
  position: static !important;
  margin-top: -1px;
  padding-top: 0px;
}
</style>
