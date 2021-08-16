import React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'

//import Home from './src/pages/Home'
import AppListProdutos from './AppListProdutos';
import AppCarrinho from './AppCarrinho';
import AppVendasFinalizadas from './AppVendasFinalizadas';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs(){
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
      {/* <Tab.Screen name="Home" component = {Home} /> */}
      <Tab.Screen name="Produtos" component = {AppListProdutos} />
      <Tab.Screen name="Carrinho" component = {AppCarrinho} />
      <Tab.Screen name="Histórico" component = {AppVendasFinalizadas} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AppListProdutos">
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
        <Stack.Screen name="AppCarrinho" component={AppCarrinho} />
        <Stack.Screen name="AppVendasFinalizadas" component={AppVendasFinalizadas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}