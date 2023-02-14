import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { buscarItensCarrinhoNoBanco, deletarItenCarrinhoNoBanco } from '../controle/CarrinhoStorage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Col, Row, Grid } from 'react-native-easy-grid';
import LottieView from 'lottie-react-native';
import { ConvertNumberParaReais } from '../utils/ConvertNumberParaReais';

const { width } = Dimensions.get("window");

function Carrinho({ route, navigation }) {
    const [itensCarrinho, setItensCarrinho] = useState();
    const [valorBruto, setValorBruto] = useState(0);

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
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <ScrollView style={styles.scrollContainer}>
                {itensCarrinho != null ?
                    <View>
                        <View style={styles.cabeçalho}>
                            <TouchableOpacity style={styles.dottedLine} />
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
                            <TouchableOpacity style={styles.dottedLine} />
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
                                                <Text>{ConvertNumberParaReais(itemCar.valor)}</Text>
                                            </Row>
                                        </Col>
                                        <Col size={40}>
                                            <Row style={styles.cell}>
                                                <Text>{ConvertNumberParaReais(itemCar.valor * itemCar.quantidade)}</Text>
                                            </Row>
                                        </Col>
                                        <Col size={15}>
                                            <Row style={styles.cell}>
                                                <TouchableOpacity onPress={() => deleteClick(itemCar)}>
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
                        <View style={styles.totalPedidoView}>
                            <Text style={styles.textValorPedido}> Valor Total: </Text>
                            <Text style={styles.valorTotalPedido}>{ConvertNumberParaReais(valorBruto)}</Text>
                        </View>
                        <View style={{ width: '100%' }}>
                            <TouchableOpacity onPress={() => { navigation.navigate('FinalizarCarrinho') }} style={{ padding: 15, marginTop: '5%', width: '100%', backgroundColor: '#38A69D' }}>
                                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold', textAlignVertical: 'center' }}>Continuar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    : <View style={{ backgroundColor: '#FFF' }}>
                        <View style={{ alignItems: 'center', marginTop: '40%', width, height: '50%', }}>
                            <LottieView
                                source={require('../images/carrinhovazio.json')}
                                autoPlay={true}
                                loop={true}
                                style={{
                                    width, height: '100%',
                                    alignSelf: 'center'
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
        fontSize: 20,
        color: "#000000",
        fontWeight: "bold",
    },

    valorTotalPedido: {
        fontSize: 20,
        color: "#000000",
        fontWeight: "bold",
        marginRight:10,
    },
    totalPedidoView: {
        width: '100%',
        paddingTop:15,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
});
export default Carrinho;