<template>
  <div class="policy-detail">
    <!-- 🔙 상단 뒤로가기 -->
    <header class="header">
      <button class="back-btn" @click="router.back()">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
    </header>

    <main class="content">
      <!-- 정책 카테고리 -->
      <div class="tags">
        <span class="tag main">{{ policy.lclsfNm }}</span>
        <span class="tag sub">{{ policy.mclsfNm }}</span>
      </div>

      <!-- 정책명 -->
      <h1 class="title">{{ policy.plcyNm }}</h1>

      <!-- 요약 -->
      <p class="summary">{{ policy.plcyExplnCn }}</p>

      <!-- 키워드 -->
      <div class="keywords" v-if="policy.plcyKywdNm">
        <span v-for="(kw, i) in policy.plcyKywdNm.split(',')" :key="i" class="keyword">
          #{{ kw.trim() }}
        </span>
      </div>

      <!-- 한눈에 보는 정책 -->
      <section class="section card">
        <h2>한눈에 보는 정책</h2>
        <div class="info-list">
          <div class="info-row">
            <span class="label">정책번호</span>
            <span>{{ policy.plcyNo }}</span>
          </div>
          <div class="info-row">
            <span class="label">정책분야</span>
            <span>{{ policy.mclsfNm }}</span>
          </div>
          <div class="info-row">
            <span class="label">지원내용</span>
            <span>{{ policy.plcySprtCn }}</span>
          </div>
          <div class="info-row">
            <span class="label">신청기간</span>
            <span>{{ formatPeriod(policy.bizPrdBgngYmd, policy.bizPrdEndYmd) }}</span>
          </div>
        </div>
      </section>

      <!-- 신청자격 -->
      <section class="section card">
        <h2>신청자격</h2>
        <div class="info-list">
          <div class="info-row">
            <span class="label">연령</span>
            <span>{{ policy.sprtTrgtMinAge }}세 ~ {{ policy.sprtTrgtMaxAge }}세</span>
          </div>
          <div class="info-row">
            <span class="label">거주지역</span>
            <span>{{ formatZipCode() }}</span>
          </div>
          <div class="info-row">
            <span class="label">소득조건</span>
            <span>{{ convertLabel(policy.earnCndSeCd, 'income') }}</span>
          </div>
          <div class="info-row" v-if="policy.earnMinAmt || policy.earnMaxAmt || policy.earnEtcCn">
            <span class="label">소득금액</span>
            <span>
              <span v-if="policy.earnMinAmt">최소 {{ formatCurrency(policy.earnMinAmt) }}</span>
              <span v-if="policy.earnMaxAmt"> ~ 최대 {{ formatCurrency(policy.earnMaxAmt) }}</span>
              <span v-if="policy.earnEtcCn"> ({{ policy.earnEtcCn }})</span>
            </span>
          </div>
          <div class="info-row">
            <span class="label">학력</span>
            <span>{{ convertLabel(policy.schoolCd, 'school') }}</span>
          </div>
          <div class="info-row">
            <span class="label">전공</span>
            <span>{{ convertLabel(policy.plcyMajorCd, 'major') }}</span>
          </div>
          <div class="info-row">
            <span class="label">취업 상태</span>
            <span>{{ convertLabel(policy.jobCd, 'job') }}</span>
          </div>
          <div class="info-row">
            <span class="label">혼인 여부</span>
            <span>{{ convertLabel(policy.mrgSttsCd, 'marriage') }}</span>
          </div>
          <div class="info-row">
            <span class="label">특화 분야</span>
            <span>{{ convertLabel(policy.sBizCd, 'specialty') }}</span>
          </div>
        </div>
      </section>

      <!-- 신청 정보 -->
      <section class="section card">
        <h2>신청 정보</h2>
        <p class="link">
          <a :href="policy.aplyUrlAddr" target="_blank" rel="noopener noreferrer">
            {{ policy.aplyUrlAddr }}
          </a>
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import policyApi from '@/api/policyApi';
import { fetchRegionNamesByZipCodes } from '@/api/regionApi';

const route = useRoute();
const router = useRouter();
const policy = ref({});
const regionNames = ref([]);

onMounted(async () => {
  const id = route.params.id;
  try {
    const res = await policyApi.get(id);
    policy.value = res;

    if (res.zipCd) {
      const zipList = res.zipCd.split(',').map((z) => z.trim());
      regionNames.value = await fetchRegionNamesByZipCodes(zipList);
    }
  } catch (err) {
    console.error('정책 상세 조회 실패:', err);
  }
});

const formatPeriod = (start, end) => {
  if (!start && !end) return '상시';
  const format = (date) => date?.replace(/-/g, '.') || '미정';
  return `${format(start)} ~ ${format(end)}`;
};

const formatZipCode = () => {
  if (!regionNames.value || regionNames.value.length === 0) return '제한 없음';
  return regionNames.value.join(', ');
};

const formatCurrency = (value) => `${value}만원`;

const convertLabel = (code, type) => {
  const map = {
    school: {
      '0049001': '고졸 미만',
      '0049002': '고교 재학',
      '0049003': '고졸 예정',
      '0049004': '고교 졸업',
      '0049005': '대학 재학',
      '0049006': '대졸 예정',
      '0049007': '대학 졸업',
      '0049008': '석/박사',
      '0049009': '기타',
      '0049010': '제한없음',
    },
    job: {
      '0013001': '재직자',
      '0013002': '자영업자',
      '0013003': '미취업자',
      '0013004': '프리랜서',
      '0013005': '일용근로자',
      '0013006': '(예비)창업자',
      '0013007': '단기근로자',
      '0013008': '영농종사자',
      '0013009': '기타',
      '0013010': '제한없음',
    },
    marriage: {
      '0055001': '기혼',
      '0055002': '미혼',
      '0055003': '제한없음',
    },
    specialty: {
      '0014001': '중소기업',
      '0014002': '여성',
      '0014003': '기초생활수급자',
      '0014004': '한부모가정',
      '0014005': '장애인',
      '0014006': '농업인',
      '0014007': '군인',
      '0014008': '지역인재',
      '0014009': '기타',
      '0014010': '제한없음',
    },
    major: {
      '0011001': '인문계열',
      '0011002': '사회계열',
      '0011003': '상경계열',
      '0011004': '어학계열',
      '0011005': '공학계열',
      '0011006': '예체능계열',
      '0011007': '농산업계열',
      '0011008': '기타',
      '0011009': '제한 없음',
    },
    income: {
      '0043001': '소득무관',
      '0043002': '소득기준 있음',
      '0043003': '기타',
    },
  };
  return map[type]?.[code] || '제한없음';
};
</script>

<style scoped>
.policy-detail {
  background: #f9fafb;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
}

.content {
  padding: 1rem;
}

.tags {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.tag.main {
  background: #f2f4f6;
  color: #333;
}

.tag.sub {
  background: #e6f0ff;
  color: #007bff;
}

.title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.summary {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.keyword {
  font-size: 0.75rem;
  color: #007bff;
  background: #f5f9ff;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
}

.section.card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.section h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.9rem;
  color: #333;
}

.label {
  font-size: 0.8rem;
  color: #888;
}

.link a {
  color: #007bff;
  font-size: 0.9rem;
  text-decoration: none;
}
</style>
