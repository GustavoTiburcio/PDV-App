import axios from 'axios';

const api = axios.create({
      // baseURL: 'https://operazjeans-api.herokuapp.com/api' //Produção Heroku
      baseURL: 'http://192.168.25.167:8087/api'
});

export default api;