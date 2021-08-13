import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, Alert} from 'react-native';
import api from './api';
import SearchBar from "react-native-dynamic-search-bar";

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
        style={{marginTop: 35}}
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

  function currencyFormat(num) {
    return 'R$ ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  function foto( linkfoto ){
    if (linkfoto == null) {
      return 'https://imagizer.imageshack.com/v2/730x450q90/924/qNmIzQ.jpg';
    }else{
      return 'https://' + linkfoto;
    }
  }
  return(
    <View style={styles.listItem}>
      <Image
         style={styles.imagemDosProdutos}
         source={{
         uri: foto(data.linkFot),
        }}
      />
      <Text></Text>
      <Text style={styles.listText}>{data.mer}</Text>
      {/* <Text style={styles.listText}>Codbar: {data.codBar}</Text> */}
      <Text style={styles.listText}>{currencyFormat(data.valVenMin).replace('.',',')}</Text>
      <Text style={styles.listText}>Estoque {data.estEst1}</Text>
      <Text style={styles.listText}>Matriz: {data.estEst1}                     Andre: {data.estEst2}</Text>
      <Text style={styles.listText}>Alexandre: {data.estEst3}               Fabio: {data.estEst4}</Text>
      <Text style={styles.listText}>Cilas: {data.estEst5}</Text>
    </View>
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
    padding: 25,
    marginTop: 15,
    borderRadius: 10
  },
  listText:{
    fontSize: 14,
    color:'#000000'
  },
  SearchBar: {
    backgroundColor: '#F3F3F3',
    marginTop: 50,
  },
  loading: {
    padding: 10
  }
});
