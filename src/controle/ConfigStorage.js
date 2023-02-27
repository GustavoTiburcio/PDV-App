/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage'

export const gravarLinkBanco = async (link) => {
    try {
        await AsyncStorage.removeItem('linkdb')
        await AsyncStorage.setItem('linkdb', link);
    } catch (e) {
        console.log(e)
    }
}
export const buscarLinkBanco = async () => {
    try {
        const value = await AsyncStorage.getItem('linkdb');
        if (value) {
            return value;
        }
        return;
    } catch (error) {
        console.log(error.message);
    }
}
export const gravarUsaGrade = async (usaGrade) => {
    try {
        await AsyncStorage.removeItem('usaGrade')
        await AsyncStorage.setItem('usaGrade', usaGrade);
    } catch (e) {
        console.log(e)
    }
}
export const buscarUsaGrade = async () => {
    try {
        const value = await AsyncStorage.getItem('usaGrade');
        if (value) {
            return value;
        }
        return;
    } catch (error) {
        console.log(error.message);
    }
}
export const gravarUsaTabPre = async (usaTabPre) => {
    try {
        await AsyncStorage.removeItem('usaTabPre')
        await AsyncStorage.setItem('usaTabPre', usaTabPre);
    } catch (e) {
        console.log(e)
    }
}
export const buscarUsaTabPre = async () => {
    try {
        const value = await AsyncStorage.getItem('usaTabPre');
        if (value) {
            return value;
        }
        return;
    } catch (error) {
        console.log(error.message);
    }
}
export const gravarUsaControleEstoque = async (usaControleEstoque) => {
    try {
        await AsyncStorage.removeItem('usaControleEstoque')
        await AsyncStorage.setItem('usaControleEstoque', usaControleEstoque);
    } catch (e) {
        console.log(e)
    }
}
export const buscarUsaControleEstoque = async () => {
    try {
        const value = await AsyncStorage.getItem('usaControleEstoque');
        if (value) {
            return value;
        }
        return;
    } catch (error) {
        console.log(error.message);
    }
}
export const gravarAlteraValorVenda = async (alteraValorVenda) => {
    try {
        await AsyncStorage.removeItem('alteraValorVenda')
        await AsyncStorage.setItem('alteraValorVenda', alteraValorVenda);
    } catch (e) {
        console.log(e)
    }
}
export const buscarAlteraValorVenda = async () => {
    try {
        const value = await AsyncStorage.getItem('alteraValorVenda');
        if (value) {
            return value;
        }
        return;
    } catch (error) {
        console.log(error.message);
    }
}
export const gravarLimitePorcentagemDesconto = async (limitePorcentagemDesconto) => {
    try {
        await AsyncStorage.removeItem('limitePorcentagemDesconto')
        await AsyncStorage.setItem('limitePorcentagemDesconto', limitePorcentagemDesconto);
    } catch (e) {
        console.log(e)
    }
}
export const buscarLimitePorcentagemDesconto = async () => {
    try {
        const value = await AsyncStorage.getItem('limitePorcentagemDesconto');
        if (value) {
            return value;
        }
        return;
    } catch (error) {
        console.log(error.message);
    }
}
export const gravarUsaEstoquePorCategoria = async (usaEstoquePorCategoria) => {
    try {
        await AsyncStorage.removeItem('usaEstoquePorCategoria')
        await AsyncStorage.setItem('usaEstoquePorCategoria', usaEstoquePorCategoria);
    } catch (e) {
        console.log(e)
    }
}
export const buscarUsaEstoquePorCategoria = async () => {
    try {
        const value = await AsyncStorage.getItem('usaEstoquePorCategoria');
        if (value) {
            return value;
        }
        return;
    } catch (error) {
        console.log(error.message);
    }
}
