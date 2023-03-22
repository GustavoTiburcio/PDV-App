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
import DropDownPicker from 'react-native-dropdown-picker';
import { buscarUsaTabPre } from '../controle/ConfigStorage';

export default function ListaProduto({ navigation }) {
  const [data, setData] = useState([]);
  const [footerLoading, setFooterLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pesquisa, setPesquisa] = useState('');
  // const [usaEstoquePorCategoria, setUsaEstoquePorCategoria] = useState(false);
  const [usaTabPre, setUsaTabPre] = useState(false);

  const [openPicker, setOpenPicker] = useState(false);
  const [valuePicker, setValuePicker] = useState(null);
  const [tabelasPreco, setTabelasPreco] = useState([
    { label: 'Atacado', value: 'Atacado' },
    { label: 'Varejo', value: 'Varejo' },
  ]);

  async function getConfig() {
    setLoading(true);
    try {
      // const response = await buscarUsaEstoquePorCategoria();
      // if (response) {
      //   setUsaEstoquePorCategoria(JSON.parse(response));
      // }
      const usaTabelaPreco = await buscarUsaTabPre();
      if (usaTabelaPreco) {
        setUsaTabPre(JSON.parse(usaTabelaPreco));
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  }

  async function getMercador() {
    if (footerLoading) return;

    setFooterLoading(true);

    if (data.length === 0) {
      setLoading(true);
    }

    try {

      //caso cliente seja gold chaves, adicionar parametro &campo=gold para filtrar retorno da pesquisa.
      const goldChaves = api.defaults.baseURL === 'http://192.168.25.167:8087/api' || api.defaults.baseURL === 'http://tifire.sytes.net:8087/api' ? '&campo=gold' : '';

      const response = await api.get(`/mercador/listarProdutosCard?page=${page}&PESQUISA=${pesquisa}${goldChaves}`);

      if (response.data?.content.length === 0) {
        setLoading(false);
        setFooterLoading(false);
        return;
      }

      setData([...data, ...response.data.content]);
      setPage(page + 1);

    } catch (error) {
      console.log(error.message);
      setFooterLoading(false);
      setLoading(false);
      Alert.alert('Erro ao buscar produtos.', error.message);
    }
    finally {
      setFooterLoading(false);
      setLoading(false);
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

  function ValorDeVenda({ data }) {
    if (valuePicker === 'Atacado') {
      return <Text style={styles.listText}>{ConvertNumberParaReais(data.valVen1)}</Text>
    }
    if (valuePicker === 'Varejo') {
      return <Text style={styles.listText}>{ConvertNumberParaReais(data.valVen2)}</Text>
    }
    return <Text style={styles.listText}>{ConvertNumberParaReais(data.valVenMin)}</Text>
  }

  function ListItem({ data }) {
    return (
      <View style={styles.listItem}>
        <View style={{
          width: '90%', height: 250, alignSelf: 'center'
        }}>
          <Image
            resizeMode='center'
            style={{ height: 250, resizeMode: 'contain' }}
            source={{
              uri: data.linkFot ? 'https://' + data.linkFot : 'https://higa.membros.supermercadozen.com.br/assets/tema01/img/produto-sem-foto.png'
            }}
          />
        </View>
        <Text style={{ textAlign: 'center' }}>{data.codBar}</Text>
        <Text style={styles.listText}>{data.mer}</Text>
        <ValorDeVenda data={data} />
        <Text />
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          {api.defaults.baseURL === 'http://192.168.25.167:8087/api' || api.defaults.baseURL === 'http://tifire.sytes.net:8087/api' ?
            <View>
              <TouchableOpacity
                style={styles.CarrinhoButton}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('Estoque', { codbar: data.codBar })}>
                <Text style={styles.TextButton}>Estoque</Text>
              </TouchableOpacity>
            </View> : <></>}
          <View>
            <TouchableOpacity
              style={styles.CarrinhoButton}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('ListaCarrinho', { codbar: data.codBar, mer: data.mer.toUpperCase(), tabPre: valuePicker })}>
              <Text style={styles.TextButton}>Detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  useEffect(() => {
    getMercador();
  }, [data]);

  useEffect(() => {
    getConfig();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <Spinner visible={loading} size={Platform.OS === 'android' ? 50 : 'large'} />
      {usaTabPre &&
        <View style={{ flexDirection: 'row', marginLeft: '5%', marginTop: 10 }}>
          <Text style={styles.text}>Tabela:</Text>
          <DropDownPicker
            style={styles.picker}
            dropDownDirection="BOTTOM"
            placeholder="Selecionar"
            open={openPicker}
            value={valuePicker}
            items={tabelasPreco}
            setOpen={() => { setOpenPicker(!openPicker) }}
            setValue={setValuePicker}
            setItems={setTabelasPreco}
            dropDownContainerStyle={{
              width: '50%', marginLeft: 10
            }}
            ListEmptyComponent={() => (
              <View style={{ justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#38A69D" />
              </View>
            )}
          />
        </View>}
      <SearchBar
        style={styles.searchBar}
        placeholder="Digite o nome do produto"
        onChangeText={(text) => setPesquisa(text)}
        onSearchPress={() => novaPesquisa()}
        returnKeyType="go"
        onSubmitEditing={() => novaPesquisa()}
        onClearPress={() => setPesquisa('')}
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
  },
  text: {
    color: '#555555',
    fontSize: 16,
    marginTop: 15,
  },
  picker: {
    width: '50%',
    marginLeft: 10
  },
});