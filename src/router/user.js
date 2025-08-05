export default [
  {
    path: '/user/MyPage',
    name: 'myPage',
    component: () => import('../pages/user/MyPage.vue'),
    meta: { isHeader: true, isFooter: true },
  },
  {
    path: '/user/personal',
    name: 'personal',
    component: () => import('../pages/user/PersonalInfo.vue'),
    meta: { isHeader: true, isFooter: true },
  },
  {
    path: '/multi-step',
    name: 'MultiStep',
    component: MultiStep,
    meta: { isHeader: true, isFooter: true },
  },
  {
    path: '/user/edit-info',
    name: 'EditInfo',
    component: () => import('../pages/user/EditInfo.vue'),
    meta: { isHeader: true, isFooter: true },
  },
  {
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  },
];

import { createRouter, createWebHistory } from 'vue-router';
import PersonalInfo from '../pages/user/PersonalInfo.vue';
import MultiStep from '../pages/user/MultiStep.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/personal-info', name: 'PersonalInfo', component: PersonalInfo },
    { path: '/multi-step', name: 'MultiStep', component: MultiStep },
  ],
});
