import axios from 'axios';

const api = axios.create({
      baseURL: 'http://192.168.25.167:8089/api' //Local TiFire
      //baseURL: 'https://goldchaves-api.herokuapp.com/api' //Produção Heroku
      // baseURL: 'http://tifire.sytes.net:8089/api'  //Produção Servidor TiFire
});

export default api;