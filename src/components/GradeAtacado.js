import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Modal, ScrollView, Text, Pressable, View, TouchableOpacity, Keyboard } from 'react-native';
import api from '../services/api';
import { DataTable, TextInput } from 'react-native-paper';

export default function GradeAtacado({ codbar, item, itensCarrinho, setItensCarrinho, setLoading }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [cores, setCores] = useState();
    const [tamanhos, setTamanhos] = useState([]);
    const [number, setNumber] = useState('');
    const [data, setData] = useState();

    const [inputs, setInputs] = useState([]);

    const inputRef = useRef([]);

    // let inputsValues = [];

    // let itensCarrinho = [];

    useEffect(() => {
        getListarDetalhes();
    }, [codbar])


    async function getListarDetalhes() {
        try {
            const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`);
            setData(response.data);
            setCores(response.data.cores);
            setTamanhos(response.data.tamanhos);

            const teste = response.data.cores.map(cor => {
                return response.data.tamanhos.map(tamanho => '');
            });

            setInputs(teste);

        } catch (error) {
            console.log(error);
        }
    }

    function adicionaProdutoPelaGrade(cor, tamanho, quantidade) {
        let codmer;

        const codmerc = data?.detalhes.filter(item => {
            return item.cor === cor && item.tamanho === tamanho
        });

        const padmer = data?.cores.filter(padmer => padmer.padmer === cor);
        
        const fotoProduto = data?.fotos.filter(foto => foto.codpad === padmer[0].cod);

        //adiciona produto já alterando quantidade se já existir
        if (quantidade && quantidade !== '0') {
            if (codmerc.length > 0) {
                codmer = codmerc[0].codigo;

                const itemcarrinho = {
                    codmer: codmer, quantidade: quantidade, item: item,
                    valor: codmerc[0].valor, cor: cor, tamanho: tamanho, linkfot: fotoProduto.length > 0 ? fotoProduto[0].linkfot : data.fotos[0]?.linkfot
                }

                const pos = itensCarrinho.findIndex(itensCarrinho => {
                    return itensCarrinho.codmer === codmer;
                });

                if (pos == '-1') {
                    itensCarrinho.push(itemcarrinho);
                    return;
                }
                const itemRemovido = itensCarrinho.splice(pos, 1)
                itensCarrinho.push(itemcarrinho);
                return;
            }
            return;
        }

        //remove produto inserido ao mudar pra vazio a quantidade
        if (codmerc.length > 0) {
            codmer = codmerc[0].codigo

            const pos = itensCarrinho.findIndex(itensCarrinho => {
                return itensCarrinho.codmer === codmer;
            });
            if (pos != '-1') {
                const itemRemovido = itensCarrinho.splice(pos, 1);
                return;
            }
            return;
        }
        return;
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
                            {cores.map((cor, indexCor) => {
                                return <DataTable.Row style={styles.modalView3} key={cor.cod}>
                                    <View style={{ width: 120, justifyContent: 'center' }}><Text>{cor.padmer}</Text></View>
                                    {tamanhos.map((tamanho, indexTamanho) => {
                                        let quantidadeInserida = [];
                                        quantidadeInserida = itensCarrinho.filter((item) => item.cor === cor.padmer && item.tamanho === tamanho);

                                        if (quantidadeInserida.length > 0) {
                                            // console.log(quantidadeInserida);
                                        }

                                        let value = quantidadeInserida[0]?.quantidade ?? '';

                                        return <DataTable.Cell style={{ marginLeft: 2 }} key={tamanho}>
                                            <TextInput
                                                style={styles.input}
                                                // value={value ? value : undefined}
                                                value={inputs[indexCor][indexTamanho] ? inputs[indexCor][indexTamanho] : undefined}
                                                // ref={el => inputRef.current[indexCor][indexTamanho] = el}
                                                keyboardType='numeric'
                                                onChange={(e) => {
                                                    const newState = [...inputs];
                                                    newState[indexCor][indexTamanho] = e.nativeEvent.text;
                                                    setInputs(newState);
                                                    console.log('inseriu');
                                                    adicionaProdutoPelaGrade(cor.padmer, tamanho, e.nativeEvent.text);
                                                }}
                                            // onBlur={e => {
                                            //     console.log('doido')
                                            //     const newState = [...inputs];
                                            //     newState[indexCor][indexTamanho] = e.nativeEvent.text;
                                            //     setInputs(newState);
                                            //     if (e.nativeEvent.text) {
                                            //         // console.log('inseriu');
                                            //         adicionaProdutoPelaGrade(cor.padmer, tamanho, e.nativeEvent.text);
                                            //     }
                                            // }}
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
                onRequestClose={async () => {
                    Keyboard.dismiss();
                    if (modalVisible && itensCarrinho.length > 0) {
                        await setItensCarrinho(itensCarrinho);
                    }
                    // setModalVisible(!modalVisible);
                    setTimeout(() => {
                        setModalVisible(!modalVisible);
                    }, 200);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {tamanhos.length > 0 && cores.length > 0 ? <Text style={styles.modalText}>Informe a quantidade</Text> : <></>}
                        {tamanhos.length > 0 && cores.length > 0 ? <Grade /> : <Text style={styles.modalText}>Produto sem cores e tamanhos cadastrados</Text>}
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={async () => {
                                Keyboard.dismiss();
                                if (modalVisible && itensCarrinho.length > 0) {
                                    await setItensCarrinho(itensCarrinho);
                                }
                                // setModalVisible(!modalVisible);
                                setTimeout(() => {
                                    setModalVisible(!modalVisible);
                                }, 200);
                            }}
                        >
                            <Text style={styles.textStyle}>Confirmar</Text>
                        </TouchableOpacity>
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