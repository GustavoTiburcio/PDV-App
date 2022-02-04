/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage'

export const gravarItensCarrinhoNoBanco = async (itensCarrinho) => {
    try {
        let tem = false;
        let i = await AsyncStorage.getItem('i');
        let itens = [];
        if (i == '1') {
            const getJsonValue = await AsyncStorage.getItem('itensCarrinho');
            if (getJsonValue != null) {
                itens = JSON.parse(getJsonValue);
                itens.map((item) => {
                    if ((item.codmer === itensCarrinho.codmer) && (item.valor === itensCarrinho.valor)) {
                        tem = true;
                        let som = parseInt(item.quantidade) + parseInt(itensCarrinho.quantidade);
                        item.quantidade = som.toString();
                    }
                })
            }
        }
        if (!tem) {
            itens.push(itensCarrinho);
        }
        await AsyncStorage.setItem('i', '1');
        const jsonValue = JSON.stringify(itens)
        await AsyncStorage.setItem('itensCarrinho', jsonValue)
    } catch (e) {
        console.log(e)
    }
};

export const gravarItensCarrinhoParaEditar = async (itensCarrinho) => {
    try {
        await AsyncStorage.removeItem('itensCarrinho');
        await AsyncStorage.setItem('i', '1');
        const jsonValue = JSON.stringify(itensCarrinho)
        await AsyncStorage.setItem('itensCarrinho', jsonValue)
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
        } else {
            const jsonValue = JSON.stringify(itensSalva);
            await AsyncStorage.setItem('itensCarrinho', jsonValue);
        }
    } catch (e) {
        console.log(e)
    }
}
export const gravarLinkBanco = async (link) => {
    try {
        await AsyncStorage.setItem('linkdb', link);
    } catch (e) {
        console.log(e)
    }
}
export const gravarCodVenBanco = async (codven) => {
    try {
        await AsyncStorage.setItem('codven', codven);
    } catch (e) {
        console.log(e)
    }
}
export const buscarLinkBanco = async () => {
    const value = await AsyncStorage.getItem('linkdb');
    return new Promise((resolve, reject) => {
        try {
            resolve(value != null ? value : null);
        } catch (e) {
            reject(e)
        }
    })
}
export const buscarCodVenBanco = async () => {
    const Value = await AsyncStorage.getItem('codven')
    return new Promise((resolve, reject) => {
        try {
            resolve(Value != null ? Value : null);
        } catch (e) {
            reject(e)
        }
    })
}
