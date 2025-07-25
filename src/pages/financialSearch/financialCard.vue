<template>
  <div class="financial-card">
    <div class="card-header" style="display: flex; align-items: center;">
      <img class="bank-logo" :src="deposit.logoUrl || defaultLogo" alt="은행로고" style="width: 32px; height: 32px; margin-right: 8px;" />
      <span class="product-title" style="font-weight: bold; font-size: 14px;">{{ deposit.productName }}</span>
      <i class="fa-regular fa-bookmark bookmark" style="margin-left: auto;"></i>
    </div>
    <div class="card-body" v-if="bestOption">
      
      <div class="rate small-text">
        <span style="color: #888;">가입 </span><span style="color: #444;">{{ deposit.bankName }}</span><br>
        <span style="color: #888;">금리 </span>
        <span class="main-rate">{{ bestOption.intrRate }}%({{ bestOption.saveTrm }}개월)</span>,<span class="max-rate" style="color: #e74c3c;">최고 {{ bestOption.intrRate2 }}%</span>({{ bestOption.saveTrm }}개월)
      </div>
      <div class="target small-text" style="color: #888;">
        <span>대상 </span>
        <span style="color: #444;">{{ deposit.target || deposit.joinMember || '정보 없음' }}</span>
      </div>
    </div>
    <button class="detail-btn" @click="goToDetail">자세히보기</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  deposit: Object
});
const defaultLogo = '/default-bank-logo.png';
const router = useRouter();

const bestOption = computed(() => {
  if (!props.deposit.options || props.deposit.options.length === 0) return null;
  return props.deposit.options.reduce((max, cur) =>
    Number(cur.intrRate) > Number(max.intrRate) ? cur : max
  );
});

const goToDetail = () => {
  router.push(`/financialSearch/${props.deposit.depositId}`);
};
</script>

<style scoped>
.financial-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #0001;
  padding: 16px 18px 12px 18px;
  margin-bottom: 16px;
  width: 100%;
  position: relative;
}
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}
.bank-logo {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}
.product-title {
  font-weight: bold;
  font-size: 1.1rem;
  color: #222;
  flex: 1;
}
.bookmark {
  color: #bdbdbd;
  font-size: 1.2rem;
  margin-left: 8px;
}
.card-body {
  font-size: 0.97rem;
  color: #444;
  margin-bottom: 8px;
}
.rate .main-rate {
  font-weight: 500;
  margin-left: 4px;
}
.rate .max-rate {
  margin-left: 4px;
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
  position: absolute;
  right: 16px;
  bottom: 10px;
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
</style>