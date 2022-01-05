import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, ScrollView, Text, Alert, Image, Pressable, View } from 'react-native';
import api from '../api';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DataTable, TextInput } from 'react-native-paper';

export default function GradeAtacado({ codbar, item, setItensCarrinho }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [cores, setCores] = useState();
    const [tamanhos, setTamanhos] = useState();
    const [number, onChangeNumber] = useState();
    const [data, setData] = useState();

    let itensCarrinho = [];

    // const [cor, setCor] = useState();
    // const [tamanho, setTamanho] = useState();

    // const alteraDados = () => {
    //     setCor(valueCor)
    //     setTamanho(valueTamanho)
    // }

    useEffect(() => {
        getListarDetalhes()
    }, [codbar])

    // useEffect(() => {
    //     alteraDados();
    // }, [valueTamanho, valueCor])

    async function getListarDetalhes() {
        const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
        console.log(response.data);
        console.log(response.data.cores);
        console.log(response.data.tamanhos);
        setData(response.data);
        setCores(response.data.cores);
        setTamanhos(response.data.tamanhos);
    }

    function adicionaProdutoPelaGrade(cor, tamanho, quantidade) {
        let codmer;
        console.log('cor: ' + cor)
        console.log('tamanho: ' + tamanho)
        const codmerc = data.detalhes.filter(item => {
            return item.cor === cor && item.tamanho === tamanho
        })
        console.log(codmerc)
        if (quantidade != '' && quantidade != '0' && quantidade != '00') {
            if (codmerc != '') {
                codmer = codmerc[0].codigo
                let itemcarrinho = { codmer: codmer, quantidade: quantidade, item: item, valor: codmerc[0].valor, cor: cor, tamanho: tamanho }
                // console.log('Para adicionar no array: ');
                // console.log(itemcarrinho);
                let pos = itensCarrinho.findIndex(itensCarrinho => {
                    return itensCarrinho.codmer === codmer;
                });
                if (pos == '-1') {
                    itensCarrinho.push(itemcarrinho);
                    console.log(itensCarrinho);
                } else {
                    var itemRemovido = itensCarrinho.splice(pos, 1)
                    console.log('Item removido: ')
                    console.log(itemRemovido)
                    itensCarrinho.push(itemcarrinho);
                    console.log(itensCarrinho);
                }

            } else {
                console.log('Não encontrado produto ' + cor + ' ' + tamanho);
            }
        } else {
            if (codmerc != '') {
                codmer = codmerc[0].codigo
                let pos = itensCarrinho.findIndex(itensCarrinho => {
                    return itensCarrinho.codmer === codmer;
                });
                console.log('indice do array ' + pos);
                if (pos != '-1') {
                    var itemRemovido = itensCarrinho.splice(pos, 1)
                    console.log('Item removido: ')
                    console.log(itemRemovido)
                }
                console.log(itensCarrinho)
            } else {
                console.log('Não encontrado produto ' + cor + ' ' + tamanho);
            }
        }
    }

    function grade() {
        const grade = <View style={{ height: "80%" }}>
            <ScrollView horizontal style={{ height: 300 }}>
                <DataTable style={styles.modalView2}>
                    <DataTable.Header style={{ marginHorizontal: -28 }}>
                        <DataTable.Title />
                        <DataTable.Title />
                        <DataTable.Title />
                        {tamanhos.map(tamanho => {
                            return <DataTable.Title key={tamanho}>{tamanho}</DataTable.Title>
                        })}
                    </DataTable.Header>

                    {cores.map(cor => {
                        return <DataTable.Row style={styles.modalView2} key={cor.cod}>
                            <DataTable.Cell style={{ width: 80 }}>{cor.padmer}</DataTable.Cell>
                            {tamanhos.map(tamanho => {
                                return <DataTable.Cell style={{ marginLeft: 5 }} key={tamanho}>
                                    <TextInput
                                        style={styles.input}
                                        value={number}
                                        keyboardType='numeric'
                                        onChangeText={(text) => { adicionaProdutoPelaGrade(cor.padmer, tamanho, text) }}
                                        // onEndEditing={(e) => {
                                        //     adicionaProdutoPelaGrade(cor.padmer, tamanho, e.nativeEvent.text)
                                        // }}
                                    />
                                </DataTable.Cell>
                            })}
                        </DataTable.Row>
                    })}
                </DataTable>
            </ScrollView>
        </View>
        return grade;
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
                        {tamanhos ? grade() : null}
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                if (modalVisible) {
                                    setItensCarrinho(itensCarrinho)
                                }
                                setModalVisible(!modalVisible)
                            }}
                        >
                            <Text style={styles.textStyle}>Confirmar</Text>
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
    modalView2: {
        marginTop: 10,
        backgroundColor: "white",
        alignItems: "center",
        shadowColor: "#000",
        minWidth: 500,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10
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
        backgroundColor: '#F3F3F3',
        height: 40,
        margin: 15,
        borderWidth: 1,
        padding: 5
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