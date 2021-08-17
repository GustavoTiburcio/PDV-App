import React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import AppListProdutos from './AppListProdutos';
import Carrinho from './Carrinho';
import ListaCarrinho from './ListaCarrinho';
import AppVendasFinalizadas from './AppVendasFinalizadas';
import AppLogin from './AppLogin';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs({route}){
  return(
    <Tab.Navigator
    tabBarOptions={{
      style: {
          elevation: 0,
          shadowOpacity: 0,
          height: 64,
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
      inactiveTintColor: '#c1bccc',
      activeTintColor: '#32264d'
    }}
    >
      <Tab.Screen name="Produtos" component = {AppListProdutos} />
      <Tab.Screen name="Carrinho" component = {Carrinho} />
      <Tab.Screen name="Histórico" component = {AppVendasFinalizadas} />
    </Tab.Navigator>
  )
}

export default function App() {

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
        <Stack.Screen name="Carrinho" component={Carrinho} />
        <Stack.Screen name="AppVendasFinalizadas" component={AppVendasFinalizadas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}