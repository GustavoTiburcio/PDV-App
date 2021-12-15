/* eslint-disable prettier/prettier */
import axios from 'axios';
import { Alert } from 'react-native';

export const postPedido = (dadosPedido) => new Promise((resolve, reject) => {
    let link = 'http://192.168.25.167:8089/api'; //Local TiFire
    // let link = 'https://goldchaves-api.herokuapp.com/api';  //Produção Heroku
    // let link = 'http://tifire.sytes.net:8089/api';  //Produção Servidor TiFire
    if (link !== null) {
        let url = link;
        if (url === 'http://192.168.25.167:8089/api') {
            link = url + '/pedidos/salvarPed';
            console.log(dadosPedido);
            return axios.post(link, dadosPedido, {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            }).then(resp => {
                if (resp.data) {
                    resolve(resp.data)
                } else {
                    reject("erro ao salvar pedido")
                }
            }).catch(error => {reject(error);console.log(error.message); Alert.alert("Erro ao salvar pedido", error.message)});
        }
    } else {
        reject("erro ao salvar pedido");
    }
});

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