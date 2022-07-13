import React, { Component, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity} from 'react-native';
import api from '../../services/api';
import {StatusBar} from 'expo-status-bar';
import SearchBar from "react-native-dynamic-search-bar";
import {useNavigation} from '@react-navigation/native';

export default function ListProdutos(){

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState('Jaq');

  useEffect(()=>{
    loadApi();
  },[data])

  async function loadApi(){
    if(loading) return;

    setLoading(true)

    const response = await api.get(`/mercador/listarProdutosCard?page=${page}&PESQUISA=${pesquisa}`)

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
        onChangeText={(text) => setPesquisa(text)}
        onSearchPress={() => novaPesquisa()}
        returnKeyType="go"
        onSubmitEditing={() => novaPesquisa()}
      />
      <Text style={{textAlign: 'center', fontSize: 24, color:'#000000', paddingTop: 10}}>Lista de Produtos</Text>
      {data != '' ? <FlatList 
        contentContainerStyle={{marginHorizontal: 20}}
        data={data}
        keyExtractor={item => String(item.codBar)}
        renderItem={({ item }) => <ListItem data={item}/>}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd < 0) return;
          loadApi()
        }}
        onEndReachedThreshold={0.01}
        ListFooterComponent={<FooterList load={loading} />}
      /> : <View><View style={{ alignItems: 'center' }}>
      <Image
        style={{ resizeMode: 'contain', paddingTop: '60%', marginTop: '30%', height: '30%', width: '40%' }}
        source={require('../assets/nenhum_prod.png')}
      />
    </View><Text style={{ textAlign: 'center', fontSize: 24, color: '#000000' }}>Nenhum produto foi encontrado...{"\n"}Verifique o valor digitado.</Text></View>}
    </View>
  )
}

function FooterList( Load ){
  if(!Load.load) return null;
  return(
    <View style={styles.loading}>
    <ActivityIndicator size='large' color="#121212" />
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
    <View style={styles.listItem}>
      <View style={{width:'100%',paddingTop:'70%'}}>
      <Image
         style={{position:'absolute',left:0,bottom:0,right:0,top:0,resizeMode:'contain'}}
         source={{
         uri: foto(data.linkFot),
        }}
      />
      </View>
      <Text style={styles.listText}>{data.codBar}</Text>
      <Text></Text>
      <Text style={styles.listText}>{data.mer}</Text>
      <Text style={styles.listText}>R$ {currencyFormat(data.valVenMin).replace('.',',')}</Text>
        
          {/* <View>
            <TouchableOpacity
            style={styles.CarrinhoButton}
            activeOpacity={0.5}
            onPress={() => {navigation.navigate('Estoque', {codbar: data.codBar})}}>
              <Text style={styles.TextButton}>   Estoque   </Text>
            </TouchableOpacity>
          </View> */}
          <View>
            <TouchableOpacity
            style={styles.CarrinhoButton}
            activeOpacity={0.5}
            onPress={() => {navigation.navigate('ListaCarrinho', {codbar: data.codBar, mer: data.mer, valor: data.valVenMin})
              }}>
              <Text style={styles.TextButton}> Detalhes </Text>
            </TouchableOpacity>
          </View>    
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listItem: {
    backgroundColor: '#F3F3F3',
    padding: 22,
    marginTop: 15,
    borderRadius: 10,
  },
  listText:{
    fontSize: 16,
    color:'#000000',
    textAlign: 'center'
  },
  SearchBar: {
    backgroundColor: '#F3F3F3',
    marginTop: 20,
  },
  loading: {
    padding: 10
  },
  CarrinhoButton: {
    marginTop: 25,
    height:50,
    padding: 15,
    borderRadius: 25,
    borderWidth: 0,
    marginBottom: 15,
    marginHorizontal: 50,
    backgroundColor: '#121212',
  },
  TextButton: {
    fontSize: 14,
    color:'#FFF',
    textAlign: 'center'
  }
});
