<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import api from '@/api/index.js'; // Auth Store 대신 직접 API 호출

library.add(faEye, faEyeSlash);
const router = useRouter();

const id = ref('');
const passwd = ref('');
const showPassword = ref(false);
const error = ref(''); // 에러 메시지
const loading = ref(false);

const canSubmit = computed(() => id.value.trim() && passwd.value.trim());

function toggleShow() {
  showPassword.value = !showPassword.value;
}

async function login() {
  error.value = ''; // 이전 에러 메시지 초기화
  loading.value = true;

  try {
    const response = await api.post('/auth/login', {
      loginId: id.value.trim(),
      password: passwd.value.trim(),
    });

    console.log('로그인 성공:', response);

    // 성공 시 토큰 저장
    if (response.token && response.user) {
      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
      await router.push({ name: 'mainPage' });
    } else {
      error.value = '로그인 응답이 올바르지 않습니다.';
    }
  } catch (err) {
    console.log('로그인 실패:', err);

    // 에러 메시지 설정
    if (err.response?.status === 401) {
      error.value = '아이디 또는 비밀번호가 일치하지 않습니다.';
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = '로그인 중 오류가 발생했습니다.';
    }
  } finally {
    loading.value = false;
  }
}

function loginWithKakao() {
  alert('카카오 로그인 시도');
}

function loginWithNaver() {
  alert('네이버 로그인 시도');
}

function loginWithGoogle() {
  alert('구글 로그인 시도');
}
</script>

<template>
  <h1>MoZi</h1>
  <div class="total-form">
    <form class="login-form" @submit.prevent="login">
      <div class="login">
        <input type="text" v-model="id" placeholder="아이디" />

        <div class="passwd-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="passwd"
            placeholder="비밀번호"
            class="passwd-input" />
          <FontAwesomeIcon
            :icon="showPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']"
            class="toggle-icon"
            @click="toggleShow" />
        </div>

        <!-- 에러 메시지 영역을 고정 높이로 미리 확보 -->
        <div class="error-container">
          <div v-if="error" class="error">{{ error }}</div>
        </div>
      </div>

      <div class="find">
        <router-link to="/find-id">아이디 찾기</router-link>
        |
        <router-link to="/find-passwd">비밀번호 찾기</router-link>
      </div>

      <button
        type="submit"
        :disabled="!canSubmit || loading"
        :class="{
          'active-btn': canSubmit && !loading,
          'inactive-btn': !canSubmit || loading,
        }">
        {{ loading ? '로그인 중...' : '로그인' }}
      </button>

      <div class="join">
        회원이 아니신가요?
        <a href="/join">회원가입</a>
      </div>

      <!--소셜 로그인 -->
      <div class="social-login">
        <p class="social-title">또는 소셜 계정으로 로그인</p>

        <button type="button" class="kakao-btn" @click="loginWithKakao">
          <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fill="#3c1e1e"
              d="M12 2C6.48 2 2 5.91 2 10.5c0 3.11 2.4 5.82 5.86 7.12L6.5 22l5.31-3.07c.06 0 .13.01.19.01 5.52 0 10-3.91 10-8.5S17.52 2 12 2z" />
          </svg>
          카카오로 로그인
        </button>

        <button type="button" class="naver-btn" @click="loginWithNaver">
          <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="white" d="M4 4h4l4 7V4h4v16h-4l-4-7v7H4z" />
          </svg>
          네이버로 로그인
        </button>

        <button type="button" class="google-btn" @click="loginWithGoogle">
          <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.4-5.8 7.5-11.3 7.5-6.9 0-12.5-5.6-12.5-12.5S17.1 10.5 24 10.5c3.1 0 5.9 1.1 8.1 3.1l5.7-5.7C34.5 4.4 29.6 2.5 24 2.5 12.4 2.5 3 11.9 3 23.5S12.4 44.5 24 44.5c11.6 0 21-9.4 21-21 0-1.5-.2-3-.4-4.5z" />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8c1.8-4.4 5.9-7.5 11.1-7.5 3.1 0 5.9 1.1 8.1 3.1l5.7-5.7C34.5 4.4 29.6 2.5 24 2.5 15.2 2.5 7.5 7.8 3.6 15.1z" />
            <path
              fill="#4CAF50"
              d="M24 44.5c5.4 0 10.3-2.1 14-5.5l-6.5-5.4c-2.1 1.5-4.8 2.4-7.5 2.4-5.5 0-10.2-3.6-11.8-8.5H6.3c2.4 7.1 9.2 12 17.7 12z" />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.7 2-1.9 3.8-3.4 5.2l.1.1 6.5 5.4c-1.8 1.7-4 3-6.4 3.8l.3.3c7-6.4 11.1-15.2 11.1-25.3 0-1.5-.2-3-.4-4.5z" />
          </svg>
          구글로 로그인
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.total-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 35vh;
}

h1 {
  text-align: center;
  margin-top: 4rem;
  font-size: 48px;
  color: #36c18c;
  transform: translateY(0%);
  transform: translateX(0%);
}

.login-form {
  margin-top: 90%;
  max-width: 330px; /* 360px에서 330px로 축소 */
  width: 100%;
  margin-bottom: 4rem;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 입력창 스타일 - 크기 축소 */
.login input {
  width: 100%;
  padding: 10px; /* 11px에서 10px로 축소 */
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.passwd-wrapper {
  position: relative;
  margin-bottom: 5px;
}

.passwd-input {
  width: 100%;
  padding: 10px; /* 11px에서 10px로 축소 */
  padding-right: 40px; /* 42px에서 40px로 축소 */
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
}

.toggle-icon {
  position: absolute;
  top: 50%;
  right: 12px; /* 13px에서 12px로 축소 */
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
  font-size: 16px; /* 17px에서 16px로 축소 */
}

/* 에러 메시지 컨테이너 - 고정 높이 */
.error-container {
  min-height: 18px; /* 20px에서 18px로 축소 */
  margin-top: 5px;
  margin-bottom: 5px;
}

/* 에러 메시지 스타일 */
.error {
  color: #e74c3c;
  font-size: 12px;
  text-align: left;
  line-height: 1.2;
  margin: 0;
}

.find {
  font-size: 12px;
  display: flex;
  justify-content: right;
  gap: 5px;
}

.find a {
  color: #000;
  font-weight: bold;
  text-decoration: none;
}

.join {
  display: flex;
  justify-content: center;
  font-size: 12px;
  gap: 5px;
  color: #757575;
  margin-bottom: 2rem;
}

.join a {
  color: #000;
  font-weight: bold;
  text-decoration: none;
}

.login-form button {
  border-radius: 5px;
  padding: 12px; /* 13px에서 12px로 축소 */
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.inactive-btn {
  background-color: #f2f4f6;
  color: #b0b8c1;
  cursor: not-allowed;
}

.active-btn {
  background-color: #36c18c;
  color: #ffffff;
}

/* 소셜 로그인 스타일 */
.social-login {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.social-title {
  font-size: 11px;
  color: #999999;
  margin-bottom: 4px;
  text-align: left;
  margin-left: 4px;
}

.social-login button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  padding: 10px; /* 11px에서 10px로 축소 */
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.social-icon {
  width: 20px;
  height: 20px;
}

.kakao-btn {
  background-color: #fee500;
  color: #3c1e1e;
}

.naver-btn {
  background-color: #03c75a;
  color: white;
}

.google-btn {
  background-color: white;
  border: 1px solid #d9d9d9;
  color: #333;
}
</style>
