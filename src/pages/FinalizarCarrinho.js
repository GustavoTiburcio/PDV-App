import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text, TextInput, ScrollView } from 'react-native';
import { postPedido } from '../services/requisicaoInserePedido';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrintPDF } from '../components/printPDF';
import { buscarItensCarrinhoNoBanco, limparItensCarrinhoNoBanco } from '../controle/CarrinhoStorage';
import { ConvertNumberParaReais } from '../utils/ConvertNumberParaReais';
import Spinner from 'react-native-loading-spinner-overlay';
import { buscarLimitePorcentagemDesconto, buscarUsaTraRed } from '../controle/ConfigStorage';
import api from '../services/api';
import { API_URL_PAPERPLAS, API_URL_PAPERPLAS_INTERNO } from '@env';

function FinalizarCarrinho({ route, navigation }) {
    var date = new Date();
    var dathor = date.toISOString();

    const [itensCarrinho, setItensCarrinho] = useState();
    const [valorBruto, setValorBruto] = useState(0);
    const [nomRep, setNomRep] = useState('');
    const [codcat, setCodCat] = useState();
    const [dadosLogin, setDadosLogin] = useState({});


    const [loading, setLoading] = useState(false);

    //inputs
    const [cliente, setDadosCliente] = useState('');
    const [traRedNom, setTraRedNom] = useState('');
    const [traRedEnd, setTraRedEnd] = useState('');
    const [traRedCgc, setTraRedCgc] = useState('');
    const [traRedFon, setTraRedFon] = useState('');
    const [porDes, setPorDes] = useState('0');
    const [valDes, setValDes] = useState('0');
    const [valJur, setValJur] = useState('0');
    const [valFre, setValFre] = useState('0');
    const [refCom, setRefCom] = useState('');
    const [praPag, setPraPag] = useState('');
    const [obs, setObs] = useState('');

    //configs
    const [limPorDes, setLimPorDes] = useState(100);
    const [usaTraRed, setUsaTraRed] = useState(false);

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

    async function getConfig() {
        try {
            const limitePorDes = await buscarLimitePorcentagemDesconto();
            const usaTransRed = await buscarUsaTraRed();

            if (limPorDes) {
                setLimPorDes(Number(limitePorDes));
            }
            if (usaTransRed) {
                setUsaTraRed(JSON.parse(usaTransRed));
            }

        } catch (error) {
            console.log(error);
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

        const valorDesconto = Number(Number(Number(valorBruto / 100 * porDes).toFixed(2)) + Number(valDes));

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
                cod: '', codcat: codcat, dathor: dathor, forpag: 'À vista', nomrep: nomRep, obs: obs, sta: 'Pagamento Futuro', traredcgc: traRedCgc, traredend: traRedEnd, traredfon: traRedFon,
                trarednom: traRedNom, valpro: Number(valorBruto.toFixed(2)), valdes: valDes, perdes: porDes, valfre: valFre, appuser, itensPedido
            });

            const result = await postPedido(ped);

            if (result) {
                limparItensCarrinhoNoBanco().then(resultado => {
                    if (resultado) {
                        setItensCarrinho(null);
                        setValorBruto(0);
                        setDadosCliente(undefined);
                        setLoading(false);

                        Alert.alert(
                            "Venda finalizada",
                            "Deseja imprimir?",
                            [
                                {
                                    text: "Sim",
                                    onPress: () => {
                                        PrintPDF(itensCarrinho, cliente, valorBruto, result.cod, nomRep);
                                        navigation.pop();
                                    },
                                },
                                {
                                    text: "Não",
                                    onPress: () => {
                                        navigation.pop();
                                    }
                                }
                            ]
                        );
                    }
                    setLoading(false);
                });
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            Alert.alert('Erro ao finalizar', error.message);
            console.log(error.message);
        }
    }

    function VerificaDescontoLimite(porcentagemDesconto, valorDesconto) {
        const valorDescontoLimite = Number((valorBruto * (Number(limPorDes) / 100)).toFixed(2));

        const valDesconto = Number(Number(Number(valorBruto / 100 * porcentagemDesconto).toFixed(2)) + Number(valorDesconto));

        return valDesconto > valorDescontoLimite ? true : false

    }

    useEffect(() => {
        getLoginData();
        getConfig();
        buscarItens();
    }, []);

    useEffect(() => {
        if (route.params?.cliente) {
            setDadosCliente(route.params?.cliente);
        }
    }, [route.params?.cliente]);

    return (
        <View style={styles.container}>
            <Spinner visible={loading} />
            <ScrollView>
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
                <View style={{ width: '95%', marginLeft: '3%' }}>
                    <View style={styles.clienteView}>
                        <Text style={styles.inputText}>Cliente:</Text>
                        <TextInput
                            style={styles.input}
                            multiline
                            onFocus={() => { Alert.alert('Utilize os botões Buscar Cliente e Novo Cliente') }}
                            editable={cliente ? true : false}
                            numberOfLines={2}
                            onChangeText={text => { }}
                            placeholder={'Utilize os botões Buscar Cliente e Novo Cliente'}
                            value={cliente ? cliente.raz + ' - ' + cliente.fan : ''}
                        />
                    </View>
                    {usaTraRed &&
                        <>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 17, marginBottom: 10 }}>Transportadora</Text>
                                <View>
                                    <Text style={styles.inputText}>Nome da Transportadora:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={setTraRedNom}
                                        placeholder={'Nome da transportadora'}
                                        value={traRedNom}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.inputText}>Endereço:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={setTraRedEnd}
                                        placeholder={'Endereço da transportadora'}
                                        value={traRedEnd}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={styles.inputText}>CNPJ:</Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={setTraRedCgc}
                                            placeholder={'CNPJ da transportadora'}
                                            value={traRedCgc}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.inputText}>Fone:</Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={setTraRedFon}
                                            placeholder={'Fone da transportadora'}
                                            value={traRedFon}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.obsView}>
                                <Text style={styles.inputText}>Referências Comerciais:</Text>
                                <TextInput
                                    style={styles.input}
                                    multiline
                                    placeholder={'Referências Comerciais(Razão social, telefone...)'}
                                    numberOfLines={2}
                                    onChangeText={setRefCom}
                                    value={refCom}
                                />
                            </View>
                        </>
                    }
                    <View style={styles.obsView}>
                        <Text style={styles.inputText}>Prazo de Pagamento:</Text>
                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder={'Prazo de pagamento'}
                            numberOfLines={2}
                            onChangeText={setPraPag}
                            value={praPag}
                        />
                    </View>
                    <View style={styles.obsView}>
                        <Text style={styles.inputText}>Observações:</Text>
                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder={'Observações do pedido'}
                            numberOfLines={2}
                            onChangeText={text => { setObs(text) }}
                            value={obs}
                        />
                    </View>
                    <View flexDirection="row" style={styles.discountView}>
                        <View flexDirection="row">
                            <Text style={styles.inputText}>Desconto %:</Text>
                            <TextInput
                                style={styles.inputDesconto}
                                keyboardType="numeric"
                                onChangeText={text => {
                                    if (VerificaDescontoLimite(text.replace(',', '.'), valDes)) {
                                        Alert.alert('Desconto não permitido', 'Desconto máximo permitido: ' + limPorDes + '%');
                                        setPorDes('0');
                                        return;
                                    }
                                    setPorDes(text.replace(',', '.'));
                                }}
                                onEndEditing={e => {
                                    if (e.nativeEvent.text == '') {
                                        setPorDes('0');
                                    }
                                }}
                                value={porDes.replace('.', ',')}
                                maxLength={4}
                            />
                        </View>
                        <View flexDirection="row">
                            <Text style={styles.inputText}>Frete R$..:</Text>
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
                    {/* Comentado por conta da ocorrencia 175745
                <View flexDirection="row" style={styles.discountView}>
                <View flexDirection="row">
                    <Text style={styles.inputText}>Desconto R$: </Text>
                    <TextInput
                        style={styles.inputDesconto}
                        keyboardType="numeric"
                        onChangeText={text => {
                            if (VerificaDescontoLimite(porDes, text.replace(',', '.'))) {
                                Alert.alert('Desconto não permitido', 'Desconto máximo permitido: ' + limPorDes + '%');
                                setValDes('0');
                                return;
                            }
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
                        editable={false}
                        selectTextOnFocus={false}
                    />
                </View>
            </View> */}
                </View>
                <View style={{ width: '100%', marginBottom: 10 }}>
                    <TouchableOpacity onPress={enviaPedido} style={styles.envioButton}>
                        <Text style={styles.TextButton}>Finalizar {ConvertNumberParaReais(CalculaValorLiquido())}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        textAlign: 'center',
        fontWeight: 'bold',
        textAlignVertical: 'center'
    },
    inputText: {
        fontSize: 16,
        color: '#000000',
    },
    obsView: {
        marginTop: 10,
    },
    input: {
        padding: 5,
        width: '100%',
        borderWidth: 1,
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
        justifyContent: 'space-around',
        marginTop: 10,
        width: '100%'
    },
    envioButton: {
        padding: 15,
        marginTop: '5%',
        width: '100%',
        backgroundColor: '#c91e1e'
    }
});

export default FinalizarCarrinho;