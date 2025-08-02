// src/api/scrapApi.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const scrapPolicy = (userId, plcyNo) => {
  return axios.post(`/api/scrap/policy/${plcyNo}?userId=${userId}`);
};

export const cancelScrap = (userId, plcyNo) => {
  return axios.delete(`/api/scrap/policy/${plcyNo}?userId=${userId}`);
};

export const getScrappedPolicyIds = (userId) =>
  axios
    .get('/api/scrap', { params: { userId, type: 'policy' } })
    .then((res) => res.data);

export const getScrappedPolicies = (userId) =>
  axios
    .get('/api/scrap/policy/list', { params: { userId } })
    .then((res) => res.data);