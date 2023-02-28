import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable'
import api from '../services/api';
import { gravarLogin, buscarLogin, limparLogin } from '../controle/LoginStorage';
import { GestureHandlerRootView, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { gravarAlteraValorVenda, gravarLimitePorcentagemDesconto, gravarUsaControleEstoque, gravarUsaGrade, gravarUsaTabPre } from '../controle/ConfigStorage';
import Spinner from 'react-native-loading-spinner-overlay';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  async function LoginAuthenticate() {
    try {
      setLoading(true);
      if (!username || !password) {
        setLoading(false);
        Alert.alert('Usuário ou senha incorretos');
        return;
      }

      const response = await api.get(`/usuarios/loginProvisorio?username=${username}&password=${password}`);

      if (!response.data) {
        Alert.alert('Usuário ou senha incorretos', 'Verifique as credenciais informadas');
        setLoading(false);
        return;
      }
      setLoading(false);
      gravarLogin(response.data);
      navigation.navigate('ListaProduto', { title: `Bem-Vindo ${response.data.username}` });
      return;

    } catch (error) {
      console.log(error);
      Alert.alert('Falha no login', error.message);
      setLoading(false);
    }
  }

  async function VerificarLogado() {
    try {
      setLoading(true);

      const login = await buscarLogin();

      if (login) {
        const response = await api.get(`/usuarios/loginProvisorio?username=${login.username}&password=${login.password}`);

        if (!response.data) {
          limparLogin();
          Alert.alert('Usuário ou senha incorretos', 'Faça login novamente.');
          setLoading(false);
          return;
        }

        setLoading(false);
        gravarLogin(response.data);
        navigation.navigate('ListaProduto', { title: `Bem-Vindo ${response.data.username}` });
        return;
      }

      setLoading(false);
      return;
    } catch (error) {
      console.log(error);
      Alert.alert('Falha no login', error.message);
      setLoading(false);
    }
  }

  function AcessarTelaConfig(event) {
    if (event.nativeEvent.state === State.ACTIVE) {
      Alert.alert('Aviso', 'Deseja abrir janela de configuração?', [
        { text: 'Sim', onPress: () => navigation.navigate('Config') },
        { text: 'Não', style: 'cancel', }
      ]);
    }
  };

  async function GetConfig() {
    try {
      const response = await api.get('/configs');

      //Usa grade de cor/tamanho
      const usaGrade = response.data.filter((config) => config.con === 'UsaGra');

      //Usa tabela de preco
      const usaTabPre = response.data.filter((config) => config.con === 'UsaTabPre');
      // console.log(usaTabPre);

      //Controla estoque, não vende produto com estoque negativo/zerado
      const controlaEstoque = response.data.filter((config) => config.con === 'VenAciEst');

      //Permite vendedor alterar valor de venda
      const alteraValVen = response.data.filter((config) => config.con === 'AltValVen');

      //Limita porcentagem de desconto permitida
      const limitePorcentagemDesconto = response.data.filter((config) => config.con === 'LimPorDes');

      if (usaGrade) {
        const usagrade = Boolean(Number(usaGrade[0].val));
        await gravarUsaGrade(usagrade.toString());
      }
      if (usaTabPre) {
        const usaTabelaPreco = Boolean(Number(usaTabPre[0].val));
        await gravarUsaTabPre(usaTabelaPreco.toString());
      }
      if (controlaEstoque) {
        const controlaestoque = !Boolean(Number(controlaEstoque[0].val));
        await gravarUsaControleEstoque(controlaestoque.toString());
      }
      if (alteraValVen) {
        const alteraValorVenda = Boolean(Number(alteraValVen[0].val));
        await gravarAlteraValorVenda(alteraValorVenda.toString());
      }
      if (limitePorcentagemDesconto) {
        await gravarLimitePorcentagemDesconto(limitePorcentagemDesconto[0].val);
      }

    } catch (error) {
      console.log(error);
    }
  }

  LogBox.ignoreLogs(["EventEmitter.removeListener"]);

  useEffect(() => {
    VerificarLogado();
    GetConfig();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Spinner visible={loading} size={Platform.OS === 'android' ? 50 : 'large'} />
        <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
          <Text style={styles.message}>Bem-vindo(a)</Text>
        </Animatable.View>

        <LongPressGestureHandler
          onHandlerStateChange={AcessarTelaConfig}
          minDurationMs={1500}
        >

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
              onSubmitEditing={LoginAuthenticate}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={LoginAuthenticate}
            >
              <Text style={styles.buttonText}>Acessar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRegister} onPress={() => Alert.alert('Credenciais de acesso', 'Entre em contato com o nosso suporte para mais informações. (44) 3023-7230')}>
              <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
            </TouchableOpacity>
          </Animatable.View>
        </LongPressGestureHandler>
      </View>
    </GestureHandlerRootView>
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
  },
  loading: {
    padding: 10
  },
})