<template>
  <div class="policy-card">
    <div class="card-header">
      <img
        src="/images/goal/policy.png"
        alt="정책 이미지"
        class="policy-icon"
      />
      <h5 class="policy-title">{{ policy.plcyNm }}</h5>
      <!-- <span class="score-badge">{{ policy.score }}점</span> -->
      <i
        class="fa-regular fa-bookmark bookmark"
        :class="{ scraped: bookmarked }"
        @click="toggleBookmark"
        style="margin-left: auto; cursor: pointer"
      ></i>
    </div>

    <div class="card-body">
      <div class="info-section">
        <div class="info-item">
          <span class="label">분야</span>
          <span class="value">{{ policy.mclsfNm || '정보 없음' }}</span>
        </div>
        <div class="info-item">
          <span class="label">연령</span>
          <span class="value">
            <span v-if="policy.sprtTrgtMinAge || policy.sprtTrgtMaxAge">
              만 {{ policy.sprtTrgtMinAge || '?' }}세 ~ 만
              {{ policy.sprtTrgtMaxAge || '?' }}세
            </span>
            <span v-else>누구나</span>
          </span>
        </div>
      </div>
    </div>

    <div class="bottom-section">
      <div class="keywords-section">
        <!-- 점수 or D-day 조건부 출력 -->
        <span class="keyword-tag score-tag">
          {{
            props.showDday
              ? dDayText || 'D-day 계산 불가'
              : props.policy.score != null
              ? props.policy.score + '점'
              : '점수 없음'
          }}
        </span>

        <!-- 기존 키워드 태그들 -->
        <span
          class="keyword-tag"
          v-for="(kw, i) in (policy.plcyKywdNm || '').split(',')"
          :key="i"
        >
          {{ kw.trim() }}
        </span>
      </div>
      <RouterLink
        :to="{ name: 'policyDetail', params: { id: policy.policyId } }"
        class="detail-btn"
      >
        자세히보기
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { scrapPolicy, cancelScrap } from '@/api/scrapApi';

const props = defineProps({
  policy: Object,
  isScrapped: Boolean,
  showDday: {
    type: Boolean,
    default: false, // 기본은 점수 출력
  },
});

const bookmarked = ref(props.isScrapped);
const userId = 1; // TODO: 로그인 연동 시 교체

const toggleBookmark = async () => {
  try {
    if (bookmarked.value) {
      await cancelScrap(userId, props.policy.plcyNo);
    } else {
      await scrapPolicy(userId, props.policy.plcyNo);
    }
    bookmarked.value = !bookmarked.value;
  } catch (err) {
    console.error('스크랩 오류', err);
  }
};

// D-day 계산
const dDayText = computed(() => {
  const aplyYmd = props.policy?.aplyYmd;
  if (!aplyYmd || typeof aplyYmd !== 'string') return null;

  const parts = aplyYmd.split('~');
  if (parts.length !== 2) return null;

  const rawEnd = parts[1].trim(); // "20250806"
  if (rawEnd.length !== 8 || isNaN(Number(rawEnd))) return null;

  const formatted = `${rawEnd.slice(0, 4)}-${rawEnd.slice(4, 6)}-${rawEnd.slice(
    6,
    8
  )}`;
  const endDate = new Date(formatted);
  const today = new Date();

  if (isNaN(endDate.getTime())) return null;

  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return 'D-day';
  return '마감';
});

onMounted(() => {
  console.log('🔍 정책명:', props.policy?.plcyNm);
  console.log('🔍 showDday:', props.showDday);
  console.log('🔍 aplyYmd:', props.policy?.aplyYmd);
  console.log('🔍 dDayText:', dDayText.value);
});
</script>

<style scoped>
.policy-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #0001;
  padding: 16px 18px 12px 18px;
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
  color: #444;
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

.score-tag {
  background: #ffe3e3;
  color: #ff3b3b;
  font-weight: bold;
  /* font-family: 'Caveat', cursive; 필기체 느낌 */
}
</style>

