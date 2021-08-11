import axios from 'axios';

const api = axios.create({
    //baseURL: 'http://192.168.25.167:8087/api'
    //baseURL: 'https://goldchaves-api.herokuapp.com/api'
      baseURL: 'https://goldchaves-api.herokuapp.com/api'
});

export default api;