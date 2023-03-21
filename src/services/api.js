import axios from 'axios';

const api = axios.create({
      baseURL: process.env.api_url
});

export default api;