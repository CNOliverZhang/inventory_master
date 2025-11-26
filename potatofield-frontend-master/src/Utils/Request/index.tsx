import axios from 'axios';
import qs from 'qs';

const request = axios.create();
const token = localStorage.getItem('token') || sessionStorage.getItem('token');

request.defaults.timeout = 1000 * 60 * 10;

request.interceptors.request.use((config) => {
  const newConfig = { ...config };
  if (config.method?.toLowerCase() === 'get') {
    newConfig.paramsSerializer = (params) => qs.stringify(params, { indices: false });
  }
  if (token) {
    newConfig.headers.authorization = `Bearer ${token}`;
  }
  return newConfig;
});

request.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(err?.response);
  },
);

export default request;
