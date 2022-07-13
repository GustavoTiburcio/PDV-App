import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable'
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  async function storeData(loginData) {
    try {
      const jsonValue = JSON.stringify(loginData)
      await AsyncStorage.setItem('@login_data', jsonValue)
      // console.log(jsonValue)
    } catch (e) {
      console.log(e)
    }
  }

  async function loginAuthenticate() {
    setLoading(true);
    if (username != '' && password != '') {
      const response = await api.get(`/usuarios/loginProvisorio?username=${username}&password=${password}`)
      if (response.data == []) {
        Alert.alert('Usuário ou senha incorretos', 'Verique as credenciais informadas')
        setLoading(false);
      } else {
        setLoading(false);
        storeData(response.data)
        navigation.navigate('ListProdutos')
      }
    } else {
      Alert.alert('Campos em branco', 'Favor informar Usuário e Senha')
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Bem-vindo(a)</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Usuário</Text>
        <TextInput
          placeholder="Digite seu usuário..."
          style={styles.input}
          onChangeText={setUsername}
          autoCorrect={false}
        />
        <Text style={styles.title}>Senha</Text>
        <TextInput
          placeholder="Digite sua senha..."
          style={styles.input}
          secureTextEntry={true}
          returnKeyType='go'
          onSubmitEditing={loginAuthenticate}
          onChangeText={setPassword}
        />

        {loading ? <ActivityIndicator size='large' color="#38A69D" /> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={loginAuthenticate}
        >
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonRegister}>
          <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
        </TouchableOpacity>

      </Animatable.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#38A69D'
  },
  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF'
  },
  containerForm: {
    backgroundColor: '#FFF',
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%'
  },
  title: {
    fontSize: 20,
    marginTop: 28,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#38A69D',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonRegister: {
    marginTop: 14,
    alignSelf: 'center',
  },
  registerText: {
    color: '#a1a1a1'
  }
})