<template>
  <div class="container py-3">
    <!-- :top: 상단: 금융 탐색 + 검색 아이콘 -->
    <div class="page-header mb-3">
      <span class="back-btn" @click="goBack">
        <i class="fa-solid fa-angle-left"></i>
      </span>
      <div style="font-size: 18px; font-weight: bold; color: #757575">금융 탐색</div>
    </div>

    <!-- 🔎 검색/필터 툴바 -->
<!-- 🔍 검색/필터 툴바 -->
<div class="toolbar mb-2">
  <input
    v-model="searchKeyword"
    type="text"
    class="search-input"
    placeholder="상품명 입력"
  />
  <button
    v-if="searchKeyword"
    class="clear-btn"
    @click="searchKeyword = ''"
    aria-label="검색어 지우기"
  >
    &times;
  </button>

  <button
    class="btn btn-outline-secondary btn-sm filter-btn"
    @click="toggleFilterPanel"
    aria-label="필터 열기"
  >
    <i class="fa-solid fa-sliders"></i>
  </button>
</div>

    <FinancialFilter
      v-if="showFilter"
      @filter-applied="handleFilter"
      @close-filter="showFilter = false"
    />

    <!-- 🔍 필터 태그 표시 -->
    <div v-if="hasActiveFilters" class="filter-tags mb-2">
      <div class="filter-tags-container">
        <!-- 기간 필터 태그 -->
        <span 
          v-if="selectedFilter.period !== '' && selectedFilter.period != null" 
          class="filter-tag"
        >
          <span class="filter-tag-text">
            {{ getPeriodLabel(selectedFilter.period) }}
          </span>
          <button 
            class="filter-tag-remove" 
            @click="removeFilter('period')"
            aria-label="기간 필터 제거"
          >
            ×
          </button>
        </span>

        <!-- 금리 정렬 필터 태그 -->
        <span 
          v-if="selectedFilter.rateSort" 
          class="filter-tag"
        >
          <span class="filter-tag-text">
            {{ getRateSortLabel(selectedFilter.rateSort) }}
          </span>
          <button 
            class="filter-tag-remove" 
            @click="removeFilter('rateSort')"
            aria-label="금리 정렬 필터 제거"
          >
            ×
          </button>
        </span>

        <!-- 은행 필터 태그들 -->
        <span 
          v-for="bankCode in (selectedFilter.banks || [])" 
          :key="bankCode"
          class="filter-tag"
        >
          <span class="filter-tag-text">
            <img 
              :src="getBankLogoUrl(bankCode)" 
              :alt="getBankName(bankCode)"
              class="filter-tag-bank-logo"
            />
            {{ getBankName(bankCode) }}
          </span>
          <button 
            class="filter-tag-remove" 
            @click="removeBankFilter(bankCode)"
            aria-label="은행 필터 제거"
          >
            ×
          </button>
        </span>

        <!-- 가입 방법 필터 태그들 -->
        <span 
          v-for="joinWay in (selectedFilter.joinWays || [])" 
          :key="joinWay"
          class="filter-tag"
        >
          <span class="filter-tag-text">
           {{ joinWay }}
          </span>
          <button 
            class="filter-tag-remove" 
            @click="removeJoinWayFilter(joinWay)"
            aria-label="가입 방법 필터 제거"
          >
            ×
          </button>
        </span>
      </div>
    </div>

    <!-- ✅ 카테고리 탭 (mozi-tabs 스타일 적용 + 전환) -->
    <ul class="nav mozi-tabs mb-2">
      <li v-for="tab in categories" :key="tab" class="nav-item">
        <a
          href="#"
          class="nav-link"
          :class="{ active: currentCategory === tab }"
          @click.prevent="currentCategory = tab"
        >
          {{ tab }}
        </a>
      </li>
    </ul>

    <!-- ✅ 탭 전환 슬라이드-페이드 + 리스트 전환 애니메이션 -->
    <transition name="slide-fade" mode="out-in">
      <div :key="currentCategory">
        <transition-group name="list-fade" tag="div">
          <FinancialCard
            v-for="(item, index) in currentProductList"
            :key="item.productCode || item.productId || (item.bankCode + '-' + item.productName) || index"
            :deposit="item"
            :productType="currentCategory"
            sourceTab="search"
          />
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import FinancialCard from './financialCard.vue';
import FinancialFilter from './financialFilter.vue';

const router = useRouter();
const searchKeyword = ref('');
const searchInputRef = ref(null);
const focusSearch = () => searchInputRef.value && searchInputRef.value.focus();

const currentCategory = ref('예금');
const showFilter = ref(false);

const selectedFilter = ref({
  period: '',
  rateSort: '',
  banks: [],
  joinWays: []
});
const goBack = () => {
  router.back();
};
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
  return fileName ? `/images/financial/${fileName}` : defaultLogo;
}

const fetchDeposits = async () => {
  try {
    const res = await axios.get('/api/deposits');
    depositList.value = res.data.map((d) => ({
      ...d,
      logoUrl: getBankLogoUrl(d.bankCode),
    }));
  } catch (e) {
    console.error('예금 데이터 불러오기 실패:', e);
  }
};

const fetchSavings = async () => {
  try {
    const res = await axios.get('/api/savings');
    savingList.value = res.data.map((s) => ({
      ...s,
      logoUrl: getBankLogoUrl(s.bankCode),
    }));
  } catch (e) {
    console.error('적금 데이터 불러오기 실패:', e);
  }
};

const toggleFilterPanel = () => {
  showFilter.value = !showFilter.value;
};

function handleFilter(selected) {
  selectedFilter.value = selected;
}

const currentProductList = computed(() => {
  if (!depositList.value || !savingList.value) return [];

  let list =
    currentCategory.value === '예금' ? depositList.value : savingList.value;

  if (selectedFilter.value?.banks?.length > 0) {
    list = list.filter((item) =>
      selectedFilter.value.banks.includes(item.bankCode)
    );
  }

  if (
    selectedFilter.value?.period !== '' &&
    selectedFilter.value?.period != null
  ) {
    const selectedPeriod = Number(selectedFilter.value.period);
    list = list.filter((item) => {
      if (!item.options || item.options.length === 0) return false;
      const lastOption = item.options[item.options.length - 1];
      return Number(lastOption.saveTrm) <= selectedPeriod;
    });
  }

  if (selectedFilter.value?.joinWays?.length > 0) {
    list = list.filter((item) => {
      const productJoinWays = item.joinWay ? item.joinWay.split(',') : [];
      return selectedFilter.value.joinWays.some((way) =>
        productJoinWays.includes(way)
      );
    });
  }

  if (selectedFilter.value?.rateSort) {
    list = [...list].sort((a, b) => {
      const aMaxRate = Math.max(
        ...a.options.map((opt) => opt.intrRate2 ?? opt.intrRate)
      );
      const bMaxRate = Math.max(
        ...b.options.map((opt) => opt.intrRate2 ?? opt.intrRate)
      );
      if (selectedFilter.value.rateSort === 'high') {
        return bMaxRate - aMaxRate;
      } else if (selectedFilter.value.rateSort === 'base') {
        const aBase = Math.max(...a.options.map((opt) => opt.intrRate));
        const bBase = Math.max(...b.options.map((opt) => opt.intrRate));
        return bBase - aBase;
      }
    });
  }

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase();
    list = list.filter(
      (item) =>
        item.productName.toLowerCase().includes(keyword) ||
        item.bankName.toLowerCase().includes(keyword)
    );
  }

  return list;
});

// 필터 태그 관련 computed 속성
const hasActiveFilters = computed(() => {
  return (
    (selectedFilter.value.period !== '' && selectedFilter.value.period != null) ||
    (selectedFilter.value.rateSort !== '' && selectedFilter.value.rateSort != null) ||
    (selectedFilter.value.banks && selectedFilter.value.banks.length > 0) ||
    (selectedFilter.value.joinWays && selectedFilter.value.joinWays.length > 0)
  );
});

// 필터 태그 관련 메서드들
const getPeriodLabel = (period) => {
  const periodMap = {
    6: '~ 6개월',
    12: '~12개월',
    24: '~24개월',
    36: '~36개월'
  };
  return periodMap[period] || period;
};

const getRateSortLabel = (rateSort) => {
  const rateSortMap = {
    'high': '높은 금리순',
    'base': '기본 금리순'
  };
  return rateSortMap[rateSort] || rateSort;
};

const getBankName = (bankCode) => {
  const bankNameMap = {
    '0010927': 'KB국민',
    '0010020': '신한',
    '0010001': '우리',
    '0013909': '하나',
    '0010002': 'SC제일',
    '0015130': '카카오뱅크',
    '0010026': 'IBK 기업',
    '0014674': '케이뱅크',
    '0017801': '토스뱅크',
    '0010017': '부산',
    '0010016': 'IM뱅크',
    '0014807': 'SH수협',
    '0010019': '광주',
    '0013175': 'NH농협'
  };
  return bankNameMap[bankCode] || bankCode;
};

const removeFilter = (filterType) => {
  if (filterType === 'period') {
    selectedFilter.value.period = '';
  } else if (filterType === 'rateSort') {
    selectedFilter.value.rateSort = '';
  }
};

const removeBankFilter = (bankCode) => {
  if (selectedFilter.value.banks) {
    selectedFilter.value.banks = selectedFilter.value.banks.filter(
      code => code !== bankCode
    );
  }
};

const removeJoinWayFilter = (joinWay) => {
  if (selectedFilter.value.joinWays) {
    selectedFilter.value.joinWays = selectedFilter.value.joinWays.filter(
      way => way !== joinWay
    );
  }
};

watch(currentCategory, (tab) => {
  if (tab === '예금') fetchDeposits();
  if (tab === '적금') fetchSavings();
});

onMounted(() => {
  if (currentCategory.value === '예금') fetchDeposits();
  else fetchSavings();
});
</script>

<style scoped>
/* ✅ mozi-tabs 공용 스타일 (부드러운 전환 포함) */
.mozi-tabs {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #ddd;
}
.mozi-tabs .nav-item {
  flex: 1;
  text-align: center;
}
.mozi-tabs .nav-link {
  width: 100%;
  text-align: center;
  border: none !important;
  border-bottom: 2px solid transparent !important;
  background: transparent !important;
  color: #6b7684 !important;
  font-weight: 500;
  padding: 6px 4px;
  transition: color .18s ease, border-bottom-color .18s ease, background-color .18s ease;
}
.mozi-tabs .nav-link.active {
  border-bottom: 2px solid #36C18C !important;
  color: #6b7684 !important;
}

/* ✅ 탭 콘텐츠 전환 (슬라이드 + 페이드) */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(8px);
}

/* ✅ 리스트 아이템 전환 (필터/검색 변화 시) */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: opacity .16s ease, transform .16s ease;
}
.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
.list-fade-move {
  transition: transform .16s ease;
}

/* 🔍 검색/필터 툴바 */
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  flex: 1;
  height: 36px;
  padding: 6px 32px 6px 12px; /* 왼쪽 여백 좁힘 */
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.search-input:focus {
  border-color: #36C18C;
  box-shadow: 0 0 0 3px rgba(54,193,140,.15);
}

.clear-btn {
  margin-left: -40px; /* 입력창 안쪽 오른쪽 위치 */
  height: 24px;
  width: 24px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #9aa2a9;
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
}
.clear-btn:hover {
  background: #f1f5f9;
}

.filter-btn {
  height: 36px;
  width: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
/* 상단 페이지 헤더 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: center; /* 제목 중앙 */
  position: relative;
}

.back-btn {
  position: absolute;
  left: 0;
  cursor: pointer;
  font-size: 1.2rem;
  color: #757575;
  padding: 4px 8px; /* 클릭 범위 확보 */
}

.page-title {
  margin: 0;
  font-weight: bold;
  text-align: center;
}

/* 🔍 필터 태그 스타일 */
.filter-tags {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
}

.filter-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 12px;
  color: #475569;
  transition: all 0.15s ease;
}

.filter-tag:hover {
  border-color: #94a3b8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-tag-text {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 4px;
}

.filter-tag-bank-logo {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.filter-tag-remove {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.15s ease;
  line-height: 1;
}

.filter-tag-remove:hover {
  background: #f1f5f9;
  color: #64748b;
}

/* financial-card 스타일 - 이 페이지에서만 적용 */
.financial-card {
  margin-bottom: 16px;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .filter-tags-container {
    gap: 4px;
  }
  
  .filter-tag {
    font-size: 11px;
    padding: 3px 6px;
  }
  
  .filter-tag-remove {
    width: 14px;
    height: 14px;
    font-size: 12px;
  }
}
</style>
