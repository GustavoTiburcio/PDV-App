import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import { buscarItensCarrinhoNoBanco, deletarItenCarrinhoNoBanco, gravarItensCarrinhoUsaGrade, limparItensCarrinhoNoBanco } from '../controle/CarrinhoStorage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import { ConvertNumberParaReais } from '../utils/ConvertNumberParaReais';

const { width } = Dimensions.get("window");

function Carrinho({ navigation }) {
    const [itensCarrinho, setItensCarrinho] = useState([]);
    const [valorBruto, setValorBruto] = useState(0);

    async function excluirCarrinho() {
        const result = await limparItensCarrinhoNoBanco();
        setItensCarrinho([]);
        setValorBruto(0);
    }

    async function buscarItens() {
        await buscarItensCarrinhoNoBanco().then(resultado => {
            if (resultado) {
                const setValorBrutoInicial = () => resultado.reduce(
                    (valorAnterior, item) =>
                        valorAnterior + (item.valor * item.quantidade),
                    0,
                );
                setValorBruto(setValorBrutoInicial);
                setItensCarrinho(resultado);
            }
        });
    }

    async function IncrementarQuantidade(item) {
        const produtosCarrinho = itensCarrinho;

        const itemIndex = produtosCarrinho.indexOf(item);

        if (itemIndex !== -1) {
            produtosCarrinho[itemIndex].quantidade = String(Number(produtosCarrinho[itemIndex].quantidade) + 1);

            await limparItensCarrinhoNoBanco();
            await gravarItensCarrinhoUsaGrade(produtosCarrinho);

            buscarItens();
        }
    }

    async function DecrementarQuantidade(item) {
        const produtosCarrinho = itensCarrinho;

        const itemIndex = produtosCarrinho.indexOf(item);

        if (itemIndex !== -1) {
            if (produtosCarrinho[itemIndex].quantidade == '1') {
                if (produtosCarrinho.length === 1) {
                    await limparItensCarrinhoNoBanco();
                    setItensCarrinho([]);
                    setValorBruto(0);
                    buscarItens();
                    return;
                }
                await deletarItenCarrinhoNoBanco(item);
                buscarItens();
                return;
            }

            produtosCarrinho[itemIndex].quantidade = String(Number(produtosCarrinho[itemIndex].quantidade) - 1);

            await limparItensCarrinhoNoBanco();
            await gravarItensCarrinhoUsaGrade(produtosCarrinho);

            buscarItens();
        }
    }

    function ListItem({ item }) {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.imageView}>
                    <Image
                        style={styles.image}
                        source={{
                            uri: item?.linkfot ? 'https://' + item.linkfot : 'https://higa.membros.supermercadozen.com.br/assets/tema01/img/produto-sem-foto.png'
                        }}
                    />
                </View>
                <View style={styles.produtoInfoView}>
                    <Text style={styles.produtoText}>
                        {item.item}
                    </Text>
                    {item?.cor &&
                        <Text style={styles.produtoText}>
                            Cor: {item.cor}
                        </Text>
                    }
                    {item?.tamanho &&
                        <Text style={styles.produtoText}>
                            Tamanho: {item.tamanho}
                        </Text>
                    }
                    <Text style={styles.produtoValorText}>
                        {ConvertNumberParaReais(item.valor)}
                    </Text>
                </View>
                <View style={styles.buttonsView}>
                    <TouchableOpacity onPress={() => DecrementarQuantidade(item)}>
                        <FontAwesome
                            name='minus-circle'
                            size={25}
                            color='#c91e1e'
                        />
                    </TouchableOpacity>
                    <Text style={styles.quantidadeText}>{item.quantidade}</Text>
                    <TouchableOpacity onPress={() => IncrementarQuantidade(item)}>
                        <FontAwesome
                            name='plus-circle'
                            size={25}
                            color='#38A69D'
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            buscarItens();
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            {itensCarrinho.length > 0 ?
                <TouchableOpacity
                    onPress={() => excluirCarrinho()}
                    style={styles.limparCarrinhoButton}>
                    <Text style={styles.limparCarrinhoButtonText}>
                        Limpar Carrinho
                    </Text>
                </TouchableOpacity> :
                <></>
            }
            {itensCarrinho.length > 0 ?
                <FlatList
                    data={itensCarrinho}
                    contentContainerStyle={styles.flatListContainer}
                    keyExtractor={(item, index) => String(index)}
                    scrollEnabled={true}
                    renderItem={({ item }) => <ListItem item={item} />}
                    ItemSeparatorComponent={({ highlighted }) => (
                        <View style={styles.separator} />
                    )}
                /> :
                <View style={styles.carrinhoVazioView}>
                    <LottieView
                        source={require('../images/carrinhovazio.json')}
                        autoPlay={true}
                        loop={true}
                        style={styles.lottieView}
                    />
                    <Text style={styles.carrinhoVazioText}>Carrinho vazio...</Text>
                </View>
            }
            <View style={styles.rodapeView}>
                <View style={styles.totalView}>
                    <Text style={styles.totalText}>Total:</Text>
                    <Text style={styles.total}>{ConvertNumberParaReais(valorBruto)}</Text>
                </View>
                <View style={styles.finalizarButton}>
                    <TouchableOpacity style={[styles.buttonFinalizar, { opacity: itensCarrinho.length <= 0 ? 0.5 : 1 }]}
                        disabled={itensCarrinho.length <= 0}
                        onPress={() => { navigation.navigate('FinalizarCarrinho') }}
                    >
                        <Text style={styles.finalizarButtonText}>
                            Finalizar
                        </Text>
                        <Ionicons
                            name='arrow-forward'
                            size={25}
                            color='#FFF'
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    limparCarrinhoButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#c91e1e',
        margin: 10,
        padding: 5,
        borderRadius: 20,
        elevation: 5
    },
    limparCarrinhoButtonText: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    flatListContainer: {
        flexGrow: 1,
        paddingBottom: 20
    },
    separator: {
        padding: 10
    },
    carrinhoVazioView: {
        height: '85%',
        justifyContent: 'center'
    },
    lottieView: {
        width, height: '50%',
        alignSelf: 'center'
    },
    carrinhoVazioText: {
        textAlign: 'center',
        fontSize: 24
    },
    rodapeView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '15%',
        backgroundColor: '#FFF'
    },
    totalView: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
        marginLeft: '5%'
    },
    totalText: {
        fontSize: 18,
        color: '#808080'
    },
    total: {
        fontWeight: 'bold',
        fontSize: 20
    },
    finalizarButton: {
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonFinalizar: {
        flexDirection: 'row',
        width: '80%',
        height: 40,
        backgroundColor: '#c91e1e',
        borderRadius: 20,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        elevation: 5,
    },
    finalizarButtonText: {
        fontWeight: 'bold',
        color: '#FFF',
        fontSize: 18
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        height: 100,
        backgroundColor: '#FFF',
        alignSelf: 'center',
        borderRadius: 5,
        elevation: 5
    },
    imageView: {
        width: '23%',
        height: '90%',
        marginLeft: 5
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    produtoInfoView: {
        marginLeft:3,
        width: '45%',
        height: '80%',
        justifyContent: 'space-evenly'
    },
    produtoText: {
        fontSize: 12,
        textTransform: 'uppercase'
    },
    produtoValorText: {
        color: '#808080',
        fontSize: 12,
        fontWeight: 'bold'
    },
    buttonsView: {
        flexDirection: 'row',
        width: '28%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    quantidadeText: {
        fontSize: 25
    }
});
export default Carrinho;