import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, ScrollView, Text, Alert, Image, Pressable,View, TextInput } from 'react-native';
import api from '../api';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default function GradeAtacado({ codbar, setCor, setTamanho }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [valueCor, setValueCor] = useState(null);
    const [valueTamanho, setValueTamanho] = useState(null);
    const [tamanhos, setTamanhos] = useState([
        { label: '', value: '' }
    ]);
    const [cores, setCores] = useState([
        { label: '', value: '' }
    ]);

    // const alteraDados = () => {
    //     setCor(valueCor)
    //     setTamanho(valueTamanho)
    // }

    useEffect(() => {
        getListarDetalhes()
    }, [])

    // useEffect(() => {
    //     alteraDados();
    // }, [valueTamanho, valueCor])

    async function getListarDetalhes() {
        const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
        const cores = response.data.cores.map(item => { return { label: item.padmer, value: item.padmer } })
        const tamanhos = response.data.tamanhos.map(item => { return { label: item, value: item } })
        setCores(cores);
        setTamanhos(tamanhos)
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>GRADE</Text>
                        <Grid>
                            <Col size={15}>
                                <Row style={styles.cell}>
                                    <Text></Text>
                                </Row>
                                <Row style={styles.cell}>
                                    <Text style={styles.textCor}>Rosa</Text>
                                </Row>
                            </Col>
                            <Col size={15}>
                                <Row style={styles.cell}>
                                    <Text>P</Text>
                                </Row>
                                <Row style={styles.cell}>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={() => {}}
                                        
                                        keyboardType="numeric"
                                    />
                                </Row>
                            </Col>
                        </Grid>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.textStyle}>SELECIONAR COR E TAMANHO</Text>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: "0%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 5,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 10,
        padding: 20,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold'
    },
    cell: {
        borderWidth: 1,
        borderColor: '#000',
        flex: 0,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    input: {
        height: 20,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
    textCor: {
        height: 20,
        margin: 12,
    },
    cellCabeçalho: {
        borderWidth: 0,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
});