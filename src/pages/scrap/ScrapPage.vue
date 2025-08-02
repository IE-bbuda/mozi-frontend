<template>
  <div class="container py-3">
    <h4 class="fw-bold mb-3">내 스크랩</h4>

    <!-- 카테고리 탭 -->
    <ul
      class="nav nav-tabs justify-content-between small mb-2"
      style="font-size: 0.85rem"
    >
      <li
        v-for="tab in ['정책', '금융']"
        :key="tab"
        class="nav-item"
        style="flex: 1; text-align: center"
      >
        <a
          href="#"
          :class="['nav-link', activeTab === (tab === '정책' ? 'policy' : 'finance') ? 'active' : '']"
          @click.prevent="changeTab(tab === '정책' ? 'policy' : 'finance')"
          style="padding: 6px 4px"
        >
          {{ tab }}
        </a>
      </li>
    </ul>

    <!-- 정책 스크랩 리스트 -->
    <div v-if="activeTab === 'policy'">
      <policyCard
        v-for="policy in policyScraps"
        :key="policy.policyId"
        :policy="policy"
        :isScrapped="true"
      />
      <div v-if="policyScraps.length === 0" class="text-muted text-center">
        스크랩한 정책이 없습니다 🥲
      </div>
    </div>

    <!-- 금융 스크랩 리스트 -->
    <div v-else>
      <financialCard
        v-for="product in financeScraps"
        :key="product.financeId"
        :deposit="product"
        :productType="product.productType"
      />
      <div v-if="financeScraps.length === 0" class="text-muted text-center">
        스크랩한 금융 상품이 없습니다 🥲
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import policyCard from '../search/policySearch/policyCard.vue';
import financialCard from '../search/financialSearch/financialCard.vue';
import { getScrappedPolicies } from '@/api/scrapApi';

const route = useRoute();
const router = useRouter();
const userId = 1; //임시 유저 정보 (추후 수정)

// URL query parameter에서 탭 상태 가져오기, 없으면 기본값 'policy'
const activeTab = ref(route.query.tab || 'policy');

const policyScraps = ref([]);
const financeScraps = ref([]);

// 금융 스크랩 데이터 가져오기
const fetchFinanceScraps = async () => {
  try {
    const response = await axios.get('/api/scrap/finance', {
      params: { userId }
    });
    
    console.log('스크랩 데이터:', response.data);
    
    // 백엔드에서 이미 상품 정보가 포함되어 있으므로 바로 매핑
    const scrapDetails = response.data.map((scrap) => {
      const product = scrap.product;
      
      if (scrap.productType === 'SAVING') {
        return {
          savingId: product.savingId,
          productName: product.productName,
          bankName: product.bankName,
          bankCode: product.bankCode,
          target: product.joinMember,
          joinWay: product.joinWay,
          options: product.options,
          productType: '적금',
          createdAt: scrap.createdAt
        };
      } else {
        return {
          depositId: product.depositId,
          productName: product.productName,
          bankName: product.bankName,
          bankCode: product.bankCode,
          target: product.joinMember,
          joinWay: product.joinWay,
          options: product.options,
          productType: '예금',
          createdAt: scrap.createdAt
        };
      }
    });
    
    // 최근 스크랩 순서로 정렬 (createdAt 기준 내림차순)
    scrapDetails.sort((a, b) => {
      // createdAt이 배열 형태 [year, month, day, hour, minute, second]로 전송됨
      const dateA = new Date(a.createdAt[0], a.createdAt[1] - 1, a.createdAt[2], a.createdAt[3], a.createdAt[4], a.createdAt[5]);
      const dateB = new Date(b.createdAt[0], b.createdAt[1] - 1, b.createdAt[2], b.createdAt[3], b.createdAt[4], b.createdAt[5]);
      return dateB - dateA; // 최신 날짜가 먼저 오도록
    });
    
    financeScraps.value = scrapDetails;
    console.log('처리된 스크랩 데이터:', financeScraps.value);
  } catch (error) {
    console.error('금융 스크랩 데이터 가져오기 실패:', error);
    financeScraps.value = [];
  }
};

onMounted(async () => {
  policyScraps.value = await getScrappedPolicies(userId);
  
  // 초기 탭에 따른 데이터 로드
  if (activeTab.value === 'finance') {
    await fetchFinanceScraps();
  }
});

// 탭 변경 시 URL 업데이트 및 데이터 로드
const changeTab = async (tab) => {
  activeTab.value = tab;
  
  // URL query parameter 업데이트 (히스토리에 기록하지 않음)
  await router.replace({
    query: { ...route.query, tab }
  });
  
  // 탭에 따른 데이터 로드
  if (tab === 'finance') {
    await fetchFinanceScraps();
  }
};


</script>