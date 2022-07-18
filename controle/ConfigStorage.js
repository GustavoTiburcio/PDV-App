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
    const value = await AsyncStorage.getItem('linkdb');
    return new Promise((resolve, reject) => {
        try {
            resolve(value != null ? value : null);
        } catch (e) {
            reject(e)
        }
    })
}
export const gravarUsaCorTamanho = async (CorTamanho) => {
    try {
        await AsyncStorage.removeItem('CorTamanho')
        await AsyncStorage.setItem('CorTamanho', CorTamanho);
    } catch (e) {
        console.log(e)
    }
}
export const buscarUsaCorTamanho = async () => {
    const value = await AsyncStorage.getItem('CorTamanho');
    return new Promise((resolve, reject) => {
        try {
            resolve(value != null ? value : null);
        } catch (e) {
            reject(e)
        }
    })
}
export const gravarUsaGrade = async (Grade) => {
    try {
        await AsyncStorage.removeItem('Grade')
        await AsyncStorage.setItem('Grade', Grade);
    } catch (e) {
        console.log(e)
    }
}
export const buscarUsaGrade = async () => {
    const value = await AsyncStorage.getItem('Grade');
    return new Promise((resolve, reject) => {
        try {
            resolve(value != null ? value : null);
        } catch (e) {
            reject(e)
        }
    })
}
