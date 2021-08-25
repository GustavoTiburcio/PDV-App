/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, Alert, View, TextInput } from 'react-native';
import BotaoVermelho from './components/BotaoVermelho';
import { gravarItensCarrinhoNoBanco, buscarItensCarrinhoNoBanco } from './controle/CarrinhoStorage';
import { useIsFocused } from '@react-navigation/native';
import api from './api';

const ListaCarrinho = ({ route, navigation }) => {
    let codmer;
    const codbar = route.params?.codbar;
    const item = route.params?.mer;
    const valor = route.params?.valor;

    const [quantidade, setQuantidade] = useState(1);
    const [valorItem, setValorItem] = useState(valor);
    const [buscaDetalhes, setBuscaDetalhes] = useState([]);

    async function getListarDetalhes(){
             const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
             var prod =  response.data.detalhes.map(item => [item.codigo,item.codbar,item.valor])
             codmer = prod[0][0]
             console.log('Pegou codmer ao abrir a tela: ' + codmer)
        }

    useEffect(()=>{
        getListarDetalhes()
    },[quantidade, valorItem])

    const salvaPedido = () => {
        let itens = { codmer: codmer, quantidade: quantidade, item: item, valor: valorItem };
        gravarItensCarrinhoNoBanco(itens).then(resultado => {
            console.log('Adicionado ao carrinho: ')
            console.log(itens)
            Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
            navigation.pop();
        });
    };
    return (
        <View id={codmer} style={styles.container}>
            <ScrollView>
            <Text style={styles.item}> {item} </Text>
            <Text style={styles.text}>Quantidade:</Text>
            <TextInput
                style={styles.textinput}
                keyboardType="numeric"
                autoFocus = {true}
                onChangeText={value => setQuantidade(value)}>
                {quantidade}
            </TextInput>
            <Text style={styles.text}>Valor:</Text>
            <TextInput
                style={styles.textinput}
                keyboardType="numeric"
                onChangeText={value => setValorItem(value.replace(',','.'))}>
                {valor}
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