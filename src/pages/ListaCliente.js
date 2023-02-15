import React, { useState, useEffect } from 'react';
import { Text, View, Button, ScrollView, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator, LogBox, Dimensions, Platform } from 'react-native';
import api from '../services/api';
import SearchBar from "react-native-dynamic-search-bar";
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const { width } = Dimensions.get("window");


export default function ListaCliente() {

  const [data, setData] = useState([]);
  const [footerLoading, setFooterLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState(' ');

  async function getClientes() {
    if (footerLoading) return;

    setFooterLoading(true);

    if (data.length === 0) {
      setLoading(true);
    }

    try {
      const response = await api.get(`/usuarios/pesquisar?page=${page}&pesquisa=${pesquisa}`);

      if (response.data?.content.length === 0) {
        setLoading(false);
        setFooterLoading(false);
        return;
      }

      setData([...data, ...response.data.content]);
      setPage(page + 1);
      setFooterLoading(false);
      setLoading(false);

    } catch (error) {
      console.log(error.message);
      setFooterLoading(false);
      setLoading(false);
      Alert.alert('Erro ao buscar clientes. ' + error.message);
    }

  }

  useEffect(() => {
    getClientes();
  }, [data])

  function novaPesquisa() {
    setPage(0);
    setData([]);
  }

  return (
    <View style={styles.container}>
      <Spinner visible={loading} size={Platform.OS === 'android' ? 50 : 'large'} />
      <SearchBar
        style={styles.SearchBar}
        placeholder="Digite o nome do Cliente"
        onChangeText={(text) => setPesquisa(text)}
        onSearchPress={() => novaPesquisa()}
        returnKeyType="go"
        onSubmitEditing={() => novaPesquisa()}
      />
      <Text style={styles.title}>Lista de Clientes</Text>
      {data.length > 0 ?
        <FlatList
          contentContainerStyle={{ marginHorizontal: 20 }}
          data={data}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <ListItem data={item} />}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd <= 0) return;
            getClientes();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<FooterList load={footerLoading} />}
        /> : !loading ?
          <View>
            <View style={{ alignItems: 'center', width, height: '60%', }}>
              <LottieView
                source={require('../images/not-found.json')}
                autoPlay={true}
                loop={true}
                style={{
                  width, height: '100%',
                  alignSelf: 'center',
                  backgroundColor: '#fff',
                }}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 24 }}>Nenhum cliente foi encontrado...</Text>
          </View> : <></>
      }
    </View>
  );
}

function FooterList(Load) {
  if (!Load.load) return null;
  return (
    <View style={styles.loading}>
      <ActivityIndicator size='large' color="#38A69D" />
    </View>
  )
}

function ListItem({ data }) {
  const navigation = useNavigation();

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  return (
    <View style={styles.listItem}>
      <Text style={styles.listText}>Código: {data.id}</Text>
      <Text style={styles.listText}>Razão social: {data.raz}</Text>
      <Text style={styles.listText}>Nome fantasia: {data.fan}</Text>
      <Text style={styles.listText}>CPF/CNPJ: {data.cgc}</Text>
      <Text style={styles.listText}>Fone: {data.fon}</Text>
      <Text style={styles.listText}>CEP: {data.cep}</Text>
      <Text style={styles.listText}>Endereço: {data.log}, {data.num} {data.cid}-{data.uf}</Text>
      <View>
        <TouchableOpacity
          style={styles.CarrinhoButton}
          activeOpacity={0.5}
          onPress={() => {
            let cliente = data;
            navigation.navigate({
              name: 'FinalizarCarrinho',
              params: { cliente },
              merge: true,
            });
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
    backgroundColor: '#FFFFFF'
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    color: '#000000',
    paddingTop: 10
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
  listText: {
    fontSize: 14,
    color: '#000000'
  },
  CarrinhoButton: {
    marginTop: 25,
    height: 50,
    padding: 15,
    borderRadius: 25,
    borderWidth: 0,
    marginBottom: 15,
    marginHorizontal: 40,
    backgroundColor: '#38A69D',
  },
  TextButton: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center'
  }
});