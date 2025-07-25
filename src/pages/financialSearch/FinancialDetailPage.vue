<template>
  <div class="financial-detail-card">
    <div class="summary-card">
      <div class="summary-header">
        <div class="summary-info">
          <div class="summary-title">{{ deposit?.productName }}</div>
          <div class="summary-bank">{{ deposit?.bankName }}</div>
          <div class="summary-badges">
            <span v-if="deposit?.specialBadge" class="badge">{{ deposit.specialBadge }}</span>
            <span v-if="deposit?.joinBadge" class="badge badge-gray">{{ deposit.joinBadge }}</span>
          </div>
        </div>
        <img :src="deposit?.logoUrl" alt="은행로고" class="summary-logo" />
      </div>
      <div class="summary-rates">
        <div class="rate-block">
          <div class="rate-label">최고</div>
          <div class="rate-value highlight">
            연 {{ bestOption?.intrRate2 || '-' }}%
            <span v-if="bestOption">({{ bestOption.saveTrm }}개월)</span>
          </div>
        </div>
        <div class="rate-block">
          <div class="rate-label">기본</div>
          <div class="rate-value">
            연 {{ bestOption?.intrRate || '-' }}%
            <span class="rate-desc" v-if="bestOption">({{ bestOption.saveTrm }}개월, 세전)</span>
          </div>
        </div>
      </div>
    
      <div class="summary-actions">
        
        <a
          class="action-btn link"
          :href="bankDepositUrl"
          target="_blank"
          rel="noopener"
        >
          공식홈에서 더 알아보기
        </a>
      </div>
    </div>
    <hr class="divider" />
    <div class="section">
      <h3 class="section-title">금리 정보</h3>
      <table class="rate-table">
        <thead>
          <tr>
            <th>기간(개월)</th>
            <th>기본 금리(%)</th>
            <th>최고 금리(%)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(opt, idx) in deposit?.options || []" :key="idx">
            <td>{{ opt.saveTrm }}</td>
            <td>{{ opt.intrRate }}</td>
            <td>{{ opt.intrRate2 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <h3 class="section-title">가입 대상</h3>
      <p class="target-info">{{ deposit?.target || deposit?.joinMember || '정보 없음' }}</p>
    </div>
    <div class="section">
      <h3 class="section-title">가입 방법</h3>
      <p class="join-way">{{ deposit?.joinWay || '정보 없음' }}</p>
    </div>
    <div class="section">
      <h3 class="section-title">기타 안내</h3>
      <p class="etc-note">{{ deposit?.etcNote || '정보 없음' }}</p>
    </div>
    <div class="product-info-box">
      <div class="product-info-title">상품 안내</div>
      <div class="product-info-row"><span class="info-label">기간</span><span class="info-value">{{ periodRange }}</span></div>
      <div class="product-info-row"><span class="info-label">가입방법</span><span class="info-value">{{ deposit?.joinWay || '-' }}</span></div>
      <div class="product-info-row"><span class="info-label">대상</span><span class="info-value">{{ deposit?.target || deposit?.joinMember || '-' }}</span></div>
      <div class="product-info-row"><span class="info-label">금액 및 조건</span><span class="info-value">{{ deposit?.etcNote || '-' }}</span></div>
      <div class="product-info-row"><span class="info-label">우대조건</span><span class="info-value">{{ deposit?.specialCondition || '-' }}</span></div>

      <div class="product-info-row align-top">
        <span class="info-label">유의</span>
        <span class="info-value">
          <ul class="info-note-list">
            <li v-for="(note, idx) in (deposit?.noteList || (deposit?.etcNote ? deposit.etcNote.split('\n') : []))" :key="idx">{{ note }}</li>
          </ul>
        </span>
      </div>
      <div class="product-info-row">
        <span class="info-label">예금자보호</span>
        <span class="info-value">이 예금은 예금자보호법에 따라 원금과 소정의 이자를 합하여 1인당 "5천만원 까지"({{deposit?.bankName}}의 여타 보호상품과 합산) 보호됩니다.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { getBankLogoUrl } from './util/bankLogo';
import { getBankDepositUrl } from './util/bankDepositUrl';

const route = useRoute();
const deposit = ref(null);

onMounted(async () => {
  const id = route.params.id;
  const res = await axios.get(`/api/deposits/${id}`);
  deposit.value = {
    ...res.data,
    logoUrl: getBankLogoUrl(res.data.bankCode)
  };
});

const bestOption = computed(() => {
  if (!deposit.value?.options || deposit.value.options.length === 0) return null;
  return deposit.value.options.reduce((max, cur) =>
    Number(cur.intrRate2) > Number(max.intrRate2) ? cur : max
  );
});

const periodRange = computed(() => {
  if (!deposit.value?.options || deposit.value.options.length === 0) return '-';
  const saveTrms = deposit.value.options.map(opt => Number(opt.saveTrm));
  const min = Math.min(...saveTrms);
  const max = Math.max(...saveTrms);
  return min === max ? `${min}개월` : `${min}~${max}개월`;
});

const bankDepositUrl = computed(() => getBankDepositUrl(deposit.value?.bankCode));
</script>

<style scoped>
.financial-detail-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px #0002;
  padding: 32px 28px 24px 28px;
  margin: 32px auto 0 auto;
  max-width: 480px;
  min-width: 260px;
}
.detail-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 10px;
}
.header-info {
  flex: 1;
}
.product-title {
  font-size: 1.35rem;
  font-weight: bold;
  color: #222;
  margin: 0 0 2px 0;
}
.bank-name {
  font-size: 1rem;
  color: #666;
  margin: 0;
}
.bank-logo {
  width: 54px;
  height: 54px;
  border-radius: 8px;
  background: #f5f5f5;
  border: 1px solid #eee;
}
.divider {
  border: none;
  border-top: 1.5px solid #f0f0f0;
  margin: 12px 0 18px 0;
}
.section {
  margin-bottom: 28px;
}
.section-title {
  font-size: 1.08rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 10px;
}
.rate-table {
  width: 100%;
  border-collapse: collapse;
  background: #fafbfc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px #0001;
}
.rate-table th, .rate-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 0;
  text-align: center;
  font-size: 0.98rem;
}
.rate-table th {
  background: #f5f7fa;
  color: #888;
  font-weight: 500;
}
.target-info {
  font-size: 1.01rem;
  color: #333;
  background: #f8f8f8;
  border-radius: 6px;
  padding: 10px 14px;
  display: inline-block;
}
.join-way, .etc-note {
  font-size: 0.99rem;
  color: #444;
  background: #f9f9f9;
  border-radius: 6px;
  padding: 10px 14px;
  display: inline-block;
  margin-bottom: 0;
}
.product-info-box {
  background: #f7f7f9;
  border: 1.5px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px 20px 18px 20px;
  margin-top: 32px;
  margin-bottom: 18px;
  max-width: 600px;
  box-shadow: 0 2px 8px #0001;
}
.product-info-title {
  font-size: 1.13rem;
  font-weight: bold;
  margin-bottom: 18px;
  color: #222;
}
.product-info-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  font-size: 1.01rem;
}
.product-info-row.align-top {
  align-items: flex-start;
}
.info-label {
  min-width: 90px;
  font-weight: 600;
  color: #555;
  margin-right: 8px;
}
.info-value {
  flex: 1;
  color: #333;
  word-break: break-all;
}
.info-note-list {
  margin: 0;
  padding-left: 18px;
  font-size: 0.97rem;
  color: #888;
}
.info-note-list li {
  margin-bottom: 2px;
  line-height: 1.5;
}
.summary-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px #0002;
  padding: 28px 24px 20px 24px;
  margin: 0 auto 32px auto;
  max-width: 540px;
  min-width: 260px;
}
.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.summary-info {
  flex: 1;
}
.summary-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 2px;
}
.summary-bank {
  font-size: 1.02rem;
  color: #666;
  margin-bottom: 6px;
}
.summary-badges {
  display: flex;
  gap: 6px;
}
.badge {
  background: #4fc3f7;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 8px;
  padding: 2px 10px;
  display: inline-block;
}
.badge-gray {
  background: #e0e0e0;
  color: #555;
}
.summary-logo {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #f5f5f5;
  border: 1px solid #eee;
}
.summary-rates {
  display: flex;
  gap: 32px;
  margin: 18px 0 10px 0;
}
.rate-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.rate-label {
  font-size: 0.97rem;
  color: #888;
  margin-bottom: 2px;
}
.rate-value {
  font-size: 1.35rem;
  font-weight: bold;
  color: #1abc9c;
}
.rate-value.highlight {
  color: #2196f3;
}
.rate-desc {
  font-size: 0.92rem;
  color: #888;
  margin-left: 4px;
}
.summary-desc {
  background: #f7f7f9;
  border-radius: 8px;
  padding: 14px 14px 12px 14px;
  color: #444;
  font-size: 1.01rem;
  margin-bottom: 18px;
  margin-top: 8px;
}
.summary-actions {
  display: flex;
  gap: 12px;
  margin-top: 6px;
  justify-content: center;
}
.action-btn {
  display: block;
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  text-align: center;
}
.action-btn.call {
  background: #e8f5e9;
  color: #388e3c;
}
.action-btn.link {
  background: #e3f2fd;
  color: #1976d2;
}
.action-btn.call:hover {
  background: #c8e6c9;
}
.action-btn.link:hover {
  background: #bbdefb;
}
</style>
