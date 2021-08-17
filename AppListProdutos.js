import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, Alert, TouchableWithoutFeedback} from 'react-native';
import api from './api';
import {StatusBar} from 'expo-status-bar'
import SearchBar from "react-native-dynamic-search-bar";
import {useNavigation} from '@react-navigation/native';
//import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default function AppListProdutos(){

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState('834');

  useEffect(()=>{
    loadApi();
  },[data])

  async function loadApi(){
    if(loading) return;

    setLoading(true)

    const response = await api.get(`/mercador/pesquisar?page=${page}&pesquisa=${pesquisa}&CODTABPRE=0`)

    setData([...data, ...response.data.content])
    setPage(page + 1);
    setLoading(false);

  }

  function novaPesquisa(){
    setPage(0);
    setData([]);
  }

  return(
    <View style={styles.container}>
      <StatusBar style="light" />
      <SearchBar
        style={styles.SearchBar}
        placeholder="Digite o nome do produto"
        //onPress={() => alert("onPress")}
        onChangeText={(text) => setPesquisa(text)}
        onSearchPress={() => novaPesquisa()}
        returnKeyType="go"
        onSubmitEditing={() => novaPesquisa()}
      />
      <Text style={{textAlign: 'center', fontSize: 24, color:'#000000', paddingTop: 10}}>Lista de Produtos</Text>
      <FlatList 
        contentContainerStyle={{marginHorizontal: 20}}
        data={data}
        keyExtractor={item => String(item.codBar)}
        renderItem={({ item }) => <ListItem data={item}/>}
        onEndReached={loadApi}
        onEndReachedThreshold={0.1}
        ListFooterComponent={<FooterList load={loading} />}
      />
    </View>
  )
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

  function currencyFormat(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  function foto( linkfoto ){
    if (linkfoto == null) {
      return 'https://imagizer.imageshack.com/v2/730x450q90/924/qNmIzQ.jpg';
    }else{
      return 'https://' + linkfoto;
    }
  }
  return(
    <TouchableWithoutFeedback 
    onPress={() => { navigation.navigate('ListaCarrinho', {cod: data.codBar, mer: data.mer, valor: data.valVenMin})}}>
    <View style={styles.listItem}>
      <Image
         style={styles.imagemDosProdutos}
         source={{
         uri: foto(data.linkFot),
        }}
      />
      <Text></Text>
      <Text style={styles.listText}>{data.mer}</Text>
      <Text style={styles.listText}>R$ {currencyFormat(data.valVenMin).replace('.',',')}</Text>
      <Text style={styles.listText}>Estoque</Text>
      <Text style={styles.listText}>Matriz: {data.estEst1}                     Andre: {data.estEst2}</Text>
      <Text style={styles.listText}>Alexandre: {data.estEst3}               Fabio: {data.estEst4}</Text>
      <Text style={styles.listText}>Cilas: {data.estEst5}</Text>
      {/* <Table borderStyle={{borderWidth: 1}}> */}
            {/* <Row data={state.tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text}/>
            <TableWrapper style={styles.wrapper}>
            <Col data={['Title', 'Title2', 'Title3', 'Title4', 'Title5']} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
            <Rows data={[data.estEst1,data.estEst2,data.estEst3,data.estEst4,data.estEst5,]} flexArr={[2, 1, 1]} style={styles.row} textStyle={styles.text}/>
          </TableWrapper> */}
        {/* </Table> */}
    </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imagemDosProdutos: {
    width: 280,
    height: 240,
   },
  listItem: {
    backgroundColor: '#F3F3F3',
    padding: 22,
    marginTop: 15,
    borderRadius: 10
  },
  listText:{
    fontSize: 14,
    color:'#000000'
  },
  SearchBar: {
    backgroundColor: '#F3F3F3',
    marginTop: 20,
  },
  table: {
    flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'
  },
  head:{
    height: 40, backgroundColor: '#f1f8ff'
  },
  wrapper: { 
    flexDirection: 'row'
   },
  title: {
    flex: 1, backgroundColor: '#f6f8fa'
  },
  row: {
    height: 28  
  },
  text:{
    margin: 6
  },
  loading: {
    padding: 10
  }
});
