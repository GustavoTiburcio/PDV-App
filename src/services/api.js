import axios from 'axios';

const api = axios.create({
      baseURL: 'https://tifiredemonstracao-api.herokuapp.com/api'
});

export default api;