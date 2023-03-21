import axios from 'axios';

const api = axios.create({
      baseURL: 'http://tifire.sytes.net:8087/api'
});

export default api;