import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import api from './api';

const AppEstoque = ({ route, navigation }) => {

const codbar = route.params?.codbar;
const [buscaDetalhes, setBuscaDetalhes] = useState([]);

async function getListarEstoque(){
  const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
  console.log(response.data)
  //var prod =  response.data.detalhes.map(item => [item.codigo,item.codbar,item.valor])
  //setBuscaDetalhes(prod)
  //console.log(buscaDetalhes)
}

useEffect(()=>{
getListarEstqoeu();
},[])

}
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      HeadTable: ['', 'Estoque'],
      DataTable: [
        ['Gold', '2',],
        ['Andre', '2',],
        ['Alexandre', '2',],
        ['Fabio', '2',],
        ['Cilas', '2',]
      ]
    }
  }

  render() {
    const state = this.state;
    return (
      <View style={styles.container}>
        <Table borderStyle={{borderWidth: 1, borderColor: '#ffa1d2'}}>
          <Row data={state.HeadTable} style={styles.HeadStyle} textStyle={styles.TableText}/>
          <Rows data={state.DataTable} textStyle={styles.TableText}/>
        </Table>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 18,
    paddingTop: 35,
    backgroundColor: '#ffffff' 
  },
  HeadStyle: { 
    height: 50,
    alignContent: "center",
    backgroundColor: '#ffe0f0'
  },
  TableText: { 
    margin: 10
  }
});