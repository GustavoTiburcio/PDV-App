import React, { useState } from 'react';
import { Text, View, TextInput, ScrollView, TouchableOpacity, StyleSheet, LogBox, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { validaCpfCnpj, cnpj, cpf, validaEmail } from '../components/FormValidation'


export default function CadastroCliente({ navigation }) {

    const [raz, setRaz] = useState('');
    const [fan, setFan] = useState('');
    const [cgc, setCgc] = useState('');
    const [insest, setInsEst] = useState('');
    const [email, setEmail] = useState('');
    const [fon, setFon] = useState('');
    const [cep, setCep] = useState('');
    const [log, setLog] = useState('');
    const [num, setNum] = useState('');
    const [bai, setBai] = useState('');
    const [cid, setCid] = useState('');
    const [uf, setUf] = useState('');
    const [codIbge, setCodIbge] = useState('');
    const [comLog, setComLog] = useState('');
    const [loading, setLoading] = useState(false);

    async function SalvarEndUsu(usuario) {
        const endUsu = JSON.stringify({
            cep: cep, log: log, num: num, bai: bai, cid: cid, uf: uf, comlog: comLog, codibg: codIbge, appuser: { id: usuario.id }
        })
        const cliente = {
            username: usuario.cgc, log: log, num: num, ema: usuario.ema, cgc: usuario.cgc, datnas: usuario.datnas, fon: usuario.fon, raz: usuario.raz,
            password: 'z', insest: usuario.insest, fan: usuario.fan, bai: bai, cep: cep, cid: cid, uf: uf, comlog: comLog, id: usuario.id
        }
        try {
            const response = await api.post('/endusus/salvar', endUsu, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            navigation.navigate({
                name: 'FinalizarCarrinho',
                params: { cliente },
                merge: true,
            });
            setLoading(false);
            Alert.alert('Cliente cadastrado com sucesso', `${usuario.id} - ${usuario.fan}`)
        } catch (error) {
            setLoading(false);
            Alert.alert('Erro ao salvar');
            console.log(error)
        }

    }

    async function SalvarCadastro() {
        const dadosCliente = JSON.stringify({
            cgc: cgc, ema: email, name: fan, username: cgc,
            password: '123', fon: fon, datnas: '2000-01-01', insest: insest, raz: raz, fan: fan, tipusu: 'comum'
        })
        try {
            setLoading(true);
            const response = await api.post('/usuarios/salvar', dadosCliente, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            SalvarEndUsu(response.data);
        } catch (error) {
            setLoading(false);
            Alert.alert('Erro ao salvar');
            console.log(error)
        }
    }

    //Validações de formulários
    async function BuscaEnd(cep) {
        try {
            const response = await api.get(`https://viacep.com.br/ws/${cep}/json/`)
            setBai(response.data.bairro)
            setCid(response.data.localidade)
            setLog(response.data.logradouro)
            setUf(response.data.uf)
            setCodIbge(response.data.ibge)
            
        } catch (error) {
            console.log(error)
        }
    }

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro de cliente</Text>
            <ScrollView style={styles.scrollView}>
                <View >
                    <View>
                        <Text style={styles.fieldText}>Razão social: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => { setRaz(text) }}
                            onEndEditing={e => { setFan(e.nativeEvent.text) }}
                            value={raz}
                        />
                    </View>
                    <View>
                        <Text style={styles.fieldText}>Nome fantasia: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => { setFan(text) }}
                            value={fan}
                        />
                    </View>
                    <View flexDirection="row">
                        <View style={styles.halfView}>
                            <Text style={styles.fieldText}>CPF/CNPJ: </Text>
                            <TextInput
                                style={styles.input}
                                maxLength={30}
                                keyboardType='numeric'
                                onChangeText={text => {
                                    if (text.length > 14) {
                                        setCgc(cnpj(text))
                                    } else {
                                        setCgc(cpf(text))
                                    }
                                }}
                                onEndEditing={e => {
                                    let valida

                                    if (e.nativeEvent.text.length > 14) {
                                        valida = validaCpfCnpj(cnpj(e.nativeEvent.text))
                                        if (valida == false) {
                                            setCgc('')
                                            Alert.alert('CNPJ inválido', 'Verique o valor digitado.')
                                        }
                                    } else {
                                        valida = validaCpfCnpj(cpf(e.nativeEvent.text))
                                        if (valida == false) {
                                            setCgc('')
                                            Alert.alert('CPF inválido', 'Verique o valor digitado.')
                                        }
                                    }
                                }}
                                value={cgc}
                            />
                        </View>
                        <View style={styles.halfView}>
                            <Text style={styles.fieldText}>Inscrição Estadual: </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => { setInsEst(text) }}
                                value={insest}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={styles.fieldText}>Email: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => { setEmail(text) }}
                            onEndEditing={e => {
                                let valida = validaEmail(e.nativeEvent.text);
                                if (valida == false) {
                                    setEmail('')
                                    Alert.alert('Email inválido', 'Verique o valor digitado.')
                                }
                            }}
                            value={email}
                        />
                    </View>
                    <View flexDirection="row">
                        <View style={styles.halfView}>
                            <Text style={styles.fieldText}>Fone/Celular: </Text>
                            <TextInput
                                style={styles.input}
                                keyboardType='numeric'
                                onChangeText={text => { setFon(text) }}
                                value={fon}
                            />
                        </View>
                        <View style={styles.halfView}>
                            <Text style={styles.fieldText}>Cep: </Text>
                            <TextInput
                                style={styles.input}
                                keyboardType='numeric'
                                onChangeText={text => { setCep(text) }}
                                onEndEditing={e => { BuscaEnd(e.nativeEvent.text.replace(/[^0-9]/g, '')) }}
                                value={cep}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={styles.fieldText}>Endereço: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => { setLog(text) }}
                            value={log}
                        />
                    </View>
                    <View flexDirection="row">
                        <View style={styles.numberInput}>
                            <Text style={styles.fieldText}>Numero: </Text>
                            <TextInput
                                style={styles.input}
                                keyboardType='numeric'
                                onChangeText={text => { setNum(text) }}
                                value={num}
                            />
                        </View>
                        <View style={styles.districtInput}>
                            <Text style={styles.fieldText}>Bairro: </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => { setBai(text) }}
                                value={bai}
                            />
                        </View>
                    </View>
                    <View flexDirection="row">
                        <View style={styles.halfView}>
                            <Text style={styles.fieldText}>Cidade: </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => { setCid(text) }}
                                value={cid}
                            />
                        </View>
                        <View style={styles.halfView}>
                            <Text style={styles.fieldText}>Estado(UF): </Text>
                            <TextInput
                                style={styles.input}
                                maxLength={2}
                                onChangeText={text => { setUf(text.toUpperCase()) }}
                                value={uf}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={styles.fieldText}>Complemento: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => { setComLog(text) }}
                            value={comLog}
                        />
                    </View>
                </View>
                {loading ?
                    <View style={styles.loading}>
                        <ActivityIndicator size='large' color="#38A69D" />
                    </View> : null
                }
                <View>
                    <TouchableOpacity
                        style={styles.SalvarButton}
                        activeOpacity={0.5}
                        onPress={() => {
                            SalvarCadastro()
                        }}>
                        <Text style={styles.TextButton}> Confirmar </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.CancelarButton}
                        activeOpacity={0.5}
                        onPress={() => {
                            navigation.pop();
                        }}>
                        <Text style={styles.TextButton}> Cancelar </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        color: '#000000',
        paddingTop: 10
    },
    input: {
        height: 35,
        width: '90%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        marginRight: '36%'
    },
    SalvarButton: {
        marginTop: 20,
        height: 50,
        marginHorizontal: '20%',
        padding: 15,
        borderRadius: 25,
        borderWidth: 0,
        marginBottom: 15,
        backgroundColor: '#10e650',
    },
    CancelarButton: {
        marginTop: 10,
        marginHorizontal: '20%',
        height: 50,
        padding: 15,
        borderRadius: 25,
        borderWidth: 0,
        marginBottom: 15,
        backgroundColor: '#e64929',
    },
    TextButton: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center'
    },
    loading: {
        padding: 10
    },
    scrollView: {
        marginLeft: '5%'
    },
    fieldText: {
        fontSize: 16,
        color: '#000'
    },
    halfView: {
        width: '47.5%',
    },
    numberInput: {
        width: '30%'
    },
    districtInput: {
        width: '66.5%'
    }
});