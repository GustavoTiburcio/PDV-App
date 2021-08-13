/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, Alert, View, TextInput } from 'react-native';
import BotaoVermelho from './components/BotaoVermelho';
import { gravarItensCarrinhoNoBanco, buscarItensCarrinhoNoBanco } from './controle/CarrinhoStorage';
import { useIsFocused } from '@react-navigation/native';

const ListaCarrinho = ({ route, navigation }) => {
    const { cod, item, valor } = route.params;
    const [quantidade, setQuantidade] = useState(1);
    const [valorItem, setValorItem] = useState(valor.replace(',','.'));
    const salvaPedido = () => {
        let itens = { codmer: cod, quantidade: quantidade, item: item, valor: valorItem };
        gravarItensCarrinhoNoBanco(itens).then(resultado => {
            Alert.alert('Sucesso', 'Item Salvo Com Sucesso.', [{ text: 'OK' }]);
            navigation.pop();
        });
    };
    return (
        <View id={cod} style={styles.container}>
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
        color: '#ff5500',
        fontSize: 20,
        fontWeight: 'bold',
    },
    item: {
        color: '#555555',
        fontSize: 20,
        marginTop: 15,
        alignItems: 'center',
    },
    text: {
        color: '#555555',
        fontSize: 16,
        marginTop: 15,
    },
    textinput: {
        fontSize: 20,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
    },
    texto: {
        color: '#005500',
        alignSelf: 'center',
    },
    listItem: {
        flex: 1,
        flexDirection: 'column',
        color: 'red',
    }
});

export default ListaCarrinho;