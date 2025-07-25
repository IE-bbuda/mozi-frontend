// PolicySearch.js
export default [
  {
    path: '/policySearch/PolicySearchPage',
    name: 'policySearchPage',
    component: () => import('../pages/policySearch/PolicySearchPage.vue'),
    meta: { isHeader: true, isFooter: true },
  },
  {
    path: '/policySearch/detail/:id',
    name: 'policyDetail',
    component: () => import('../pages/policySearch/policyDetailPage.vue'),
    meta: { isHeader: true, isFooter: true },
  },
];
