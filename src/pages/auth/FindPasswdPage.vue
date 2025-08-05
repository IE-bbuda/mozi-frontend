<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { authAPI } from '@/api/auth.js';

library.add(faEye, faEyeSlash);
library.add(faChevronLeft);

const router = useRouter();

const userId = ref('');
const email = ref('');
const errors = reactive({ userId: '', email: '', verificationCode: '' });
const loading = ref(false);
const submitError = ref('');
const verificationCode = ref('');
const sentCode = ref(false);
const isEmailVerified = ref(false);

function goBack() {
  router.back();
}

function validateUserId() {
  errors.userId = userId.value.trim() ? '' : '가입 시 등록한 아이디를 입력해주세요';
}

function validateEmail() {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    errors.email = '가입 시 등록한 이메일을 입력해 주세요';
  } else if (!re.test(email.value)) {
    errors.email = '유효하지 않은 이메일입니다';
  } else {
    errors.email = '';
  }
}

async function sendVerificationCode() {
  validateEmail();
  if (errors.email) return;

  try {
    // authAPI 사용 - 비밀번호 재설정용 이메일 인증번호 발송
    const response = await authAPI.sendPasswordResetCode(email.value);

    if (response.isSuccess || response.code === 200) {
      sentCode.value = true;
      alert('인증 코드가 이메일로 발송되었습니다');
    } else {
      alert(response.message || '인증 코드 발송에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    console.error('이메일 발송 실패:', error);
    alert(error.response?.data?.message || '인증 코드 발송에 실패했습니다. 다시 시도해주세요.');
  }
}

async function verifyCode() {
  if (!verificationCode.value.trim()) {
    errors.verificationCode = '인증 코드를 입력해주세요.';
    return;
  }

  try {
    // authAPI 사용 - 비밀번호 재설정용 인증번호 확인
    const response = await authAPI.verifyPasswordResetCode({
      email: email.value,
      verificationCode: verificationCode.value,
    });

    if (response.isSuccess || response.code === 200) {
      isEmailVerified.value = true;
      errors.verificationCode = '';
      alert('이메일 인증이 완료되었습니다.');
    } else {
      isEmailVerified.value = false;
      errors.verificationCode = response.message || '인증 코드가 일치하지 않습니다.';
    }
  } catch (error) {
    console.error('이메일 인증 실패:', error);
    isEmailVerified.value = false;
    errors.verificationCode = error.response?.data?.message || '인증 코드가 일치하지 않습니다.';
  }
}

const canSubmit = computed(() => {
  return userId.value.trim() && email.value.trim() && !errors.userId && !errors.email && isEmailVerified.value;
});

async function handleSubmit() {
  validateUserId();
  validateEmail();
  submitError.value = '';

  if (!canSubmit.value) return;

  loading.value = true;
  try {
    // authAPI 사용 - 계정 확인 및 토큰 발급
    const response = await authAPI.verifyAccount({
      loginId: userId.value,
      email: email.value,
    });

    if (response.isSuccess || response.code === 200 || response.result) {
      // 토큰을 받았으므로 비밀번호 재설정 페이지로 이동
      // result 필드에 토큰이 있거나, response 자체가 토큰일 수 있음
      const token = response.result || response;
      await router.push({
        name: 'ResetPasswdPage',
        query: { token: token },
      });
    } else {
      submitError.value = response.message || '아이디 또는 이메일이 일치하지 않습니다';
    }
  } catch (error) {
    console.error('계정 확인 실패:', error);
    submitError.value = error.response?.data?.message || '요청 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="header">
    <font-awesome-icon icon="fa-solid fa-chevron-left" class="backIcon" @click="goBack" />
    <h1 class="logo">MoZi</h1>
  </div>
  <div class="title">비밀번호 찾기</div>

  <div class="form-wrapper">
    <form @submit.prevent="handleSubmit" class="form-container">
      <section class="writeID section-field">
        <label>
          아이디
          <input name="userId" type="text" v-model="userId" placeholder="아이디를 입력하세요" @blur="validateUserId" />
          <span v-if="errors.userId" class="error">{{ errors.userId }}</span>
        </label>
      </section>

      <div class="certification">
        <section class="writeEmail section-field">
          <label>
            이메일
            <input name="email" type="email" v-model="email" placeholder="이메일을 입력하세요" @blur="validateEmail" />
          </label>
          <span :class="['error-message', { visible: errors.email }]">{{ errors.email || '' }}</span>
          <button type="button" @click="sendVerificationCode">인증</button>
        </section>

        <section v-if="sentCode" class="verificationCode section-field">
          <label>
            인증 코드
            <input
              name="verificationCode"
              type="text"
              v-model="verificationCode"
              placeholder="인증 코드를 입력하세요" />
            <span v-if="errors.verificationCode" class="error">{{ errors.verificationCode }}</span>
          </label>
          <button type="button" @click="verifyCode">확인</button>
        </section>

        <!-- 인증 완료 메시지 -->
        <div v-if="isEmailVerified" class="verification-success">✅ 이메일 인증이 완료되었습니다.</div>
      </div>

      <button
        type="submit"
        :disabled="!canSubmit || loading"
        :class="{
          'active-btn': canSubmit && !loading,
          'inactive-btn': !canSubmit || loading,
        }">
        {{ loading ? '처리중...' : '확인' }}
      </button>

      <div v-if="loading" class="loading-message">요청중입니다...</div>
      <div v-if="submitError" class="error submit-error">{{ submitError }}</div>
    </form>
  </div>
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
  overflow-x: hidden;
}

#page {
  display: flex;
  justify-content: center; /* 가로 중앙 */
  align-items: flex-start; /* 세로는 위쪽 정렬 */
  min-height: 850px; /* 세로 스크롤 방지 */
  padding-top: 1rem; /* 화면 상단에서 여백 */
  box-sizing: border-box;
}
.header {
  position: relative;
  display: flex;
  justify-content: center; /* 로고는 가운데 */
  align-items: center; /* 세로 중앙 */
  width: 100%;
  height: 60px;
  margin-top: 2rem;
}
/* 로고 중앙 */
.logo {
  font-size: 48px;
  color: #36c18c;
  margin: 0;
}
.backIcon {
  position: absolute;
  left: 10px;
  top: 60%;
  transform: translateY(-50%);
  font-size: 30px;
  color: black;
  cursor: pointer;
}
/* 타이틀 */
.title {
  font-size: 24px;
  color: #776e6e;
  text-align: center;
  margin-top: 1rem;
}
/* 폼 외부구조 */
.form-wrapper {
  width: 100%;
  max-width: 100%;
  align-items: center;
  height: 20vh;
  margin-top: 3rem;
}
.form-container {
  max-width: 300px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  font-size: 20px;
  border-radius: 5px;
}
.form-container input {
  width: 100%;
  padding: 0.75rem;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.form-container input:focus {
  outline: none;
  background-color: #fff;
}
.form-container .section-field {
  margin-bottom: 1rem;
}
input {
  font-size: 16px; /* 동일한 폰트 크기 */
  padding: 0.75rem; /* 동일한 내측 여백 */
  box-sizing: border-box; /* 패딩, 보더 포함 고정 높이 유지 */
  height: 3rem; /* 통일된 높이 고정 */
  background-color: none;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
}
input::placeholder {
  font-size: 16px;
  font-family: inherit;
}
.writeEmail button,
.writeID input {
  font-size: inherit;
  height: 3rem;
}
/* 이메일 입력창  */
.writeEmail {
  position: relative;
  margin-bottom: 1.5rem;
}
.writeEmail input {
  padding-right: 4.5rem;
}
.writeEmail button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.5rem;
  height: 2.2rem;
  padding: 0 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background-color: #36c18c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.writeEmail button:disabled,
.verificationCode button:disabled,
.certification section button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.form-container input {
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.form-container input,
.form-container button {
  width: 100%;
  box-sizing: border-box;
}
/* 인증코드 입력창 */
.verificationCode {
  position: relative;
}
.verificationCode button {
  position: absolute;
  top: 60%;
  transform: translateY(-50%);
  right: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.4rem;
  background-color: #36c18c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.verificationCode button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 1rem;
  text-align: center;
}
.error-message {
  visibility: hidden;
  display: block;
  min-height: 1.2em;
  margin-top: -0.3rem;
  color: red;
  font-size: 12px;
}
.error-message.visible {
  visibility: visible;
}
.form-container button {
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  color: whites;
}
.active-btn {
  cursor: pointer;
  background-color: #36c18c;
  color: #fff;
}
.active-btn:hover {
  background-color: #2fa876;
}
.inactive-btn,
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  pointer-events: none;
}
.section-field {
  margin-bottom: 1.5rem;
}
.section-field label {
  font-size: 14px;
  margin-bottom: 0.5rem;
  display: block;
  flex-direction: column;
}
.section-field label > input {
  margin-top: 0.5rem;
}

/* 인증 상태 메시지 */
.verification-success {
  color: #28a745;
  font-size: 14px;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  padding: 8px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}

.certification {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.certification section {
  position: relative;
  align-items: center;
  margin-bottom: 1.5rem;
}
/* 인증, 확인 버튼 */
.certification section button {
  position: absolute;
  top: 55%;
  transform: translateY(-55%);
  right: 0.5rem;
  padding: 0 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 50px;
  font-size: 14px;
  cursor: pointer;
  background-color: #36c18c;
  color: white;
  border: none;
  border-radius: 4px;
}

.certification section button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.certification section input {
  width: 100%;
  padding-right: 4rem;
}

.loading-message {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 1rem;
}

.submit-error {
  text-align: center;
  margin-top: 1rem;
}
</style>
