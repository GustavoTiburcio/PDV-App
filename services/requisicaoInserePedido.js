/* eslint-disable prettier/prettier */
import axios from 'axios';

export const postPedido = (dadosPedido) => new Promise((resolve, reject) => {
    let link = 'https://goldchaves-api.herokuapp.com/api';
    if (link !== null) {
        let url = link;
        if (url === 'https://goldchaves-api.herokuapp.com/api') {
            link = url + '/pedidos/salvarPed';
            return axios.post(link, {
                headers: {
                    'Content-Type': 'application/json',
                }, data: dadosPedido
            }).then(resp => {
                if (resp.data) {
                    resolve(resp.data)
                } else {
                    reject("erro ao salvar pedido")
                }
            }).catch(error => reject(error));
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