import api from './index.js';

export const profileAPI = {
  // 프로필 조회
  getProfile: () => api.get('/profile'),

  // 프로필 저장
  saveProfile: (profileData) => api.post('/profile', profileData),
  // 프로필 수정
  updateProfile: (profileData) => api.put('/profile', profileData),
};
