/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity, ScrollView, TextInput, Image, Alert, RefreshControl } from 'react-native';
import BotaoVermelho from './components/BotaoVermelho';
import { buscarItensCarrinhoNoBanco, limparItensCarrinhoNoBanco, deletarItenCarrinhoNoBanco, buscarCodVenBanco } from './controle/CarrinhoStorage';
import { openDatabase } from 'react-native-sqlite-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { postPedido } from './services/requisicaoInserePedido';
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PrintPDF, { getDadosPedido } from './PrintPDF';
import * as Print from 'expo-print';
import { Col, Row, Grid } from 'react-native-easy-grid';


const Carrinho = ({ route, navigation }) => {
    var date = new Date();
    var dathor = date.toISOString();

    const [itensCarrinho, setItensCarrinho] = useState();
    const [valorBruto, setValorBruto] = useState(0);
    const isFocused = useIsFocused();
    const [nomRep, setNomRep] = useState('');
    const [codcat, setCodCat] = useState();
    const [dadosCliente, setDadosCliente] = useState({});
    const [dadosLogin, setDadosLogin] = useState({});
    const [codPed, setCodPed] = useState();
    const [selectedLanguage, setSelectedLanguage] = useState();


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
            //    console.log('Pegou dados cliente: ' + clientedados)
        } catch (e) {
            console.log('Erro ao ler login')
        }
    }

    async function getUltimoCodPed() {
        const response = await api.get(`/pedidos/recuperaUltimoCod`)
        setCodPed(response.data)
        console.log(codPed);
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
        navigation.addListener('focus', () => {
            buscarItens();
            getClienteData();
            getUltimoCodPed()
        });
    }, [navigation]);

    useEffect(() => {
        getLoginData();
        getClienteData();
    }, [])

    useEffect(() => {
        setNomRep(dadosLogin.username)
        setCodCat(dadosLogin.codcat)
        console.log('Usuario logado: ' + nomRep + ', categoria: ' + codcat);
    }, [getLoginData])

    function enviaPedido() {

        if (dadosCliente == null) {
            Alert.alert("Atenção", "Favor selecionar o cliente da venda");
        } else {
            const appuser = { id: dadosCliente.id };
            const itensPedido = itensCarrinho.map((iten) => {
                return { qua: iten.quantidade, valuni: iten.valor, mercador: { cod: iten.codmer, mer: iten.item } };
            });
            const ped = JSON.stringify({
                cod: codPed, codcat: codcat, dathor: dathor, forpag: 'À vista', nomrep: nomRep, obs: null, sta: 'Pagamento Futuro', traredcgc: '', traredend: '', traredfon: '',
                trarednom: '', appuser, itensPedido
            })
            console.log('PostPedido: ')
            console.log(ped)
            postPedido(ped).then(resultado => {
                function currencyFormat(num) {
                    return num.toFixed(2);
                }
                var PrintItems = itensCarrinho.map(function (item) {
                    return `<tr>
                <td style={{ fontSize: "38px" , maxWidth:"145px"}}>
                    <b>${item.item} ${item.cor} ${item.tamanho}</b>
                </td>
                <td style={{ fontSize: "38px" , maxWidth:"20px"}} >
                    <b>${item.quantidade}</b>
                </td>
                <td style={{ fontSize: "38px" , maxWidth:"60px" }}>
                    <b>${currencyFormat(item.valor).replace('.', ',')}</b>
                </td>
                <td style={{ fontSize: "38px" , maxWidth:"80px" }}>
                    <b>${currencyFormat(item.valor * item.quantidade).replace('.', ',')}</b>
                </td>
                </tr>`;
                });
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
                      font-size: 38px;
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
                      font-size: 38px;
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
                <p align="right"><b>Venda ${codPed}</b></p>
                </br>
                <p align="center"><b>OPERA Z</b></p>
                </br>
                <p align="center"><b></b></p>
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
                <p style="text-align:right"><b>Total geral: R$ ${valorBruto.toFixed(2).replace('.', ',')}</b></p>
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
                    limparItensCarrinhoNoBanco().then(resultado => {
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
                        setItensCarrinho(null);
                        setValorBruto(0);
                        removeClienteValue('@Cliente_data');
                        navigation.navigate('AppListProdutos');
                    });
                } else { Alert.alert("falhou ao salvar, tente novamente"); }
            })
        };
    }

    function ImprimeDadosCliente() {
        if (dadosCliente != null) {
            return <Text>{dadosCliente.raz} - {dadosCliente.fan}</Text>
        }
    }

    function salvarApi() {
        const pedido = {
            cod: 1,
            dathor: new Date(),
            appuser: {
                id: 1
            },
            itensPedido: itensCarrinho
        }
    }
    function salvarSqlLite() {

        let codped = 0;
        var db = openDatabase({ name: 'VendaDatabase.db' });
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='table_pedido'",
                [],
                function (tx, res) {
                    if (res.rows.length > 0) {
                        txn.executeSql('DROP TABLE IF EXISTS table_pedido', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS table_pedido(pedido_id INTEGER PRIMARY KEY AUTOINCREMENT, pedido_codcli INTEGER)',
                            []
                        );
                        txn.executeSql('DROP TABLE IF EXISTS table_itenPedido', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS table_itenPedido(itenPedido_id INTEGER PRIMARY KEY AUTOINCREMENT, itenPedido_codped INTEGER, itenPedido_codmer INTEGER, itenPedido_qua INTEGER, itenPedido_valuni VARCHAR(20),itenPedido_mer VARCHAR(20))',
                            []
                        );
                    }
                }
            );
            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO table_pedido (pedido_codcli) VALUES (?)',
                    ['1'],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            console.log('Success You are Registered Successfully');
                        } else console.log('Registration Failed');
                    },
                );
            });
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT max(pedido_id) pedido_id FROM table_pedido  ', [],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            let res = results.rows.item(0);
                            codped = res.pedido_id;
                        } else {
                            console.log('No user found');
                        }
                    },
                );
            });
            itensCarrinho.map((itemCar) => {
                db.transaction(function (tx) {
                    tx.executeSql(
                        'INSERT INTO table_itenPedido (itenPedido_codped, itenPedido_codmer, itenPedido_qua, itenPedido_valuni, itenPedido_mer) VALUES (?,?,?,?,?)',
                        [codped, itemCar.codmer, itemCar.quantidade, itemCar.valor, itemCar.item],
                        (tx, results) => {
                            if (results.rowsAffected > 0) {
                                console.log('Success You are Registered Successfully');
                            } else console.log('Registration Failed');
                        },
                    );
                });
            });
        });
    }

    return (
        <View id={"pai"} >
            <Text style={{ textAlign: 'center', fontSize: 24, color: '#000000', paddingTop: 10 }}>Carrinho</Text>
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
                                    <Text style={styles.textItem}>{itemCar.item} {itemCar.cor} {itemCar.tamanho}</Text>
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
                        <View flexDirection="row">
                            <Text style={styles.textValorPedido}> Valor Total: </Text>
                            <Text style={styles.valorTotalPedido}>R$ {valorBruto.toFixed(2).replace('.', ',')}</Text>
                        </View>
                        <Text style={{ fontSize: 16, color: '#000000' }}>Cliente: {ImprimeDadosCliente()}</Text>
                        <View flexDirection="row">
                            <View>
                                <TouchableOpacity
                                    style={styles.Clientes}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        navigation.navigate('AppClientes', {
                                            onGoBack: () => Refresh()
                                        });
                                    }}>
                                    <Text style={styles.TextButton}>Selecionar Cliente</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={styles.NovoCliente}
                                    activeOpacity={0.5}
                                    onPress={() => { navigation.navigate('AppCadastroCliente', {
                                            onGoBack: () => Refresh()
                                        });
                                    }}>
                                    <Text style={styles.TextButton}>Novo cliente</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <BotaoVermelho
                            text={`Finalizar Venda`}
                            onPress={() => enviaPedido()}></BotaoVermelho>
                        <Text></Text>
                        <Text></Text>
                        <Text></Text>
                        <Text></Text>
                    </View>
                    : <View>
                        {/* <Text style={styles.textCarinhoVazio}>Carrinho Vazio ... </Text> */}
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                style={{ resizeMode: 'contain', paddingTop: 600, height: 250, width: 280 }}
                                source={require('./images/carrinhovazio.png')}
                            />
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
        backgroundColor: '#121212',
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