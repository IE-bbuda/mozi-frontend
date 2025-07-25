<template>
  <div class="container py-3">
    <!-- 뒤로가기 버튼 -->
    <div class="d-flex align-items-center mb-3">
      <button class="btn btn-outline-secondary me-2" @click="router.back()">
        ←
      </button>
      <h4 class="fw-bold mb-0">정책 상세 정보</h4>
    </div>
    <div v-if="policy" class="card shadow-sm p-3">
      <h5 class="fw-bold">{{ policy.plcyNm }}</h5>
      <p class="text-muted">{{ policy.plcyExplnCn }}</p>

      <ul class="list-group list-group-flush mt-3">
        <li class="list-group-item">
          <strong>정책 분류:</strong> {{ policy.lclsfNm }} /
          {{ policy.mclsfNm }}
        </li>
        <li class="list-group-item">
          <strong>지원 내용:</strong> {{ policy.plcySprtCn }}
        </li>
        <li class="list-group-item">
          <strong>대상 연령:</strong> {{ policy.sprtTrgtMinAge }} ~
          {{ policy.sprtTrgtMaxAge }}세
        </li>
        <li class="list-group-item">
          <strong>학력:</strong> {{ policy.schoolCd }}
        </li>
        <li class="list-group-item">
          <strong>취업 상태:</strong> {{ policy.jobCd }}
        </li>
        <li class="list-group-item">
          <strong>혼인 여부:</strong> {{ policy.mrgSttsCd }}
        </li>
        <li class="list-group-item">
          <strong>특화 분야:</strong> {{ policy.sBizCd }}
        </li>
        <li class="list-group-item">
          <strong>신청 URL:</strong>
          <a
            :href="policy.aplyUrlAddr"
            target="_blank"
            rel="noopener noreferrer"
            >{{ policy.aplyUrlAddr }}</a
          >
        </li>
      </ul>

      <div class="mt-3">
        <strong>키워드:</strong>
        <span
          class="badge bg-light text-dark me-1"
          v-for="(kw, i) in (policy.plcyKywdNm || '').split(',')"
          :key="i"
        >
          {{ kw.trim() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import policyApi from '@/api/policyApi';

const route = useRoute();
const policy = ref(null);
const router = useRouter();

onMounted(async () => {
  const id = route.params.id;
  try {
    const res = await policyApi.get(id);
    policy.value = res;
  } catch (err) {
    console.error('정책 상세 조회 실패:', err);
  }
});
</script>
