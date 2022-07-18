/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage'

export const gravarItensCarrinhoNoBanco = async (itensCarrinho) => {
    try {
        // await AsyncStorage.removeItem('itensCarrinho');
        // await AsyncStorage.removeItem('i');
        let tem = false;
        let i = await AsyncStorage.getItem('i');
        let itens = [];
        let diferenca;
        if (i == '1') {
            const getJsonValue = await AsyncStorage.getItem('itensCarrinho');
            if (getJsonValue != null) {
                itens = JSON.parse(getJsonValue);

                diferenca = itensCarrinho.filter(ite => !itens.some(item => ite.codmer === item.codmer))

                itens.map((item) => {
                    itensCarrinho.map((ite) => {
                        if (item.codmer === ite.codmer) {
                            tem = true;
                            let som = parseInt(item.quantidade) + parseInt(ite.quantidade);
                            item.quantidade = som.toString();
                        }
                    })
                })
                if (diferenca) {
                    diferenca.map(item => {
                        itens.push(item)
                    })
                }
            }
            const jsonValue = JSON.stringify(itens)
            await AsyncStorage.setItem('itensCarrinho', jsonValue)
        } else {
            await AsyncStorage.setItem('i', '1');
            const jsonValue = JSON.stringify(itensCarrinho)
            await AsyncStorage.setItem('itensCarrinho', jsonValue)
        }
    } catch (e) {
        console.log(e)
    }
};

export const buscarItensCarrinhoNoBanco = async () => {
    const jsonValue = await AsyncStorage.getItem('itensCarrinho')
    return new Promise((resolve, reject) => {
        try {
            resolve(jsonValue != null ? JSON.parse(jsonValue) : null);
        } catch (e) {
            reject(e)
        }
    })
}
export const limparItensCarrinhoNoBanco = async () => {
    try {
        await AsyncStorage.removeItem('itensCarrinho');
        await AsyncStorage.removeItem('i');//* */
        return true;
    } catch (e) {
        return false;
    }
}
export const deletarItenCarrinhoNoBanco = async (itemCarrinho) => {
    try {
        let itens = [];
        const getJsonValue = await AsyncStorage.getItem('itensCarrinho');
        itens = JSON.parse(getJsonValue);
        const itensSalva = itens.filter(item => ((item.codmer != itemCarrinho.codmer)));
        if (itensSalva.length === 0) {
            await AsyncStorage.removeItem('itensCarrinho');
            await AsyncStorage.removeItem('i'); //* */
        } else {
            const jsonValue = JSON.stringify(itensSalva);
            await AsyncStorage.setItem('itensCarrinho', jsonValue);
        }
    } catch (e) {
        console.log(e)
    }
}

