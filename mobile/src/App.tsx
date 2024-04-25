/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Permission,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import btSerial, {
  ICameraDevice,
  ITimelapseCommand,
} from './Modules/BtSerial.ts';
import PairedCameraList from './components/PairedCameraList.tsx';
import Camera from './components/camera.tsx';

export const requestPermission = async (permission: Permission) => {
  try {
    const granted = await PermissionsAndroid.request(permission);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission granted !');
    } else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

function App(): React.JSX.Element {
  const [managerOk, setManagerOk] = useState<boolean>(false);
  const [camera, setCamera] = useState<ICameraDevice | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await requestPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      await requestPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      );
      await requestPermission(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      await requestPermission(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
      await requestPermission(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      );
      setManagerOk(await btSerial.initBluetoothManager());
    })();
  }, []);

  const startTimelapse = () => {
    if (!btSerial.isConnected()) {
      return;
    }
    const json: ITimelapseCommand = {
      command: 'begin_timelapse',
      timelapse: 'test_mobile_app',
      interval: 3,
      duration: 1,
    };
    btSerial.sendMessage(JSON.stringify(json));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.parent}>
        <ActivityIndicator size={'large'} />
      </SafeAreaView>
    );
  }

  if (camera) {
    return (
      <SafeAreaView style={styles.parent}>
        <Camera setCamera={setCamera} setLoading={setLoading} camera={camera} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.parent}>
      <PairedCameraList
        managerOk={managerOk}
        setCamera={setCamera}
        setLoading={setLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },

  buttonStyle: {
    height: 50,
    width: 200,
    backgroundColor: 'lightblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default App;
