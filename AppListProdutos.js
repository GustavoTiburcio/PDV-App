import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator} from 'react-native';
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

  // useEffect(() =>{
  //   console.log(pesquisa);
  // })

  async function loadApi(){
    if(loading) return;

    setLoading(true)

    const response = await api.get(`/mercador/pesquisar?page=${page}&pesquisa=${pesquisa}&CODTABPRE=0`)

    //console.log(response.data.content);
    //console.log('passou')
    setData([...data, ...response.data.content])
    //console.log(data)
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
      />
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

function ListItem( {data} ){  

  function currencyFormat(num) {
    return 'R$ ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  return(
    <View style={styles.listItem}>
      <Image
         style={styles.imagemDosProdutos}
         source={{
         uri: 'https://' + data.linkFot,
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

function FooterList( Load ){
  if(!Load) return null;
  return(
    <View style={styles.loading}>
    <ActivityIndicator size={25} color="#121212" />
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
    height: 200,
   },
  listItem: {
    backgroundColor: '#F3F3F3',
    padding: 25,
    marginTop: 20,
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
