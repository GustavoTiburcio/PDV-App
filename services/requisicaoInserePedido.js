/* eslint-disable prettier/prettier */
import axios from 'axios';
import api from '../api';
import { Alert } from 'react-native';


export const postPedido = (dadosPedido) => new Promise((resolve, reject) => {
    return api.post('/pedidos/salvarPed', dadosPedido, {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    }).then(response => {
        if (response.data) {
            resolve(response.data);
        } else {
            reject("erro ao salvar pedido")
        }
    }).catch(error => { reject(error); console.log(error.message); Alert.alert("Erro ao salvar pedido", error.message) });
});