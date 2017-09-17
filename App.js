import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
//import Button from 'react-native-button';
import Button from 'apsl-react-native-button'
import {  Location, } from 'expo';

const socketuri = 'ws://172.16.10.42:8080/RegisterPublisher/MeasureDeviceId/1';
const socketuri2 = 'wss://echo.websocket.org/';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: null
    };
    this.socket = new WebSocket(socketuri);
    this.socket.onopen = () => {
      console.log(`Connected to websocket ${socketuri}`);
    };
    this.socket.onmessage = (e) => {
      console.log(`Received from: ${socketuri}\n`,e.data);
    };
    this.socket.onerror = (e) => {
      console.error(e.message);
    };
    this.socket.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };
  }

  getLocationUriAsync = async () => {
    let location = await Location.getCurrentPositionAsync({});
    let heading = await Location.getHeadingAsync({});
    location.coords.heading = heading;
    let json = JSON.stringify(location.coords);
    this.setState({uri:`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${json}`});
    this.socket.send(json); // send a message
    console.log('Send',json);
  }

  onClick(){
    this.getLocationUriAsync();
  }

  render(){
    return (
        <View style={styles.container}>
          <Text textStyle={{fontSize: 18, color:'black', fontWeight: 'bold', marginBottom:20}}>Stargeezer</Text>
          <Button
              onPress={() => this.onClick()}
              style={{
                backgroundColor: 'white',
                borderWidth: 3
              }} 
              textStyle={{fontSize: 18, color:'black', fontWeight: 'bold'}}>
            Start from here
          </Button>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});