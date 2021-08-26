import React, {useState, useEffect } from 'react';
import { Text, View, Button, ScrollView, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import api from './api';
import SearchBar from "react-native-dynamic-search-bar";
import {useNavigation} from '@react-navigation/native';

export default function Home({ navigation }) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState('ilson');

    async function getClientes(){
        if(loading) return;
        setLoading(true)
        const response = await api.get(`/usuarios/pesquisar?page=${page}&pesquisa=${pesquisa}`)
        console.log(response.data.content)
        setData([...data, ...response.data.content])
        setPage(page + 1);
        setLoading(false);
      }

    useEffect(()=>{
        getClientes();
    },[data])

    function novaPesquisa(){
      setPage(0);
      setData([]);
    }

  return (
    <View style={styles.container}>
    <SearchBar
        style={styles.SearchBar}
        placeholder="Digite o nome do Cliente"
        onChangeText={(text) => setPesquisa(text)}
        onSearchPress={() => novaPesquisa()}
        returnKeyType="go"
        onSubmitEditing={() => novaPesquisa()}
    />
    <Text style={{textAlign: 'center', fontSize: 24, color:'#000000', paddingTop: 10}}>Lista de Clientes</Text>
    <FlatList 
        contentContainerStyle={{marginHorizontal: 20}}
        data={data}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <ListItem data={item}/>}
        onEndReached={getClientes}
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
  return(
    <View style={styles.listItem}>
      <Text style={styles.listText}>Código: {data.id}</Text>
      <Text style={styles.listText}>Razão social: {data.raz}</Text>
      <Text style={styles.listText}>Nome fantasia: {data.fan}</Text>
      <Text style={styles.listText}>CPF/CNPJ: {data.cgc}</Text>
      <Text style={styles.listText}>Fone: {data.fon}</Text>
      <Text style={styles.listText}>Endereço: {data.log}, {data.num} {data.cid}-{data.uf}</Text>
        <View>
              <TouchableOpacity
              style={styles.CarrinhoButton}
              activeOpacity={0.5}
              onPress={() => {
                  navigation.goBack('Carrinho', {codcli : 1})
               }}>
                <Text style={styles.TextButton}> Selecionar </Text>
              </TouchableOpacity>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF'
  },
  button: {
    alignItems: "center",
    padding: 10,
    paddingBottom: 15,
    backgroundColor: '#F3F3F3',
    marginTop: 15,
    borderRadius: 10
  },
  SearchBar: {
    backgroundColor: '#F3F3F3',
    marginTop: 20,
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
  CarrinhoButton: {
    marginTop: 25,
    height:50,
    padding: 15,
    borderRadius: 25,
    borderWidth: 0,
    marginBottom: 15,
    marginHorizontal: 40,
    backgroundColor: '#121212',
  },
  TextButton: {
    fontSize: 14,
    color:'#FFF',
    textAlign: 'center'
  }
});