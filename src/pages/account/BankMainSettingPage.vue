<script setup>
import { ref, onMounted, computed } from 'vue';
import { getMainBank, setMainBank } from '@/api/accountApi';
import { useRouter } from 'vue-router';
import { useBankStore } from '@/stores/bank';

const initialBankCode = ref(null); // 최초 상태 저장
const mainBankCode = ref(null); // 현재 선택 상태
const bankList = ref([]);
const router = useRouter();

const bankStore = useBankStore();
const banks = bankStore.banks;

const getBankLogoUrl = (bankCode) => {
  const bank = banks.find((b) => b.code === bankCode);
  return bank?.logo || '/images/financial/default.png';
};

onMounted(async () => {
  const data = await getMainBank();
  bankList.value = data.bankList.map((code) => {
    return (
      banks.find((b) => b.code === code) || {
        code,
        name: '알수없음',
        logo: '/images/financial/default.png',
      }
    );
  });
  initialBankCode.value = data.mainBankCode || null;
  mainBankCode.value = data.mainBankCode || null;
});

const isBankSelected = computed(() => mainBankCode.value !== null);

// 현재 상태와 초기 상태 비교 → 변경되었을 경우 버튼 활성화
const isModified = computed(() => mainBankCode.value !== initialBankCode.value);

// 은행 클릭 → 선택 또는 해제
const toggleMainBank = (bankCode) => {
  if (mainBankCode.value === bankCode) {
    mainBankCode.value = null;
  } else {
    mainBankCode.value = bankCode;
  }
};

// 동의 버튼 → 서버에 반영
const handleAgree = async () => {
  await setMainBank(mainBankCode.value); // null이면 해제
  router.back();
};

// 뒤로가기
const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="container">
    <div class="header">
      <span class="back-btn" @click="goBack"
        ><i class="fa-solid fa-angle-left"></i
      ></span>
      <div style="font-size: 18px; font-weight: bold; color: #757575">
        주거래 은행
      </div>
    </div>
    <p>주거래 은행 한 개를 선택해주세요</p>

    <div class="bank-box">
      <div
        v-for="bank in bankList"
        :key="bank.code"
        class="bank-row"
        @click="toggleMainBank(bank.code)"
      >
        <img
          :src="getBankLogoUrl(bank.code)"
          alt="은행 로고"
          style="height: 32px; margin-right: 0.5rem"
        />
        <span class="bank-name">{{ bank.name }}</span>
        <span class="star">
          <span v-if="mainBankCode === bank.code"
            ><i class="fa-solid fa-star" style="color: #ffd43b"></i
          ></span>
          <span v-else
            ><i class="fa-solid fa-star" style="color: #dedede"></i
          ></span>
        </span>
      </div>
    </div>

    <button
      class="Agreecard-btn"
      :disabled="!isModified"
      :style="{
        backgroundColor: isModified ? '#4CAF50' : '#d9d9d9',
        cursor: isModified ? 'pointer' : 'not-allowed',
      }"
      @click="handleAgree"
    >
      동의하기
    </button>
  </div>
</template>

<style scoped>
.container {
  padding: 16px;
}
.header {
  display: flex;
  align-items: center;
  gap: 115px;
}
.back-btn {
  font-size: 24px;
  cursor: pointer;
  user-select: none;
}
.bank-box {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
}
.bank-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.bank-name {
  flex: 1;
  margin-left: 12px;
  font-weight: bold;
}
.star {
  font-size: 20px;
  color: #f5c518;
}
.Agreecard-btn {
  display: block;
  width: 90%;
  margin: 100px 0 0 20px;
  padding: 10px 0;
  border-radius: 4px;
  border: none;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.4);
  font-size: 16px;
  transition: background-color 0.3s ease;
}
.Agreecard-btn:active {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
  background: #388e3c;
  transform: scale(0.98);
  transition: box-shadow 0.1s, background 0.1s, transform 0.1s;
}
</style>
