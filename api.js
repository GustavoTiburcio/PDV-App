import axios from 'axios';

const api = axios.create({
      baseURL: 'https://guizzi-api.herokuapp.com/api' //Produção Heroku
});

export default api;