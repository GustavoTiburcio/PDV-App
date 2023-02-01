import axios from 'axios';

const api = axios.create({
      baseURL: 'https://tifiredemonstracao-api.herokuapp.com/api' //Produção Heroku
});

export default api;