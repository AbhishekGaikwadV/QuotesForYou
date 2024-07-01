import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://quotes-for-you-a.vercel.app',
  withCredentials: true // if you need to include cookies
});

export default apiClient;
