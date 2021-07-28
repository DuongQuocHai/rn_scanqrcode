import React, {useState, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

export default function HomeScreen({navigation}) {
  const [state, setState] = useState({
    listCode: [],
  });
  const scanRef = useRef();
  console.log(
    'LOG -> file: home.screen.js -> line 11 -> HomeScreen -> scanRef',
    scanRef,
  );
  const onSuccess = data => {
    console.log(
      'LOG -> file: home.screen.js -> line 11 -> HomeScreen -> data',
      data,
    );
    ToastAndroid.showWithGravity(
      data?.data,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  return (
    <View style={{flex: 1}}>
      <QRCodeScanner
        ref={scanRef}
        onRead={onSuccess}
        reactivateTimeout={3000}
        topViewStyle={{display: 'none'}}
        bottomViewStyle={{
          // backgroundColor: 'red',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          // position: 'absolute',
          // top: 0,
          // bottom: 0,
          // right: 0,
          // left: 0,
        }}
        reactivate={true}
        showMarker={true}
        cameraStyle={{
          height: 400,
          overflow: 'hidden',
        }}
        containerStyle={
          {
            // justifyContent: 'flex-start',
            // alignItems: 'center',
            // backgroundColor: 'red',
          }
        }
        bottomContent={
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Webview', {
                  listCode: [1, 2, 3, 4, 5],
                });
              }}
              style={{
                backgroundColor: 'green',
                width: 200,
                height: 50,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text>Send Data to Webview</Text>
            </TouchableOpacity>
          </View>
        }
        // customMarker={<Text>haha</Text>}
        markerStyle={{borderColor: 'white', width: 350, height: 350}}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
