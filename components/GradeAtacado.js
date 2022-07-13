import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, ScrollView, Text, Alert, Image, Pressable, View, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { DataTable, TextInput } from 'react-native-paper';

export default function GradeAtacado({ codbar, item, setItensCarrinho }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [cores, setCores] = useState();
    const [tamanhos, setTamanhos] = useState();
    const [number, onChangeNumber] = useState();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    let itensCarrinho = [];

    useEffect(() => {
        getListarDetalhes()
    }, [codbar])


    async function getListarDetalhes() {
        const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
        setData(response.data);
        setCores(response.data.cores);
        setTamanhos(response.data.tamanhos);
    }

    function adicionaProdutoPelaGrade(cor, tamanho, quantidade) {
        let codmer;
        const codmerc = data.detalhes.filter(item => {
            return item.cor === cor && item.tamanho === tamanho
        })
        if (quantidade != '' && quantidade != '0' && quantidade != '00') {
            if (codmerc != '') {
                codmer = codmerc[0].codigo
                let itemcarrinho = { codmer: codmer, quantidade: quantidade, item: item, valor: codmerc[0].valor, cor: cor, tamanho: tamanho }
                let pos = itensCarrinho.findIndex(itensCarrinho => {
                    return itensCarrinho.codmer === codmer;
                });
                if (pos == '-1') {
                    itensCarrinho.push(itemcarrinho);
                } else {
                    var itemRemovido = itensCarrinho.splice(pos, 1)
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
                    var itemRemovido = itensCarrinho.splice(pos, 1)
                }
            } else {
                //console.log('Não encontrado produto ' + cor + ' ' + tamanho);
            }
        }
    }

    function FooterList(Load) {
        if (Load.load == false) {
            return null
        } else {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size='large' color="#121212" />
                </View>
            )
        }
    }


    function grade() {
        const grade =
            <ScrollView horizontal={true} style={{}}>
                <ScrollView
                    nestedScrollEnabled
                    bounces={false}
                    contentContainerStyle={{ height: cores ? cores.length * 120 : 0  }}
                >
                    <View style={{ }}>
                        <DataTable style={styles.modalView2}>
                            <DataTable.Header style={{ marginLeft: '2%' }}>
                                <DataTable.Title />
                                <DataTable.Title />
                                <DataTable.Title />
                                {tamanhos.map(tamanho => {
                                    return <DataTable.Title key={tamanho} style={{marginLeft: '4%'}}>{tamanho}</DataTable.Title>
                                })}
                            </DataTable.Header>
                            {cores.map(cor => {
                                return <DataTable.Row style={styles.modalView2} key={cor.cod}>
                                    <View style={{ width: '20%', justifyContent: 'center'}}><Text>{cor.padmer}</Text></View>
                                    {tamanhos.map(tamanho => {
                                        return <DataTable.Cell style={{ }} key={tamanho}>
                                            <TextInput
                                                style={styles.input}
                                                value={number}
                                                keyboardType='numeric'
                                                onChangeText={(text) => { adicionaProdutoPelaGrade(cor.padmer, tamanho, text) }}
                                            />
                                        </DataTable.Cell>
                                    })}
                                </DataTable.Row>
                            })}
                        </DataTable>
                    </View>
                </ScrollView>
            </ScrollView>;
        return grade;
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
                        <Text style={styles.modalText}>GRADE</Text>
                        {tamanhos !== undefined && cores !== undefined? grade() : <Text style={styles.modalText}>Produto sem cores e tamanhos cadastrados</Text>}
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
        height: 35,
        borderWidth: 1,
        padding: 5
    },
    textCor: {
        height: 20,
        margin: 12,
    },
});