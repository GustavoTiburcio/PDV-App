import axios from 'axios';
import { API_URL_GOLDCHAVES } from '@env';

const api = axios.create({
      baseURL: API_URL_GOLDCHAVES
});

export default api;