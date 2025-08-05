import axios from 'axios';

// test 코드로 추후 변경 가능
export const fetchUserProfileById = (userId) => {
  return axios
    .get(`/api/profile/test/${userId}`)
    .then((res) => res.data.result);
};
