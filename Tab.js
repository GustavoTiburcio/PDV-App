import React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import Home from './src/pages/Home'
import AppListProdutos from './AppListProdutos';
import AppCarrinho from './AppCarrinho';
import AppVendasFinalizadas from './AppVendasFinalizadas';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs(){
  return(
    <Tab.Navigator>
      <Tab.Screen name="Home" component = {Home} />
      <Tab.Screen name="AppListProdutos" component = {AppListProdutos} />
      <Tab.Screen name="AppCarrinho" component = {AppCarrinho} />
      <Tab.Screen name="AppVendasFinalizadas" component = {AppVendasFinalizadas} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
        name="AppListProdutos" 
        component={Tabs}
        options={{
          title: 'Bem-vindo',
          headerStyle: {
            backgroundColor: '#121212'
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