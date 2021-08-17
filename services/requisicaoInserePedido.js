/* eslint-disable prettier/prettier */
import axios from 'axios';
import { buscarLinkBanco } from '../controle/CarrinhoStorage';

const urlbruta = buscarLinkBanco();

export const postPedido = (dadosPedido) => new Promise((resolve, reject) => {
    let link = urlbruta._W;
    if (link !== null) {
        let url = link;
        if (url === 'http://45.170.26.9:8085/api') {
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
        } else {
            link = url + '/InserePedido' + dadosPedido;
            return axios.put(link).then(resp => {
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