import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Print from 'expo-print';
import * as MediaLibrary from "expo-media-library";

export default function PrintPDF() {
    let assetURI;
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
              h3 {
                font-family: "Didot", "Times New Roman";
                font-size: 28px;
                margin: 0;
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
                text-align: center;
                padding: 8px;
                font-family: "Didot", "Times New Roman";
                font-size: 28px;
              }
              tr:nth-child(even) {
                background-color: #f2f2f2;
              }
              div.small{
                
              }
          </style>
      </head>
      <body>
        <div class="small" align="center" >
          <h3>Usuário Logado</h3>
          <p>Gold</p>
          <h3>Informações da empresa</h3>
          <p>Gold Chaves</p>
          <p>Av. Brasil, 2796 - Zona 03, Maringá - PR, 87050-000</p>
          <h3>Data Pedido</h3>
          <p>27/08/2021</p>
          <h3>Razão Social</h3>
          <p>ROGERIO APARECIDO PEREIRA DE JESUS 00501171908</p>
          <h3>CPF/CNPJ - Telefone</h3>
          <p>16.875.774/0001-04 - (44) 3274-3674</p>
          <h3>Email</h3>
          <p>lu_e_roger@hotmail.com</p>
          <h3>Endereço</h3>
          <p>Avenida Tamandaré, 79</p>
          <h3>Bairro</h3>
          <p>Vila Planalto</p>
          <h3>Cidade - Estado</h3>
          <p>Campo Grande - MS</p>
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
          <h3>Total geral:</h3>
      </body>
      </html>
  `;
  const createAndSavePDF = async (html) => {
    try {
      const { uri } = await Print.printToFileAsync({ 
        html: html,
        width: 1000, height: 1500 });
      console.log(uri)
      if (Platform.OS === "ios") {
        await Sharing.shareAsync(uri);
        console.log('entrou aonde não pode')
      } else {
        const permission = await MediaLibrary.requestPermissionsAsync();
        console.log('entrou 2')
        if (permission.granted) {
          const asset = await MediaLibrary.createAssetAsync(uri);
          console.log('entrou 3')
          console.log(asset.uri)
          await Print.printAsync(
            {uri:asset.uri,
              width: 1000, height: 1500 })
        }
      }
  
    } catch (error) {
      console.error(error);
    }
  };
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Button
          onPress={() => {
            createAndSavePDF(htmlContent)
     
          }}
          title="Imprimir PDF"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });