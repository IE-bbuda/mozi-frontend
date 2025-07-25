export default [
  {
    path: '/financialSearch/FinancialSearchPage',
    name: 'financialSearchPage',
    component: () => import('../pages/financialSearch/FinancialSearchPage.vue'),
    meta: { isHeader: true, isFooter: true },
  },
  {
    path: '/financialSearch/:id', // 상세 페이지용 경로
    name: 'financialDetail',
    component: () => import('../pages/financialSearch/FinancialDetailPage.vue'),
    meta: { isHeader: true, isFooter: true },
  },
];
