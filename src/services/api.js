import axios from 'axios';

const api = axios.create({
      baseURL: env.API_URL
});

export default api;