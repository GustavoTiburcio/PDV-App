import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import api from './api';
import {StatusBar} from 'expo-status-bar';
import SearchBar from "react-native-dynamic-search-bar";
import {useNavigation} from '@react-navigation/native';
 
export default function AppVendasFinalizadas({ route, navigation }) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState('Gold');
  const [itensPedidos, setItensPedidos]= useState();

  useEffect(()=>{
    loadApi();
    Alert.alert('Atenção', 'Tela em construção!!');
  },[data, navigation])

  async function loadApi(){
    if(loading) return;

    setLoading(true)

    const response = await api.get(`/pedidos/listarPorCliente?page=${page}&nome=${pesquisa}`)

    const resp = response.data.content;

    const itePed = resp.map((ped) => {
      return { codped: ped.cod, mer: ped.mer, qua: ped.qua, valUni: ped.valUni }
    });
    setItensPedidos(itePed);
    const cabPedAux = resp.map((ped) => {
        return { cod: ped.cod, datHor: ped.datHor, raz: ped.raz, valTot: ped.valTot, valFre: ped.valFre, exp: ped.exp, visualizarItens: false }
    });

    const cabPed = cabPedAux
        .map(e => JSON.stringify(e))
        .reduce((acc, cur) => (acc.includes(cur) || acc.push(cur), acc), [])
        .map(e => JSON.parse(e));

    setData([...data, ...cabPed])
    console.log(data);
    //  var teste = itensPedidos.filter(teste => teste.codped == "d7667915-cffd-4493-8961-c1dbb499b496");
     
    //  teste.forEach(teste => {
    //    console.log(teste);
    //  })
    
    setPage(page + 1);
    setLoading(false);
  }

  function novaPesquisa(){
    setPage(0);
    setData([]);
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

function FooterList( Load ){
  if(!Load) return null;
  return(
    <View style={styles.loading}>
    <ActivityIndicator size={25} color="#121212" />
    </View>
  )
}

function ListItem( {data} ){  

  const navigation = useNavigation();
  let datVen = data.datHor;
  return(
    <View style={styles.listItem}>
      {/* <Text style={styles.listText}>código: {data.cod}</Text> */}
      <Text style={styles.listText}>Data: {datVen.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</Text>
      <Text style={styles.listText}>Razão social: {data.raz}</Text>
      <Text style={styles.listText}>Total: R${data.valTot.toFixed(2).replace('.',',')}</Text>
    </View>
  )
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
  SearchBar: {
    backgroundColor: '#F3F3F3',
    marginTop: 20,
  },
  loading: {
    padding: 10
  }
});