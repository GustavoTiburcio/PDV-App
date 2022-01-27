/* eslint-disable prettier/prettier */
import axios from 'axios';
import api from '../api';
import { Alert } from 'react-native';

// export const postPedido = async (dadosPedido) => {
//         const response = await api.post('/pedidos/salvar2Pedisdo', dadosPedido, {
//             headers: {
//                 'Content-Type': 'application/json; charset=UTF-8'
//             }
//         }).catch(error => {
//             return Promise.reject(new Error(400));
//         });
// }

// export const postPedido = (dadosPedido) => new Promise((resolve, reject) =>{
//     return new Promise((resolve, reject) => {
//         const response = api.post('/pedidos/salvar2Pedisdo', dadosPedido, {
//             headers: {
//                 'Content-Type': 'application/json; charset=UTF-8'
//             }
//         })
//       error ? reject("erro ao salvar pedido") : resolve(response.data);
//     });
// };

export const postPedido = (dadosPedido) => new Promise(async (resolve, reject) => {
        const response = await api.post('/pedidos/salvar2Pedisdo', dadosPedido, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });
        if (response.data) {
            resolve(response.data);
            console.log('Entrou 1')
        }
}).catch(error => { reject(error); console.log(error.message); Alert.alert("Erro ao salvar pedido", error.message) });

// export const postPedido = (dadosPedido) => new Promise((resolve, reject) => {
//     let link = 'http://192.168.25.167:8089/api'; //Local TiFire
//     // let link = 'https://goldchaves-api.herokuapp.com/api';  //Produção Heroku
//     //let link = 'http://tifire.sytes.net:8089/api';  //Produção Servidor TiFire
//         if (link !== null) {
//             let url = link;
//             if (url === 'http://192.168.25.167:8089/api') {
//                 link = url + '/pedidos/salvarPed';
//                 console.log(dadosPedido);
//                 return axios.post(link, dadosPedido, {
//                     headers: {
//                         'Content-Type': 'application/json; charset=UTF-8'
//                     }
//                 }).then(resp => {
//                     if (resp.data) {
//                         resolve(resp.data)
//                     } else {
//                         reject("erro ao salvar pedido")
//                     }
//                 }).catch(error => { reject(error); console.log(error.message); Alert.alert("Erro ao salvar pedido", error.message) });
//             }
//         } else {
//             reject("erro ao salvar pedido");
//         }
// });

/*export const getPedido = () => new Promise((resolve, reject) =>{
    return axios.get(url+'/pedidos/listarNaoImportadosDetalhado')
         .then(resp =>{
             if(resp.data){
                 resolve(resp.data)
             }else{
                 reject("secao não encontrado")
             }
         }).catch(error => reject(error));
 });
*/