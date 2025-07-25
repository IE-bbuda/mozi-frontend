<!-- policySearchPage.vue -->
<template>
  <div class="container py-3">
    <!-- 정책 탐색 + 검색 -->
    <div
      class="d-flex justify-content-center align-items-center mb-2 position-relative"
    >
      <h4 class="mb-0 fw-bold text-center w-100">정책 탐색</h4>
      <i
        class="fa-solid fa-magnifying-glass fa-lg"
        @click="toggleSearch"
        style="cursor: pointer"
      ></i>
    </div>

    <!-- 검색창 -->
    <div class="mb-2" v-if="showSearch">
      <input
        v-model="searchKeyword"
        type="text"
        class="form-control"
        placeholder="검색어를 입력하세요"
      />
    </div>

    <!-- 필터 버튼 -->
    <div class="d-flex justify-content-end mb-2">
      <button
        class="btn btn-outline-secondary btn-sm"
        @click="toggleFilterPanel"
      >
        <i class="fa-solid fa-sliders"></i>
      </button>
    </div>

    <!-- 선택된 필터  표시 + 제거 기능 -->
    <div v-if="selectedTagsWithCategory.length" class="mb-3">
      <span
        v-for="(tag, index) in selectedTagsWithCategory"
        :key="index"
        class="badge bg-secondary me-1 d-inline-flex align-items-center"
        style="font-size: 0.75rem"
      >
        {{ tag.label }}
        <i
          class="fa-solid fa-xmark ms-1"
          style="cursor: pointer; font-size: 0.7rem"
          @click="toggleFilter(tag.category, tag.label)"
        ></i>
      </span>
    </div>

    <!-- 필터 -->
    <policyFilter
      v-if="showFilter"
      :filterState="filterState"
      :toggleFilter="toggleFilter"
    />

    <!-- 카테고리 탭 -->
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

    <PolicyCard
      v-for="(policy, index) in filteredList"
      :key="index"
      :policy="policy"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import PolicyCard from './policyCard.vue';
import policyApi from '@/api/policyApi';
import policyFilter from './policyFilter.vue';

const searchKeyword = ref('');
const currentCategory = ref('전체');
const showFilter = ref(false);
const showSearch = ref(false);

const categories = ['전체', '일자리', '주거', '교육', '문화', '기타'];
const policyList = ref([]);

// 지역명 → 코드 앞 두 자리 매핑
const regionCodeMap = {
  서울: '11',
  부산: '26',
  대구: '27',
  인천: '28',
  광주: '29',
  대전: '30',
  울산: '31',
  세종: '36',
  경기: '41',
  강원: '42',
  충북: '43',
  충남: '44',
  전북: '45',
  전남: '46',
  경북: '47',
  경남: '48',
  제주: '50',
};

// 필터 상태
const filterState = ref({
  region: [],
  age: [],
  maritalStatus: [],
  income: [],
  education: [],
  employment: [],
  major: [],
  special: [],
});

// 필터 toggle 함수
const toggleFilter = (type, value) => {
  const list = filterState.value[type];
  if (list.includes(value)) {
    filterState.value[type] = list.filter((v) => v !== value);
  } else {
    filterState.value[type].push(value);
  }
};

// 선택된 키워드들
const selectedTagsWithCategory = computed(() => {
  const result = [];
  for (const [category, values] of Object.entries(filterState.value)) {
    values.forEach((label) => {
      result.push({ category, label });
    });
  }
  return result;
});
const filteredList = computed(() => {
  let list = policyList.value;

  // 지역 필터링
  if (filterState.value.region.length > 0) {
    const regionCodes = filterState.value.region.map(
      (regionName) => regionCodeMap[regionName]
    );
    list = list.filter((policy) => {
      const zipCd = policy.zipCd || '';
      return regionCodes.some((code) =>
        zipCd.split(',').some((z) => z.trim().startsWith(code))
      );
    });
  }

  // 카테고리 필터링
  if (currentCategory.value !== '전체') {
    list = list.filter((policy) => {
      const lcl = policy.lclsfNm || '';
      const category = currentCategory.value;

      if (category === '일자리') return lcl.includes('일자리');
      if (category === '교육') return lcl.includes('교육');
      if (category === '주거') return lcl.includes('주거');
      if (category === '문화') return lcl.includes('복지문화');

      // 기타: 어떤 카테고리에도 포함되지 않은 항목
      return !(
        lcl.includes('일자리') ||
        lcl.includes('교육') ||
        lcl.includes('주거') ||
        lcl.includes('복지문화')
      );
    });
  }

  return list;
});

const toggleFilterPanel = () => {
  showFilter.value = !showFilter.value;
};
const toggleSearch = () => {
  showSearch.value = !showSearch.value;
};
const selectCategory = (tab) => {
  currentCategory.value = tab;
};

onMounted(async () => {
  const data = await policyApi.getList();
  console.log('정책 목록:', data);
  policyList.value = data;
});
</script>
