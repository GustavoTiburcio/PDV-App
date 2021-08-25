import React, { Component, useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import api from './api';

export default function AppEstoque({ route, navigation }) {

    const codbar = route.params?.codbar;
    const [mercadorDetalhes, setMercadorDetalhes] = useState([[]]);
    let estoques;
    
    async function getListarEstoque(){
      const response = await api.get(`/mercador/listarParaDetalhes?codbar=${codbar}`)
      estoques = Object.entries(response.data)
      console.log(estoques[7][1])
      //var prod =  Object.entries(response.data).map(item => [item.estest1])
      //setMercadorDetalhes(Object.entries(response.data));
      //console.log(estoques)
      //console.log(Object.values(response.data))
      //console.log(mercadorDetalhes)
    }
    
    useEffect(()=>{
    getListarEstoque();
    },[])
    
  return (
    <View style={styles.container}>
      <Text>Estoque</Text>
      <Grid>
        <Col size={50}>
          <Row style={styles.cell}>
            <Text>Matriz</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>Andre</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>Alexandre</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>Fabio</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>Cilas</Text>
          </Row>
        </Col>
        <Col size={25}>
        <Row style={styles.cell}>
            <Text>E</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>F</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>G</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>H</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>I</Text>
          </Row>
        </Col>
      </Grid>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    padding: 16,
    paddingTop: 100,
    backgroundColor: '#fff',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
});

