import axios from 'axios';
import { API_URL_PINDUFOODS_INTERNO, API_URL_GOLDCHAVES_INTERNO } from '@env';

const api = axios.create({
      baseURL: API_URL_PINDUFOODS_INTERNO
});

export default api;