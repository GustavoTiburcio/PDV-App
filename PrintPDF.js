import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Print from 'expo-print';
import api from './api';
import {useNavigation} from '@react-navigation/native';

export default function PrintPDF(props) {

  async function getDadosPedido(){
    const response = await api.get(`/pedidos/listarParaImprimir?cod=${props.codped}`)
    console.log(response.data)
  }
  useEffect(() => {
    getDadosPedido();  
},[])
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pdf Content</title>
        <style>
            body {
                color: #000000;
            }
            p {
              font-family: "Didot", "Times New Roman";
              font-size: 38px;
              margin: 0;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              text-align: left;
              padding: 8px;
              font-family: "Didot", "Times New Roman";
              font-size: 28px;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
              margin-bottom:0px
            }
            div.small{
              
            }
        </style>
    </head>
    <body>
      <div class="small">
      </br>
      </br>
        <p></p>
        <p align="center"><b>GOLD CHAVES</b></p>
        <p align="center"><b>Av. Brasil, 2796 - Zona 03, Maringá - PR, 87050-000</b></p>
        </br>
        </br>
        <div>
        <p><b>Vendedor: Gold</b></p>
        <p><b>Data da Venda: 27/08/2021</b></p>
        <p><b>Razão Social</b></p>
        <p><b>ROGERIO APARECIDO PEREIRA DE JESUS 00501171908</b></p>
        <p><b>CPF/CNPJ: 16.875.774/0001-04</b><b> Telefone: (44)3274-3674</b></p>
        <p><b>Email: lu_e_roger@hotmail.com</b></p>
        <p><b> Endereço: Avenida Tamandaré, 79</b></p>
        <p><b>Bairro: Vila Planalto</b><b> Cidade: Campo Grande - MS</b></p>
        </div>
        <table>
                                <thead>
                                    <tr>
                                        <th>Descricao</th>
                                        <th>Qtd</th>
                                        <th>Valor </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        <tr>
                                            <td>
                                                teste
                                            </td>
                                            <td>
                                                3
                                            </td>
                                            <td>
                                                12
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                teste2
                                            </td>
                                            <td>
                                                3
                                            </td>
                                            <td>
                                                12
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                teste3
                                            </td>
                                            <td>
                                                3
                                            </td>
                                            <td>
                                                12
                                            </td>
                                        </tr>
                                </tbody>
                            </table>
          </div>
        <p><b>Total geral:</b></p>
    </body>
    </html>
`;
// const createAndPrintPDF = async (html) => {
//   try {
//     const { uri } = await Print.printToFileAsync({ 
//       html: html,
//       width: 1000, height: 1500 });
//     console.log(uri)
//     await Print.printAsync(
//         {uri:uri,
//         width: 595, height: 1500 })
//   } catch (error) {
//     console.error(error);
//   }
// };
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });