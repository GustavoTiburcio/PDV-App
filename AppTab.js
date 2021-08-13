import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack'

import AppListProdutos from './AppListProdutos';
import AppCarrinho from './AppCarrinho';
import ListaCarrinho from './ListaCarrinho';
import AppVendasFinalizadas from './AppVendasFinalizadas';
 
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
 
function Tabs(){
    return (
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
                <Tab.Screen name="AppListProdutos" component={AppListProdutos}
                    options={{
                        tabBarLabel: "Produtos"
                    }}
                />
                <Tab.Screen name="AppCarrinho" component={AppCarrinho}
                    options={{
                        tabBarLabel: "Carrinho"
                    }}
                />
                <Tab.Screen name="AppVendasFinalizadas" component={AppVendasFinalizadas}
                    options={{
                        tabBarLabel: "Histórico"
                    }}
                />
            </Tab.Navigator>
    );
}

export default function App(){
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName="AppListProdutos">
                <Stack.Screen name="AppListProdutos" component={Tabs}/>
                <Stack.Screen name="AppCarrinho" component={AppCarrinho}/>
                <Stack.Screen name="ListaCarrinho" component={ListaCarrinho}/>
                <Stack.Screen name="AppVendasFinalizadas" component={AppVendasFinalizadas}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}