import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://blogapp-4h26.onrender.com/api',
  withCredentials: true, 
});

instance.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

export default instance;
