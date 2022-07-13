import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { StatusBar } from 'expo-status-bar';
import SearchBar from "react-native-dynamic-search-bar";
import { useNavigation } from '@react-navigation/native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as Print from 'expo-print';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function VendasFinalizadas({ route, navigation }) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState('');
  const [itensPedidos, setItensPedidos] = useState([]);
  const [dadosPedido, setDadosPedido] = useState();
  const [refresh, setRefresh] = useState(false);
  const [visualizar, setVisualizar] = useState(false);


  useEffect(() => {
    loadApi();
  }, [data])

  //   useEffect(() => {
  //     navigation.addListener('focus', () => {
  //       loadApi();
  //     });
  // }, [navigation]);

  useEffect(() => {

  }, [dadosPedido])

  useEffect(() => {
    setRefresh(false)
  }, [refresh])

  async function loadApi() {

    if (loading) return;

    setLoading(true)

    const jsonValue = await AsyncStorage.getItem('@login_data')
    const login = JSON.parse(jsonValue)

    const response = await api.get(`/pedidos/listarPedidoPorCliente?page=${page}&nome=${login.username}`)

    const cabPedAux = response.data.map((ped) => {
      return { cod: ped.cod, dat: ped.dat, forPag: ped.forPag, nomrep: ped.nomrep, status: ped.status, valPro: ped.valPro, visualizarItens: false, cliente: ped.cliente, itensPedido: ped.itensPedido }
    });

    const cabPed = cabPedAux
      .map(e => JSON.stringify(e))
      .reduce((acc, cur) => (acc.includes(cur) || acc.push(cur), acc), [])
      .map(e => JSON.parse(e));

    setData([...data, ...cabPed]);

    setPage(page + 1);
    setLoading(false);
  }

  function novaPesquisa() {
    setPage(0);
    setData([]);
  }

  function FooterList(Load) {
    if(!Load.load) return null;
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='large' color="#121212" />
      </View>
    )
  }

  function filtrarItePed(codped) {
    const pedidofiltrado = data.filter(function (items) {
      return items.cod == codped;
    });

    const itens = pedidofiltrado[0].itensPedido.map(item => {
      return (
        <View key={item.codmer}>
          <Grid>
            <Col size={15}>
              <Row style={styles.cell}>
                <Text>{item.qua}x</Text>
              </Row>
            </Col>
            <Col size={50}>
              <Row style={styles.cell}>
                <Text>{item.mer} {item.pad} {item.codtam}</Text>
              </Row>
            </Col>
            <Col size={25}>
              <Row style={styles.cell}>
                <Text>R$ {item.valUni.toFixed(2).replace('.', ',')}</Text>
              </Row>
            </Col>
          </Grid>
        </View>
      )
    });
    return itens;
  }

  function ListItem({ data }) {

    const navigation = useNavigation();

    return (
      <View style={styles.listItem}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.listText}>Data: {data.dat.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</Text>
          <Text style={styles.listText}>Cód: {data.cod}</Text>
        </View>
        <Text style={styles.listText}>Razão social: {data.cliente.raz}</Text>
        <Text style={styles.listText}>Nome fantasia: {data.cliente.fan}</Text>
        {data.visualizarItens ? <Text style={styles.listText}>CPF/CNPJ: {data.cliente.cgc}</Text> : null}
        {data.visualizarItens ? <Text style={styles.listText}>Telefone: {data.cliente.tel}</Text> : null}
        {data.visualizarItens ? <Text style={styles.listText}>Email: {data.cliente.ema}</Text> : null}
        {data.visualizarItens ? <Text style={{ textAlign: 'center', fontSize: 18, color: '#000000', paddingTop: 5, paddingBottom: 10, fontWeight: 'bold' }} >Produtos</Text> : <Text></Text>}
        {data.visualizarItens ? filtrarItePed(data.cod) : null}
        <Text style={styles.ValVenText}>Total: R$ {data.valPro.toFixed(2).replace('.', ',')}</Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.DetalhesButton}
            activeOpacity={0.5}
            onPress={() => {
              if (data.visualizarItens == false) {
                data.visualizarItens = true;
                setRefresh(true);
              } else {
                data.visualizarItens = false;
                setRefresh(true);
              }
            }}>
            <Text style={styles.TextButton}> {data.visualizarItens ? 'Fechar' : 'Detalhes(+)'} </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Icon}
            activeOpacity={0.5}
            onPress={() => { ImprimePDF(data.cod) }}>
            <Ionicons
              name={Platform.OS === 'android' ? 'md-print' : 'print'}
              size={23}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Icon}
            activeOpacity={0.5}
            onPress={() => { SharePDF(data.cod) }}>
            <Ionicons
              name={Platform.OS === 'android' ? 'md-share-social-sharp' : 'ios-share'}
              size={23}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  async function ImprimePDF(codped) {
    const response = await api.get(`pedidos/listarParaImprimir?cod=${codped}`)
    setDadosPedido(response.data)

    async function createAndPrintPDF() {
      var PrintItems = response.data.Pedidos[0].itensPedido.map(function (item) {
        return `<tr>
          <td style={{ fontSize: "36px" , maxWidth:"180px"}}>
              <b>${item.mer}  ${item.pad} ${item.codtam}</b>
          </td>
          <td style={{ fontSize: "36px" , maxWidth:"20px"}} >
              <b>${item.qua}</b>
          </td>
          <td style={{ fontSize: "36px" , maxWidth:"60px" }}>
              <b>${item.valUni.toFixed(2).replace('.', ',')}</b>
          </td>
          <td style={{ fontSize: "36px" , maxWidth:"80px" }}>
              <b>${(item.qua * item.valUni).toFixed(2).replace('.', ',')}</b>
          </td>
          </tr>`;
      });

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
                    font-size: 36px;
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
                    font-size: 36px;
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
              <p align="right"><b>Venda ${codped}</b></p>
              </br>
              <p align="center"><b>OPERA Z</b></p>
              </br>
              <p align="center"><b></b></p>
              </br>
              </br>
              <div>
                <p><b>Data: ${response.data.Pedidos[0].dat.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</b></p>
                <p><b>Vendedor: </b></p>
                <p><b>Razão Social:</b><b> ${response.data.Pedidos[0].cliente.raz}</b></p>
                <p><b>CPF/CNPJ: ${response.data.Pedidos[0].cliente.cgc}</b><b> Telefone: ${response.data.Pedidos[0].cliente.tel}</b></p>
                <p><b>Email: ${response.data.Pedidos[0].cliente.ema}</b></p>
                <p><b> Endereço: ${response.data.Pedidos[0].cliente.endereco[0].log + ', ' + response.data.Pedidos[0].cliente.endereco[0].num}</b></p>
                <p><b>Bairro: ${response.data.Pedidos[0].cliente.endereco[0].bai}</b><b> Cidade: ${response.data.Pedidos[0].cliente.endereco[0].cid + ' - ' + response.data.Pedidos[0].cliente.endereco[0].uf}</b></p>
              </div>
              <table>
                                      <thead>
                                          <tr>
                                              <th>Descricao</th>
                                              <th>Qtd</th>
                                              <th>Vlr</th>
                                              <th>Total</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                      ${PrintItems}
                                      </tbody>
              </table>
              </div>
              </br>
              <p style="text-align:right"><b>Total geral: R$ ${response.data.Pedidos[0].valPro.toFixed(2).replace('.', ',')}</b></p>
          </body>
          </html>
        `;

      try {
        const { uri } = await Print.printToFileAsync({
          html: htmlContent,
          width: 1000, height: 1500
        });
        await Print.printAsync({
          uri: uri
        })
      } catch (error) {
        console.error(error);
      }
    };

    createAndPrintPDF()
  };

  async function SharePDF(codped) {
    const response = await api.get(`pedidos/listarParaImprimir?cod=${codped}`)
    async function createPDF() {
      var PrintItems = response.data.Pedidos[0].itensPedido.map(function (item) {
        return `<tr>
          <td style={{ fontSize: "36px" , maxWidth:"180px"}}>
              <b>${item.mer} ${item.pad} ${item.codtam}</b>
          </td>
          <td style={{ fontSize: "36px" , maxWidth:"20px"}} >
              <b>${item.qua}</b>
          </td>
          <td style={{ fontSize: "36px" , maxWidth:"60px" }}>
              <b>${item.valUni.toFixed(2).replace('.', ',')}</b>
          </td>
          <td style={{ fontSize: "36px" , maxWidth:"80px" }}>
              <b>${(item.qua * item.valUni).toFixed(2).replace('.', ',')}</b>
          </td>
          </tr>`;
      });

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
                    font-size: 36px;
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
                    font-size: 36px;
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
              <p align="right"><b>Venda ${codped}</b></p>
              </br>
              <p align="center"><b>OPERA Z</b></p>
              </br>
              <p align="center"><b></b></p>
              </br>
              </br>
              <div>
                <p><b>Data: ${response.data.Pedidos[0].dat.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</b></p>
                <p><b>Vendedor: </b></p>
                <p><b>Razão Social:</b><b> ${response.data.Pedidos[0].cliente.raz}</b></p>
                <p><b>CPF/CNPJ: ${response.data.Pedidos[0].cliente.cgc}</b><b> Telefone: ${response.data.Pedidos[0].cliente.tel}</b></p>
                <p><b>Email: ${response.data.Pedidos[0].cliente.ema}</b></p>
                <p><b> Endereço: ${response.data.Pedidos[0].cliente.endereco[0].log + ', ' + response.data.Pedidos[0].cliente.endereco[0].num}</b></p>
                <p><b>Bairro: ${response.data.Pedidos[0].cliente.endereco[0].bai}</b><b> Cidade: ${response.data.Pedidos[0].cliente.endereco[0].cid + ' - ' + response.data.Pedidos[0].cliente.endereco[0].uf}</b></p>
              </div>
              <table>
                                      <thead>
                                          <tr>
                                              <th>Descricao</th>
                                              <th>Qtd</th>
                                              <th>Vlr</th>
                                              <th>Total</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                      ${PrintItems}
                                      </tbody>
              </table>
              </div>
              </br>
              <p style="text-align:right"><b>Total geral: R$ ${response.data.Pedidos[0].valPro.toFixed(2).replace('.', ',')}</b></p>
          </body>
          </html>
        `;

      try {
        const { uri } = await Print.printToFileAsync({
          html: htmlContent,
          width: 1000, height: 1500
        });
        Sharing.shareAsync(uri)
      } catch (error) {
        console.error(error);
      }
    };
    createPDF();
  };



  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SearchBar
        style={styles.SearchBar}
        placeholder="Digite o nome do cliente"
        onChangeText={(text) => setPesquisa(text)}
        onSearchPress={() => { }}
        returnKeyType="go"
        onSubmitEditing={() => { }}
      />
      <Text style={{ textAlign: 'center', fontSize: 24, color: '#000000', paddingTop: 10 }}>Histórico de vendas</Text>
      <FlatList
        contentContainerStyle={{ marginHorizontal: 20 }}
        data={data}
        keyExtractor={item => String(item.cod)}
        renderItem={({ item }) => <ListItem data={item} />}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd < 0) return;
          loadApi()
        }}
        onEndReachedThreshold={0.01}
        ListFooterComponent={<FooterList load={loading} />}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    backgroundColor: '#F3F3F3',
    padding: 22,
    marginTop: 15,
    borderRadius: 10,
  },
  listText: {
    fontSize: 15,
    color: '#000000'
  },
  ValVenText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 180,
    fontWeight: 'bold',
  },
  TextButton: {
    fontSize: 14,
    color: '#FFF',
  },
  DetalhesButton: {
    marginTop: 15,
    height: 50,
    padding: 15,
    borderRadius: 25,
    borderWidth: 0,
    marginBottom: 15,
    marginHorizontal: 5,
    backgroundColor: '#000',
  },
  Icon: {
    marginTop: 15,
    height: 55,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 20,
    backgroundColor: '#36c75c',
    borderRadius: 25,
    borderWidth: 0,
  },
  SearchBar: {
    backgroundColor: '#F3F3F3',
    marginTop: 20,
  },
  cell: {
    borderWidth: 2,
    borderColor: '#000',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loading: {
    padding: 10
  }
});