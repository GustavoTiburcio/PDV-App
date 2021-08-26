import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Image, TextInput, TouchableOpacity, Animated, Keyboard, Alert } from 'react-native';
import {StatusBar} from 'expo-status-bar'
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppLogin({navigation}) {
  
  const [offset] = useState(new Animated.ValueXY({x: 0, y: 95}));
  const [opacity] = useState(new Animated.Value(0));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginData, setLoginData] = useState({});

  async function storeData(){
    try {
      const jsonValue = JSON.stringify(loginData)
      await AsyncStorage.setItem('@login_data', jsonValue)
      console.log('salvou informações de login')
      console.log(jsonValue)
    } catch (e) {
      console.log('erro ao salvar informações de login')
    }
  }

async function loginAuthenticate(){
    const response = await api.get(`/usuarios/loginProvisorio?username=${username}&password=${password}`)
     if (response.data == []) {
       Alert.alert('Usuário ou senha incorretos')
    }else{
        setLoginData(response.data)
        navigation.navigate('AppListProdutos')
    }
  }

  useEffect(() => {
    storeData();
  },[loginData])

  useEffect(() => {

    Animated.parallel([
      Animated.spring(offset.y, {
        toValue: 0,
        speed: 4,
        bounciness: 20,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();

  },[]);

  return (
    <KeyboardAvoidingView style={styles.background}>
      <StatusBar style="light" />
      <View style={styles.containerLogo}>
        <Image 
        style={{
          width: 400,
          height: 221
        }}
        source={require('./assets/logo.png')}
        />
      </View>

      <Animated.View
       style={[
         styles.container,
         {
           opacity: opacity,
           transform: [
             { translateY: offset.y}
             
           ]
         }
        ]}
      >
        <TextInput 
        style={styles.input}
        placeholder="Usuário"
        autoCorrect={false}
        onChangeText={(text) => {
          setUsername(text)
        }}
        />

        <TextInput 
        style={styles.input}
        placeholder="Senha"
        autoCorrect={false}
        secureTextEntry={true}
        onChangeText={(text) => {
          setPassword(text)
        }}
        returnKeyType="go"
        onSubmitEditing={() => loginAuthenticate()}
        />

        <TouchableOpacity style={styles.btnSubmit} onPress= {() => loginAuthenticate()}>
          <Text style={styles.submitText}>Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnRegister}>
          <Text style={styles.registerText}>Criar conta gratuita</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background:{
    flex:1,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#d1ac97'
  },
  containerLogo:{
    flex: 1,
    justifyContent: 'center',
  },
  container:{
    flex:1,
    alignItems: 'center',
    justifyContent:'center',
    width: '90%',
    paddingBottom: 100
  },
  input: {
    backgroundColor: '#FFF',
    width: '90%',
    marginBottom: 15,
    color: '#222',
    fontSize: 17,
    borderRadius: 7,
    padding: 10
  },
  btnSubmit: {
    backgroundColor: '#35AAFF',
    width: '90%',
    height: 45,
    alignItems: 'center',
    justifyContent:'center',
    borderRadius: 7,
  },
  submitText:{
   color: '#FFF',
   fontSize: 18
  },
  btnRegister:{
    marginTop: 10,

  },
  registerText: {
    color: '#FFF'
  }
});