import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import AppListProdutos from './AppListProdutos';
import Carrinho from './Carrinho';
import ListaCarrinho from './ListaCarrinho';
import AppVendasFinalizadas from './AppVendasFinalizadas';
import AppLogin from './AppLogin';
import AppClientes from './AppClientes';
import AppEstoque from './AppEstoque';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs({ route }) {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          elevation: 0,
          shadowOpacity: 0,
          height: '8%',
        },
        tabStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        },
        labelStyle: {
          fontSize: 13,
          marginLeft: 16
        },
        inactiveBackgroundColor: '#fafafc',
        activeBackgroundColor: '#ebebf5',
        inactiveTintColor: '#777',
        activeTintColor: '#9C27B0',
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Produtos"
        component={AppListProdutos}
        options={() => ({
          tabBarIcon: ({ tintColor }) => (
            <View>
              <LinearGradient style={styles.iconTabRound} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} colors={['#D500F9', '#4A148C']}>
                <Icon name="list" size={24} color='#FFF' />
              </LinearGradient>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Carrinho"
        component={Carrinho}
        options={() => ({
          tabBarIcon: ({ tintColor }) => (
            <View>
              <LinearGradient style={styles.iconTabRound} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} colors={['#D500F9', '#4A148C']}>
                <Icon name="shopping-cart" size={24} color='#FFF' />
              </LinearGradient>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Histórico"
        component={AppVendasFinalizadas}
        options={() => ({
          tabBarIcon: ({ tintColor }) => (
            <View>
              <LinearGradient style={styles.iconTabRound} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} colors={['#D500F9', '#4A148C']}>
                <Icon name="history" size={24} color='#FFF' />
              </LinearGradient>
            </View>
          ),
        })}
      />
    </Tab.Navigator>
  )
}

export default function App() {

  //   const getData = async () => {
  //   try {
  //         const jsonValue = await AsyncStorage.getItem('@login_data')
  //         return jsonValue != null ? JSON.parse(jsonValue) : null;
  //   } catch(e) {
  //         console.log('Erro ao ler login')
  //       }
  //   }

  //  let login;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AppLogin">
        <Stack.Screen
          name="AppListProdutos"
          component={Tabs}
          options={{
            title: 'Bem-vindo',
            headerStyle: {
              backgroundColor: '#121212',
              padding: 40,
            },
            headerTintColor: '#FFF'
          }}
        />
        <Stack.Screen
          name="ListaCarrinho"
          component={ListaCarrinho}
          options={{
            title: 'Inserir item',
            headerStyle: {
              backgroundColor: '#121212',
              padding: 40,
            },
            headerTintColor: '#FFF'
          }}
        />
        <Stack.Screen
          name="AppLogin"
          component={AppLogin}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Carrinho"
          component={Carrinho}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AppVendasFinalizadas"
          component={AppVendasFinalizadas}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AppClientes"
          component={AppClientes}
          options={{
            title: 'Selecionar Cliente',
            headerStyle: {
              backgroundColor: '#121212',
              padding: 40,
            },
            headerTintColor: '#FFF'
          }}
        />
        <Stack.Screen
          name="AppEstoque"
          component={AppEstoque}
          options={{
            title: 'Estoque',
            headerStyle: {
              backgroundColor: '#121212',
              padding: 40,
            },
            headerTintColor: '#FFF'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconTabRound: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginBottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  }
});