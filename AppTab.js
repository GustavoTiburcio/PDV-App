import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
 
import AppVenda from './AppVenda';
import AppListProdutos from './AppListProdutos';
import AppCarrinho from './AppCarrinho';
import AppVendasFinalizadas from './AppVendasFinalizadas';
 
const {Navigator, Screen} = createBottomTabNavigator();
 
function AppTab(){
    return (
        <NavigationContainer>
            <Navigator
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
                <Screen name="AppListProdutos" component={AppListProdutos}
                    options={{
                        tabBarLabel: "Produtos"
                    }}
                />
                {/* <Screen name="AppVenda" component={AppVenda}
                    options={{
                        tabBarLabel: "Venda"
                    }}
                /> */}
                <Screen name="AppCarrinho" component={AppCarrinho}
                    options={{
                        tabBarLabel: "Carrinho"
                    }}
                />
                <Screen name="AppVendasFinalizadas" component={AppVendasFinalizadas}
                    options={{
                        tabBarLabel: "Histórico"
                    }}
                />
            </Navigator>
        </NavigationContainer>
    );
}
 
export default AppTab;