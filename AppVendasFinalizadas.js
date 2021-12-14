import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import api from './api';
import {StatusBar} from 'expo-status-bar';
import SearchBar from "react-native-dynamic-search-bar";
import {useNavigation} from '@react-navigation/native';
import BotaoVermelho from './components/BotaoVermelho';
import { Col, Row, Grid } from 'react-native-easy-grid';
 
export default function AppVendasFinalizadas({ route, navigation }) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState('Gold');
  const [itensPedidos, setItensPedidos]= useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(()=>{
    loadApi();
    Alert.alert('Atenção', 'Tela em construção!!');
  },[])

  useEffect(()=>{
    setRefresh(false)
  },[refresh])

  async function loadApi(){
    if(loading) return;

    setLoading(true)

    const response = await api.get(`/pedidos/listarPorCliente?page=${page}&nome=${pesquisa}`)

    const resp = response.data.content;

    const itePed = resp.map((ped) => {
      return { codped: ped.cod, mer: ped.mer, qua: ped.qua, valUni: ped.valUni }
    });
    setItensPedidos([...itensPedidos, ...itePed]);
    const cabPedAux = resp.map((ped) => {
        return { cod: ped.cod, datHor: ped.datHor, raz: ped.raz, valTot: ped.valTot, valFre: ped.valFre, exp: ped.exp, visualizarItens: false }
    });

    const cabPed = cabPedAux
        .map(e => JSON.stringify(e))
        .reduce((acc, cur) => (acc.includes(cur) || acc.push(cur), acc), [])
        .map(e => JSON.parse(e));

    setData([...data, ...cabPed])
    console.log(data);
    console.log('itens');
    console.log(itePed);
    setPage(page + 1);
    setLoading(false);
  }

  function novaPesquisa(){
    setPage(0);
    setData([]);
  }

  function FooterList( Load ){
    if(!Load) return null;
    return(
      <View style={styles.loading}>
      <ActivityIndicator size={25} color="#121212" />
      </View>
    )
  }

  function filtrarItePed(codped){
    const itensfiltrados = itensPedidos.filter(function(items){
      return items.codped == codped;
    });
    console.log('teste itens filtrados');
    console.log(itensfiltrados);
    const itens = itensfiltrados.map(item => {
      return ( <View key={item.mer}>
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
              <Text>R$ {item.valUni.toFixed(2).replace('.',',')}</Text>
            </Row>
          </Col>
        </Grid>
        </View> )
    })
    return itens;
  }
  
  function ListItem( {data} ){  
  
    const navigation = useNavigation();
    let datVen = data.datHor;
    return(
      <View style={styles.listItem}>
        {/* <Text style={styles.listText}>código: {data.cod}</Text> */}
        <Text style={styles.listText}>Data: {datVen.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</Text>
        <Text style={styles.listText}>Razão social: {data.raz}</Text>
        {data.visualizarItens ? filtrarItePed(data.cod) : null}
        <Text style={styles.ValVenText}>Total: R$ {data.valTot.toFixed(2).replace('.',',')}</Text>
        <View>
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
                <Text style={styles.TextButton}> {data.visualizarItens ? '    Fechar' : 'Detalhes(+)'} </Text>
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
        onSearchPress={() => {}}
        returnKeyType="go"
        onSubmitEditing={() => {}}
      />
      <Text style={{textAlign: 'center', fontSize: 24, color:'#000000', paddingTop: 10}}>Histórico de vendas</Text>
       <FlatList 
        contentContainerStyle={{marginHorizontal: 20}}
        data={data}
        keyExtractor={item => String(item.cod)}
        renderItem={({ item }) => <ListItem data={item}/>}
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
  listText:{
    fontSize: 16,
    color:'#000000'
  },
  ValVenText:{
    fontSize: 16,
    color:'#000000',
    marginLeft: 180,
    fontWeight: 'bold'
  },
  TextButton: {
    fontSize: 14,
    color:'#FFF',
  },
  DetalhesButton: {
    marginTop: 15,
    height:50,
    padding: 15,
    borderRadius: 25,
    borderWidth: 0,
    marginBottom: 15,
    marginHorizontal: 100,
    backgroundColor: '#121212',
  },
  SearchBar: {
    backgroundColor: '#F3F3F3',
    marginTop: 20,
  },
  cell: {
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    padding: 10
  }
});