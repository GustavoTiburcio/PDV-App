/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import api from '../services/api';
import DropDownPicker from 'react-native-dropdown-picker';

export default function CorTamanho({ codbar, setCor, setTamanho }) {

    const [openCorPicker, setOpenCorPicker] = useState(false);
    const [openTamanhoPicker, setOpenTamanhoPicker] = useState(false);
    const [valueCor, setValueCor] = useState(null);
    const [valueTamanho, setValueTamanho] = useState(null);
    const [tamanhos, setTamanhos] = useState([
        { label: '', value: '' }
    ]);
    const [cores, setCores] = useState([
        { label: '', value: '' }
    ]);

    const alteraDados = () => {
        setCor(valueCor)
        setTamanho(valueTamanho)
    }

    useEffect(() => {
        getListarDetalhes()
    }, [])

    useEffect(() => {
        alteraDados();
    }, [valueTamanho, valueCor])

    async function getListarDetalhes() {
        const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
        const cores = response.data.cores.map(item => { return { label: item.padmer, value: item.padmer } })
        const tamanhos = response.data.tamanhos.map(item => { return { label: item, value: item } })
        setCores(cores);
        setTamanhos(tamanhos)
    }


    return (
        <View>
            <Text style={styles.text}>Cor:</Text>
            <DropDownPicker
                style={styles.picker}
                dropDownDirection="TOP"
                placeholder="Selecionar"
                open={openCorPicker}
                value={valueCor}
                items={cores}
                setOpen={() => { setOpenCorPicker(!openCorPicker); setOpenTamanhoPicker(false) }}
                setValue={setValueCor}
                setItems={setCores}
                dropDownContainerStyle={{
                    width: '50%'
                }}
                ListEmptyComponent={() => (
                    <View style={{ justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#38A69D" />
                    </View>
                )}
            />
            <Text style={styles.text}>Tamanho:</Text>
            <DropDownPicker
                style={styles.picker}
                placeholder="Selecionar"
                open={openTamanhoPicker}
                value={valueTamanho}
                items={tamanhos}
                setOpen={() => { setOpenTamanhoPicker(!openTamanhoPicker); setOpenCorPicker(false) }}
                setValue={setValueTamanho}
                setItems={setTamanhos}
                dropDownContainerStyle={{
                    width: '50%'
                }}
                ListEmptyComponent={() => (
                    <View style={{justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#38A69D" />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        color: '#555555',
        fontSize: 16,
        marginTop: 15,
    },
    picker: {
        width: '50%'
    },
});