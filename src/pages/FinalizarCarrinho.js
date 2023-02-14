import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text, TextInput } from 'react-native';
import { postPedido } from '../services/requisicaoInserePedido';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrintPDF } from '../components/printPDF';
import { buscarItensCarrinhoNoBanco, limparItensCarrinhoNoBanco } from '../controle/CarrinhoStorage';
import { ConvertNumberParaReais } from '../utils/ConvertNumberParaReais';

function FinalizarCarrinho({ route, navigation }) {
    var date = new Date();
    var dathor = date.toISOString();

    const [itensCarrinho, setItensCarrinho] = useState();
    const [valorBruto, setValorBruto] = useState(0);
    const [nomRep, setNomRep] = useState('');
    const [codcat, setCodCat] = useState();
    const [cliente, setDadosCliente] = useState();
    const [dadosLogin, setDadosLogin] = useState({});
    const [obs, setObs] = useState('');
    const [porDes, setPorDes] = useState('0');
    const [valDes, setValDes] = useState('0');
    const [valJur, setValJur] = useState('0');
    const [valFre, setValFre] = useState('0');
    const [loading, setLoading] = useState(false);

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

    async function getLoginData() {
        try {
            const jsonValue = await AsyncStorage.getItem('@login_data');
            if (jsonValue) {
                const dadLogin = JSON.parse(jsonValue);
                setDadosLogin(dadLogin);
                setNomRep(dadLogin.username);
                setCodCat(dadLogin.codcat);
            }
        } catch (e) {
            console.log('Erro ao ler login')
        }
    }

    function CalculaValorLiquido() {
        let VlrJur = 0;
        let VlrFre = 0;
        if (valJur && valJur !== '') {
            VlrJur = Number(valJur);
        }
        if (valFre && valFre !== '') {
            VlrFre = Number(valFre);
        }
        let valorDesconto = Number(Number(Number(valorBruto / 100 * porDes).toFixed(2)) + Number(valDes));
        if (isNaN(valorDesconto)) {
            return valorBruto + Number(VlrJur) + Number(VlrFre);
        }
        return Number(valorBruto - valorDesconto + Number(VlrJur) + Number(VlrFre));
    }

    async function enviaPedido() {
        setLoading(true);
        if (!cliente) {
            setLoading(false);
            Alert.alert("Dados incompletos", "Faltou informar o cliente da venda.");
            return;
        }
        try {
            const appuser = { id: cliente.id };
            const itensPedido = itensCarrinho.map((iten) => {
                return { obs: iten.obs, qua: iten.quantidade, valuni: iten.valor, mercador: { cod: iten.codmer, mer: iten.item } };
            });
            const ped = JSON.stringify({
                cod: '', codcat: codcat, dathor: dathor, forpag: 'À vista', nomrep: nomRep, obs: obs, sta: 'Pagamento Futuro', traredcgc: '', traredend: '', traredfon: '',
                trarednom: '', valpro: valorBruto, valdes: valDes, perdes: porDes, valfre: valFre, appuser, itensPedido
            })

            console.log(ped);
            const result = await postPedido(ped);

            if (result) {
                const limparCarrinhoStorage = await limparItensCarrinhoNoBanco();

                if (limparCarrinhoStorage) {
                    Alert.alert(
                        "Venda finalizada",
                        "Deseja imprimir?",
                        [
                            {
                                text: "Sim",
                                onPress: () => {
                                    PrintPDF(itensCarrinho, cliente, valorBruto, result.cod, nomRep);
                                    setItensCarrinho(null);
                                    setValorBruto(0);
                                    setDadosCliente(undefined);
                                    setLoading(false);
                                    navigation.pop();
                                    Alert.alert("Sucesso", "Pedido finalizado.");
                                },
                            },
                            {
                                text: "Não",
                                onPress: () => {
                                    setItensCarrinho(null);
                                    setValorBruto(0);
                                    setDadosCliente(undefined);
                                    setLoading(false);
                                    navigation.pop();
                                    Alert.alert("Sucesso", "Pedido finalizado.");
                                }
                            }
                        ]
                    );
                }
            }
        } catch (error) {
            setLoading(false);
            Alert.alert('Erro ao finalizar', error.message);
            console.log(error.message);
        }
    }

    useEffect(() => {
        getLoginData();
        buscarItens();
    }, []);

    useEffect(() => {
        if (route.params?.cliente) {
            setDadosCliente(route.params?.cliente);
        }
    }, [route.params?.cliente]);

    return (
        <View style={styles.container}>
            <View flexDirection="row">
                <View>
                    <TouchableOpacity
                        style={styles.Clientes}
                        activeOpacity={0.5}
                        onPress={() => {
                            navigation.navigate('ListaCliente');
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
            <View flexDirection="row" style={styles.clienteView}>
                <Text style={styles.inputText}> Cliente: </Text>
                <TextInput
                    style={styles.input}
                    multiline
                    onFocus={() => { Alert.alert('Utilize os botões Buscar Cliente e Novo Cliente') }}
                    editable={cliente ? true : false}
                    numberOfLines={3}
                    onChangeText={text => { }}
                    placeholder={'Utilize os botões Buscar Cliente e Novo Cliente'}
                    value={cliente ? cliente.raz + ' - ' + cliente.fan : ''}
                />
            </View>
            <View flexDirection="row" style={styles.obsView}>
                <Text style={styles.inputText}> Obs.....: </Text>
                <TextInput
                    style={styles.input}
                    multiline
                    editable={true}
                    placeholder={'Observações'}
                    numberOfLines={3}
                    onChangeText={text => { setObs(text) }}
                    value={obs}
                />
            </View>
            <View flexDirection="row" style={styles.discountView}>
                <View flexDirection="row">
                    <Text style={styles.inputText}>Desconto %: </Text>
                    <TextInput
                        style={styles.inputDesconto}
                        keyboardType="numeric"
                        onChangeText={text => {
                            setPorDes(text.replace(',', '.'));
                        }}
                        onEndEditing={e => {
                            if (e.nativeEvent.text == '') {
                                setPorDes('0');
                            }
                        }}
                        value={porDes.replace('.', ',')}
                    />
                </View>
                <View flexDirection="row">
                    <Text style={styles.inputText}>Desconto R$: </Text>
                    <TextInput
                        style={styles.inputDesconto}
                        keyboardType="numeric"
                        onChangeText={text => {
                            setValDes(text.replace(',', '.'));
                        }}
                        onEndEditing={e => {
                            if (e.nativeEvent.text == '') {
                                setValDes('0');
                            }
                        }}
                        value={valDes.replace('.', ',')}
                    />
                </View>
            </View>
            <View flexDirection="row" style={styles.discountView}>
                <View flexDirection="row">
                    <Text style={styles.inputText}>Juros R$..: </Text>
                    <TextInput
                        style={styles.inputDesconto}
                        keyboardType="numeric"
                        onChangeText={text => {
                            setValJur(text.replace(',', '.'));
                        }}
                        onEndEditing={e => {
                            if (e.nativeEvent.text == '') {
                                setValJur('0');
                            }
                        }}
                        value={valJur.replace('.', ',')}
                    />
                </View>
                <View flexDirection="row">
                    <Text style={styles.inputText}>Frete R$..: </Text>
                    <TextInput
                        style={styles.inputDesconto}
                        keyboardType="numeric"
                        onChangeText={text => {
                            setValFre(text.replace(',', '.'));
                        }}
                        onEndEditing={e => {
                            if (e.nativeEvent.text == '') {
                                setValFre('0');
                            }
                        }}
                        value={valFre.replace('.', ',')}
                    />
                </View>
            </View>
            <View style={{ width: '100%' }}>
                <TouchableOpacity onPress={enviaPedido} style={{ padding: 15, marginTop: '5%', width: '100%', backgroundColor: '#38A69D' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold', textAlignVertical: 'center' }}>Finalizar {ConvertNumberParaReais(CalculaValorLiquido())}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    inputText: {
        fontSize: 16,
        color: '#000000',
    },
    clienteView: {
        marginTop: '5%',
    },
    obsView: {
        marginTop: '5%',
    },
    input: {
        padding: 20,
        width: '80%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        textAlignVertical: 'top'
    },
    inputDesconto: {
        height: 35,
        width: 60,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    loading: {
        padding: 10
    },
    discountView: {
        justifyContent: 'space-evenly',
        marginTop: 15,
    },
});

export default FinalizarCarrinho;