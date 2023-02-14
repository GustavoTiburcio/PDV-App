import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import TelaInicial from '../pages/TelaInicial';
import Login from '../pages/Login';
import ListaProduto from '../pages/ListaProduto';
import Estoque from '../pages/Estoque';
import ListaCarrinho from '../pages/ListaCarrinho';
import Carrinho from '../pages/Carrinho';
import FinalizarCarrinho from '../pages/FinalizarCarrinho';
import CadastroCliente from '../pages/CadastroCliente';
import ListaCliente from '../pages/ListaCliente';
import VendasFinalizadas from '../pages/VendasFinalizadas';
import Config from '../pages/Config'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const { height } = Dimensions.get('window');
const altura = height / 100 * 7;

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#32264d",
        tabBarInactiveTintColor: "#c1bccc",
        tabBarActiveBackgroundColor: "#ebebf5",
        tabBarInactiveBackgroundColor: "#FFF",
        headerShown: false,
        tabBarLabelStyle: {
          "fontSize": 16
        },
        tabBarItemStyle: {
          alignItems: "center",
          justifyContent: "center"
        },
        tabBarStyle: [
          {
            display: "flex"
          },
          null
        ],
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Produtos') {
            iconName = focused ? 'home' : 'home-outline';
          }
          if (route.name === 'Carrinho') {
            iconName = focused ? 'cart' : 'cart-outline';
          }
          if (route.name === 'Histórico') {
            return <FontAwesome name='history' size={30} color={color} />;
          }
          // if (route.name === 'Config') {
          //   return <FontAwesome name='gear' size={30} color={color} />;
          // }

          return <Ionicons name={iconName} size={30} color={color} />;
        },
      })}
      // tabBarOptions={{
      //   activeTintColor: '#32264d',
      //   inactiveTintColor: '#c1bccc',
      //   activeBackgroundColor: '#ebebf5',
      //   inactiveBackgroundColor: '#FFF',
      //   style: {
      //     elevation: 0,
      //     shadowOpacity: 0,
      //     height: Platform.OS === 'ios' ? '10%' : altura
      //   },
      //   tabStyle: {
      //     alignItems: 'center',
      //     justifyContent: 'center'
      //   },
      //   labelStyle: {
      //     fontSize: 16,
      //   },
      // }}
    >
      <Tab.Screen
        name="Produtos"
        component={ListaProduto}
      />
      <Tab.Screen
        name="Carrinho"
        component={Carrinho}
      />
      <Tab.Screen
        name="Histórico"
        component={VendasFinalizadas}
      />
      {/* <Tab.Screen
        name="Config"
        component={Config}
      /> */}
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TelaInicial">
        <Stack.Screen
          name="TelaInicial"
          component={TelaInicial}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListaProduto"
          component={Tabs}
          options={({ route }) => ({
            title: route.params?.title ? route.params.title : '',
            headerStyle: {
              backgroundColor: '#38A69D',
              padding: 40,
            },
            headerTintColor: '#FFF'
          })}
        />
        <Stack.Screen
          name="ListaCarrinho"
          component={ListaCarrinho}
          options={{
            title: 'Inserir item',
            headerStyle: {
              backgroundColor: '#38A69D',
              padding: 40,
            },
            headerTintColor: '#FFF'
          }}
        />
        <Stack.Screen
          name="FinalizarCarrinho"
          component={FinalizarCarrinho}
          options={{
            title: 'Finalizar Carrinho',
            headerStyle: {
              backgroundColor: '#38A69D',
              padding: 40,
            },
            headerTintColor: '#FFF'
          }}
        />
        <Stack.Screen
          name="ListaCliente"
          component={ListaCliente}
          options={{
            title: 'Selecionar Cliente',
            headerStyle: {
              backgroundColor: '#38A69D',
              padding: 40,
            },
            headerTintColor: '#FFF'
          }}
        />
        <Stack.Screen
          name="CadastroCliente"
          component={CadastroCliente}
          options={{
            title: 'Cadastro Novo Cliente',
            headerStyle: {
              backgroundColor: '#38A69D',
              padding: 40,
            },
            headerTintColor: '#FFF'
          }}
        />
        <Stack.Screen
          name="Estoque"
          component={Estoque}
          options={{
            title: 'Estoque',
            headerStyle: {
              backgroundColor: '#38A69D',
              padding: 40,
            },
            headerTintColor: '#FFF'
          }}
        />
        <Stack.Screen
          name="Config"
          component={Config}
          options={{
            title: 'Configurações',
            headerStyle: {
              backgroundColor: '#38A69D',
              padding: 40,
            },
            headerTintColor: '#FFF'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}