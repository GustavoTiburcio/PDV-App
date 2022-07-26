/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Dimensions, Text, Alert, Image, View, TextInput, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import CorTamanho from '../../components/CorTamanho';
import GradeAtacado from '../../components/GradeAtacado';
import { gravarItensCarrinhoUsaGrade, gravarItensCarrinho } from '../../controle/CarrinhoStorage';
import { buscarUsaCorTamanho, buscarUsaGrade, buscarEstoquePorCategoria, buscarUsaControleEstoque } from '../../controle/ConfigStorage';
import { buscarLogin } from '../../controle/LoginStorage';
import Slider from '../../components/Slider';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get("window");

const ListaCarrinho = ({ route, navigation }) => {
    let codmer;
    const codbar = route.params?.codbar;
    const item = route.params?.mer;

    //Valor vindo do card(ListProdutos), ficará errado se tiver variação de preço por cor/tamanho
    const valor = route.params?.valor;

    const [quantidade, setQuantidade] = useState();
    const [valorItem, setValorItem] = useState(valor);
    const [data, setData] = useState();
    const [cor, setCor] = useState();
    const [tamanho, setTamanho] = useState();
    const [itensCarrinho, setItensCarrinho] = useState();
    const [fotos, setFotos] = useState([]);
    const [codigoProd, setCodigoProd] = useState();
    const [obs, setObs] = useState('');

    //configs
    const [usaCorTamanho, setUsaCorTamanho] = useState(false);
    const [usaGrade, setUsaGrade] = useState(false);
    const [usaControleEstoque, setUsaControleEstoque] = useState(false)
    const [usaEstoquePorCategoria, setUsaEstoquePorCategoria] = useState(false);

    //login
    const [dadosLogin, setDadosLogin] = useState();

    useEffect(() => {
    }, [data, fotos])

    useEffect(() => {
        navigation.addListener('focus', () => {
            getListarDetalhes();
            getConfig();
        });
    }, [navigation]);

    useEffect(() => {

    }, [quantidade, valorItem])

    async function getListarDetalhes() {
        const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
        let prod = response.data.detalhes.map(item => [item.codigo, item.codbar, item.valor])
        let fotos = response.data.fotos.map(fotos => { return { linkfot: fotos.linkfot } })
        // console.log(response.data)
        setCodigoProd(prod[0][0])
        setData(response.data)
        setFotos(fotos);
    }

    async function getConfig() {
        buscarUsaCorTamanho().then(result => {
            setUsaCorTamanho(JSON.parse(result))
        })
        buscarUsaGrade().then(result => {
            setUsaGrade(JSON.parse(result))
        })
        buscarEstoquePorCategoria().then(result => {
            setUsaEstoquePorCategoria(JSON.parse(result))
        })
        buscarLogin().then(result => {
            setDadosLogin(result)
        })
        buscarUsaControleEstoque().then(result => {
            setUsaControleEstoque(JSON.parse(result))
        })
    }

    const addItemCarrinho = () => {
        if (usaGrade) {
            gravarItensCarrinhoUsaGrade(itensCarrinho).then(resultado => {
                Alert.alert('Sucesso', 'Foi adicionado ao carrinho', [{ text: 'OK' }]);
                navigation.pop();
            })
        } else if (usaCorTamanho) {
            console.log('usa cor e tamanho varejo');
            Alert.alert('Opção em construção')
            return
        } else {
            let itens = { codmer: codigoProd, quantidade: quantidade, item: item, valor: valorItem, obs: obs };
            if (quantidade == undefined) {
                Alert.alert('Quantidade vazia', 'Faltou informar a quantidade');
            } else {
                //Verificação de estoque por categoria, Exemplo de cliente que utiliza: Gold chaves
                if (usaEstoquePorCategoria) {
                    switch (dadosLogin.codcat) {
                        case null:
                            Alert.alert('Usuário sem categoria', 'Favor contatar o suporte para colocar categoria no app_user representante')
                            break;
                        case 1:
                            if (quantidade > data.estest1 || data.estest1 == null) {
                                Alert.alert('Quantidade inválida', 'Estoque atual: ' + data.estest1 + ' Unidades')
                            } else {
                                let itens = { codmer: codigoProd, quantidade: quantidade, item: item, valor: valorItem };
                                gravarItensCarrinho(itens).then(resultado => {
                                    Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
                                    navigation.pop();
                                });
                            }
                            break;
                        case 2:
                            if (quantidade > data.estest2 || data.estest2 == null) {
                                Alert.alert('Quantidade inválida', 'Estoque atual: ' + data.estest2 + ' Unidades')
                            } else {
                                let itens = { codmer: codigoProd, quantidade: quantidade, item: item, valor: valorItem };
                                gravarItensCarrinho(itens).then(resultado => {
                                    Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
                                    navigation.pop();
                                });
                            }
                            break;
                        case 3:
                            if (quantidade > data.estest3 || data.estest3 == null) {
                                Alert.alert('Quantidade inválida', 'Estoque atual: ' + data.estest3 + ' Unidades')
                            } else {
                                let itens = { codmer: codigoProd, quantidade: quantidade, item: item, valor: valorItem };
                                gravarItensCarrinho(itens).then(resultado => {
                                    Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
                                    navigation.pop();
                                });
                            }
                            break;
                        case 4:
                            if (quantidade > data.estest4 || data.estest4 == null) {
                                Alert.alert('Quantidade inválida', 'Estoque atual: ' + data.estest4 + ' Unidades')
                            } else {
                                let itens = { codmer: codigoProd, quantidade: quantidade, item: item, valor: valorItem };
                                gravarItensCarrinho(itens).then(resultado => {
                                    Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
                                    navigation.pop();
                                });
                            }
                            break;
                        case 5:
                            if (quantidade > data.estest5 || data.estest5 == null) {
                                Alert.alert('Quantidade inválida', 'Estoque atual: ' + data.estest5 + ' Unidades')
                            } else {
                                let itens = { codmer: codigoProd, quantidade: quantidade, item: item, valor: valorItem };
                                gravarItensCarrinho(itens).then(resultado => {
                                    Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
                                    navigation.pop();
                                });
                            }
                            break;
                        default:
                            break;
                    }
                } else {
                    if (usaControleEstoque && data.detalhes[0].estoque >= quantidade) {
                        gravarItensCarrinho(itens).then(resultado => {
                            Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
                            navigation.pop();
                        })
                    } else {
                        Alert.alert('Estoque insuficiente', 'Estoque atual: ' + data.detalhes[0].estoque)
                    }
                }
            }
        }
        // if (quantidade == undefined) {
        //     Alert.alert('Quantidade vazia', 'Faltou informar a quantidade');
        // }else if(codmer == undefined) {
        //     Alert.alert('Erro ao adicionar item', 'Não existe cadastro desse produto com cor ' + cor + ' e tamanho ' + tamanho + ', favor entrar em contato com a fabrica.');
        // }else{
        //     let itens = { codmer: codmer, quantidade: quantidade, item: item, valor: valorItem, cor: cor, tamanho: tamanho };
        // gravarItensCarrinho(itens).then(resultado => {
        //     Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
        //     navigation.pop();
        // });
        // }
    };

    return (
        <View style={styles.container}>
            {fotos.length > 0 ?
                <Slider fotos={fotos} /> :
                <View style={{ alignSelf: 'center', width, height: '35%', }}>
                    <LottieView
                        source={require('../assets/camera.json')}
                        autoPlay={true}
                        loop={true}
                        style={{
                            width, height: '100%',
                            resizeMode: 'contain',
                            alignSelf: 'center'
                        }}
                    />
                </View>}
            <View style={styles.fields}>
                <Text style={{ alignSelf: 'center' }}> {codbar} </Text>
                <Text style={styles.item}>{item}</Text>
                {usaCorTamanho === false && usaGrade === false ?
                    <View>
                        <Text style={styles.text}>Quantidade:</Text>
                        <TextInput
                            style={styles.textinput}
                            keyboardType="numeric"
                            autoFocus={true}
                            placeholder="Informe a quantidade"
                            onChangeText={value => setQuantidade(value)}>
                            {quantidade}
                        </TextInput>
                        <Text style={styles.text}>Valor R$:</Text>
                        <TextInput
                            style={styles.textinput}
                            keyboardType="numeric"
                            placeholder="Valor do produto"
                            onChangeText={value => setValorItem(value.replace(',', '.'))}>
                            {valor.toFixed(2).replace('.', ',')}
                        </TextInput>
                        <Text style={styles.text}>Observação:</Text>
                        <TextInput
                            style={styles.textinput}
                            placeholder="Obs"
                            multiline={true}
                            onChangeText={value => setObs(value)}>
                            {obs}
                        </TextInput>
                    </View>
                    : null
                }
                {usaGrade ?
                    <View style={{ marginTop: '5%' }}>
                        <Text style={styles.text}>Valor R$:</Text>
                        <Text style={styles.textinput}>{valor}</Text>
                        <Text />
                        <GradeAtacado codbar={codbar} item={item} setItensCarrinho={setItensCarrinho} />
                        <TouchableOpacity
                            style={styles.AdicionarButton}
                            activeOpacity={0.5}
                            onPress={() => { addItemCarrinho() }}>
                            <Text style={styles.TextButton}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                    : null
                }
                {usaCorTamanho ?
                    <View>
                        <Text style={styles.text}>Valor R$:</Text>
                        <Text style={styles.textinput}>{valor}</Text>
                        <Text style={styles.text}>Quantidade:</Text>
                        <TextInput
                            style={styles.textinput}
                            keyboardType="numeric"
                            autoFocus={true}
                            placeholder="Informe a quantidade"
                            onChangeText={value => setQuantidade(value)}>
                            {quantidade}
                        </TextInput>
                        <CorTamanho codbar={codbar} setCor={setCor} setTamanho={setTamanho} />
                        <View>
                            <TouchableOpacity
                                style={styles.AdicionarButton}
                                activeOpacity={0.5}
                                onPress={() => { addItemCarrinho() }}>
                                <Text style={styles.TextButton}>Adicionar {Number.parseFloat(valorItem).toPrecision(7) * Number.parseInt(quantidade ? quantidade : 1).toFixed(2)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    : null
                }
                {usaCorTamanho === false && usaGrade === false || usaCorTamanho === undefined && usaGrade === undefined ?
                    <View>
                        <TouchableOpacity
                            style={styles.AdicionarButton}
                            activeOpacity={0.5}
                            onPress={() => { addItemCarrinho() }}>
                            <Text style={styles.TextButton}>Adicionar {(valorItem * (quantidade ? quantidade : 0)).toFixed(2).replace('.', ',')}</Text>
                        </TouchableOpacity>
                    </View> : null}
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    textcadastro: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    fields: {
        marginLeft: 20,
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
    AdicionarButton: {
        marginTop: 20,
        height: 50,
        marginHorizontal: '20%',
        padding: 15,
        borderRadius: 25,
        borderWidth: 0,
        marginBottom: 15,
        backgroundColor: '#38A69D',
    },
    TextButton: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
    },
});

export default ListaCarrinho;