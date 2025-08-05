<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  // 로그아웃 후 로그인 페이지로 이동 (또는 앱에서 자동 처리)
  router.push('/auth/LoginPage');
};
</script>

<template>
  <div class="hamburger-menu">
    <!-- 뒤로가기 헤더 -->
    <div class="menu-header">
      <button @click="goBack" class="back-button">
        <i class="fas fa-chevron-left"></i>
        <span>뒤로가기</span>
      </button>
    </div>

    <nav class="menu-nav">
      <router-link to="/" class="menu-item">
        <i class="fas fa-home"></i>
        <span>홈</span>
      </router-link>

      <router-link to="/goal" class="menu-item">
        <i class="fas fa-bullseye"></i>
        <span>목표 설정</span>
      </router-link>

      <router-link to="/policySearch/PolicySearchPage" class="menu-item">
        <i class="fas fa-search"></i>
        <span>정책 탐색</span>
      </router-link>

      <router-link to="/financialSearch/FinancialSearchPage" class="menu-item">
        <i class="fas fa-chart-line"></i>
        <span>금융상품 탐색</span>
      </router-link>

      <router-link to="/scrap/ScrapPage" class="menu-item">
        <i class="fas fa-bookmark"></i>
        <span>스크랩</span>
      </router-link>

      <router-link to="/user/MyPage" class="menu-item">
        <i class="fas fa-user"></i>
        <span>마이페이지</span>
      </router-link>

      <!-- 로그아웃 버튼 -->
      <button @click="handleLogout" class="menu-item logout-button">
        <i class="fas fa-sign-out-alt"></i>
        <span>로그아웃</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
/* 구분선 */
.menu-divider {
  height: 1px;
  background-color: var(--color-border, rgba(60, 60, 60, 0.12));
  margin: 8px 0;
}

/* 로그아웃 버튼 스타일 */
.logout-button {
  font-family: inherit;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}
.logout-button:hover {
  background-color: #e74c3c;
  color: white;
  transform: translateX(4px);
}

.logout-button:hover i {
  transform: scale(1.1);
}
.hamburger-menu {
  width: 100%;
  background: var(--color-background, #ffffff);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.menu-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border, rgba(60, 60, 60, 0.12));
  background-color: var(--color-background-soft, #f8f8f8);
}

.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--color-text, #2c3e50);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #36c18c;
}

.back-button i {
  font-size: 16px;
  margin-right: 8px;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  text-decoration: none;
  color: #585858;
  font-size: 15px;
  font-weight: 500;
  border-bottom: 1px solid var(--color-border, rgba(60, 60, 60, 0.12));
  transition: all 0.3s ease;
  position: relative;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: var(--color-background-soft, #f8f8f8);
  color: var(--color-text, #2c3e50);
  transform: translateX(4px);
}

.menu-item.router-link-active {
  background-color: var(--color-background-mute, #f2f2f2);
  color: var(--color-text, #2c3e50);
  font-weight: 600;
  border-left: 4px solid #36c18c;
}

.menu-item.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: #36c18c;
}

.menu-item i {
  font-size: 18px;
  margin-right: 12px;
  width: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}

.menu-item:hover i {
  transform: scale(1.1);
}

.menu-item span {
  flex: 1;
  line-height: 1.4;
}

/* 활성 상태일 때 아이콘 색상 유지 */
.menu-item.router-link-active i {
  color: var(--color-text, #2c3e50);
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .menu-item {
    padding: 14px 16px;
    font-size: 14px;
  }

  .menu-item i {
    font-size: 16px;
    margin-right: 10px;
  }
}

/* 터치 디바이스용 활성 상태 */
.menu-item:active {
  background-color: var(--color-background-mute, #f2f2f2);
  transform: scale(0.98);
}

.menu-item.router-link-active:active {
  background-color: var(--color-background-mute, #f2f2f2);
}
</style>
