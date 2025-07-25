<template>
  <div class="border p-3 rounded mb-3 bg-light">
    <!-- 상단 체크박스 추가 -->
    <div class="d-flex justify-content-end mb-2 align-items-center">
      <input
        type="checkbox"
        id="personalInfo"
        class="form-check-input me-1"
        v-model="usePersonalInfo"
      />
      <label
        for="personalInfo"
        class="form-check-label small"
        style="font-size: 0.75rem"
      >
        퍼스널 정보
      </label>
    </div>

    <!-- 관심 지역 -->
    <FilterLayout
      label="관심 지역"
      :items="regions"
      category="region"
      :filterState="filterState"
      :toggleFilter="toggleFilter"
    />

    <!-- 연령 -->
    <FilterLayout
      label="연령"
      :items="ages"
      category="age"
      :filterState="filterState"
      :toggleFilter="toggleFilter"
    />

    <!-- 혼인 여부 -->
    <FilterLayout
      label="혼인 여부"
      :items="maritalStatus"
      category="maritalStatus"
      :filterState="filterState"
      :toggleFilter="toggleFilter"
    />

    <!-- 연소득 -->
    <FilterLayout
      label="연소득"
      :items="income"
      category="income"
      :filterState="filterState"
      :toggleFilter="toggleFilter"
    />

    <!-- 학력 -->
    <FilterLayout
      label="학력"
      :items="education"
      category="education"
      :filterState="filterState"
      :toggleFilter="toggleFilter"
    />

    <!-- 취업 상태 -->
    <FilterLayout
      label="취업 상태"
      :items="employment"
      category="employment"
      :filterState="filterState"
      :toggleFilter="toggleFilter"
    />

    <!-- 전공 분야 -->
    <FilterLayout
      label="전공 분야"
      :items="major"
      category="major"
      :filterState="filterState"
      :toggleFilter="toggleFilter"
    />

    <!-- 특화 분야 -->
    <FilterLayout
      label="특화 분야"
      :items="special"
      category="special"
      :filterState="filterState"
      :toggleFilter="toggleFilter"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import FilterLayout from './FilterLayout.vue';
import { ref } from 'vue';

const usePersonalInfo = ref(true); //체크 상태

const props = defineProps({
  filterState: Object,
  toggleFilter: Function,
  exactAge: Number,
});

const regions = [
  '서울',
  '부산',
  '대구',
  '인천',
  '광주',
  '대전',
  '울산',
  '세종',
  '경기',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주',
];

const ages = ['10대', '20대', '30대', '40대'];

const maritalStatus = ['제한없음', '기혼', '미혼'];
const income = [
  '제한없음',
  '1000만원 이하',
  '2000만원 이하',
  '3000이하',
  '4000이하',
  '5000이하',
];
const education = [
  '제한없음',
  '고졸미만',
  '고교재학',
  '고졸예정',
  '대학재학',
  '대졸예정',
  '대학졸업',
  '석/박사',
  '기타',
];
const employment = [
  '제한없음',
  '재직자',
  '자영업자',
  '미취업자',
  '프리랜서',
  '일용근로자',
  '(예비)창업자',
  '단기근로자',
  '영농종사자',
  '기타',
];
const major = [
  '제한없음',
  '인문계열',
  '사회계열',
  '상경계열',
  '어학계열',
  '공학계열',
  '예체능계열',
  '농산업계열',
  '기타',
];
const special = [
  '제한없음',
  '중소기업',
  '여성',
  '기초생활수급자',
  '한부모가정',
  '장애인',
  '농업인',
  '군인',
  '지역인재',
  '기타',
];
</script>
