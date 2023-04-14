import axios from 'axios';
import { API_URL_PAPERPLAS_INTERNO } from '@env';

const api = axios.create({
      baseURL: API_URL_PAPERPLAS_INTERNO
});

export default api;