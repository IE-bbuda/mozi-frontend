<template>
  <div class="financial-card">
    <div class="card-header" style="display: flex; align-items: center">
      <img
        class="bank-logo"
        :src="getBankLogoUrl(deposit?.bankCode)"
        alt="은행로고"
        style="width: 32px; height: 32px; margin-right: 8px"
      />
      <span class="product-title" style="font-weight: bold; font-size: 14px">
        {{ deposit?.productName || '상품명 없음' }}
      </span>
      <i
        class="fa-regular fa-bookmark bookmark"
        :class="{ scraped: isScraped }"
        @click="toggleScrap"
        style="margin-left: auto; cursor: pointer"
      >
      </i>
    </div>

    <div class="card-body" v-if="bestOption">
      <div class="rate small-text">
        <span style="color: #888">가입 </span>
        <span style="color: #444">{{ deposit?.bankName || '은행명 없음' }}</span
        ><br />
        <span style="color: #888">금리 </span>
        <span class="main-rate"
          >{{ bestOption.intrRate }}%({{ bestOption.saveTrm }}개월)</span
        >,
        <span class="max-rate" style="color: #e74c3c"
          >최고 {{ bestOption.intrRate2 }}%</span
        >({{ bestOption.saveTrm }}개월)
      </div>
      <div class="target small-text" style="color: #888">
        <span>대상 </span>
        <span style="color: #444">{{
          deposit?.target || deposit?.joinMember || '정보 없음'
        }}</span>
      </div>
    </div>

    <div class="button-container">
      <button class="detail-btn" @click="goToDetail">자세히보기</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getBankLogoUrl } from './util/bankLogo.js';
import api from '@/api'; // axios 인스턴스 사용

const props = defineProps({
  deposit: Object,
  productType: String,
  // 이 카드가 렌더링된 출발 탭: 'search' | 'recommend' | 'goal' | 'main' | 'asset'
  sourceTab: {
    type: String,
    default: 'search',
  },
});

const router = useRouter();
const isScraped = ref(false);

const bestOption = computed(() => {
  if (!props.deposit?.options || props.deposit.options.length === 0)
    return null;
  return props.deposit.options.reduce((max, cur) =>
    Number(cur.intrRate) > Number(max.intrRate) ? cur : max
  );
});

// 스크랩 상태 확인
const checkScrapStatus = async () => {
  try {
    const response = await api.get('/scrap/finance');
    const productId =
      props.productType === '적금'
        ? props.deposit?.savingId
        : props.deposit?.depositId;
    const productType = props.productType === '적금' ? 'SAVING' : 'DEPOSIT';

    const isAlreadyScraped = response.some(
      (scrap) =>
        scrap.productType === productType &&
        ((productType === 'SAVING' && scrap.product.savingId === productId) ||
          (productType === 'DEPOSIT' && scrap.product.depositId === productId))
    );

    isScraped.value = isAlreadyScraped;
  } catch (error) {
    console.error('스크랩 상태 확인 실패:', error);
  }
};

// 스크랩 토글 함수
const toggleScrap = async () => {
  try {
    const productId =
      props.productType === '적금'
        ? props.deposit?.savingId
        : props.deposit?.depositId;
    const productType = props.productType === '적금' ? 'SAVING' : 'DEPOSIT';

    if (!productId) {
      console.error('상품 ID가 없습니다.');
      return;
    }

    if (isScraped.value) {
      // 스크랩 삭제
      await api.delete('/scrap/finance', {
        params: { productType, productId },
      });
      isScraped.value = false;
      console.log('스크랩이 삭제되었습니다.');
    } else {
      // 스크랩 추가
      await api.post('/scrap/finance', null, {
        params: { productType, productId },
      });
      isScraped.value = true;
      console.log('스크랩이 추가되었습니다.');
    }
  } catch (error) {
    console.error('스크랩 토글 실패:', error);
  }
};

// 상세 페이지 이동
const goToDetail = () => {
  if (!props.deposit) return;

  if (props.productType === '적금') {
    const savingId = props.deposit.savingId;
    if (savingId) {
      router.push({ path: `/financialSearch/saving/${savingId}`, query: { fromTab: props.sourceTab } });
    }
  } else {
    const depositId = props.deposit.depositId;
    if (depositId) {
      router.push({ path: `/financialSearch/deposit/${depositId}`, query: { fromTab: props.sourceTab } });
    }
  }
};

// 컴포넌트 마운트 시 스크랩 상태 확인
onMounted(() => {
  checkScrapStatus();
});
</script>

<style scoped>
.financial-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #0001;
  padding: 8px 16px 8px 16px;

  width: 100%;
  position: relative;
}
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
.bank-logo {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}
.product-title {
  font-weight: bold;
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
}

.bookmark.scraped::before {
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  content: '\f02e';
}
.card-body {
  font-size: 0.97rem;
  color: #444;
  margin-bottom: 6px;
}
.rate .main-rate {
  font-weight: 500;
  margin-left: 4px;
}
.rate .max-rate {
  margin-left: 4px;
}
.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
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
}
.rate.small-text span,
.target.small-text span:first-child {
  font-size: 12px;
  font-weight: 600;
}
.target.small-text span:last-child {
  font-size: 12px;
}
.small-text {
  font-size: 12px;
}

.financial-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background: linear-gradient(to bottom, #ff9d00 0%, #83fff1 70%);
  opacity: 0.7;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
</style>
