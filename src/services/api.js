import axios from 'axios';

const api = axios.create({
      baseURL: 'http://192.168.25.167:8091/api',
});

export default api;