/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity, ScrollView, TextInput, Image, Alert, Dimensions } from 'react-native';
import BotaoVermelho from '../components/BotaoVermelho';
import { buscarItensCarrinhoNoBanco, limparItensCarrinhoNoBanco, deletarItenCarrinhoNoBanco, buscarCodVenBanco } from '../controle/CarrinhoStorage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { postPedido } from '../services/requisicaoInserePedido';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { PrintPDF } from '../components/printPDF';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get("window");

const Carrinho = ({ route, navigation }) => {
    var date = new Date();
    var dathor = date.toISOString();

    const [itensCarrinho, setItensCarrinho] = useState();
    const [valorBruto, setValorBruto] = useState(0);
    const [nomRep, setNomRep] = useState('');
    const [codcat, setCodCat] = useState();
    const [dadosCliente, setDadosCliente] = useState({});
    const [dadosLogin, setDadosLogin] = useState({});

    async function getLoginData() {
        try {
            const jsonValue = await AsyncStorage.getItem('@login_data')
            setDadosLogin(JSON.parse(jsonValue));
        } catch (e) {
            console.log('Erro ao ler login')
        }
    }

    async function deleteClick(mer) {
        if (mer != null) {
            await deletarItenCarrinhoNoBanco(mer);
            buscarItens();
        }
    }
    async function buscarItens() {
        await buscarItensCarrinhoNoBanco().then(resultado => {
            if ((resultado != null) && (resultado !== [])) {
                const setValorBrutoInicial = () => resultado.reduce(
                    (valorAnterior, item) =>
                        valorAnterior + (item.valor * item.quantidade),
                    0,
                );
                setValorBruto(setValorBrutoInicial);
            }
            setItensCarrinho(resultado);
        });
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            buscarItens();
            getLoginData();
        });
    }, [navigation]);

    useEffect(() => {
        setNomRep(dadosLogin.username)
        setCodCat(dadosLogin.codcat)
    }, [dadosLogin])

    useEffect(() => {
        if (route.params?.cliente) {
            setDadosCliente(route.params?.cliente)
        }
    }, [route.params?.cliente])

    function enviaPedido() {
        if (dadosCliente == null) {
            Alert.alert("Atenção", "Favor selecionar o cliente da venda");
        } else {
            const appuser = { id: dadosCliente.id };
            const itensPedido = itensCarrinho.map((iten) => {
                return { obs: iten.obs, qua: iten.quantidade, valuni: iten.valor, mercador: { cod: iten.codmer, mer: iten.item } };
            });
            const ped = JSON.stringify({
                cod: '', codcat: codcat, dathor: dathor, forpag: 'À vista', nomrep: nomRep, obs: null, sta: 'Pagamento Futuro', traredcgc: '', traredend: '', traredfon: '',
                trarednom: '', valdes: 0, appuser, itensPedido
            })
            postPedido(ped).then(resultado => {
                if (resultado) {
                    limparItensCarrinhoNoBanco().then(result => {
                        Alert.alert(
                            "Venda finalizada",
                            "Deseja imprimir?",
                            [
                                {
                                    text: "Sim",
                                    onPress: () => {
                                        PrintPDF(itensCarrinho, dadosCliente, valorBruto, resultado.cod, nomRep)
                                    },
                                },
                                {
                                    text: "Não",
                                },
                            ]
                        );
                        setItensCarrinho(null);
                        setValorBruto(0);
                        setDadosCliente({});
                        navigation.navigate('ListProdutos');
                    });
                }
            }, rejeted => {
                Alert.alert('Erro ao salvar')
                console.log(rejeted)
            })
        };
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Text style={styles.title}>Carrinho</Text>
            <ScrollView style={styles.scrollContainer}>
                {itensCarrinho != null ?
                    <View>
                        <View style={styles.cabeçalho}>
                            <TouchableOpacity
                                style={styles.dottedLine}
                            >
                            </TouchableOpacity>
                            <Grid>
                                <Col size={15}>
                                    <Row style={styles.cellCabeçalho}>
                                        <Text>Qtde</Text>
                                    </Row>
                                </Col>
                                <Col size={35}>
                                    <Row style={styles.cellCabeçalho}>
                                        <Text>Vlr Uni</Text>
                                    </Row>
                                </Col>
                                <Col size={40}>
                                    <Row style={styles.cellCabeçalho}>
                                        <Text>Vlr Total</Text>
                                    </Row>
                                </Col>
                                <Col size={15}>
                                    <Row style={styles.cellCabeçalho}>
                                        <Text></Text>
                                    </Row>
                                </Col>
                            </Grid>
                            <TouchableOpacity
                                style={styles.dottedLine}
                            >
                            </TouchableOpacity>
                        </View>
                        {itensCarrinho.map((itemCar, key) => {
                            return (
                                <View key={key} style={styles.container}>
                                    <Text style={styles.textItem}>{itemCar.item} {itemCar.cor} {itemCar.tamanho}</Text>
                                    {itemCar.obs ? <Text style={styles.textObsItem}>{itemCar.obs}</Text> : null}
                                    <Grid>
                                        <Col size={15}>
                                            <Row style={styles.cell}>
                                                <Text>{itemCar.quantidade}</Text>
                                            </Row>
                                        </Col>
                                        <Col size={35}>
                                            <Row style={styles.cell}>
                                                <Text>R$ {Number.parseFloat(itemCar.valor).toFixed(2).replace('.', ',')}</Text>
                                            </Row>
                                        </Col>
                                        <Col size={40}>
                                            <Row style={styles.cell}>
                                                <Text>R$ {Number.parseFloat(itemCar.valor * itemCar.quantidade).toFixed(2).replace('.', ',')}</Text>
                                            </Row>
                                        </Col>
                                        <Col size={15}>
                                            <Row style={styles.cell}>
                                                <TouchableOpacity onPress={() => deleteClick(itemCar)} style={styles.deleteButton}>
                                                    <Ionicons
                                                        name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                                                        size={23}
                                                        color="red"
                                                    />
                                                </TouchableOpacity>
                                            </Row>
                                        </Col>
                                    </Grid>
                                </View>
                            )
                        })}
                        <View flexDirection="row">
                            <Text style={styles.textValorPedido}> Valor Total: </Text>
                            <Text style={styles.valorTotalPedido}>R$ {valorBruto.toFixed(2).replace('.', ',')}</Text>
                        </View>
                        <Text style={{ fontSize: 16 }}>Cliente: {dadosCliente !== null ? <Text>{dadosCliente.raz} - {dadosCliente.fan}</Text> : null}</Text>
                        <View flexDirection="row">
                            <View>
                                <TouchableOpacity
                                    style={styles.Clientes}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        navigation.navigate('Clientes');
                                    }}>
                                    <Text style={styles.TextButton}>Selecionar Cliente</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={styles.NovoCliente}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        navigation.navigate('CadastroCliente');
                                    }}>
                                    <Text style={styles.TextButton}>Novo cliente</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <BotaoVermelho
                            text={`Finalizar Venda`}
                            onPress={() => enviaPedido()}
                        />
                    </View>
                    : <View style={{ backgroundColor: '#FFF' }}>
                        <View style={{ alignItems: 'center', marginTop: '40%', width, height: '50%', }}>
                            <LottieView
                                source={require('../images/carrinhovazio.json')}
                                autoPlay={true}
                                loop={true}
                                style={{
                                    width, height: '100%',
                                    alignSelf: 'center',
                                }}
                            />
                            <Text style={{ textAlign: 'center', fontSize: 24 }}>Carrinho vazio...</Text>
                        </View>
                    </View>
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
    },
    cabeçalho: {
        padding: 10,
        justifyContent: 'space-between'
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        color: '#000000',
        paddingTop: 10
    },
    dottedLine: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderColor: 'black',
        borderStyle: 'dotted',
        borderWidth: 2,
        borderRadius: 1,
        position: 'relative',
    },
    itenWiew: {
        flexDirection: 'row',
    },
    textItem: {
        width: '85%',
        fontSize: 17,
        color: "#000000",
        fontWeight: "bold",
        textAlignVertical: "center",
        alignSelf: "center",
    },
    textObsItem: {
        width: '85%',
        fontSize: 15,
        color: "#000000",
        textAlignVertical: "center",
        alignSelf: "center",
    },
    textQuantidade: {
        width: '30%',
        padding: 1,
        fontSize: 17,
        color: "#000000",
        fontWeight: "bold",
        textAlignVertical: "center",
        alignSelf: "flex-start",
        alignItems: 'flex-start',
    },
    cell: {
        borderWidth: 1,
        borderColor: '#000',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    cellCabeçalho: {
        borderWidth: 0,
        borderColor: '#000',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    valorItem: {
        fontSize: 17,
        color: "#000000",
        fontWeight: "bold",
        borderRadius: 40,
        padding: 3,
        textAlign: "right",
        alignSelf: "center",
        width: '30%',
        alignItems: 'center',

    },

    valorTotalItem: {
        fontSize: 17,
        color: "#000000",
        fontWeight: "bold",
        borderRadius: 40,
        padding: 3,
        textAlign: "right",
        alignSelf: "flex-end",
        width: '40%',
        alignItems: 'flex-end',

    },
    textCliente: {
        width: '20%',
        fontSize: 20,
        color: "#000000",
        fontWeight: "bold",
        alignSelf: "flex-start",
        alignItems: 'flex-start',
    },
    textinput: {
        paddingTop: 10,
        width: '80%',
        fontSize: 20,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        textAlignVertical: "center",
        alignSelf: "center",
        alignItems: "flex-end"
    },
    textValorPedido: {
        paddingTop: 11,
        width: '50%',
        fontSize: 20,
        color: "#000000",
        fontWeight: "bold",
        alignSelf: "flex-start",
        alignItems: 'flex-start',
    },

    valorTotalPedido: {
        fontSize: 17,
        color: "#000000",
        fontWeight: "bold",
        borderRadius: 40,
        padding: 3,
        textAlign: "right",
        alignSelf: "flex-end",
        width: '48%',
        alignItems: 'flex-end',

    },

    semItem: {
        padding: 40,
        fontSize: 20,
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#004400",
    },
    deleteButton: {
        marginRight: 1,
        paddingLeft: 20,
        alignSelf: "center",
        alignItems: 'flex-start',

    },
    textCarinhoVazio: {
        paddingTop: 20,
        width: '100%',
        fontSize: 20,
        color: "#000000",
        fontWeight: "bold",
        alignSelf: "center",
        alignItems: "center",
        textAlign: "center"
    },
    textCabeçalhoCarrinho: {
        width: '40%',
        padding: 1,
        fontSize: 17,
        color: "#000000",
        fontWeight: "bold",
        textAlignVertical: "center",
        alignSelf: "flex-start",
        alignItems: 'flex-start',
    },
    Clientes: {
        marginTop: 25,
        height: 50,
        width: 160,
        padding: 15,
        borderRadius: 25,
        borderWidth: 0,
        marginBottom: 15,
        marginHorizontal: 30,
        backgroundColor: '#38A69D',
    },
    NovoCliente: {
        marginTop: 25,
        width: 160,
        height: 50,
        padding: 15,
        borderRadius: 25,
        borderWidth: 0,
        marginBottom: 15,
        backgroundColor: '#36c75c',
    },
    TextButton: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center'
    }
});
export default Carrinho;