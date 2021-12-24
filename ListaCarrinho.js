/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, Alert, Image, View, TextInput } from 'react-native';
import BotaoVermelho from './components/BotaoVermelho';
import { gravarItensCarrinhoNoBanco, buscarItensCarrinhoNoBanco } from './controle/CarrinhoStorage';
import { useIsFocused } from '@react-navigation/native';
import api from './api';

const ListaCarrinho = ({ route, navigation }) => {
    let codmer;
    const codbar = route.params?.codbar;
    const item = route.params?.mer;
    const valor = route.params?.valor;

    const [quantidade, setQuantidade] = useState();
    const [valorItem, setValorItem] = useState(valor);
    const [buscaDetalhes, setBuscaDetalhes] = useState([]);
    const [data, setData] = useState();
    
    useEffect(()=>{
        getListarDetalhes()
      },[codbar])

    useEffect(()=>{
        
    },[quantidade, valorItem])

    async function getListarDetalhes(){
        const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
        var prod =  response.data.detalhes.map(item => [item.codigo,item.codbar,item.valor])
        codmer = prod[0][0]
        console.log('Pegou codmer ao abrir a tela: ' + codmer)
        console.log(response.data.fotos[0].linkfot)
        setData(response.data)
        console.log(data)      
    }
    

    function foto( linkfoto ){
        if (linkfoto == null) {
          return 'https://imagizer.imageshack.com/v2/730x450q90/924/qNmIzQ.jpg';
        }else{
          return 'https://' + linkfoto;
        }
      }

    const salvaPedido = () => {
        if (quantidade == undefined) {
            Alert.alert('Quantidade vazia', 'Faltou informar a quantidade');
        }else if(codmer == undefined) {
            Alert.alert('Erro ao adicionar item', 'código do produto está vazio, tente novamente');
        }else{
            let itens = { codmer: codmer, quantidade: quantidade, item: item, valor: valorItem };
        gravarItensCarrinhoNoBanco(itens).then(resultado => {
            console.log('Adicionado ao carrinho: ')
            console.log(itens)
            Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
            navigation.pop();
        });
        }
    };
    return (
        <View id={codmer} style={styles.container}>
            <ScrollView>
            <View style={{width:'100%', paddingTop:'70%', marginTop: 20}}>
            {/* <Image
                style={{position:'absolute',left:0,bottom:0,right:0,top:0,resizeMode:'contain'}}
                source={{
                uri: foto(data.fotos[0].linkfot)
                }}
            /> */}
            </View>
            <Text style={styles.item}> {item} </Text>
            <Text style={styles.text}>Quantidade:</Text>
            <TextInput
                style={styles.textinput}
                keyboardType="numeric"
                autoFocus = {true}
                placeholder="Digite a quantidade"
                onChangeText={value => setQuantidade(value)}>
                {quantidade}
            </TextInput>
            <Text style={styles.text}>Valor R$:</Text>
            <TextInput
                style={styles.textinput}
                keyboardType="numeric"
                placeholder="Valor do produto"
                onChangeText={value => setValorItem(value.replace(',','.'))}>
                {valor.toFixed(2).replace('.',',')}
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