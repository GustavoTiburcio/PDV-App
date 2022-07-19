import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { buscarLogin } from '../controle/LoginStorage';

import TelaInicial from '../src/pages/TelaInicial';
import Login from '../src/pages/Login';
import ListProdutos from '../src/pages/ListProdutos';
import Estoque from '../src/pages/Estoque';
import ListaCarrinho from '../src/pages/ListaCarrinho';
import Carrinho from '../src/pages/Carrinho';
import CadastroCliente from '../src/pages/CadastroCliente';
import Clientes from '../src/pages/Clientes';
import VendasFinalizadas from '../src/pages/VendasFinalizadas';
import Config from '../src/pages/Config'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Router() {
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
          fontSize: 16,
        },
        inactiveBackgroundColor: '#fafafc',
        activeBackgroundColor: '#ebebf5',
        inactiveTintColor: '#c1bccc',
        activeTintColor: '#32264d'
      }}
    >
      <Tab.Screen name="Produtos" component={ListProdutos} />
      <Tab.Screen name="Carrinho" component={Carrinho} />
      <Tab.Screen name="Histórico" component={VendasFinalizadas} />
      <Tab.Screen name="Config" component={Config} />
    </Tab.Navigator>
  )
}

export default function () {
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
          name="ListProdutos"
          component={Router}
          options={({ route }) => ({
            title: route.params.title,
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
          name="Clientes"
          component={Clientes}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}