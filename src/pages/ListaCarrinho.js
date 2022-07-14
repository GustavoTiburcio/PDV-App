/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, Alert, Image, View, TextInput } from 'react-native';
import BotaoVermelho from '../../components/BotaoVermelho';
import { gravarItensCarrinhoNoBanco, buscarItensCarrinhoNoBanco } from '../../controle/CarrinhoStorage';
import api from '../../services/api';
import CorTamanho from '../../components/CorTamanho';
import GradeAtacado from '../../components/GradeAtacado';

const ListaCarrinho = ({ route, navigation }) => {
    let codmer;
    const codbar = route.params?.codbar;
    const item = route.params?.mer;

    //Valor vindo do card(ListProdutos), ficará errado se tiver variação de preço por cor/tamanho
    const valor = route.params?.valor;

    const [quantidade, setQuantidade] = useState();
    const [valorItem, setValorItem] = useState(valor);
    const [buscaDetalhes, setBuscaDetalhes] = useState([]);
    const [data, setData] = useState();
    const [cor, setCor] = useState();
    const [tamanho, setTamanho] = useState();
    const [itensCarrinho, setItensCarrinho] = useState();
    const [foto, setFoto] = useState();

    // useEffect(() => {
    //     getListarDetalhes()
    // }, [codbar])

    useEffect(() => {
    }, [data, foto])

    useEffect(() => {
        navigation.addListener('focus', () => {
            getListarDetalhes()
        });
    }, [navigation]);

    useEffect(() => {

    }, [quantidade, valorItem])

    async function getListarDetalhes() {
        const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
        var prod = response.data.detalhes.map(item => [item.codigo, item.codbar, item.valor])
        setData(response.data)
        try {
            setFoto(response.data.fotos[0].linkfot);
        } catch (error) {
            console.log(error)
        }
    }

    const salvaPedido = () => {
        gravarItensCarrinhoNoBanco(itensCarrinho).then(resultado => {
            Alert.alert('Sucesso', 'Foi adicionado ao carrinho', [{ text: 'OK' }]);
            navigation.pop();
        });
        // if (quantidade == undefined) {
        //     Alert.alert('Quantidade vazia', 'Faltou informar a quantidade');
        // }else if(codmer == undefined) {
        //     Alert.alert('Erro ao adicionar item', 'Não existe cadastro desse produto com cor ' + cor + ' e tamanho ' + tamanho + ', favor entrar em contato com a fabrica.');
        // }else{
        //     let itens = { codmer: codmer, quantidade: quantidade, item: item, valor: valorItem, cor: cor, tamanho: tamanho };
        // gravarItensCarrinhoNoBanco(itens).then(resultado => {
        //     Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
        //     navigation.pop();
        // });
        // }
    };

    function fotoProduto(link) {
        if (link != undefined) {
            return <View style={{ width: '100%', paddingTop: '70%', marginTop: 20 }}>
                <Image
                    style={{ position: 'absolute', left: 0, bottom: 0, right: 0, top: 0, resizeMode: 'contain' }}
                    source={{
                        uri: 'https://' + link
                    }}
                />
            </View>
        } else {
            return <View style={{ width: '100%', paddingTop: '70%', marginTop: 20 }}>
                <Image
                    style={{ position: 'absolute', left: 0, bottom: 0, right: 0, top: 0, resizeMode: 'contain' }}
                    source={{
                        uri: 'https://imagizer.imageshack.com/v2/730x450q90/924/qNmIzQ.jpg'
                    }}
                />
            </View>
        }
    }

    return (
        <View id={codmer} style={styles.container}>
            {fotoProduto(foto)}
            <ScrollView>
                <Text style={{alignSelf: 'center'}}> {codbar} </Text>
                <Text style={styles.item}>{item}</Text>
                {/* Cor e tamanho para varejo
                <CorTamanho codbar={codbar} setCor={setCor} setTamanho={setTamanho}/> */}
                <Text style={styles.text}>Valor R$:</Text>
                <Text style={styles.textinput}>{valor}</Text>
                <Text></Text>
                <GradeAtacado codbar={codbar} item={item} setItensCarrinho={setItensCarrinho} />
                {/* <TextInput
                    style={styles.textinput}
                    keyboardType="numeric"
                    placeholder="Valor do produto"
                    onChangeText={value => setValorItem(value.replace(',', '.'))}>
                    {valor.toFixed(2).replace('.', ',')}
                </TextInput> */}
                <BotaoVermelho
                    text={
                        'Adicionar '
                        // +
                        // (
                        //     Number.parseFloat(valorItem).toPrecision(7) *
                        //     Number.parseInt(quantidade ? quantidade : 1)
                        // ).toFixed(2)
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
        borderBottomWidth: 1,
        width: '90%'
    },
    texto: {
        color: '#000000',
        alignSelf: 'center',
    },
    listItem: {
        flex: 1,
        flexDirection: 'column',
        color: 'red',
    },
    picker: {
        width: '50%'
    },
});

export default ListaCarrinho;