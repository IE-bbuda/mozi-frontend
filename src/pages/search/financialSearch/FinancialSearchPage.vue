<template>
  <div class="container py-3">
    <!-- :top: 상단: 정책 탐색 + 검색 아이콘 -->
    <div
      class="d-flex justify-content-center align-items-center mb-2 position-relative"
    >
      <h4 class="mb-0 fw-bold text-center w-100">금융 탐색</h4>
      <i
        class="fa-solid fa-magnifying-glass fa-lg"
        @click="toggleSearch"
        style="cursor: pointer"
      ></i>
    </div>

    <!-- :mag: 토글 검색창 -->
    <div class="mb-2" v-if="showSearch">
      <input
        v-model="searchKeyword"
        type="text"
        class="form-control"
        placeholder="검색어를 입력하세요"
      />
    </div>

    <!--  필터 버튼 -->
    <div class="d-flex justify-content-end mb-2">
      <button
        class="btn btn-outline-secondary btn-sm"
        @click="toggleFilterPanel"
      >
        <i class="fa-solid fa-sliders"></i>
      </button>
    </div>
    <FinancialFilter
      v-if="showFilter"
      @filter-applied="handleFilter"
      @close="showFilter = false"
    />

    <!-- :open_file_folder: 카테고리 탭 -->
    <ul
      class="nav nav-tabs justify-content-between small mb-2"
      style="font-size: 0.85rem"
    >
      <li
        v-for="tab in categories"
        :key="tab"
        class="nav-item"
        style="flex: 1; text-align: center"
      >
        <a
          href="#"
          :class="['nav-link', currentCategory === tab ? 'active' : '']"
          @click.prevent="selectCategory(tab)"
          style="padding: 6px 4px"
        >
          {{ tab }}
        </a>
      </li>
    </ul>

    <!-- :white_check_mark:  카드 리스트 반복 -->
    <FinancialCard
      v-for="(item, index) in currentProductList"
      :key="index"
      :deposit="item"
      :productType="currentCategory"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios'; // axios 추가
import FinancialCard from './financialCard.vue';
import FinancialFilter from './financialFilter.vue'; // 필터 컴포넌트 추가

const searchKeyword = ref('');
const currentCategory = ref('예금');
const showFilter = ref(false);
const showSearch = ref(false);

const selectedFilter = ref({
  period: '',
  rateSort: '',
  banks: [],
});

const categories = ['예금', '적금'];
const depositList = ref([]);
const savingList = ref([]);

const bankLogoMap = {
  '0010001': 'wooribank.png',
  '0010002': 'scbank.png',
  '0010016': 'imbank.png',
  '0010017': 'bnkbank.png',
  '0010019': 'gwangjubank.png',
  '0010020': 'shinhanbank.png',
  '0010022': 'gwangjubank.png',
  '0010024': 'bnkbank.png',
  '0010026': 'ibkbank.png',
  '0010030': 'kdbbank.png',
  '0010927': 'kbbank.png',
  '0011625': 'shinhanbank.png',
  '0013175': 'nhbank.png',
  '0013909': 'kebhanabank.png',
  '0014674': 'kbank.png',
  '0014807': 'suhyupbank.png',
  '0015130': 'kakaobank.png',
  '0017801': 'tossbank.png',
};
const defaultLogo = '/default-bank-logo.png';

function getBankLogoUrl(bankCode) {
  const fileName = bankLogoMap[bankCode];
  if (fileName) {
    return `/images/financial/${fileName}`;
  }
  return defaultLogo;
}

// 예금 데이터 불러오기 함수
const fetchDeposits = async () => {
  try {
    const res = await axios.get('/api/deposits');
    depositList.value = res.data.map((d) => ({
      ...d,
      logoUrl: getBankLogoUrl(d.bankCode),
    }));
    console.log('예금 상품 개수:', depositList.value.length);
  } catch (e) {
    console.error('예금 데이터 불러오기 실패:', e);
  }
};
// 적금 데이터 불러오기 함수
const fetchSavings = async () => {
  try {
    const res = await axios.get('/api/savings');
    savingList.value = res.data.map((s) => ({
      ...s,
      logoUrl: getBankLogoUrl(s.bankCode),
    }));
    console.log('적금 상품 개수:', savingList.value.length);
  } catch (e) {
    console.error('적금 데이터 불러오기 실패:', e);
  }
};

const toggleFilterPanel = () => {
  console.log('필터실행됨');
  showFilter.value = !showFilter.value;
};
const toggleSearch = () => {
  showSearch.value = !showSearch.value;
};
const selectCategory = (tab) => {
  currentCategory.value = tab;
  if (tab === '예금') {
    fetchDeposits();
  } else if (tab === '적금') {
    fetchSavings();
  } else {
    depositList.value = [];
    savingList.value = [];
  }
};

function handleFilter(selected) {
  // 선택된 필터값 처리 (예시: 콘솔 출력)
  console.log('선택된 필터:', selected);
  selectedFilter.value = selected; //필터에서 보낸 값 저장
}
const currentProductList = computed(() => {
  if (!depositList.value || !savingList.value) return []; // 데이터 없으면 빈 배열

  // 예금/적금 선택
  let list =
    currentCategory.value === '예금' ? depositList.value : savingList.value;

  // 🏦 은행 필터
  if (selectedFilter.value?.banks?.length > 0) {
    list = list.filter((item) =>
      selectedFilter.value.banks.includes(item.bankCode)
    );
  }

  // ⏳ 기간 필터 (options 마지막 saveTrm 기준)
  if (
    selectedFilter.value?.period !== '' &&
    selectedFilter.value?.period != null
  ) {
    const selectedPeriod = Number(selectedFilter.value.period);

    list = list.filter((item) => {
      if (!item.options || item.options.length === 0) return false;
      const lastOption = item.options[item.options.length - 1]; // 마지막 옵션
      return Number(lastOption.saveTrm) <= selectedPeriod;
    });
  }

  // 🖥 가입 방법 필터
  if (selectedFilter.value?.joinWays?.length > 0) {
    list = list.filter((item) => {
      const productJoinWays = item.joinWay ? item.joinWay.split(',') : []; // 문자열 → 배열 변환
      return selectedFilter.value.joinWays.some((way) =>
        productJoinWays.includes(way)
      );
    });
  }

  // 📈 금리 정렬 (options에서 최고 금리 기준)
  if (selectedFilter.value?.rateSort) {
    list = [...list].sort((a, b) => {
      const aMaxRate = Math.max(
        ...a.options.map((opt) => opt.intrRate2 ?? opt.intrRate)
      );
      const bMaxRate = Math.max(
        ...b.options.map((opt) => opt.intrRate2 ?? opt.intrRate)
      );

      if (selectedFilter.value.rateSort === 'high') {
        return bMaxRate - aMaxRate; // 높은 금리순
      } else if (selectedFilter.value.rateSort === 'base') {
        const aBase = Math.max(...a.options.map((opt) => opt.intrRate));
        const bBase = Math.max(...b.options.map((opt) => opt.intrRate));
        return bBase - aBase; // 기본 금리순
      }
    });
  }

  // 🔍 검색 필터
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase();
    list = list.filter(
      (item) =>
        item.productName.toLowerCase().includes(keyword) ||
        item.bankName.toLowerCase().includes(keyword)
    );
  }

  console.log('필터 적용 후 상품 개수:', list.length);
  return list;
});
onMounted(() => {
  fetchDeposits(); //초기 로딩 시 예금 데이터 자동 불러오기
});
</script>
