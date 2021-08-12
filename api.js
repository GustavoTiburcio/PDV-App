import axios from 'axios';

const api = axios.create({
      baseURL: 'https://goldchaves-api.herokuapp.com/api'
});

export default api;