<!-- policyCard.vue -->
<template>
  <div class="card shadow-sm mb-3 policy-card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <!--정책명 -->
        <div class="d-flex align-items-center">
          <h6 class="fw-bold mb-0">{{ policy.plcyNm }}</h6>
        </div>

        <!-- 북마크 -->
        <div class="text-end">
          <i
            class="fa-bookmark ms-2"
            :class="
              policy.bookmarked
                ? 'fa-solid text-primary'
                : 'fa-regular text-secondary'
            "
            style="cursor: pointer"
          ></i>
        </div>
      </div>

      <!-- 중간 정보 -->
      <div class="mt-2 small text-muted">
        <div>
          정책분야
          <span class="text-dark fw-semibold">{{ policy.mclsfNm || '-' }}</span>
        </div>
        <div>
          연령
          <span
            class="text-dark fw-semibold"
            v-if="policy.sprtTrgtMinAge || policy.sprtTrgtMaxAge"
          >
            만 {{ policy.sprtTrgtMinAge || '?' }}세 ~ 만
            {{ policy.sprtTrgtMaxAge || '?' }}세
          </span>
          <span class="text-dark fw-semibold" v-else>누구나</span>
        </div>
        <div>
          기간
          <span class="text-dark fw-semibold">
            <template v-if="!policy.bizPrdBgngYmd && !policy.bizPrdEndYmd"
              >상시</template
            >
            <template v-else
              >{{ policy.bizPrdBgngYmd }} ~ {{ policy.bizPrdEndYmd }}</template
            >
          </span>
        </div>
      </div>

      <!-- 키워드 태그 + 상세 버튼 -->
      <div class="mt-2 d-flex justify-content-between align-items-center">
        <!-- 키워드 -->
        <div class="d-flex flex-wrap gap-1">
          <span
            class="badge bg-light text-dark"
            v-for="(kw, i) in (policy.plcyKywdNm || '').split(',')"
            :key="i"
          >
            {{ kw.trim() }}
          </span>
        </div>

        <!-- 상세 버튼 -->
        <RouterLink
          :to="{ name: 'policyDetail', params: { id: policy.policyId } }"
          class="btn btn-outline-primary btn-sm"
        >
          상세 보기
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ policy: Object });
</script>

<style scoped>
.policy-card {
  border-left: 5px solid #28a745; /* 초록 포인트 */
  border-radius: 12px;
}
</style>
