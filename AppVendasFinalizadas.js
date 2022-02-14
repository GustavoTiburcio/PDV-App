import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, TouchableOpacity, LogBox } from 'react-native';
import api from './api';
import { StatusBar } from 'expo-status-bar';
import SearchBar from "react-native-dynamic-search-bar";
import { useNavigation } from '@react-navigation/native';
import BotaoVermelho from './components/BotaoVermelho';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as Print from 'expo-print';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { gravarItensCarrinhoParaEditar } from './controle/CarrinhoStorage';;

export default function AppVendasFinalizadas({ route, navigation }) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState('Gold');
  const [itensPedidos, setItensPedidos] = useState([]);
  const [dadosPedido, setDadosPedido] = useState();
  const [refresh, setRefresh] = useState(false);
  const [visualizar, setVisualizar] = useState(false);
  const [nomrep, setNomRep] = useState('');


  useEffect(() => {
    loadApi();
    console.log('1')
  }, [data])

  useEffect(() => {
    navigation.addListener('tabPress', () => {
      loadApi();
      console.log('2')
    });
  }, [navigation]);

  useEffect(() => {
    console.log('3')
  }, [dadosPedido])

  useEffect(() => {
    console.log('4')
    setRefresh(false)
  }, [refresh])

  async function loadApi() {

    if (loading) return;

    setLoading(true)

    const jsonValue = await AsyncStorage.getItem('@login_data')
    const login = JSON.parse(jsonValue)
    setNomRep(login.username);

    const response = await api.get(`/pedidos/listarPedidoPorCliente?page=${page}&nome=${login.username}`)

    const cabPedAux = response.data.map((ped) => {
      return { cod: ped.cod, dat: ped.dat, forPag: ped.forPag, nomrep: ped.nomrep, status: ped.status, valPro: ped.valPro, valDes: ped.valDes, obs: ped.obs, visualizarItens: false, cliente: ped.cliente, itensPedido: ped.itensPedido }
    });

    const cabPed = cabPedAux
      .map(e => JSON.stringify(e))
      .reduce((acc, cur) => (acc.includes(cur) || acc.push(cur), acc), [])
      .map(e => JSON.parse(e));

    //console.log(cabPed)

    setData([...data, ...cabPed]);

    setPage(page + 1);
    setLoading(false);
  }

  function novaPesquisa() {
    setPage(0);
    setData([]);
  }

  function FooterList(Load) {
    if (!Load) return null;
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='large' color="#121212" />
      </View>
    )
  }

  async function deletarPed(codped) {
    try {
      const response = await api.delete(`http://192.168.25.167:8089/api/pedidos/deletarPedido?cod=${codped}`)
      Alert.alert('Excluir Venda', `${response.data}`)
    } catch (error) {
      Alert.alert('Erro ao apagar venda', 'Não pode alterar. Pedido já está concluido')
    }
  }

  function filtrarItePed(codped) {
    const pedidofiltrado = data.filter(function (items) {
      return items.cod == codped;
    });
    //console.log('teste itens filtrados');
    //console.log(pedidofiltrado[0].itensPedido);

    const itens = pedidofiltrado[0].itensPedido.map(item => {
      return (
        <View key={item.mer}>
          <Grid>
            <Col size={15}>
              <Row style={styles.cell}>
                <Text>{item.qua}x</Text>
              </Row>
            </Col>
            <Col size={50}>
              <Row style={styles.cell}>
                <Text>{item.mer}</Text>
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

  function preparaItensCarrinho(codped) {
    const pedidofiltrado = data.filter(function (items) {
      return items.cod == codped;
    });
    const itens = pedidofiltrado[0].itensPedido.map(item => {
      return { codmer: item.codmer, quantidade: item.qua, item: item.mer, valor: item.valUni }
    });
    gravarItensCarrinhoParaEditar(itens);
  }

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);


  function ListItem({ data }) {

    const navigation = useNavigation();
    let datVen = data.dat;

    return (
      <View style={styles.listItem}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.listText}>Data: {datVen.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</Text>
          <Text style={styles.listText}>Cód: {data.cod}</Text>
        </View>
        <Text style={styles.listText}>Razão social: {data.cliente.raz}</Text>
        <Text style={styles.listText}>Nome fantasia: {data.cliente.fan}</Text>
        {data.visualizarItens ? <Text style={styles.listText}>CPF/CNPJ: {data.cliente.cgc}</Text> : null}
        {data.visualizarItens ? <Text style={styles.listText}>Telefone: {data.cliente.tel}</Text> : null}
        {data.visualizarItens ? <Text style={styles.listText}>Email: {data.cliente.ema}</Text> : null}
        {data.visualizarItens ? <Text style={styles.listText}>Obs: {data.obs}</Text> : null}
        {data.visualizarItens ? <Text style={{ textAlign: 'center', fontSize: 18, color: '#000000', paddingTop: 5, paddingBottom: 10, fontWeight: 'bold' }} >Produtos</Text> : <Text></Text>}
        {data.visualizarItens ? filtrarItePed(data.cod) : null}
        {data.visualizarItens ? <Text style={styles.ValVenText}>Total Bruto: R$ {data.valPro.toFixed(2).replace('.', ',')}</Text> : null}
        {data.visualizarItens ? <Text style={styles.ValVenText}>Total Desconto: R$ {data.valDes.toFixed(2).replace('.', ',')}</Text> : null}
        <Text style={styles.ValVenText}>Total: R$ {(data.valPro - data.valDes).toFixed(2).replace('.', ',')}</Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.Icons}
            activeOpacity={0.5}
            onPress={() => { ImprimePDF(data.cod) }}>
            <Ionicons
              name={Platform.OS === 'android' ? 'md-print' : 'print'}
              size={22}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Icons}
            activeOpacity={0.5}
            onPress={() => { SharePDF(data.cod) }}>
            <Ionicons
              name={Platform.OS === 'android' ? 'md-share-social-sharp' : 'ios-share'}
              size={22}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Icons}
            activeOpacity={0.5}
            onPress={() => {
              preparaItensCarrinho(data.cod)
              Alert.alert(
                `Editando Venda ${data.cod}`,
                "",
                [
                  {
                    text: "Ok",
                    onPress: () => {
                      navigation.navigate('Carrinho', { codven: data.cod, valdesc: data.valDes, raz: data.cliente.raz, dadosPed: { obs: data.obs, valdes: data.valDes } })
                    },
                  },
                ]
              );
            }}>
            <Ionicons
              name={Platform.OS === 'android' ? 'pencil' : 'pencil'}
              size={22}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.TrashIcon}
            activeOpacity={0.5}
            onPress={() => {
              Alert.alert(
                "Excluir venda",
                "Confirmar exclusão?",
                [
                  {
                    text: "Sim",
                    onPress: () => {
                      deletarPed(data.cod)
                    },
                  },
                  {
                    text: "Não",
                  },
                ]
              );
            }}>
            <Ionicons
              name={Platform.OS === 'android' ? 'trash' : 'trash'}
              size={22}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", alignContent: 'center', justifyContent: 'center' }}>
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
        </View>
      </View>
    )
  }

  async function ImprimePDF(codped) {
    const response = await api.get(`pedidos/listarParaImprimir?cod=${codped}`)
    setDadosPedido(response.data)

    //console.log('Dados pedido')
    //console.log(response.data.Pedidos[0]);

    async function createAndPrintPDF() {
      var PrintItems = response.data.Pedidos[0].itensPedido.map(function (item) {
        return `<tr>
          <td style={{ fontSize: "44px" , maxWidth:"145px"}}>
              <b>${item.mer}</b>
          </td>
          <td style={{ fontSize: "44px" , maxWidth:"20px"}} >
              <b>${item.qua}</b>
          </td>
          <td style={{ fontSize: "44px" , maxWidth:"60px" }}>
              <b>${item.valUni.toFixed(2).replace('.', ',')}</b>
          </td>
          <td style={{ fontSize: "44px" , maxWidth:"80px" }}>
              <b>${(item.qua * item.valUni).toFixed(2).replace('.', ',')}</b>
          </td>
          </tr>`;
      });

      function quantidadeTotal() {
        var soma = 0;
        for (let i = 0; i < response.data.Pedidos[0].itensPedido.length; i++) {
          soma += response.data.Pedidos[0].itensPedido[i].qua;
        }
        return soma.toFixed(2).replace('.', ',');
      }

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
                    font-size: 44px;
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
                    font-size: 44px;
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
              <p align="center"><b>GOLD CHAVES ACESSORIOS LTDA</b></p>
              </br>
              <p align="center"><b>Av. Brasil, 2796 - LOJA 03 - CENTRO, Maringá - PR, 87013-000</b></p>
              <p align="center"><b>(44) 3227-5493</b></p>
              </br>
              </br>
              <div>
                <p><b>Data: ${response.data.Pedidos[0].dat.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</b></p>
                <p><b>Vendedor: ${nomrep}</b></p>
                <p><b>Razão Social:</b><b> ${response.data.Pedidos[0].cliente.raz}</b></p>
                <p><b>CPF/CNPJ: ${response.data.Pedidos[0].cliente.cgc}</b><b> Telefone: ${response.data.Pedidos[0].cliente.tel}</b></p>
                <p><b>Email: ${response.data.Pedidos[0].cliente.ema}</b></p>
                <p><b> Endereço: ${response.data.Pedidos[0].cliente.endereco[0].log + ', ' + response.data.Pedidos[0].cliente.endereco[0].num}</b></p>
                <p><b>Bairro: ${response.data.Pedidos[0].cliente.endereco[0].bai}</b><b> Cidade: ${response.data.Pedidos[0].cliente.endereco[0].cid + ' - ' + response.data.Pedidos[0].cliente.endereco[0].uf}</b></p>
                <p><b>Obs: ${response.data.Pedidos[0].obs}</b></p>
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
              <p style="text-align:right"><b>Qtd Total: ${quantidadeTotal()} Uni</b></p>
              <p style="text-align:right"><b>Total Bruto: R$ ${response.data.Pedidos[0].valPro.toFixed(2).replace('.', ',')}</b></p>
              <p style="text-align:right"><b>Total Desconto: R$ ${response.data.Pedidos[0].valDes.toFixed(2).replace('.', ',')}</b></p>
              <p style="text-align:right"><b>Total Líquido: R$ ${(response.data.Pedidos[0].valPro - response.data.Pedidos[0].valDes).toFixed(2).replace('.', ',')}</b></p>
              </br>
              </br>
              </br>
              </br>
              </br>
              </br>
              <p style="text-align:center"><b>_______________________________________________</b></p>
              <p style="text-align:center"><b>${response.data.Pedidos[0].cliente.raz}</b></p>
          </body>
          </html>
        `;

      try {
        const { uri } = await Print.printToFileAsync({
          html: htmlContent,
          width: 1000, height: 1500
        });
        //console.log(uri)
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
          <td style={{ fontSize: "44px" , maxWidth:"145px"}}>
              <b>${item.mer}</b>
          </td>
          <td style={{ fontSize: "44px" , maxWidth:"20px"}} >
              <b>${item.qua}</b>
          </td>
          <td style={{ fontSize: "44px" , maxWidth:"60px" }}>
              <b>${item.valUni.toFixed(2).replace('.', ',')}</b>
          </td>
          <td style={{ fontSize: "44px" , maxWidth:"80px" }}>
              <b>${(item.qua * item.valUni).toFixed(2).replace('.', ',')}</b>
          </td>
          </tr>`;
      });

      function quantidadeTotal() {
        var soma = 0;
        for (let i = 0; i < response.data.Pedidos[0].itensPedido.length; i++) {
          soma += response.data.Pedidos[0].itensPedido[i].qua;
        }
        return soma.toFixed(2).replace('.', ',');
      }

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
                    font-size: 44px;
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
                    font-size: 44px;
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
              <p align="center"><b>GOLD CHAVES ACESSORIOS LTDA</b></p>
              </br>
              <p align="center"><b>Av. Brasil, 2796 - LOJA 03 - CENTRO, Maringá - PR, 87013-000</b></p>
              <p align="center"><b>(44) 3227-5493</b></p>
              </br>
              </br>
              <div>
                <p><b>Data: ${response.data.Pedidos[0].dat.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</b></p>
                <p><b>Vendedor: ${nomrep}</b></p>
                <p><b>Razão Social:</b><b> ${response.data.Pedidos[0].cliente.raz}</b></p>
                <p><b>CPF/CNPJ: ${response.data.Pedidos[0].cliente.cgc}</b><b> Telefone: ${response.data.Pedidos[0].cliente.tel}</b></p>
                <p><b>Email: ${response.data.Pedidos[0].cliente.ema}</b></p>
                <p><b> Endereço: ${response.data.Pedidos[0].cliente.endereco[0].log + ', ' + response.data.Pedidos[0].cliente.endereco[0].num}</b></p>
                <p><b>Bairro: ${response.data.Pedidos[0].cliente.endereco[0].bai}</b><b> Cidade: ${response.data.Pedidos[0].cliente.endereco[0].cid + ' - ' + response.data.Pedidos[0].cliente.endereco[0].uf}</b></p>
                <p><b>Obs: ${response.data.Pedidos[0].obs}</b></p>
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
              <p style="text-align:right"><b>Qtd Total: ${quantidadeTotal()} Uni</b></p>
              <p style="text-align:right"><b>Total Bruto: R$ ${response.data.Pedidos[0].valPro.toFixed(2).replace('.', ',')}</b></p>
              <p style="text-align:right"><b>Total Desconto: R$ ${response.data.Pedidos[0].valDes.toFixed(2).replace('.', ',')}</b></p>
              <p style="text-align:right"><b>Total Líquido: R$ ${(response.data.Pedidos[0].valPro - response.data.Pedidos[0].valDes).toFixed(2).replace('.', ',')}</b></p>
              </br>
              </br>
              </br>
              </br>
              </br>
              </br>
              <p style="text-align:center"><b>_______________________________________________</b></p>
              <p style="text-align:center"><b>${response.data.Pedidos[0].cliente.raz}</b></p>
          </body>
          </html>
        `;

      try {
        const { uri } = await Print.printToFileAsync({
          html: htmlContent,
          width: 1000, height: 1500
        });
        //console.log(uri);
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
        onEndReached={loadApi}
        onEndReachedThreshold={0.1}
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
    marginHorizontal: 0,
    backgroundColor: '#000',
  },
  Icons: {
    marginTop: 15,
    height: 50,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 10,
    backgroundColor: '#36c75c',
    borderRadius: 25,
    borderWidth: 0,
  },
  TrashIcon: {
    marginTop: 15,
    height: 50,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 10,
    backgroundColor: '#d11b49',
    borderRadius: 25,
    borderWidth: 0,
  },
  SearchBar: {
    backgroundColor: '#F3F3F3',
    marginTop: 20,
  },
  cell: {
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  loading: {
    padding: 10
  }
});