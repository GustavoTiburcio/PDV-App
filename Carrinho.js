/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity, ScrollView, TextInput, Image, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import BotaoVermelho from './components/BotaoVermelho';
import { buscarItensCarrinhoNoBanco, limparItensCarrinhoNoBanco, deletarItenCarrinhoNoBanco, buscarCodVenBanco } from './controle/CarrinhoStorage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { postPedido, putAlterarPedido } from './services/requisicaoInserePedido';
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import { Col, Row, Grid } from 'react-native-easy-grid';
import LottieView from 'lottie-react-native';


const Carrinho = ({ route, navigation }) => {
    const codven = route.params?.codven;
    const dadosPed = route.params?.dadosPed;
    const raz = route.params?.raz;

    var date = new Date();
    var dathor = date.toISOString();

    const [itensCarrinho, setItensCarrinho] = useState();
    const [valorBruto, setValorBruto] = useState(0);
    const [nomRep, setNomRep] = useState('');
    const [codcat, setCodCat] = useState();
    const [dadosCliente, setDadosCliente] = useState({});
    const [dadosLogin, setDadosLogin] = useState({});
    const [valDes, setValDes] = useState('0');
    const [porDes, setPorDes] = useState('0');
    const [obs, setObs] = useState('');
    const [loading, setLoading] = useState(false);
    const [editando, setEditando] = useState(false);
    const [codVenda, setCodVenda] = useState('');
    const [refresh, setRefresh] = useState('');

    async function getLoginData() {
        try {
            const jsonValue = await AsyncStorage.getItem('@login_data')
            setDadosLogin(JSON.parse(jsonValue));
        } catch (e) {
            console.log('Erro ao ler login')
        }
    }
    async function getClienteData() {
        try {
            const clientedados = await AsyncStorage.getItem('@Cliente_data')
            setDadosCliente(JSON.parse(clientedados))
            //console.log('Pegou dados cliente: ' + clientedados)
        } catch (e) {
            console.log('Erro ao pegar dados do cliente')
        }
    }

    async function buscaDadosClienteESalvaStore(raz) {
        const response = await api.get(`/usuarios/pesquisar?page=0&pesquisa=${raz}`)
        try {
            await AsyncStorage.removeItem('@Cliente_data');
            const jsonValue = JSON.stringify(response.data.content[0])
            await AsyncStorage.setItem('@Cliente_data', jsonValue)
            setDadosCliente(response.data.content[0])
            setRefresh('')
        } catch (e) {
            console.log('erro ao salvar informações de Cliente' + e)
        }
    }

    //Gera GUID
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
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

    async function removeClienteValue(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    useEffect(() => {
        if (codven != undefined) {
            buscaDadosClienteESalvaStore(raz)
            setObs(dadosPed.obs)
            setValDes((dadosPed.valdes).toString())
            setEditando(true)
            setCodVenda(codven)
        }
        
    }, [codven]);

    // useEffect(() => {
    //     navigation.addListener('focus', () => {
    //         buscarItens();
    //         getClienteData();
    //     });
    // }, [navigation]);

    // useEffect(() => {
    //     getLoginData();
    // }, [])

    useEffect(() => {
        
    }, [dadosCliente, refresh])

    useFocusEffect(
        React.useCallback(() => {
            getClienteData();
            buscarItens();
            getLoginData();
            
            //alert('Screen was focused');
            return () => {
                //alert('Screen was unfocused');
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    useEffect(() => {
        
        setNomRep(dadosLogin.username)
        setCodCat(dadosLogin.codcat)
    }, [getLoginData])

    function enviaPedido() {

        function CalculaValorDesconto() {
            let valorDesconto = parseFloat(valorBruto / 100 * porDes) + parseFloat(valDes);
            if (isNaN(valorDesconto)) {
                return 0;
            }
            return valorDesconto;
        }

        if (dadosCliente == null) {
            Alert.alert("Atenção", "Favor selecionar o cliente da venda");
        } else {
            const appuser = { id: dadosCliente.id };
            const itensPedido = itensCarrinho.map((iten) => {
                return { qua: iten.quantidade, valuni: iten.valor, mercador: { cod: iten.codmer, mer: iten.item } };
            });
            const ped = JSON.stringify({
                cod: '', codcat: codcat, dathor: dathor, forpag: 'À vista', nomrep: nomRep, obs: obs, sta: 'Pagamento Futuro', traredcgc: '', traredend: '', traredfon: '',
                trarednom: '', valdes: CalculaValorDesconto(), appuser, itensPedido
            })
            console.log('PostPedido: ')
            console.log(ped)
            setLoading(true)
            postPedido(ped).then(resultado => {
                console.log('resultado')
                console.log(resultado)
                function currencyFormat(num) {
                    return num.toFixed(2);
                }

                var PrintItems = itensPedido.map(function (item) {
                    return `<tr>
                <td style={{ fontSize: "44px" , maxWidth:"145px"}}>
                    <b>${item.mercador.mer}</b>
                </td>
                <td style={{ fontSize: "44px" , maxWidth:"20px"}} >
                    <b>${item.qua}</b>
                </td>
                <td style={{ fontSize: "44px" , maxWidth:"60px" }}>
                    <b>${currencyFormat(item.valuni).replace('.', ',')}</b>
                </td>
                <td style={{ fontSize: "44px" , maxWidth:"80px" }}>
                    <b>${currencyFormat(item.valuni * item.qua).replace('.', ',')}</b>
                </td>
                </tr>`;
                });

                function quantidadeTotal() {
                    try {
                        var soma = 0;
                        for (let i = 0; i < itensPedido.length; i++) {
                            soma += parseInt(itensPedido[i].qua);
                        }
                        return soma.toFixed(2).replace('.', ',');
                    } catch (error) {
                        console.log(error.message)
                    }
                }

                const htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Pdf Content</title>
                        <style>
                            body {
                                color: #000000;
                            }
                            p {
                            font-family: "Didot", "Times New Roman";
                            font-size: 44px;
                            margin: 0;
                            }
                            table {
                            border-collapse: collapse;
                            width: 100%;
                            }
                            th, td {
                            text-align: left;
                            padding: 8px;
                            font-family: "Didot", "Times New Roman";
                            font-size: 44px;
                            }
                            tr:nth-child(even) {
                            background-color: #f2f2f2;
                            margin-bottom:0px
                            }
                            div.small{
                            
                            }
                        </style>
                    </head>
                    <body>
                    <div class="small">
                    </br>
                    </br>
                        <p></p>
                        <p align="right"><b>Venda ${resultado.cod}</b></p>
                        </br>
                        <p align="center"><b>GOLD CHAVES ACESSORIOS LTDA</b></p>
                        </br>
                        <p align="center"><b>Av. Brasil, 2796 - LOJA 03 - CENTRO, Maringá - PR, 87013-000</b></p>
                        <p align="center"><b>(44) 3227-5493</b></p>
                        </br>
                        </br>
                        <div>
                        <p><b>Data: ${date.toLocaleDateString()}</b></p>
                        <p><b>Vendedor: ${nomRep}</b></p>
                        <p><b>Razão Social:</b><b> ${dadosCliente.raz}</b></p>
                        <p><b>CPF/CNPJ: ${dadosCliente.cgc}</b><b> Telefone: ${dadosCliente.fon}</b></p>
                        <p><b>Email: ${dadosCliente.ema}</b></p>
                        <p><b> Endereço: ${dadosCliente.log + ', ' + dadosCliente.num}</b></p>
                        <p><b>Bairro: ${dadosCliente.bai}</b><b> Cidade: ${dadosCliente.cid + ' - ' + dadosCliente.uf}</b></p>
                        <p><b>Obs: ${obs}</b></p>
                        </div>
                        <table>
                                                <thead>
                                                    <tr>
                                                        <th>Descricao</th>
                                                        <th>Qtd</th>
                                                        <th>Vlr</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                ${PrintItems}
                                                </tbody>
                        </table>
                        </div>
                        </br>
                        <p style="text-align:right"><b>Qtd Total: ${quantidadeTotal()} Uni</b></p>
                        <p style="text-align:right"><b>Total Bruto: R$ ${valorBruto.toFixed(2).replace('.', ',')}</b></p>
                        <p style="text-align:right"><b>Total Desconto: R$ ${(parseFloat(valorBruto / 100 * porDes) + parseFloat(valDes)).toFixed(2).replace('.', ',')}</b></p>
                        <p style="text-align:right"><b>Total Líquido: R$ ${((valorBruto - valorBruto / 100 * porDes) - valDes).toFixed(2).replace('.', ',')}</b></p>
                        </br>
                        </br>
                        </br>
                        </br>
                        </br>
                        </br>
                        <p style="text-align:center"><b>_______________________________________________</b></p>
                        <p style="text-align:center"><b>${dadosCliente.raz}</b></p>
                    </body>
                    </html>
                `;
                const createAndPrintPDF = async () => {
                    try {
                        const { uri } = await Print.printToFileAsync({
                            html: htmlContent,
                            width: 1000, height: 1500
                        });
                        console.log(uri)
                        await Print.printAsync({
                            uri: uri
                        })
                    } catch (error) {
                        console.error(error);
                    }
                };
                if (resultado != "erro ao salvar pedido") {
                    setLoading(false)
                    limparItensCarrinhoNoBanco().then(resultado => {
                        setItensCarrinho(null);
                        setValorBruto(0);
                        setObs('');
                        setValDes('0');
                        setPorDes('0');
                        removeClienteValue('@Cliente_data');
                        navigation.navigate('AppListProdutos');
                        Alert.alert(
                            "Venda finalizada",
                            "Deseja imprimir?",
                            [
                                {
                                    text: "Sim",
                                    onPress: () => {
                                        createAndPrintPDF()
                                    },
                                },
                                {
                                    text: "Não",
                                },
                            ]
                        );
                    });
                }
            }, reject => {
                setLoading(false)
                console.log(reject)
            })
        };
    }
    function AlteraPedido() {

        function CalculaValorDesconto() {
            let valorDesconto = parseFloat(valorBruto / 100 * porDes) + parseFloat(valDes);
            if (isNaN(valorDesconto)) {
                return 0;
            }
            return valorDesconto;
        }

        if (dadosCliente == null) {
            Alert.alert("Atenção", "Favor selecionar o cliente da venda");
        } else {
            const appuser = { id: dadosCliente.id };
            const itensPedido = itensCarrinho.map((iten) => {
                return { qua: iten.quantidade, valuni: iten.valor, mercador: { cod: iten.codmer, mer: iten.item } };
            });
            const ped = JSON.stringify({
                cod: codVenda, codcat: codcat, dathor: dathor, forpag: 'À vista', nomrep: nomRep, obs: obs, sta: 'Pagamento Futuro', traredcgc: '', traredend: '', traredfon: '',
                trarednom: '', valdes: CalculaValorDesconto(), appuser, itensPedido
            })
            console.log('PutPedido: ')
            console.log(ped)
            setLoading(true)
            putAlterarPedido(ped).then(resultado => {
                console.log('resultado')
                console.log(resultado)
                function currencyFormat(num) {
                    return num.toFixed(2);
                }

                var PrintItems = itensPedido.map(function (item) {
                    return `<tr>
                <td style={{ fontSize: "44px" , maxWidth:"145px"}}>
                    <b>${item.mercador.mer}</b>
                </td>
                <td style={{ fontSize: "44px" , maxWidth:"20px"}} >
                    <b>${item.qua}</b>
                </td>
                <td style={{ fontSize: "44px" , maxWidth:"60px" }}>
                    <b>${currencyFormat(item.valuni).replace('.', ',')}</b>
                </td>
                <td style={{ fontSize: "44px" , maxWidth:"80px" }}>
                    <b>${currencyFormat(item.valuni * item.qua).replace('.', ',')}</b>
                </td>
                </tr>`;
                });

                function quantidadeTotal() {
                    try {
                        var soma = 0;
                        for (let i = 0; i < itensPedido.length; i++) {
                            soma += parseInt(itensPedido[i].qua);
                        }
                        return soma.toFixed(2).replace('.', ',');
                    } catch (error) {
                        console.log(error.message)
                    }
                }

                const htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Pdf Content</title>
                        <style>
                            body {
                                color: #000000;
                            }
                            p {
                            font-family: "Didot", "Times New Roman";
                            font-size: 44px;
                            margin: 0;
                            }
                            table {
                            border-collapse: collapse;
                            width: 100%;
                            }
                            th, td {
                            text-align: left;
                            padding: 8px;
                            font-family: "Didot", "Times New Roman";
                            font-size: 44px;
                            }
                            tr:nth-child(even) {
                            background-color: #f2f2f2;
                            margin-bottom:0px
                            }
                            div.small{
                            
                            }
                        </style>
                    </head>
                    <body>
                    <div class="small">
                    </br>
                    </br>
                        <p></p>
                        <p align="right"><b>Venda ${codVenda}</b></p>
                        </br>
                        <p align="center"><b>GOLD CHAVES ACESSORIOS LTDA</b></p>
                        </br>
                        <p align="center"><b>Av. Brasil, 2796 - LOJA 03 - CENTRO, Maringá - PR, 87013-000</b></p>
                        <p align="center"><b>(44) 3227-5493</b></p>
                        </br>
                        </br>
                        <div>
                        <p><b>Data: ${date.toLocaleDateString()}</b></p>
                        <p><b>Vendedor: ${nomRep}</b></p>
                        <p><b>Razão Social:</b><b> ${dadosCliente.raz}</b></p>
                        <p><b>CPF/CNPJ: ${dadosCliente.cgc}</b><b> Telefone: ${dadosCliente.fon}</b></p>
                        <p><b>Email: ${dadosCliente.ema}</b></p>
                        <p><b> Endereço: ${dadosCliente.log + ', ' + dadosCliente.num}</b></p>
                        <p><b>Bairro: ${dadosCliente.bai}</b><b> Cidade: ${dadosCliente.cid + ' - ' + dadosCliente.uf}</b></p>
                        <p><b>Obs: ${obs}</b></p>
                        </div>
                        <table>
                                                <thead>
                                                    <tr>
                                                        <th>Descricao</th>
                                                        <th>Qtd</th>
                                                        <th>Vlr</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                ${PrintItems}
                                                </tbody>
                        </table>
                        </div>
                        </br>
                        <p style="text-align:right"><b>Qtd Total: ${quantidadeTotal()} Uni</b></p>
                        <p style="text-align:right"><b>Total Bruto: R$ ${valorBruto.toFixed(2).replace('.', ',')}</b></p>
                        <p style="text-align:right"><b>Total Desconto: R$ ${(parseFloat(valorBruto / 100 * porDes) + parseFloat(valDes)).toFixed(2).replace('.', ',')}</b></p>
                        <p style="text-align:right"><b>Total Líquido: R$ ${((valorBruto - valorBruto / 100 * porDes) - valDes).toFixed(2).replace('.', ',')}</b></p>
                        </br>
                        </br>
                        </br>
                        </br>
                        </br>
                        </br>
                        <p style="text-align:center"><b>_______________________________________________</b></p>
                        <p style="text-align:center"><b>${dadosCliente.raz}</b></p>
                    </body>
                    </html>
                `;
                const createAndPrintPDF = async () => {
                    try {
                        const { uri } = await Print.printToFileAsync({
                            html: htmlContent,
                            width: 1000, height: 1500
                        });
                        console.log(uri)
                        await Print.printAsync({
                            uri: uri
                        })
                    } catch (error) {
                        console.error(error);
                    }
                };
                if (resultado != "erro ao salvar pedido") {
                    setLoading(false)
                    limparItensCarrinhoNoBanco().then(resultado => {
                        setItensCarrinho(null);
                        setValorBruto(0);
                        setObs('');
                        setValDes('0');
                        setPorDes('0');
                        removeClienteValue('@Cliente_data');
                        setEditando(false)
                        navigation.navigate('AppListProdutos');
                        Alert.alert(
                            "Venda finalizada",
                            "Deseja imprimir?",
                            [
                                {
                                    text: "Sim",
                                    onPress: () => {
                                        createAndPrintPDF()
                                    },
                                },
                                {
                                    text: "Não",
                                },
                            ]
                        );
                    });
                }
            }, reject => {
                setLoading(false)
                console.log(reject)
            })
        };
    }

    return (
        <View id={"pai"} >
            <Text style={{ textAlign: 'center', fontSize: 24, color: '#000000', paddingTop: 10 }}>Carrinho</Text>
            {editando ? <Text style={{ textAlign: 'center', fontSize: 24, color: 'blue', paddingTop: 10 }}>Editando Venda {codVenda}</Text> : null}
            <ScrollView style={styles.scrollContainer}>
                {itensCarrinho != null ?
                    <View id={"itens"} >
                        <View style={styles.cabeçalho}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    borderColor: 'black',
                                    borderStyle: 'dotted',
                                    borderWidth: 2,
                                    borderRadius: 1,
                                    position: 'relative',
                                }}
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
                                <Col size={25}>
                                    <Row style={styles.cellCabeçalho}>
                                        <Text></Text>
                                    </Row>
                                </Col>
                            </Grid>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    borderColor: 'black',
                                    borderStyle: 'dotted',
                                    borderWidth: 2,
                                    borderRadius: 1,
                                    position: 'relative',
                                }}
                            >
                            </TouchableOpacity>
                        </View>
                        {itensCarrinho.map((itemCar, key) => {
                            return (
                                <View key={key} style={styles.container}>
                                    <Text style={styles.textItem}>{itemCar.item}</Text>
                                    <Grid>
                                        <Col size={15}>
                                            <Row style={styles.cell}>
                                                <Text>{itemCar.quantidade}x</Text>
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
                                        <Col size={20}>
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
                        <View style={{ alignItems: 'flex-end' }}>
                            <TouchableOpacity
                                style={{
                                    marginTop: 15,
                                    marginRight:5,
                                    height: 10,
                                    width: '30%',
                                    padding: 15,
                                    borderRadius: 25,
                                    marginBottom: 5,
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    backgroundColor: '#d11b49',
                                }}
                                onPress={() => {
                                    limparItensCarrinhoNoBanco()
                                    setItensCarrinho(null);
                                    setValorBruto(0);
                                    setValDes('0');
                                    setPorDes('0');
                                }}
                            >
                                <Text style={styles.TextButton}>
                                    Limpar
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={{
                                marginTop: 15,
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                borderColor: 'black',
                                borderStyle: 'dotted',
                                borderWidth: 2,
                                borderRadius: 1,
                                position: 'relative',
                            }}
                        ></TouchableOpacity>
                        <View flexDirection="row" style={{ justifyContent: 'space-evenly', paddingTop: 15 }}>
                            <View flexDirection="row">
                                <Text style={{ fontSize: 16, color: '#000000' }}>Desconto %: </Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    onChangeText={text => {
                                        setPorDes(text.replace(',', '.'))
                                        console.log(text)
                                    }}
                                    onEndEditing={e => {
                                        if (e.nativeEvent.text == '') {
                                            setPorDes('0')
                                        }
                                    }}
                                    value={porDes.replace('.', ',')}
                                />
                            </View>
                            <View flexDirection="row">
                                <Text style={{ fontSize: 16, color: '#000000' }}>Desconto R$: </Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    onChangeText={text => {
                                        setValDes(text.replace(',', '.'))
                                        console.log(text)
                                    }}
                                    onEndEditing={e => {
                                        if (e.nativeEvent.text == '') {
                                            setValDes('0')
                                        }
                                    }}
                                    value={valDes.replace('.', ',')}
                                />
                            </View>
                        </View>
                        <View flexDirection="row" style={{ paddingTop: 15 }}>
                            <Text style={{ fontSize: 16, color: '#000000', marginLeft: 26 }}>Observação: </Text>
                            <TextInput
                                style={styles.inputObs}
                                multiline
                                numberOfLines={6}
                                onChangeText={text => {
                                    setObs(text)
                                    console.log(text)
                                }}
                                value={obs}
                            />
                        </View>
                        <View flexDirection="row">
                            <Text style={styles.textValorPedido}> Valor Líquido: </Text>
                            <Text style={styles.valorTotalPedido}>R$ {((valorBruto - valorBruto / 100 * porDes) - valDes).toFixed(2).replace('.', ',')}</Text>
                        </View>
                        <Text style={{ fontSize: 16, color: '#000000' }}>Cliente: {dadosCliente != null ? <Text>{dadosCliente.raz} - {dadosCliente.fan}</Text> : null}</Text>
                        <View flexDirection="row">
                            <BotaoVermelho
                                text={'Selecionar Cliente'}
                                onPress={() => {
                                    navigation.navigate('AppClientes', {
                                        onGoBack: () => Refresh()
                                    });
                                }}
                            />
                        </View>
                        {editando === false ?
                            <BotaoVermelho
                                text={`Finalizar Venda`}
                                onPress={() => enviaPedido()}>
                            </BotaoVermelho> :
                            <View>
                                <BotaoVermelho
                                    text={`Salvar alterações`}
                                    onPress={() => AlteraPedido()}>
                                </BotaoVermelho>
                                <TouchableOpacity
                                    style={styles.CancelarButton}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        removeClienteValue('@Cliente_data')
                                        limparItensCarrinhoNoBanco()
                                        setItensCarrinho(null);
                                        setValorBruto(0);
                                        setObs('');
                                        setValDes('0');
                                        setPorDes('0');
                                        setEditando(false)
                                    }}>
                                    <Text style={styles.TextButton}>Cancelar Edição</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {loading &&
                            <View style={styles.loading}>
                                <ActivityIndicator size='large' color="#121212" />
                            </View>
                        }
                        <Text></Text>
                        <Text></Text>
                        <Text></Text>
                        <Text></Text>
                    </View>
                    : <View>
                        <View style={{ alignItems: 'center', marginTop: '35%' }}>
                            {/* <Image
                                style={{ resizeMode: 'contain', paddingTop: 600, height: 250, width: 280 }}
                                source={require('./images/carrinhovazio.png')}
                            /> */}
                            <LottieView
                                source={require('./assets/tumbleweed-rolling.json')}
                                autoPlay={true}
                                loop={true}
                                style={{
                                    width: 300,
                                    height: 300,
                                }}
                            />
                            <Text style={{ textAlign: 'center', fontSize: 24, color: '#000000' }}>Carrinho vazio...</Text>
                        </View>
                    </View>
                }
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        padding: 4,
        justifyContent: 'space-between'
    },
    TextButton: {
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
    },
    CancelarButton: {
        marginTop: 5,
        height: 50,
        padding: 15,
        borderRadius: 25,
        borderWidth: 0,
        marginBottom: 15,
        marginHorizontal: 70,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#d11b49',
    },
    cabeçalho: {
        padding: 10,
        justifyContent: 'space-between'
    },
    itenWiew: {
        flexDirection: 'row',
    },
    textItem: {
        width: '85%',
        padding: 1,
        fontSize: 17,
        color: "#000000",
        fontWeight: "bold",
        textAlignVertical: "center",
        alignSelf: "center",
        alignItems: 'flex-start',
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
        fontSize: 20,
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
    input: {
        height: 35,
        width: 60,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        backgroundColor: '#F5FCFF88',
        justifyContent: 'center'
    },
    inputObs: {
        height: 100,
        width: '60%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        textAlignVertical: "top",
        backgroundColor: '#F3F3F3'
    },
});
export default Carrinho;