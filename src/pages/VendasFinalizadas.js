import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { StatusBar } from 'expo-status-bar';
import SearchBar from "react-native-dynamic-search-bar";
import { Col, Row, Grid } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { reqPrintPDF, reqSharePDF } from '../../components/printPDF';

export default function VendasFinalizadas() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState('');
  const [dadosPedido, setDadosPedido] = useState();
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    loadApi();
  }, [data])

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
      return {
        cod: ped.cod, dat: ped.dat, forPag: ped.forPag, nomrep: ped.nomrep,
        status: ped.status, valPro: ped.valPro, visualizarItens: false,
        cliente: ped.cliente, itensPedido: ped.itensPedido
      }
    });

    const cabPed = cabPedAux
      .map(e => JSON.stringify(e))
      .reduce((acc, cur) => (acc.includes(cur) || acc.push(cur), acc), [])
      .map(e => JSON.parse(e));

    setData([...data, ...cabPed]);

    setPage(page + 1);
    setLoading(false);
  }

  // function novaPesquisa() {
  //   setPage(0);
  //   setData([]);
  // }

  function FooterList(Load) {
    if (!Load.load) return null;
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='large' color="#38A69D" />
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
            <Col size={15} style={{}}>
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
        {data.visualizarItens ? <Text style={styles.tableTitle} >Produtos</Text> : <Text></Text>}
        {data.visualizarItens ? filtrarItePed(data.cod) : null}
        <Text style={styles.ValVenText}>Total: R$ {data.valPro.toFixed(2).replace('.', ',')}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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
            onPress={() => { reqPrintPDF(data.cod) }}>
            <Ionicons
              name={Platform.OS === 'android' ? 'md-print' : 'print'}
              size={23}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Icon}
            activeOpacity={0.5}
            onPress={() => { reqSharePDF(data.cod) }}>
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
      <Text style={styles.title}>Histórico de vendas</Text>
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
  title: {
    textAlign: 'center',
    fontSize: 24,
    color: '#000000',
    paddingTop: 10
  },
  tableTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#000000',
    paddingTop: 5,
    paddingBottom: 10,
    fontWeight: 'bold'
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
    height: 55,
    padding: 15,
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#38A69D',
  },
  Icon: {
    marginTop: 15,
    height: 55,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 20,
    backgroundColor: '#36c75c',
    borderRadius: 25,
  },
  SearchBar: {
    backgroundColor: '#F3F3F3',
    marginTop: 20,
  },
  cell: {
    borderWidth: 1,
    borderColor: '#000',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loading: {
    padding: 10
  }
});