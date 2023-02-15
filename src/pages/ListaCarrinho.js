/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, Text, Alert, Image, View, TextInput, TouchableOpacity } from 'react-native';
import api from '../services/api';
import CorTamanho from '../components/CorTamanho';
import GradeAtacado from '../components/GradeAtacado';
import { gravarItensCarrinhoUsaGrade, gravarItensCarrinho } from '../controle/CarrinhoStorage';
import { buscarUsaCorTamanho, buscarUsaGrade, buscarUsaEstoquePorCategoria, buscarUsaControleEstoque } from '../controle/ConfigStorage';
import { buscarLogin } from '../controle/LoginStorage';
import Slider from '../components/Slider';
import { ConvertNumberParaReais } from '../utils/ConvertNumberParaReais';

const { width } = Dimensions.get("window");

const ListaCarrinho = ({ route, navigation }) => {
    const codbar = route.params?.codbar;
    const item = route.params?.mer;

    const [quantidade, setQuantidade] = useState();
    const [valorItem, setValorItem] = useState('0');
    const [data, setData] = useState();
    const [cor, setCor] = useState();
    const [tamanho, setTamanho] = useState();
    const [itensCarrinho, setItensCarrinho] = useState();
    const [fotos, setFotos] = useState([]);
    const [codigoProd, setCodigoProd] = useState();
    const [obs, setObs] = useState('');

    //configs
    const [usaCorTamanho, setUsaCorTamanho] = useState(false);
    const [usaGrade, setUsaGrade] = useState(false);
    const [usaControleEstoque, setUsaControleEstoque] = useState(false)
    const [usaEstoquePorCategoria, setUsaEstoquePorCategoria] = useState(false);

    //login
    const [dadosLogin, setDadosLogin] = useState();

    useEffect(() => {
    }, [data, fotos, quantidade, valorItem])

    useEffect(() => {
        getData();
        getConfig();
    }, []);

    async function getData() {
        const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`);
        const prod = response.data.detalhes.map(item => [item.codigo, item.codbar, item.valor]);
        const fotos = response.data.fotos.map(fotos => { return { linkfot: fotos.linkfot } });

        setCodigoProd(prod[0][0]);
        setData(response.data);
        setValorItem(response.data?.detalhes[0]?.valor.toFixed(2) ?? 0);
        setFotos(fotos);

        if (response.data?.cores.length > 0 || response.data?.tamanhos.length > 0) {
            setUsaCorTamanho(true);
        }
    }

    async function getConfig() {
        const login = await buscarLogin();
        const usaestoqueporcategoria = await buscarUsaEstoquePorCategoria();
        const usagrade = await buscarUsaGrade();
        const usacontroleestoque = await buscarUsaControleEstoque();

        if (login) {
            setDadosLogin(login);
        }
        if (usaestoqueporcategoria) {
            setUsaEstoquePorCategoria(JSON.parse(usaestoqueporcategoria));
        }
        if (usagrade) {
            setUsaGrade(JSON.parse(usagrade));
        }
        if (usacontroleestoque) {
            setUsaControleEstoque(JSON.parse(usacontroleestoque));
        }
    }

    const addItemCarrinho = () => {
        const itens = { codmer: codigoProd, quantidade: quantidade, item: item, valor: valorItem, obs: obs };

        if (usaGrade) {
            gravarItensCarrinhoUsaGrade(itensCarrinho).then(resultado => {
                Alert.alert('Sucesso', 'Foi adicionado ao carrinho', [{ text: 'OK' }]);
                navigation.pop();
                return;
            })
            return;
        }
        if (usaCorTamanho) {
            console.log('usa cor e tamanho varejo');
            Alert.alert('Opção em construção')
            return;
        }
        if (!quantidade) {
            Alert.alert('Quantidade vazia', 'Informe a quantidade');
            return;
        }
        if (!valorItem) {
            Alert.alert('Valor de venda', 'Informe o valor');
            return;
        }
        if (usaControleEstoque && data.detalhes[0].estoque >= quantidade) {
            Alert.alert('Estoque insuficiente', 'Estoque atual: ' + data.detalhes[0].estoque);
            return;
        }
        gravarItensCarrinho(itens).then(resultado => {
            Alert.alert('Sucesso', item + ' Foi adicionado ao carrinho', [{ text: 'OK' }]);
            navigation.pop();
            return;
        })
    };

    return (
        <View style={styles.container}>
            {fotos.length > 0 ?
                <Slider fotos={fotos} /> :
                <View style={{ width, height: 250, alignSelf: 'center' }}>
                    <Image
                        resizeMode='center'
                        style={{ height: 250 }}
                        source={{
                            uri: 'https://higa.membros.supermercadozen.com.br/assets/tema01/img/produto-sem-foto.png'
                        }}
                    />
                </View>
            }
            <View style={styles.fields}>
                <Text style={{ alignSelf: 'center' }}> {codbar} </Text>
                <Text style={styles.item}>{item}</Text>
                {!usaEstoquePorCategoria && !usaGrade && !usaCorTamanho && <Text>Estoque atual: {data?.detalhes[0]?.estoque ? Number(data.detalhes[0].estoque).toFixed(2) : 0}</Text>}
                {!usaCorTamanho && !usaGrade ?
                    <View>
                        <Text style={styles.text}>Quantidade:</Text>
                        <TextInput
                            style={styles.textinput}
                            keyboardType="numeric"
                            autoFocus={true}
                            placeholder="Quantidade"
                            onChangeText={value => setQuantidade(value.replace(',', '.'))}
                            value={quantidade}
                        />
                        <Text style={styles.text}>Valor R$:</Text>
                        <TextInput
                            style={styles.textinput}
                            keyboardType="numeric"
                            placeholder="Valor do produto"
                            onChangeText={value => setValorItem(value.replace(',', '.'))}
                            value={valorItem}
                        />
                        <Text style={styles.text}>Observação:</Text>
                        <TextInput
                            style={styles.textinput}
                            placeholder="Obs"
                            multiline={true}
                            onChangeText={value => setObs(value)}
                            value={obs}
                        />
                    </View>
                    : <></>
                }
                {usaGrade ?
                    <View>
                        <Text style={styles.text}>Valor R$:</Text>
                        <Text style={styles.textinput}>{valorItem}</Text>
                        <GradeAtacado codbar={codbar} item={item} setItensCarrinho={setItensCarrinho} />
                        <TouchableOpacity
                            style={styles.AdicionarButton}
                            activeOpacity={0.5}
                            onPress={() => { addItemCarrinho() }}>
                            <Text style={styles.TextButton}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                    : <></>
                }
                {usaCorTamanho ?
                    <View>
                        <Text style={styles.text}>Quantidade:</Text>
                        <TextInput
                            style={styles.textinput}
                            keyboardType="numeric"
                            autoFocus={true}
                            placeholder="Quantidade"
                            onChangeText={value => setQuantidade(value.replace(',', '.'))}
                            value={quantidade}
                        />
                        <Text style={styles.text}>Valor R$:</Text>
                        <Text style={styles.textinput}>{valorItem}</Text>
                        <CorTamanho codbar={codbar} setCor={setCor} setTamanho={setTamanho} />
                        <View>
                            <TouchableOpacity
                                style={styles.AdicionarButton}
                                activeOpacity={0.5}
                                onPress={() => { addItemCarrinho() }}>
                                <Text style={styles.TextButton}>Adicionar {ConvertNumberParaReais((valorItem * (quantidade ? quantidade : 0)))}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    : <></>
                }
                {!usaCorTamanho && !usaGrade ?
                    <View>
                        <TouchableOpacity
                            style={styles.AdicionarButton}
                            activeOpacity={0.5}
                            onPress={() => { addItemCarrinho() }}>
                            <Text style={styles.TextButton}>Adicionar {ConvertNumberParaReais((valorItem * (quantidade ? quantidade : 0)))}</Text>
                        </TouchableOpacity>
                    </View> : <></>
                }
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    fields: {
        marginLeft: 20,
    },
    item: {
        color: '#000000',
        fontSize: 20,
        marginTop: 15,
    },
    text: {
        color: '#000000',
        fontSize: 16,
        marginTop: 15,
    },
    textinput: {
        fontSize: 20,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        width: '90%'
    },
    AdicionarButton: {
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
    },
});

export default ListaCarrinho;