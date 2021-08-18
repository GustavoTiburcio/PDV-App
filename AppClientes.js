import React, {useState, useEffect } from 'react';
import { Text, View, Button, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import api from './api';
import SearchBar from "react-native-dynamic-search-bar";

export default function Home({ navigation }) {

  const [clientes, setClientes] = useState([]);
  const [pesquisa, setPesquisa] = useState('');

    async function getClientes(){
        const response = await api.get(`/usuarios/listarTodos`)
        setClientes(response.data)
      }

    useEffect(()=>{
        getClientes();
    },[])

  return (
    <ScrollView>
    <View style={styles.container}>
    <SearchBar
        style={styles.SearchBar}
        placeholder="Digite o nome do Cliente"
        onChangeText={(text) => setPesquisa(text)}
        onSearchPress={() => {}}
        returnKeyType="go"
        onSubmitEditing={() => {}}
    />
    {clientes.filter(item => item.raz.startsWith(pesquisa)).map(item => {
      return (
      <View key={item.id}>
        <TouchableOpacity style={styles.button}>
        <Text>{item.raz}</Text>
        </TouchableOpacity>
      </View>
      )
    })}
    </View>
    </ScrollView>
  );
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
});