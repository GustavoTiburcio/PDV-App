import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import api from '../services/api';
import { StatusBar } from 'expo-status-bar';
import SearchBar from "react-native-dynamic-search-bar";
import LottieView from 'lottie-react-native';
import { buscarUsaEstoquePorCategoria } from '../controle/ConfigStorage';
import { ConvertNumberParaReais } from '../utils/ConvertNumberParaReais';

export default function ListProdutos({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState('');
  const [usaEstoquePorCategoria, setUsaEstoquePorCategoria] = useState(false);

  async function getConfig() {
    try {
      const response = await buscarUsaEstoquePorCategoria();
      if (response) {
        setUsaEstoquePorCategoria(JSON.parse(result));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getMercador() {
    if (loading) return;
    setLoading(true)
    try {
      //caso cliente seja gold chaves, adicionar parametro &campo=gold para ordenar retorno da pesquisa.
      const response = await api.get(`/mercador/listarProdutosCard?page=${page}&PESQUISA=${pesquisa}`)

      setData([...data, ...response.data.content])
      setPage(page + 1);
      setLoading(false);

    } catch (error) {
      console.log(error.message);
      Alert.alert('Erro ao buscar produtos. ' + error.message)
    }
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getConfig();
    });
  }, [navigation]);

  useEffect(() => {
    getMercador();
  }, [data])


  function novaPesquisa() {
    setPage(0);
    setData([]);
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
    return (
      <View style={styles.listItem}>
        <View style={{ width: '90%', height: 250, alignSelf: 'center' }}>
          <Image
            resizeMode='center'
            style={{ height: 250, borderWidth: 0.5, borderColor: '#000' }}
            source={{
              uri: data.linkFot ? 'https://' + data.linkFot : 'https://higa.membros.supermercadozen.com.br/assets/tema01/img/produto-sem-foto.png'
            }}
          />
        </View>
        <Text style={styles.listText}>{data.codBar}</Text>
        <Text />
        <Text style={styles.listText}>{data.mer}</Text>
        <Text style={styles.listText}>{ConvertNumberParaReais(data.valVenMin)}</Text>
        <View flexDirection={'row'} style={{ justifyContent: 'space-evenly' }}>
          {usaEstoquePorCategoria ?
            <View>
              <TouchableOpacity
                style={styles.CarrinhoButton}
                activeOpacity={0.5}
                onPress={() => { navigation.navigate('Estoque', { codbar: data.codBar }) }}>
                <Text style={styles.TextButton}>Estoque</Text>
              </TouchableOpacity>
            </View> : <></>}
          <View>
            <TouchableOpacity
              style={styles.CarrinhoButton}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate('ListaCarrinho', { codbar: data.codBar, mer: data.mer, valor: data.valVenMin })
              }}>
              <Text style={styles.TextButton}>Detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <SearchBar
        style={styles.SearchBar}
        placeholder="Digite o nome do produto"
        onChangeText={(text) => setPesquisa(text)}
        onSearchPress={() => novaPesquisa()}
        returnKeyType="go"
        onSubmitEditing={() => novaPesquisa()}
      />
      <Text style={styles.title}>Lista de Produtos</Text>
      {data.length > 0 ?
        <FlatList
          contentContainerStyle={{ marginHorizontal: 20 }}
          data={data}
          keyExtractor={item => String(item.codBar)}
          renderItem={({ item }) => <ListItem data={item} />}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd < 0) return;
            getMercador();
          }}
          onEndReachedThreshold={0.01}
          ListFooterComponent={<FooterList load={loading} />}
        /> :
        <View style={{ alignItems: 'center', width: '100%', height: '100%', flexDirection: 'column' }}>
          <LottieView
            source={require('../images/not-found.json')}
            autoPlay={true}
            loop={true}
            style={{
              width: 200, height: 200, marginTop: 30,
            }}
          />
          <Text style={{ textAlign: 'center', marginTop: 30, fontSize: 24 }}>Nenhum produto foi encontrado...</Text>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    color: '#000000',
    paddingTop: 10
  },
  listItem: {
    backgroundColor: '#F3F3F3',
    padding: 22,
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  listText: {
    fontSize: 16,
    color: '#000000',
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
    height: 50,
    width: 120,
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#38A69D',
  },
  TextButton: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center'
  }
});