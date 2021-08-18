import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

export default class BotaoVermelho extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.MainContainer}>
        <TouchableOpacity
          style={styles.SubmitButtonStyle}
          activeOpacity={0.5}
          onPress={this.props.onPress}>
          <Text style={styles.TextStyle}> {this.props.text}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent:'center',
    flexDirection:'column'
  },

  SubmitButtonStyle: {
    marginTop: 25,
    height:50,
    padding: 15,
    borderRadius: 25,
    borderWidth: 0,
    marginBottom: 15,
    marginHorizontal: 10,
    backgroundColor: '#121212',
  },

  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
  },
});
