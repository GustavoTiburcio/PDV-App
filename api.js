import axios from 'axios';

const api = axios.create({
      //baseURL: 'http://192.168.25.167:8087/api' //Local TiFire
      baseURL: 'http://tifire.sytes.net:8087/api'  //Produção Servidor TiFire
      //baseURL: 'https://goldchavesheroku.herokuapp.com/api'  //Heroku Provisório
});

export default api;