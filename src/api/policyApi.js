// policyApi.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 20000,
});

const POLICY_BASE_URL = 'policy';

export default {
  // 정책 목록 조회
  async getList(params) {
    const { data } = await api.get(POLICY_BASE_URL, { params });
    console.log('POLICY GET LIST:', data);
    return data;
  },

  // 정책 상세 조회
  async get(id) {
    const { data } = await api.get(`${POLICY_BASE_URL}/${id}`);
    console.log('POLICY GET DETAIL:', data);
    return data;
  },

  // 필터 정책 조회
  async filterPolicies(filterData) {
    const { data } = await api.post(`${POLICY_BASE_URL}/filter`, filterData);
    return data;
  },

  // ✅ 마감 임박 정책 조회 (추가된 부분)
  async getDeadlinePolicies(days = 31) {
    const { data } = await api.get(`${POLICY_BASE_URL}/deadline`, {
      params: { days },
    });
    return data.result;
  },
};
