<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({ name: '', phone: '', email: '' });
const loading = ref(false);
const error = ref('');

// 사용자 정보 불러오기
onMounted(async () => {
  try {
    const res = await axios.get('/api/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
    form.value = res.data;
  } catch (err) {
    error.value = '사용자 정보를 불러오는 데 실패했습니다.';
  }
});

// 저장
async function onSave() {
  if (!form.value.name || !form.value.phone || !form.value.email) {
    error.value = '모든 항목을 입력해주세요.';
    return;
  }

  try {
    loading.value = true;
    await axios.put('/api/me', form.value, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
    alert('정보가 수정되었습니다.');
    router.push({ name: 'myPage', query: { updated: 'true' } });
  } catch (err) {
    error.value = '정보 저장에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container form-edit">
    <h2>기본 정보 수정</h2>
    <label>이름</label>
    <input v-model="form.name" placeholder="이름 입력" />
    <label>전화번호</label>
    <input v-model="form.phone" placeholder="전화번호 입력" />
    <label>이메일</label>
    <input v-model="form.email" placeholder="이메일 입력" />

    <div v-if="error" class="error-msg">{{ error }}</div>

    <button :disabled="loading" @click="onSave">{{ loading ? '저장 중...' : '저장' }}</button>
  </div>
</template>

<style scoped>
.container.form-edit {
  max-width: 400px;
  margin: 40px auto;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}
label {
  display: block;
  margin-top: 16px;
  font-weight: 500;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  box-sizing: border-box;
}
button {
  margin-top: 24px;
  padding: 12px 0;
  width: 100%;
  background: #36c18c;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
