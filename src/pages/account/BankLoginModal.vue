<template>
  <div class="modal-overlay" @click.self="close">
    <div class="my-modal">
      <div class="modal-header">
        <img :src="bank.logo" class="bank-logo" />
        <h2>{{ bank.name }} 연동</h2>
      </div>
      <input v-model="id" placeholder="아이디" class="input" />
      <input
        v-model="password"
        type="password"
        placeholder="비밀번호"
        class="input"
      />
      <p v-if="error" class="error">{{ error }}</p>
      <div class="badge-container">
        <span class="badge" @click="goHomPage">{{ bank.name }} 홈페이지</span>
      </div>
      <div class="modal-actions">
        <button @click="connect" class="connect-btn" :disabled="loading">
          {{ loading ? '연동 중...' : '연동' }}
        </button>

        <button @click="close" class="cancel-btn">취소</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useBankStore } from '@/stores/bank';
import { addAccountList } from '@/api/accountApi.js';
const props = defineProps({
  bank: Object,
});

console.log('modal bank:', props.bank);
const emit = defineEmits(['close']);
const id = ref('');
const password = ref('');
const error = ref('');
const bankStore = useBankStore();
const loading = ref(false);
function close() {
  emit('close');
}
function goHomPage() {
  if (props.bank.link) {
    window.open(props.bank.link, '_blank'); // 새 창으로 열기
  } else {
    alert('홈페이지 링크가 존재하지 않습니다.');
  }
}
async function connect() {
  if (!id.value || !password.value) {
    error.value = '아이디와 비밀번호를 입력해주세요.';
    return;
  }
  loading.value = true;
  try {
    //  실제 backend 요청
    const response = await addAccountList({
      bankCode: props.bank.code,
      userBankId: id.value,
      userBankPassword: password.value,
    });
    console.log('연동 성공:', response);
    //const connectedId = response.connectedId;
    if (!response.success) {
      error.value = '아이디 또는 비밀번호가 일치하지 않습니다.';
      return;
    }
    // 연동 처리
    bankStore.markAsConnected(props.bank.code);
    close();
  } catch (e) {
    console.log(e);
    error.value = '연동 실패. 다시 시도해주세요.';
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.my-modal {
  background: white;
  padding: 20px;
  width: 300px;
  border-radius: 8px;
  text-align: center;
}
.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.bank-logo {
  margin-top: 10px;
  width: 60px;
  height: 60px;
  object-fit: contain;
}
.input {
  display: block;
  width: 100%;
  margin-bottom: 5px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.error {
  color: red;
  font-size: 13px;
  margin-bottom: 10px;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
}
.connect-btn {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.cancel-btn {
  background-color: #ddd;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.spinner {
  margin: 10px 0;
  font-size: 14px;
  color: #4caf50;
}
.badge-container {
  display: flex;
  justify-content: flex-end; /* 또는 margin-left: auto 방식 */
  margin-bottom: 16px;
}
.badge {
  display: inline-block;
  /* margin: 0px 0 30px 150px; */
  padding: 4px 8px;
  background-color: #e0f3ff;
  color: #0077cc;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.badge:hover {
  background-color: #d0eaff;
}
</style>
