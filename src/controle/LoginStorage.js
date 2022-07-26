import AsyncStorage from '@react-native-async-storage/async-storage'


export const gravarLogin = async (loginData) => {
    try {
        const jsonValue = JSON.stringify(loginData)
        await AsyncStorage.setItem('@login_data', jsonValue)
    } catch (e) {
        console.log(e)
    }
}

export const buscarLogin = async () => {
    const jsonValue = await AsyncStorage.getItem('@login_data')
    return new Promise((resolve, reject) => {
        try {
            resolve(jsonValue != null ? JSON.parse(jsonValue) : null);
        } catch (e) {
            reject(e)
        }
    })
}

export const limparLogin = async () => {
    try {
        await AsyncStorage.removeItem('@login_data');
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}