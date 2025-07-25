<template>
  <div class="container py-3">
    <!-- :top: 상단: 정책 탐색 + 검색 아이콘 -->
    <div class="d-flex justify-content-center align-items-center mb-2 position-relative">
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

    <!-- 🎛 필터 버튼 -->
    <div class="d-flex justify-content-end mb-2">
      <button
        class="btn btn-outline-secondary btn-sm"
        @click="toggleFilterPanel"
      >
        <i class="fa-solid fa-sliders"></i>
      </button>
    </div>

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

    <!-- :white_check_mark: 정책 카드 리스트 반복 -->
    <FinancialCard
      v-for="(deposit, index) in depositList"
      :key="index"
      :deposit="deposit"
    />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // axios 추가
import FinancialCard from './financialCard.vue';

const searchKeyword = ref('');
const currentCategory = ref('전체');
const showFilter = ref(false);
const showSearch = ref(false);

const categories = ['예금', '적금'];
const depositList = ref([]);

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
    depositList.value = res.data.map(d => ({
      ...d,
      logoUrl: getBankLogoUrl(d.bankCode)
    }));
    console.log(depositList.value);
  } catch (e) {
    console.error('예금 데이터 불러오기 실패:', e);
  }
};

const toggleFilterPanel = () => {
  showFilter.value = !showFilter.value;
};
const toggleSearch = () => {
  showSearch.value = !showSearch.value;
};
const selectCategory = (tab) => {
  currentCategory.value = tab;
  if (tab === '예금') {
    fetchDeposits();
  } else {
    depositList.value = [];
  }
};

onMounted(() => {
  selectCategory('예금');
});

</script>
