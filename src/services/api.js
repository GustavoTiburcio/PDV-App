import axios from 'axios';

const api = axios.create({
      // baseURL: 'https://operazjeans-api.herokuapp.com/api' //Produção Heroku
      baseURL: 'https://tifiredemonstracao-api.herokuapp.com/api'
});

export default api;