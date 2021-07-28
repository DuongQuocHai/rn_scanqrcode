import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from 'react-native';
import {WebView} from 'react-native-webview';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import Sound from 'react-native-sound';
import beepSound from '../assets/sounds/beep.mp3';

const sound = new Sound(beepSound);

function WebviewScreen(props) {
  const webviewRef = React.useRef(null);
  const scanRef = React.useRef();
  const [visible, setVisible] = React.useState(false);
  const [listQR, setListQR] = React.useState([]);
  const [error, setError] = React.useState('white');

  function onMessage(data) {
    console.log(
      'LOG -> file: webview.screen.js -> line 27 -> onMessage -> data',
      data,
    );
    if (data.nativeEvent.data === 'OPEN_SCAN_QR') {
      setVisible(true);
    } else if (data.nativeEvent.data === 'CLOSE_SCAN_QR') {
      setVisible(false);
    }
  }
  const onSuccess = data => {
    console.log(
      'LOG -> file: home.screen.js -> line 11 -> HomeScreen -> data',
      data,
    );
    const newList = [...listQR];
    if (!newList.find(item => data?.data === item)) {
      sound.play();
      ToastAndroid.showWithGravity(
        data?.data,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      newList.push(data?.data);
      setListQR(newList);
      webviewRef?.current?.injectJavaScript(getInjectableJSMessage(data?.data));
      setError('green');
      setTimeout(function () {
        setError('white');
      }, 1500);
    } else {
      ToastAndroid.showWithGravity(
        'Mã đã quét',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setError('red');
      setTimeout(function () {
        setError('white');
      }, 1500);
    }
  };

  function getInjectableJSMessage(message) {
    console.log(
      'LOG -> file: webview.screen.js -> line 71 -> getInjectableJSMessage -> message',
      message,
    );
    return `
      (function() {
        document.dispatchEvent(new MessageEvent('message', {
          data: ${JSON.stringify(message)}
        }));
      })();
    `;
  }

  // somewhere in your code

  const LoadingIndicatorView = () => {
    return <ActivityIndicator size="small" color="blue" />;
  };
  return (
    <>
      <SafeAreaView style={styles.flexContainer}>
        {visible && (
          <View style={styles.flexContainer}>
            <QRCodeScanner
              ref={scanRef}
              onRead={onSuccess}
              reactivateTimeout={2000}
              topViewStyle={{display: 'none'}}
              bottomViewStyle={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
              reactivate={true}
              showMarker={true}
              cameraStyle={{
                height: 400,
                overflow: 'hidden',
                // display: visible ? 'flex' : 'none',
              }}
              containerStyle={
                {
                  // justifyContent: 'flex-start',
                  // alignItems: 'center',
                  // backgroundColor: 'red',
                }
              }
              cameraProps={{
                zoom: 0.2,
              }}
              // bottomContent={
              //   <View
              //     style={{
              //       width: '100%',
              //       height: '100%',
              //       justifyContent: 'center',
              //       alignItems: 'center',
              //     }}></View>
              // }
              markerStyle={{
                borderColor: error,
                width: 350,
                height: 350,
              }}
            />
          </View>
        )}
        <WebView
          style={{flex: 1}}
          // source={{
          //   html: `<body style="display:flex;justify-content:center;flex-direction:column;align-items:center">
          //             <h2>React native webview</h2>
          //             <h2>React native webview data transfer between Native to web</h2>
          //             <button style="color:green; height:100;width:300;font-size:30px"
          //               onclick="openScanQR()">Open ScanQR</button>
          //             <button style="color:green; height:100;width:300;font-size:30px"
          //               onclick="closeScanQR()">Close ScanQR</button>
          //             <p id="demo"></p>
          //             <script>
          //              var newData = [];
          //              document.addEventListener("message", function(data) {
          //              if(data.data){
          //                  newData.push(data.data)
          //                  var i, len, text;
          //                  for (i = 0, len = newData.length, text = ""; i < len; i++) {
          //                    text += newData[i] + "<br>";
          //               }
          //              }
          //              document.getElementById("demo").innerHTML = text;
          //              window.ReactNativeWebView.postMessage(JSON.stringify(newData))
          //             });
          //             function openScanQR() {
          //               window.ReactNativeWebView.postMessage('OPEN_SCAN_QR')
          //             }
          //             function closeScanQR() {
          //               window.ReactNativeWebView.postMessage('CLOSE_SCAN_QR')
          //             }
          //           </script>
          //  </body>`,
          // }}
          source={{uri: 'https://dev-swallowservice.softworld.dev/en'}}
          renderLoading={LoadingIndicatorView}
          startInLoadingState={true}
          ref={webviewRef}
          onMessage={onMessage}
        />
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  flexContainer: {
    flex: 1,
  },
});
export default WebviewScreen;
