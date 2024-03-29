import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import * as Animatable from 'react-native-animatable';

import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import {
  API_URL_GOLDCHAVES, API_URL_GOLDCHAVES_INTERNO,
  API_URL_PINDUFOODS, API_URL_PINDUFOODS_INTERNO,
  API_URL_PAPERPLAS, API_URL_PAPERPLAS_INTERNO
} from '@env';

export default function TelaInicial() {
  const navigation = useNavigation();

  function LogoPorCliente() {
    if (api.defaults.baseURL === API_URL_GOLDCHAVES || api.defaults.baseURL === API_URL_GOLDCHAVES_INTERNO) {
      return 'https://imagizer.imageshack.com/img924/5123/ciUHTV.jpg'
    }
    if (api.defaults.baseURL === API_URL_PINDUFOODS || api.defaults.baseURL === API_URL_PINDUFOODS_INTERNO) {
      return 'https://imagizer.imageshack.com/img922/5654/ENd4qQ.png'
    }
    if (api.defaults.baseURL === API_URL_PAPERPLAS || api.defaults.baseURL === API_URL_PAPERPLAS_INTERNO) {
      return 'https://imagizer.imageshack.com/img923/2646/Oc8IEE.jpg'
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY"
          source={{uri: LogoPorCliente()}}
          style={{ width: '85%', height: '25%', borderRadius: 10 }}
          resizeMode="contain"
        />
      </View>

      <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Ponto de Venda Móvel</Text>
        <Text style={styles.text}>A mobilidade aumenta a qualidade das vendas. </Text>
        <Text style={styles.text}>Em caso de dúvidas, ligar para (44) 3023-7230.</Text>
        <Text style={styles.text}>Pressione Acessar para começar.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Acessar</Text>
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
  containerLogo: {
    flex: 2,
    backgroundColor: '#38A69D',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerForm: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    //borderBottomRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12
  },
  text: {
    color: '#a1a1a1'
  },
  button: {
    position: 'absolute',
    backgroundColor: '#38A69D',
    borderRadius: 50,
    paddingVertical: 8,
    width: '60%',
    alignSelf: 'center',
    bottom: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  }
})