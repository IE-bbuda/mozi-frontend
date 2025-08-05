import api from './index.js';

//계좌 추가
export const addAccountList = async (data) => {
  try {
    const result = await api.post('/account/add', data);
    return result;
  } catch (error) {
    console.error('계좌 추가 실패:', error);
    throw error;
  }
};

//계좌 조회
export const getAccountList = async () => {
  try {
    const result = await api.get('/account/get');
    return result;
  } catch (error) {
    console.error('계좌 조회 실패:', error);
    throw error;
  }
};

// 은행 삭제 요청 (bankCode 배열 전달)
export const deleteAccounts = async (bankCodeList) => {
  const response = await api.delete('/account/delete', {
    data: bankCodeList,
  });
  return response; // 삭제된 bankCode 리스트 반환
};

// 계좌 최신화
export const refreshAccounts = async () => {
  try {
    const result = await api.put('/account/refresh');
    return result;
  } catch (error) {
    console.error('계좌 최신화 실패:', error);
    throw error;
  }
};

// 메인페이지 은행 보여주기
export const getMainBankSummary = async () => {
  try {
    const result = await api.get('/account/mainsummary');
    return result;
  } catch (error) {
    console.error('계좌 조회 실패:', error);
    throw error;
  }
};

export const getBankSummary = async () => {
  try {
    const res = await api.get('/account/summary');
    return res;
  } catch (error) {
    console.error('은행 요약 조회 실패:', error);
    throw error;
  }
};

export const getMainBank = async () => {
  const response = await api.get('/account/get-mainbank');
  console.log(response);
  return response;
};

export const setMainBank = async (bankCode) => {
  const payload = { bankCode: bankCode === null ? null : bankCode };
  const response = await api.post('/account/set-mainbank', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response;
};

export const getAccountsByGoal = async (goalId) => {
  try {
    const result = await api.get('/account/get-by-goal', {
      params: { goalId }, // ✅ GET 요청은 params로
    });
    return result;
  } catch (error) {
    console.error('목표별 계좌 조회 실패:', error);
    throw error;
  }
};

export const getAccountsByBank = async (bankCode) => {
  const result = await api.get(`/account/get-by-bank`, {
    params: { bankCode },
  });
  return result;
};

//목표 포함계좌 수정
export const updateAccountsByGoal = async (data) => {
  try {
    const response = await api.post('/account/update-by-goal', data);
    return response;
  } catch (error) {
    console.error('계좌 목표 업데이트 실패:', error);
    throw error;
  }
};

export async function getConnectedBanks() {
  const res = await api.get('/account/connected-banks');
  return res;
}
