/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, Alert, Image, View, TextInput } from 'react-native';
import api from '../api';
import DropDownPicker from 'react-native-dropdown-picker';

export default function GradeAtacado({codbar, setCor, setTamanho}) {

    const [openCorPicker, setOpenCorPicker] = useState(false);
    const [openTamanhoPicker, setOpenTamanhoPicker] = useState(false);
    const [valueCor, setValueCor] = useState(null);
    const [valueTamanho, setValueTamanho] = useState(null);
    const [tamanhos, setTamanhos] = useState([
        {label: '', value: ''}
    ]);
    const [cores, setCores] = useState([
        {label: '', value: ''}
    ]);

    const alteraDados = () => {
        setCor(valueCor)
        setTamanho(valueTamanho)
    }

    useEffect(()=>{
        getListarDetalhes()
    },[])

    useEffect(()=>{
        alteraDados();
    },[valueTamanho, valueCor])

    async function getListarDetalhes(){
        const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
        const cores = response.data.cores.map( item => {return { label: item.padmer, value: item.padmer }})
        const tamanhos = response.data.tamanhos.map( item => {return {label: item, value: item}})
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
                setOpen={setOpenCorPicker}
                setValue={setValueCor}
                setItems={setCores}
            />
        <Text style={styles.text}>Tamanho:</Text>
            <DropDownPicker
                style={styles.picker}
                placeholder="Selecionar"
                open={openTamanhoPicker}
                value={valueTamanho}
                items={tamanhos}
                setOpen={setOpenTamanhoPicker}
                setValue={setValueTamanho}
                setItems={setTamanhos}
            />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 20,
        justifyContent: 'flex-start',
    },
    textcadastro: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    item: {
        color: '#000000',
        fontSize: 20,
        marginTop: 15,
        alignItems: 'center',
    },
    text: {
        color: '#000000',
        fontSize: 16,
        marginTop: 15,
    },
    textinput: {
        fontSize: 20,
        borderBottomColor: '#000000',
        borderBottomWidth: 2,
    },
    texto: {
        color: '#000000',
        alignSelf: 'center',
    },
    listItem: {
        flex: 1,
        flexDirection: 'column',
        color: 'red',
    },
    picker: {
        width: '50%'
    },
});