/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, Alert, View, TextInput } from 'react-native';
import BotaoVermelho from './components/BotaoVermelho';
import { gravarItensCarrinhoNoBanco, buscarItensCarrinhoNoBanco } from './controle/CarrinhoStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import api from './api';

const ListaCarrinho = ({ route, navigation }) => {
    const codbar = route.params?.codbar;
    const item = route.params?.mer;
    const valor = route.params?.valor;

    const [quantidade, setQuantidade] = useState();
    const [valorItem, setValorItem] = useState(valor);
    const [buscaDetalhes, setBuscaDetalhes] = useState([]);
    const [dataEstoque, setDataEstoque] = useState();
    const [dadosLogin, setDadosLogin] = useState();
    const [codigoProd, setCodigoProd] = useState();

    async function getListarDetalhes() {
        const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
        var prod = response.data.detalhes.map(item => [item.codigo, item.codbar, item.valor])
        setCodigoProd(prod[0][0])
        //console.log('Pegou codmer ao abrir a tela: ' + codigoProd)
    }

    async function getListarEstoque() {
        const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
        setDataEstoque(response.data)
        // console.log(response.data)
    }

    async function getLoginData() {
        try {
            const jsonValue = await AsyncStorage.getItem('@login_data')
            setDadosLogin(JSON.parse(jsonValue));
            // console.log(jsonValue)
        } catch (e) {
            console.log('Erro ao ler login')
        }
    }

    useEffect(() => {
        getListarDetalhes()
        getListarEstoque()
        getLoginData()
    }, [quantidade, valorItem, codigoProd])

    useEffect(() => {
        if (valor == null && valor == undefined) {
            Alert.alert('Valor de venda zerado', item + ' está sem valor de venda, avise a loja para corrigir o valor no sistema.')
        }
    }, [navigation]);

    function converteValVen(num) {
        if (num != null && num != undefined) {
          return num.toFixed(2).replace('.',',')
        }
      }

    const salvaPedido = () => {
        if (quantidade == undefined || quantidade == 0) {
            Alert.alert('Quantidade vazia', 'Faltou informar a quantidade');
        } else if (codigoProd == undefined) {
            Alert.alert('Erro ao adicionar item', 'código do produto está vazio, tente novamente');
        } else {
            switch (dadosLogin.codcat) {
                case null:
                    Alert.alert('Usuário sem categoria', 'Favor contatar o suporte para colocar categoria no app_user')                  
                    break;
                case 1:
                    if (quantidade > dataEstoque.estest1 || dataEstoque.estest1 == null) {
                        Alert.alert('Quantidade inválida', 'Estoque atual: ' + dataEstoque.estest1 + ' Unidades')
                    } else {
                        let itens = { codmer: codigoProd, quantidade: quantidade, item: item, valor: valorItem };
                        gravarItensCarrinhoNoBanco(itens).then(resultado => {
                            console.log('Adicionado ao carrinho: ')
                            console.log(itens)
                            Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
                            navigation.pop();
                        });
                    }
                    break;
                case 2:
                    if (quantidade > dataEstoque.estest2 || dataEstoque.estest2 == null) {
                        Alert.alert('Quantidade inválida', 'Estoque atual: ' + dataEstoque.estest2 + ' Unidades')
                    } else {
                        let itens = { codmer: codigoProd, quantidade: quantidade, item: item, valor: valorItem };
                        gravarItensCarrinhoNoBanco(itens).then(resultado => {
                            console.log('Adicionado ao carrinho: ')
                            console.log(itens)
                            Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
                            navigation.pop();
                        });
                    }
                    break;
                case 3:
                    if (quantidade > dataEstoque.estest3 || dataEstoque.estest3 == null) {
                        Alert.alert('Quantidade inválida', 'Estoque atual: ' + dataEstoque.estest3 + ' Unidades')
                    } else {
                        let itens = { codmer: codigoProd, quantidade: quantidade, item: item, valor: valorItem };
                        gravarItensCarrinhoNoBanco(itens).then(resultado => {
                            console.log('Adicionado ao carrinho: ')
                            console.log(itens)
                            Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
                            navigation.pop();
                        });
                    }
                    break;
                case 4:
                    if (quantidade > dataEstoque.estest4 || dataEstoque.estest4 == null) {
                        Alert.alert('Quantidade inválida', 'Estoque atual: ' + dataEstoque.estest4 + ' Unidades')
                    } else {
                        let itens = { codmer: codigoProd, quantidade: quantidade, item: item, valor: valorItem };
                        gravarItensCarrinhoNoBanco(itens).then(resultado => {
                            console.log('Adicionado ao carrinho: ')
                            console.log(itens)
                            Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
                            navigation.pop();
                        });
                    }
                    break;
                case 5:
                    if (quantidade > dataEstoque.estest5 || dataEstoque.estest5 == null) {
                        Alert.alert('Quantidade inválida', 'Estoque atual: ' + dataEstoque.estest5 + ' Unidades')
                    } else {
                        let itens = { codmer: codigoProd, quantidade: quantidade, item: item, valor: valorItem };
                        gravarItensCarrinhoNoBanco(itens).then(resultado => {
                            console.log('Adicionado ao carrinho: ')
                            console.log(itens)
                            Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
                            navigation.pop();
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    };
    return (
        <View id={codigoProd} style={styles.container}>
            <ScrollView>
                <Text style={styles.item}> {item} </Text>
                <Text style={styles.text}>Quantidade:</Text>
                <TextInput
                    style={styles.textinput}
                    keyboardType="numeric"
                    autoFocus={true}
                    placeholder="Digite a quantidade"
                    onChangeText={value => setQuantidade(value)}>
                    {quantidade}
                </TextInput>
                <Text style={styles.text}>Valor R$:</Text>
                <TextInput
                    style={styles.textinput}
                    keyboardType="numeric"
                    placeholder="Valor do produto"
                    onChangeText={value => setValorItem(parseFloat(value.replace(',', '.')))}>
                    {converteValVen(valor)}
                </TextInput>
                <BotaoVermelho
                    text={
                        'Adicionar R$ ' +
                        (
                            Number.parseFloat(valorItem).toPrecision(7) *
                            Number.parseInt(quantidade ? quantidade : 1)
                        ).toFixed(2)
                    }
                    onPress={() => salvaPedido()}

                />
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 20,
        justifyContent: 'flex-start',
    },
    textcadastro: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    item: {
        color: '#000000',
        fontSize: 20,
        marginTop: 15,
        alignItems: 'center',
    },
    text: {
        color: '#000000',
        fontSize: 16,
        marginTop: 15,
    },
    textinput: {
        fontSize: 20,
        borderBottomColor: '#000000',
        borderBottomWidth: 2,
    },
    texto: {
        color: '#000000',
        alignSelf: 'center',
    },
    listItem: {
        flex: 1,
        flexDirection: 'column',
        color: 'red',
    }
});

export default ListaCarrinho;