import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, ScrollView, TouchableOpacity, StyleSheet, LogBox, Alert } from 'react-native';
import api from './api';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home({ navigation }) {

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
    const [comLog, setComLog] = useState('');

    async function storeClienteData(DadosCliente) {
        try {
            removeClienteValue('@Cliente_data');
            await AsyncStorage.setItem('@Cliente_data', DadosCliente)
            console.log('salvou localstorage informações do cliente: ' + DadosCliente)
        } catch (e) {
            console.log('erro ao salvar informações de Cliente' + e)
        }
    }

    async function SalvarEndUsu(codusu) {
        const endUsu = JSON.stringify({
            cep: cep, log: log, num: num, bai: bai, cid: cid, uf: uf, comlog: comLog, appuser: { id: codusu }
        })
        const dadosClienteStorage = JSON.stringify({
            username: cgc, log: log, num: num, ema: email, cgc: cgc, datnas: null, fon: fon, raz: raz,
            password: 'operaz', insest: insest, fan: fan, bai: bai, cep: cep, cid: cid, uf: uf, comlog: comLog, id: codusu
        })
        console.log(endUsu)
        try {
            const response = await api.post('/endusus/salvar', endUsu, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log('Salvou endusu')
            console.log(response)
            storeClienteData(dadosClienteStorage);
        } catch (error) {
            Alert.alert('Erro ao salvar');
            console.log(error)
        }

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

    async function SalvarCadastro() {
        const dadosCliente = JSON.stringify({
            cgc: cgc, ema: email, name: fan, username: cgc,
            password: 'operaz', fon: fon, datnas: '2000-01-01', insest: insest, raz: raz, fan: fan
        })
        console.log(dadosCliente)
        try {
            const response = await api.post('/usuarios/salvar', dadosCliente, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log('Enviou cliente')
            console.log(response)
            SalvarEndUsu(response.data.id)
        } catch (error) {
            Alert.alert('Erro ao salvar');
            console.log(error)
        }
    }

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={{ textAlign: 'center', fontSize: 24, color: '#000000', paddingTop: 10 }}>Cadastro de cliente</Text>
                <View style={{ marginLeft: '5%', marginTop: '5%' }}>
                    {/* <View flexDirection="row" style={{ justifyContent: 'space-evenly', paddingTop: 15 }}> */}
                    <View>
                        <Text style={{ fontSize: 16, color: '#000000' }}>Razão social: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => { setRaz(text) }}
                            value={raz}
                        />
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, color: '#000000' }}>Nome fantasia: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => { setFan(text) }}
                            value={fan}
                        />
                    </View>
                    <View flexDirection="row">
                        <View style={{ width: '47.5%' }}>
                            <Text style={{ fontSize: 16, color: '#000000' }}>CPF/CNPJ: </Text>
                            <TextInput
                                style={styles.input}
                                maxLength={14}
                                keyboardType='numeric'
                                onChangeText={text => { setCgc(text) }}
                                value={cgc}
                            />
                        </View>
                        <View style={{ width: '47.5%' }}>
                            <Text style={{ fontSize: 16, color: '#000000' }}>Inscrição Estadual: </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => { setInsEst(text) }}
                                value={insest}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, color: '#000000' }}>Email: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => { setEmail(text) }}
                            value={email}
                        />
                    </View>
                    <View flexDirection="row">
                        <View style={{ width: '47.5%' }}>
                            <Text style={{ fontSize: 16, color: '#000000' }}>Fone/Celular: </Text>
                            <TextInput
                                style={styles.input}
                                keyboardType='numeric'
                                onChangeText={text => { setFon(text) }}
                                value={fon}
                            />
                        </View>
                        <View style={{ width: '47.5%' }}>
                            <Text style={{ fontSize: 16, color: '#000000' }}>Cep: </Text>
                            <TextInput
                                style={styles.input}
                                keyboardType='numeric'
                                onChangeText={text => { setCep(text) }}
                                value={cep}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, color: '#000000' }}>Endereço: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => { setLog(text) }}
                            value={log}
                        />
                    </View>
                    <View flexDirection="row">
                        <View style={{ width: '47.5%' }}>
                            <Text style={{ fontSize: 16, color: '#000000' }}>Numero: </Text>
                            <TextInput
                                style={styles.input}
                                keyboardType='numeric'
                                onChangeText={text => { setNum(text) }}
                                value={num}
                            />
                        </View>
                        <View style={{ width: '47.5%' }}>
                            <Text style={{ fontSize: 16, color: '#000000' }}>Bairro: </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => { setBai(text) }}
                                value={bai}
                            />
                        </View>
                    </View>
                    <View flexDirection="row">
                        <View style={{ width: '47.5%' }}>
                            <Text style={{ fontSize: 16, color: '#000000' }}>Cidade: </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => { setCid(text) }}
                                value={cid}
                            />
                        </View>
                        <View style={{ width: '47.5%' }}>
                            <Text style={{ fontSize: 16, color: '#000000' }}>Estado(UF): </Text>
                            <TextInput
                                style={styles.input}
                                maxLength={2}
                                onChangeText={text => { setUf(text.toUpperCase()) }}
                                value={uf}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, color: '#000000' }}>Complemento: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => { setComLog(text) }}
                            value={comLog}
                        />
                    </View>
                </View>
                <View style={{ marginTop: '0%' }}>
                    <TouchableOpacity
                        style={styles.SalvarButton}
                        activeOpacity={0.5}
                        onPress={() => {
                            SalvarCadastro()
                            navigation.pop();
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
    input: {
        height: 35,
        width: '90%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        marginRight: '36%'
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
    SalvarButton: {
        marginTop: 20,
        height: 50,
        marginHorizontal: '20%',
        padding: 15,
        borderRadius: 25,
        borderWidth: 0,
        marginBottom: 15,
        backgroundColor: '#36c75c',
    },
    CancelarButton: {
        marginTop: 10,
        marginHorizontal: '20%',
        height: 50,
        padding: 15,
        borderRadius: 25,
        borderWidth: 0,
        marginBottom: 15,
        backgroundColor: '#121212',
    },
    TextButton: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center'
    }
});