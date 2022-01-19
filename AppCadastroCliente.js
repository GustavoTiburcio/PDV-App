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
    const [codIbge, setCodIbge] = useState('');
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
            cep: cep, log: log, num: num, bai: bai, cid: cid, uf: uf, comlog: comLog, codibg: codIbge,appuser: { id: codusu }
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
            Alert.alert('Cliente cadastrado com sucesso', `${codusu} - ${fan}`)
            storeClienteData(dadosClienteStorage);
            navigation.pop();
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
            password: 'operaz', fon: fon, datnas: '2000-01-01', insest: insest, raz: raz, fan: fan, tipusu: 'comum'
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

    //Validações de formulários

    async function BuscaEnd(cep) {
        console.log(cep)
        const response = await api.get(`https://viacep.com.br/ws/${cep}/json/`)
        console.log(response.data)
        setBai(response.data.bairro)
        setCid(response.data.localidade)
        setLog(response.data.logradouro)
        setUf(response.data.uf)
        setCodIbge(response.data.ibge)
    }

    function validaCpfCnpj(val) {
        if (val.length == 14) {
            var cpf = val.trim();
         
            cpf = cpf.replace(/\./g, '');
            cpf = cpf.replace('-', '');
            cpf = cpf.split('');
            
            var v1 = 0;
            var v2 = 0;
            var aux = false;
            
            for (var i = 1; cpf.length > i; i++) {
                if (cpf[i - 1] != cpf[i]) {
                    aux = true;   
                }
            } 
            
            if (aux == false) {
                return false; 
            } 
            
            for (var i = 0, p = 10; (cpf.length - 2) > i; i++, p--) {
                v1 += cpf[i] * p; 
            } 
            
            v1 = ((v1 * 10) % 11);
            
            if (v1 == 10) {
                v1 = 0; 
            }
            
            if (v1 != cpf[9]) {
                return false; 
            } 
            
            for (var i = 0, p = 11; (cpf.length - 1) > i; i++, p--) {
                v2 += cpf[i] * p; 
            } 
            
            v2 = ((v2 * 10) % 11);
            
            if (v2 == 10) {
                v2 = 0; 
            }
            
            if (v2 != cpf[10]) {
                return false; 
            } else {   
                return true; 
            }
        } else if (val.length == 18) {
            var cnpj = val.trim();
            
            cnpj = cnpj.replace(/\./g, '');
            cnpj = cnpj.replace('-', '');
            cnpj = cnpj.replace('/', ''); 
            cnpj = cnpj.split(''); 
            
            var v1 = 0;
            var v2 = 0;
            var aux = false;
            
            for (var i = 1; cnpj.length > i; i++) { 
                if (cnpj[i - 1] != cnpj[i]) {  
                    aux = true;   
                } 
            } 
            
            if (aux == false) {  
                return false; 
            }
            
            for (var i = 0, p1 = 5, p2 = 13; (cnpj.length - 2) > i; i++, p1--, p2--) {
                if (p1 >= 2) {  
                    v1 += cnpj[i] * p1;  
                } else {  
                    v1 += cnpj[i] * p2;  
                } 
            } 
            
            v1 = (v1 % 11);
            
            if (v1 < 2) { 
                v1 = 0; 
            } else { 
                v1 = (11 - v1); 
            } 
            
            if (v1 != cnpj[12]) {  
                return false; 
            } 
            
            for (var i = 0, p1 = 6, p2 = 14; (cnpj.length - 1) > i; i++, p1--, p2--) { 
                if (p1 >= 2) {  
                    v2 += cnpj[i] * p1;  
                } else {   
                    v2 += cnpj[i] * p2; 
                } 
            }
            
            v2 = (v2 % 11); 
            
            if (v2 < 2) {  
                v2 = 0;
            } else { 
                v2 = (11 - v2); 
            } 
            
            if (v2 != cnpj[13]) {   
                return false; 
            } else {  
                return true; 
            }
        } else {
            return false;
        }
     }

    function cnpj(v){
        v=v.replace(/\D/g,"")                           //Remove tudo o que não é dígito
        v=v.replace(/^(\d{2})(\d)/,"$1.$2")             //Coloca ponto entre o segundo e o terceiro dígitos
        v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3") //Coloca ponto entre o quinto e o sexto dígitos
        v=v.replace(/\.(\d{3})(\d)/,".$1/$2")           //Coloca uma barra entre o oitavo e o nono dígitos
        v=v.replace(/(\d{4})(\d)/,"$1-$2")              //Coloca um hífen depois do bloco de quatro dígitos
        return v
    }
    
    function cpf(v){
        v=v.replace(/\D/g,"")                    //Remove tudo o que não é dígito
        v=v.replace(/(\d{3})(\d)/,"$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
        v=v.replace(/(\d{3})(\d)/,"$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
                                                 //de novo (para o segundo bloco de números)
        v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
        return v
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
                                maxLength={30}
                                keyboardType='numeric'
                                onChangeText={text => {
                                    if (text.length > 11) {
                                        setCgc(cnpj(text))
                                    } else {
                                        setCgc(cpf(text))
                                    }
                                }}
                                onEndEditing={e => {
                                    let valida

                                    if (e.nativeEvent.text.length > 11) {
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
                                    //validaCpfCnpj(e.nativeEvent.text)           
                                }}
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
                                onChangeText={text => {setCep(text)}}
                                onEndEditing={e => {BuscaEnd(e.nativeEvent.text.replace(/[^0-9]/g,''))}}
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
                        <View style={{ width: '30%' }}>
                            <Text style={{ fontSize: 16, color: '#000000' }}>Numero: </Text>
                            <TextInput
                                style={styles.input}
                                keyboardType='numeric'
                                onChangeText={text => { setNum(text) }}
                                value={num}
                            />
                        </View>
                        <View style={{ width: '66.5%' }}>
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