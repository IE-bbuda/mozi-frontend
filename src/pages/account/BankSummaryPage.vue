<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getBankSummary } from '@/api/accountApi';
import { useBankStore } from '@/stores/bank';

const router = useRouter();
const totalBalance = ref(0);
const bankSummaryList = ref([]);
const mainBankCode = ref('');
const isConnected = ref(false);
const isLoading = ref(false);
const bankStore = useBankStore();
const banks = bankStore.banks;

const getBankLogoUrl = (bankCode) => {
  const bank = banks.find((b) => b.code === bankCode);
  return bank?.logo || '/images/financial/default.png';
};

const goBack = () => router.back();
const goToDeletePage = () => router.push('/account/BankUnlinkPage');
const goToBankMainSetting = () => router.push('/account/BankMainSettingPage');
const goToConnectPage = () => router.push('/account/BankConnectPage');

const refreshAccountData = async () => {
  try {
    isLoading.value = true;
    const response = await getBankSummary();
    totalBalance.value = response.totalBalance;
    bankSummaryList.value = response.BankSummaryList;
    isConnected.value = response.isConnected;
    mainBankCode.value = response.mainBankCode || '';
  } catch (error) {
    console.error('새로 고침 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const response = await getBankSummary();
    totalBalance.value = response.totalBalance;
    bankSummaryList.value = response.BankSummaryList;
    isConnected.value = response.isConnected;
    mainBankCode.value = response.mainBankCode || '';
  } catch (error) {
    console.error('계좌 요약 조회 실패:', error);
    isConnected.value = false;
  }
});
</script>

<template>
  <div class="wrapper">
    <div class="header">
      <span class="back-btn" @click="goBack">
        <i class="fa-solid fa-angle-left"></i>
      </span>
      <div class="header-title">전체 은행</div>
      <span v-if="isConnected" class="icon-button" @click="refreshAccountData">
        <i class="fa-solid fa-rotate"></i>
      </span>
    </div>

    <template v-if="isConnected">
      <div class="total-box">
        총 자산: {{ totalBalance.toLocaleString() }}원
      </div>

      <div class="card-list" v-if="bankSummaryList.length > 0">
        <div
          class="bank-card"
          v-for="bank in bankSummaryList"
          :key="bank.bankCode"
          @click="router.push(`/account/BankAccountListPage/${bank.bankCode}`)"
        >
          <img :src="getBankLogoUrl(bank.bankCode)" class="bank-logo" />
          <div class="bank-text">
            <div class="bank-amount">
              총: {{ bank.totalBalance.toLocaleString() }}원
            </div>
            <div class="bank-account">
              <template v-if="bank.accountCount === 0">계좌 0개</template>
              <template v-else>
                {{ bank.representativeAccountName }} 외
                {{ bank.accountCount - 1 }}개
              </template>
            </div>
          </div>
          <div v-if="mainBankCode === bank.bankCode">
            <i class="fa-solid fa-star" style="color: #ffd43b"></i>
          </div>
        </div>

        <button class="connect-btn-full" @click="goToConnectPage">
          은행 연동 추가하기
        </button>
      </div>

      <div class="nav-links">
        <div class="link-item" @click="goToBankMainSetting">
          주거래 은행 설정 &gt;
        </div>
        <div class="link-item" @click="goToDeletePage">은행 연동 해지 &gt;</div>
      </div>

      <div v-if="isLoading" class="loading">불러오는 중...</div>
    </template>

    <template v-else>
      <div class="fixed-center-box">
        <img
          src="/images/accountEmpty.png"
          alt="데이터 없음"
          class="no-data-image"
        />
        <h6>아직 계좌가 없어요</h6>
        <p class="no-data-text">
          계좌를 연동하면 더 많은 서비스를 <br />받을 수 있어요!
        </p>
        <button class="card-btn" @click="goToConnectPage">계좌 연결하기</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
}

.header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.back-btn {
  font-size: 24px;
  cursor: pointer;
  user-select: none;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: bold;
  color: #757575;
}

.icon-button {
  font-size: 20px;
  cursor: pointer;
}

.total-box {
  background: #d3e8df;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #2f423f;
}

.card-list {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  max-height: 320px;
  overflow-y: auto;
}

.bank-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 10px 0;
  border-top: 1px solid #eee;
  cursor: pointer;
}

.bank-card:first-child {
  border-top: none;
}

.bank-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  margin-right: 12px;
}

.bank-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bank-amount {
  font-weight: bold;
  font-size: 14px;
}

.bank-account {
  font-size: 13px;
  color: #555;
}

.connect-btn-full {
  margin-top: 16px;
  width: 100%;
  padding: 12px;
  background-color: #f5f6f8;
  color: #7b8a99;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
}

.nav-links {
  margin-top: 16px;
  font-size: 15px;
  font-weight: bold;
  color: #3f50b5;
}

.link-item {
  margin-bottom: 12px;
  cursor: pointer;
}

.loading {
  text-align: center;
  color: #888;
  margin-top: 8px;
}

/* ✅ 변경된 계좌 없음 화면 위치 조정 */
.fixed-center-box {
  position: absolute;
  top: 45%; /* 기존 60%에서 위로 조정 */
  left: 50%;
  width: 320px;
  padding: 24px;
  text-align: center;
  transform: translate(-50%, -50%);
  user-select: none;
}

.no-data-image {
  width: 200px;
  height: 200px;
  margin-bottom: 12px;
  opacity: 0.7;
}

.no-data-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.card-btn {
  display: block;
  width: 100%;
  height: 40px;
  padding: 8px 0;
  border-radius: 8px;
  background: #36c18c;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}
</style>
