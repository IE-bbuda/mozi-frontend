import api from './index.js';

export const authAPI = {
  // 로그인
  login: (credentials) => api.post('/auth/login', credentials),

  // 회원가입
  signup: (userData) => api.post('/users/signup', userData),

  // 아이디 중복 확인
  checkUsername: (loginId) => api.get(`/users/check-username/${loginId}`),

  // 이메일 인증번호 발송 (회원가입용)
  sendSignupEmailCode: (email) =>
    api.post(`/users/signup/send-email-code?email=${email}`),

  // 이메일 인증번호 확인 (회원가입용)
  verifySignupEmailCode: (data) =>
    api.post('/users/signup/verify-email-code', data),

  // 아이디 찾기
  findLoginId: (username, email) =>
    api.get('/users/find-id', {
      params: { username, email },
    }),

  // 비밀번호 재설정용 이메일 인증
  sendPasswordResetCode: (email) =>
    api.post(`/users/password/send-email-code?email=${email}`),

  // 비밀번호 재설정용 인증번호 확인
  verifyPasswordResetCode: (data) =>
    api.post('/users/password/verify-email-code', data),

  // 계정 확인 및 토큰 발급
  verifyAccount: (data) => api.post('/users/password/verify-account', data),

  // 비밀번호 재설정
  resetPassword: (data) => api.post('/users/password/reset', data),
};
