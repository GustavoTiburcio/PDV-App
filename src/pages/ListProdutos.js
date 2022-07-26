import React, { Component, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import api from '../../services/api';
import { StatusBar } from 'expo-status-bar';
import SearchBar from "react-native-dynamic-search-bar";
import LottieView from 'lottie-react-native';
import { buscarEstoquePorCategoria } from '../../controle/ConfigStorage';

const { width } = Dimensions.get("window");

export default function ListProdutos({ navigation }) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState('');
  const [usaEstoquePorCategoria, setUsaEstoquePorCategoria] = useState(false);

  async function getConfig() {
    buscarEstoquePorCategoria().then(result => {
      setUsaEstoquePorCategoria(JSON.parse(result));
    })
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getConfig();
    });
  }, [navigation]);

  useEffect(() => {
    loadApi();
  }, [data])

  async function loadApi() {
    if (loading) return;

    setLoading(true)

    const response = await api.get(`/mercador/listarProdutosCard?page=${page}&PESQUISA=${pesquisa}`)

    //campo=gold é para ordenar retorno da pesquisa para o cliente Gold Chaves
    // const response = await api.get(`/mercador/listarProdutosCard?page=${page}&PESQUISA=${pesquisa}&CODTABPRE=1&campo=gold`)

    setData([...data, ...response.data.content])
    setPage(page + 1);
    setLoading(false);

  }

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

    // const navigation = useNavigation();

    function foto(linkfoto) {
      if (linkfoto == null) {
        return 'https://imagizer.imageshack.com/v2/730x450q90/924/qNmIzQ.jpg';
      } else {
        return 'https://' + linkfoto;
      }
    }
    return (
      <View style={styles.listItem}>
        <View style={{ width: '100%', paddingTop: '70%' }}>
          <Image
            style={{ position: 'absolute', left: 0, bottom: 0, right: 0, top: 0, resizeMode: 'contain' }}
            source={{
              uri: foto(data.linkFot),
            }}
          />
        </View>
        <Text style={styles.listText}>{data.codBar}</Text>
        <Text></Text>
        <Text style={styles.listText}>{data.mer}</Text>
        <Text style={styles.listText}>R$ {data.valVenMin.toFixed(2).replace('.', ',')}</Text>
        <View flexDirection={'row'} style={{ justifyContent: 'space-evenly' }}>
          {usaEstoquePorCategoria ?
            <View>
              <TouchableOpacity
                style={styles.CarrinhoButton}
                activeOpacity={0.5}
                onPress={() => { navigation.navigate('Estoque', { codbar: data.codBar }) }}>
                <Text style={styles.TextButton}>Estoque</Text>
              </TouchableOpacity>
            </View> : null}
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
      <StatusBar style="light" />
      <SearchBar
        style={styles.SearchBar}
        placeholder="Digite o nome do produto"
        onChangeText={(text) => setPesquisa(text)}
        onSearchPress={() => novaPesquisa()}
        returnKeyType="go"
        onSubmitEditing={() => novaPesquisa()}
      />
      <Text style={styles.title}>Lista de Produtos</Text>
      {data.length > 0 ? <FlatList
        contentContainerStyle={{ marginHorizontal: 20 }}
        data={data}
        keyExtractor={item => String(item.codBar)}
        renderItem={({ item }) => <ListItem data={item} />}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd < 0) return;
          loadApi()
        }}
        onEndReachedThreshold={0.01}
        ListFooterComponent={<FooterList load={loading} />}
      /> :
        <View>
          <View style={{ alignItems: 'center', width, height: '60%', }}>
            <LottieView
              source={require('../assets/not-found.json')}
              autoPlay={true}
              loop={true}
              style={{
                width, height: '100%',
                resizeMode: 'contain',
                alignSelf: 'center',
                backgroundColor: '#fff',
              }}
            />
          </View>
          <Text style={{ textAlign: 'center', fontSize: 24 }}>Nenhum produto foi encontrado...</Text>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginTop: 15,
    borderRadius: 10,
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