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
  Platform,
} from 'react-native';
import api from '../services/api';
import { StatusBar } from 'expo-status-bar';
import SearchBar from "react-native-dynamic-search-bar";
import LottieView from 'lottie-react-native';
// import { buscarUsaEstoquePorCategoria } from '../controle/ConfigStorage';
import { ConvertNumberParaReais } from '../utils/ConvertNumberParaReais';
import Spinner from 'react-native-loading-spinner-overlay';

export default function ListaProduto({ navigation }) {
  const [data, setData] = useState([]);
  const [footerLoading, setFooterLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState(' ');
  // const [usaEstoquePorCategoria, setUsaEstoquePorCategoria] = useState(false);

  // async function getConfig() {
  //   try {
  //     const response = await buscarUsaEstoquePorCategoria();
  //     if (response) {
  //       setUsaEstoquePorCategoria(JSON.parse(response));
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  async function getMercador() {
    if (footerLoading) return;

    setFooterLoading(true);

    if (data.length === 0) {
      setLoading(true);
    }

    try {
      //caso cliente seja gold chaves, adicionar parametro &campo=gold para ordenar retorno da pesquisa.
      const response = await api.get(`/mercador/listarProdutosCard?page=${page}&PESQUISA=${pesquisa}`);

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
      Alert.alert('Erro ao buscar produtos.', error.message);
    }
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
    return (
      <View style={styles.listItem}>
        <View style={{
          width: '90%', height: 250, alignSelf: 'center'
        }}>
          <Image
            resizeMode='center'
            style={{ height: 250, borderWidth: 0.2, borderColor: '#000', resizeMode: 'contain', borderRadius: 10 }}
            source={{
              uri: data.linkFot ? 'https://' + data.linkFot : 'https://higa.membros.supermercadozen.com.br/assets/tema01/img/produto-sem-foto.png'
            }}
          />
        </View>
        <Text style={{ textAlign: 'center' }}>{data.codBar}</Text>
        <Text />
        <Text style={styles.listText}>{data.mer}</Text>
        <Text style={styles.listText}>{ConvertNumberParaReais(data.valVenMin)}</Text>
        <Text />
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <View flexDirection={'row'} style={{ justifyContent: 'space-evenly' }}>
          {/* {usaEstoquePorCategoria ?
            <View>
              <TouchableOpacity
                style={styles.CarrinhoButton}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('Estoque', { codbar: data.codBar })}>
                <Text style={styles.TextButton}>Estoque</Text>
              </TouchableOpacity>
            </View> : <></>} */}
          <View>
            <TouchableOpacity
              style={styles.CarrinhoButton}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('ListaCarrinho', { codbar: data.codBar, mer: data.mer.toUpperCase(), valor: data.valVenMin })}>
              <Text style={styles.TextButton}>Detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  // useEffect(() => {
  //   navigation.addListener('focus', () => {
  //     getConfig();
  //   });
  // }, [navigation]);

  useEffect(() => {
    getMercador();
  }, [data]);

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <Spinner visible={loading} size={Platform.OS === 'android' ? 50 : 'large'} />
      <SearchBar
        style={styles.searchBar}
        placeholder="Digite o nome do produto"
        onChangeText={(text) => setPesquisa(text)}
        onSearchPress={() => novaPesquisa()}
        returnKeyType="go"
        onSubmitEditing={() => novaPesquisa()}
      />
      {data.length > 0 ?
        <FlatList
          contentContainerStyle={{ marginHorizontal: 20, paddingBottom: 20 }}
          data={data}
          keyExtractor={item => String(item.codBar)}
          renderItem={({ item }) => <ListItem data={item} />}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd <= 0) return;
            getMercador();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<FooterList load={footerLoading} />}
        /> : !loading ?
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
          </View> : <></>
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
    elevation: 2,
    shadowColor: '#000',
  },
  listText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  searchBar: {
    backgroundColor: '#F3F3F3',
    marginVertical: 20,
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
    elevation: 3, shadowColor: '#000'
  },
  TextButton: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});