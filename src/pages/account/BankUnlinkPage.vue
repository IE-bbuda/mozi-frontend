<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMainBank, deleteAccounts } from '@/api/accountApi';
import { useBankStore } from '@/stores/bank';

const router = useRouter();
const bankStore = useBankStore();
const banks = bankStore.banks;

const bankList = ref([]);
const selectedBanks = ref(new Set()); // ✅ 다중 선택용
const showConfirm = ref(false);

// 은행 로고 URL
const getBankLogoUrl = (bankCode) => {
  const bank = banks.find((b) => b.code === bankCode);
  return bank?.logo || '/images/financial/default.png';
};

// 초기 데이터 로딩
const loadBankList = async () => {
  try {
    const res = await getMainBank();
    bankList.value = res.bankList.map(
      (code) =>
        banks.find((b) => b.code === code) || {
          code,
          name: '알수없음',
          logo: '/images/financial/default.png',
        }
    );
  } catch (err) {
    console.error('은행 목록 불러오기 실패:', err);
    bankList.value = [];
  }
};

// 은행 선택 토글
const toggleBankSelection = (code) => {
  if (selectedBanks.value.has(code)) {
    selectedBanks.value.delete(code);
  } else {
    selectedBanks.value.add(code);
  }
  selectedBanks.value = new Set([...selectedBanks.value]); // 반응성 유지를 위해 복사
};

// 삭제 확정
const confirmDelete = async () => {
  try {
    await deleteAccounts([...selectedBanks.value]);
    showConfirm.value = false;
    selectedBanks.value.clear();
    await loadBankList();
  } catch (error) {
    console.error('삭제 실패:', error);
  }
};

// 뒤로가기
const goBack = () => router.back();

onMounted(() => {
  loadBankList();
});
</script>

<template>
  <div class="container">
    <!-- 헤더 -->
    <div class="header">
      <span class="back-btn" @click="goBack">
        <i class="fa-solid fa-angle-left"></i>
      </span>
      <div style="font-size: 18px; font-weight: bold; color: #757575">
        은행 연동 해지
      </div>
    </div>

    <p>해지할 은행을 선택해주세요 (복수 선택 가능)</p>

    <!-- 은행 목록 -->
    <div class="bank-box">
      <div
        v-for="bank in bankList"
        :key="bank.code"
        class="bank-row"
        :class="{ selected: selectedBanks.has(bank.code) }"
        @click="toggleBankSelection(bank.code)"
      >
        <img
          :src="getBankLogoUrl(bank.code)"
          alt="은행 로고"
          style="height: 32px; margin-right: 0.5rem"
        />
        <span class="bank-name">{{ bank.name }}</span>
        <span class="check-icon">
          <i
            :class="[
              'fa-regular',
              selectedBanks.has(bank.code) ? 'fa-check-square' : 'fa-square',
            ]"
          ></i>
        </span>
      </div>
    </div>

    <!-- 삭제 버튼 -->
    <button
      class="delete-btn"
      :disabled="selectedBanks.size === 0"
      @click="showConfirm = true"
      :style="{
        backgroundColor: selectedBanks.size > 0 ? '#e34c4c' : '#d9d9d9',
        cursor: selectedBanks.size > 0 ? 'pointer' : 'not-allowed',
      }"
    >
      삭제하기
    </button>

    <!-- 삭제 모달 -->
    <div class="modal-overlay" v-if="showConfirm">
      <div class="my-modal">
        <p class="modal-title">선택한 은행을 연동 해지하시겠습니까?</p>
        <p class="modal-desc">관련 정보도 함께 삭제됩니다.</p>
        <div class="modal-actions">
          <button class="cancel" @click="showConfirm = false">취소</button>
          <button class="confirm" @click="confirmDelete">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 16px;
}
.header {
  display: flex;
  align-items: center;
  gap: 110px;
}
.back-btn {
  font-size: 24px;
  cursor: pointer;
}
.bank-box {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  margin-top: 12px;
}
.bank-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}
.bank-row:last-child {
  border-bottom: none;
}
.bank-row.selected {
  background-color: #e6f0f0;
}
.bank-name {
  flex: 1;
  margin-left: 12px;
  font-weight: bold;
}
.check-icon {
  font-size: 20px;
  color: teal;
}
.delete-btn {
  display: block;
  width: 90%;
  margin: 100px 0 0 20px;
  padding: 10px 0;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: white;
  transition: background-color 0.3s ease;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.4);
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.my-modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  max-width: 300px;
}
.modal-title {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 18px;
}
.modal-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
}
.cancel {
  background: white;
  border: 1px solid #ccc;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.confirm {
  background: #e34c4c;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
