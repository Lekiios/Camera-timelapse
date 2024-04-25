import React, {Dispatch, FC, useState} from 'react';
import btSerial, {
  ICameraDevice,
  ITimelapseCommand,
} from '../Modules/BtSerial.ts';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ICameraProps {
  camera: ICameraDevice;
  setCamera: Dispatch<ICameraDevice | undefined>;
  setLoading: Dispatch<boolean>;
}

const Camera: FC<ICameraProps> = ({camera, setCamera, setLoading}) => {
  const [timelapse, setTimelapse] = useState<string>();
  const [timelapseInterval, setTimelapseInterval] = useState<string>();
  const [timelapseDuration, setTimelapseDuration] = useState<string>();

  const handleStartTimelapse = () => {
    if (!btSerial.isConnected()) {
      return;
    }
    if (!timelapse || !timelapseInterval || !timelapseDuration) {
      return;
    }
    const json: ITimelapseCommand = {
      command: 'begin_timelapse',
      timelapse,
      interval: Number(timelapseInterval),
      duration: Number(timelapseDuration),
    };
    btSerial.sendMessage(JSON.stringify(json));
  };

  const handleDisconnect = () => {
    btSerial.disconnectDevice();
    setCamera(undefined);
  };

  return (
    <View style={styles.parent}>
      <View style={styles.banner}>
        <View style={styles.infos}>
          <Text style={styles.name}>{camera.name}</Text>
          <Text style={styles.address}>{camera.address}</Text>
        </View>
        <View style={{flex: 1}} />
        <TouchableOpacity
          style={styles.disButton}
          onPress={() => handleDisconnect()}>
          <Text>DISCONNECT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Timelapse</Text>
        <View style={styles.inputView}>
          <Text style={styles.label}>Timelapse name</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setTimelapse(text)}
            value={timelapse}
            placeholder={'Name...'}
          />
        </View>

        <View style={styles.inputView}>
          <Text style={styles.label}>Timelapse Interval</Text>
          <TextInput
            style={styles.input}
            keyboardType={'numeric'}
            onChangeText={text => setTimelapseInterval(text)}
            value={timelapseInterval}
            placeholder={'Interval...'}
          />
        </View>

        <View style={styles.inputView}>
          <Text style={styles.label}>Timelapse duration</Text>
          <TextInput
            style={styles.input}
            keyboardType={'numeric'}
            onChangeText={text => setTimelapseDuration(text)}
            value={timelapseDuration}
            placeholder={'Duration...'}
          />
        </View>

        <View style={{flex: 1}} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleStartTimelapse()}
          disabled={!timelapseInterval || !timelapseDuration || !timelapse}>
          <Text style={styles.buttonText}>Start timelapse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 20,
  },
  banner: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'lightblue',
    alignItems: 'center',
    padding: 10,
  },
  infos: {
    display: 'flex',
    flexDirection: 'column',
  },
  disButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
    height: '70%',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  address: {
    fontStyle: 'italic',
  },
  body: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  button: {
    height: 50,
    width: 200,
    backgroundColor: 'lightblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    padding: 5,
    color: 'black',
  },
  inputView: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
