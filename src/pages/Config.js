import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Alert
} from 'react-native';
import Checkbox from 'expo-checkbox';
import api from '../services/api';

export default function Config() {
    const [endApi, setEndApi] = useState(api.defaults.baseURL);
    const [usaGrade, setUsaGrade] = useState(false);
    const [usaControleEstoque, setUsaControleEstoque] = useState(false);

    async function getConfig() {
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
        getConfig();
    }, []);

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
                    <View style={styles.checkBoxView}>
                        <Text style={styles.fieldText}>Usa cor e tamanho(Grade)?</Text>
                        <Checkbox
                            value={usaGrade}
                            onValueChange={() => {
                                Alert.alert('Atenção', 'Configurações devem ser feitas pelo sigepe ou tabela config da API. Parâmetro UsaGra');
                            }}
                            style={styles.checkBox}
                        />
                    </View>
                    <View style={styles.checkBoxView}>
                        <Text style={styles.fieldText}>Usa controle de estoque?</Text>
                        <Checkbox
                            value={usaControleEstoque}
                            onValueChange={() => {
                                Alert.alert('Atenção', 'Configurações devem ser feitas pelo sigepe ou tabela config da API. Parâmetro VenAciEst');
                            }}
                            style={styles.checkBox}
                        />
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
});