import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, ScrollView, Text, Pressable, View } from 'react-native';
import api from '../services/api';
import { DataTable, TextInput } from 'react-native-paper';

export default function GradeAtacado({ codbar, item, itensCarrinho, setItensCarrinho }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [cores, setCores] = useState();
    const [tamanhos, setTamanhos] = useState([]);
    const [number, setNumber] = useState([]);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    // let itensCarrinho = [];

    useEffect(() => {
        getListarDetalhes();
    }, [codbar])


    async function getListarDetalhes() {
        const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`);
        setData(response.data);
        setCores(response.data.cores);
        setTamanhos(response.data.tamanhos);
    }

    function adicionaProdutoPelaGrade(cor, tamanho, quantidade) {
        let codmer;
        const codmerc = data.detalhes.filter(item => {
            return item.cor === cor && item.tamanho === tamanho
        })
        if (quantidade) {
            if (codmerc != '') {
                codmer = codmerc[0].codigo
                let itemcarrinho = { codmer: codmer, quantidade: quantidade, item: item, valor: codmerc[0].valor, cor: cor, tamanho: tamanho }
                let pos = itensCarrinho.findIndex(itensCarrinho => {
                    return itensCarrinho.codmer === codmer;
                });
                if (pos == '-1') {
                    itensCarrinho.push(itemcarrinho);
                } else {
                    let itemRemovido = itensCarrinho.splice(pos, 1)
                    itensCarrinho.push(itemcarrinho);
                }

            } else {
                //console.log('Não encontrado produto ' + cor + ' ' + tamanho);
            }
        } else {
            if (codmerc != '') {
                codmer = codmerc[0].codigo
                let pos = itensCarrinho.findIndex(itensCarrinho => {
                    return itensCarrinho.codmer === codmer;
                });
                if (pos != '-1') {
                    let itemRemovido = itensCarrinho.splice(pos, 1)
                }
            } else {
                //console.log('Não encontrado produto ' + cor + ' ' + tamanho);
            }
        }
    }

    function Grade() {
        return (
            <ScrollView horizontal={true}>
                <ScrollView
                    nestedScrollEnabled
                    bounces={false}
                    contentContainerStyle={{ height: cores ? cores.length * 120 : 0 }}
                >
                    <View>
                        <DataTable style={styles.modalView2}>
                            <DataTable.Header >
                                <DataTable.Title style={{ width: 79 }} />
                                {tamanhos.map(tamanho => {
                                    return <DataTable.Title key={tamanho} style={{ width: 15, justifyContent: 'center', fontWeight: 'bold', marginLeft: 2 }}>
                                        {tamanho}
                                    </DataTable.Title>
                                })}
                            </DataTable.Header>
                            {cores.map(cor => {
                                return <DataTable.Row style={styles.modalView3} key={cor.cod}>
                                    <View style={{ width: 120, justifyContent: 'center' }}><Text>{cor.padmer}</Text></View>
                                    {tamanhos.map(tamanho => {
                                        let quantidadeInserida = []
                                        quantidadeInserida = itensCarrinho.filter((item) => item.cor === cor.padmer && item.tamanho === tamanho);

                                        let value = quantidadeInserida[0]?.quantidade ?? '';

                                        return <DataTable.Cell style={{ marginLeft: 2 }} key={tamanho}>
                                            <TextInput
                                                style={styles.input}
                                                value={value}
                                                keyboardType='numeric'
                                                onChangeText={(text) => { 
                                                    adicionaProdutoPelaGrade(cor.padmer, tamanho, text);
                                                    value = text; 
                                                }}
                                            />
                                        </DataTable.Cell>
                                    })}
                                </DataTable.Row>
                            })}
                        </DataTable>
                    </View>
                </ScrollView>
            </ScrollView>
        );
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                propagateSwipe={true}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Informe a quantidade</Text>
                        {tamanhos.length > 0 && cores.length > 0 ? <Grade /> : <Text style={styles.modalText}>Produto sem cores e tamanhos cadastrados</Text>}
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                if (modalVisible && itensCarrinho.length > 0) {
                                    setItensCarrinho(itensCarrinho);
                                    console.log(itensCarrinho);
                                }
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Confirmar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                    setModalVisible(true);
                }}
            >
                <Text style={styles.textStyle}>SELECIONAR COR E TAMANHO</Text>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30
    },
    modalView: {
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
    modalView3: {
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
        elevation: 2,
        fontWeight: 'bold'
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
        height: 35,
        borderWidth: 1,
        padding: 5
    },
    textCor: {
        height: 20,
        margin: 12,
    },
});