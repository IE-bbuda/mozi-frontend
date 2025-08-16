<template>
  <div class="policy-card">
    <div class="card-header">
      <img
        src="/images/goal/policy.png"
        alt="정책 이미지"
        class="policy-icon"
      />
      <span class="policy-title">{{ policy?.plcyNm || '정책명 없음' }}</span>

      <i
        class="fa-regular fa-bookmark bookmark"
        :class="{ scraped: bookmarked }"
        @click="toggleBookmark"
        style="margin-left: auto; cursor: pointer"
      ></i>
    </div>

    <div class="card-body" v-if="policy">
      <div class="info-section">
        <div class="info-item">
          <span class="label">분야</span>
          <span class="value">{{ policy.mclsfNm || '정보 없음' }}</span>
        </div>

        <!-- 연령 + 마감 -->
        <div class="info-item deadline-row">
          <div class="left-info">
            <span class="label">연령</span>
            <span class="value">
              <template
                v-if="
                  policy.sprtTrgtMinAge === 0 && policy.sprtTrgtMaxAge === 0
                "
              >
                누구나
              </template>
              <template v-else>
                만
                {{
                  policy.sprtTrgtMinAge === 0
                    ? 0
                    : policy.sprtTrgtMinAge || '?'
                }}세 ~ 만 {{ policy.sprtTrgtMaxAge || '?' }}세
              </template>
            </span>
          </div>

          <!-- 마감 뱃지 -->
          <span v-if="isClosed(policy.aplyYmd)" class="inline-closed-badge">
            마감
          </span>
        </div>
      </div>
    </div>

    <div class="bottom-section">
      <div class="keywords-section">
        <!-- 소득제한 키워드가 있을 경우 먼저 추가 -->
        <span v-if="hasIncomeCondition" class="keyword-tag income"
          >소득제한</span
        >
        <span
          class="keyword-tag"
          v-for="(kw, i) in (policy.plcyKywdNm || '').split(',')"
          :key="i"
        >
          {{ kw.trim() }}
        </span>
      </div>

      <RouterLink
        :to="{ name: 'policyDetail', params: { id: policy?.policyId } }"
        class="detail-btn"
      >
        자세히보기
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { scrapPolicy, cancelScrap } from '@/api/scrapApi';
import api from '@/api';

const props = defineProps({
  policy: Object,
  isScrapped: { type: Boolean, default: false },
});

const bookmarked = ref(props.isScrapped);

const emit = defineEmits(['bookmark-changed']);

// ✅ 부모에서 isScrapped 바뀌면 로컬도 동기화
watch(
  () => props.isScrapped,
  (v) => {
    bookmarked.value = v;
  }
);

const hasIncomeCondition = computed(() => {
  const code = String(props.policy?.earnCndSeCd || '').trim();
  return ['0043002', '0043003'].includes(code);
});

// 토글
const toggleBookmark = async () => {
  try {
    const plcyNo = String(props.policy?.plcyNo ?? '').trim();
    if (!plcyNo) return;

    if (bookmarked.value) {
      await cancelScrap(plcyNo);
      bookmarked.value = false;
    } else {
      await scrapPolicy(plcyNo);
      bookmarked.value = true;
    }

    // 부모 리스트 즉시 반영하도록 이벤트 발행
    emit('bookmark-changed', { plcyNo, bookmarked: bookmarked.value });
  } catch (e) {
    console.error('스크랩 토글 실패:', e);
  }
};

function isClosed(aplyYmd) {
  if (!aplyYmd || !aplyYmd.includes('~')) return false;
  const end = aplyYmd.split('~')[1].trim(); // "20250806"
  const today = new Date();
  const yyyyMMdd = today.toISOString().slice(0, 10).replace(/-/g, ''); // "20250805"
  return end < yyyyMMdd;
}
</script>

<style scoped>
.policy-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #0001;
  padding: 8px 16px 8px 16px;
  margin-bottom: 16px;
  width: 100%;
  position: relative;
}

/* 그라디언트 왼쪽 바 - 투명도 70% */
.policy-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background: linear-gradient(to bottom, #ff0000 0%, #000dff 55%);
  opacity: 0.7;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.policy-icon {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.policy-title {
  font-weight: bold;
  font-size: 14px;
  color: #222;
  flex: 1;
}

.bookmark {
  color: #bdbdbd;
  font-size: 1.2rem;
  margin-left: 8px;
  transition: all 0.2s ease;
}

.bookmark.scraped {
  color: #569fff;

  font-weight: 900;
}

.card-body {
  font-size: 0.97rem;
  color: #444;
  margin-bottom: 8px;
}

.info-section {
  font-size: 12px;
  margin-bottom: 8px;
}

.info-item {
  margin-bottom: 2px;
}

.info-item .label {
  color: #888;
  font-weight: 600;
}

.info-item .value {
  color: #000000;
  margin-left: 4px;
}

.bottom-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.keywords-section {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
}

.keyword-tag {
  background: #f5f5f5;
  color: #666;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
}

.detail-btn {
  background: #f5f5f5;
  color: #aaa;
  border: none;
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 0.85rem;
  min-height: 24px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  line-height: 20px;
  margin-left: 8px;
}

.deadline-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-info {
  display: flex;
  align-items: center;
}

.inline-closed-badge {
  color: #d32f2f;
  font-size: 0.8rem;
  font-weight: bold;
  white-space: nowrap;
}

.keyword-tag.income {
  background: #ffecec;
  color: #d32f2f;
  border: 1px solid #f5c6cb;
  font-weight: bold;
}
</style>
