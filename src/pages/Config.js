import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import Checkbox from 'expo-checkbox';
import {
    gravarUsaCorTamanho,
    buscarUsaCorTamanho,
    gravarUsaGrade,
    buscarUsaGrade,
    gravarUsaEstoquePorCategoria,
    buscarUsaEstoquePorCategoria,
    gravarUsaControleEstoque,
    buscarUsaControleEstoque
} from '../controle/ConfigStorage';
import api from '../services/api';

export default function Config({ navigation }) {
    const [endApi, setEndApi] = useState(api.defaults.baseURL);
    const [usaCorTamanho, setUsaCorTamanho] = useState(false);
    const [usaGrade, setUsaGrade] = useState(false);
    const [usaControleEstoque, setUsaControleEstoque] = useState(false);
    const [usaEstoquePorCategoria, setUsaEstoquePorCategoria] = useState(false);

    async function Salvar() {
        // await gravarUsaCorTamanho(usaCorTamanho.toString());
        // await gravarUsaGrade(usaGrade.toString());
        // await gravarUsaEstoquePorCategoria(usaEstoquePorCategoria.toString());
        // await gravarUsaControleEstoque(usaControleEstoque.toString());

        // Alert.alert('Sucesso', 'Configurações salvas', [
        //     {
        //         text: "Ok",
        //         onPress: () => {
        //             navigation.navigate('Produtos')
        //         },
        //     },
        // ]);

        navigation.pop();
    }

    async function getConfig() {
        // buscarUsaCorTamanho().then(result => {
        //     if (result) {
        //         setUsaCorTamanho(JSON.parse(result));   
        //     }
        // })
        // buscarUsaGrade().then(result => {
        //     if (result) {
        //         setUsaGrade(JSON.parse(result));
        //     }
        // })
        // buscarUsaEstoquePorCategoria().then(result => {
        //     if (result) {
        //         setUsaEstoquePorCategoria(JSON.parse(result));
        //     }
        // })
        // buscarUsaControleEstoque().then(result => {
        //     if (result) { 
        //         setUsaControleEstoque(JSON.parse(result));
        //     }
        // })

        const response = await api.get('/configs');
        const usaGrade = response.data.filter((config) => config.con === 'UsaGra');
        const controlaEstoque = response.data.filter((config) => config.con === 'VenAciEst');

        if (usaGrade) {
            setUsaGrade(Boolean(usaGrade[0].val));
        }
        if (controlaEstoque) {
            setUsaControleEstoque(!Boolean(controlaEstoque[0].val));
        }
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            getConfig();
        });
    }, [navigation]);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configurações</Text>
            <View style={styles.form}>
                <View>
                    <Text style={styles.fieldText}>Endereço da API: </Text>
                    <TextInput
                        style={styles.input}
                        value={endApi}
                        onFocus={() => Alert.alert('Atenção suporte', 'Campo fixo.')}
                    />
                    {/* <View style={styles.checkBoxView}>
                        <Text style={styles.fieldText}>Usa cor e tamanho(Varejo)?</Text>
                        <Checkbox
                            value={usaCorTamanho}
                            onValueChange={() => {
                                setUsaCorTamanho(!usaCorTamanho)
                                if (usaGrade || usaEstoquePorCategoria) {
                                    setUsaGrade(false)
                                    setUsaEstoquePorCategoria(false)
                                }
                            }}
                            style={styles.checkBox}
                        />
                    </View> */}
                    <View style={styles.checkBoxView}>
                        <Text style={styles.fieldText}>Usa cor e tamanho(Grade)?</Text>
                        <Checkbox
                            value={usaGrade}
                            onValueChange={() => {
                                // setUsaGrade(!usaGrade)
                                // if (usaCorTamanho || usaEstoquePorCategoria) {
                                //     setUsaCorTamanho(false)
                                //     setUsaEstoquePorCategoria(false)
                                // }
                                Alert.alert('Atenção', 'Configurações devem ser feitas pelo sigepe ou tabela config. Parâmetro UsaGra');
                            }}
                            style={styles.checkBox}
                        />
                    </View>
                    <View style={styles.checkBoxView}>
                        <Text style={styles.fieldText}>Usa controle de estoque?</Text>
                        <Checkbox
                            value={usaControleEstoque}
                            onValueChange={() => {
                                // setUsaControleEstoque(!usaControleEstoque)
                                Alert.alert('Atenção', 'Configurações devem ser feitas pelo sigepe ou tabela config. Parâmetro VenAciEst');
                            }}
                            style={styles.checkBox}
                        />
                    </View>
                    {/* <View style={styles.checkBoxView}>
                        <Text style={styles.fieldText}>Usa estoque por Categoria?</Text>
                        <Checkbox
                            value={usaEstoquePorCategoria}
                            onValueChange={() => {
                                setUsaEstoquePorCategoria(!usaEstoquePorCategoria)
                                if (usaCorTamanho || usaGrade) {
                                    setUsaCorTamanho(false)
                                    setUsaGrade(false)
                                }
                            }}
                            style={styles.checkBox}
                        />
                    </View> */}
                    <View>
                        <TouchableOpacity
                            style={styles.SalvarButton}
                            activeOpacity={0.5}
                            onPress={() => Salvar()}>
                            <Text style={styles.TextButton}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    form: {
        marginLeft: '5%',
        marginTop: '3%'
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
    fieldText: {
        fontSize: 18,
        color: '#000'
    },
    checkBoxView: {
        flexDirection: 'row',
        marginTop: '5%'
    },
    checkBox: {
        marginLeft: '2%',
        marginTop: '1%',
    },
    SalvarButton: {
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
        fontWeight: 'bold'
    },
});