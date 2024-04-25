import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import btSerial, {ICameraDevice} from '../Modules/BtSerial.ts';
import React, {Dispatch, FC} from 'react';

interface IDeviceCardProps extends ICameraDevice {
  setCamera: Dispatch<ICameraDevice | undefined>;
  setLoading: Dispatch<boolean>;
}

const DeviceCard: FC<IDeviceCardProps> = ({
  name,
  address,
  setCamera,
  setLoading,
}) => {
  const handlePress = () => {
    setLoading(true);
    btSerial.connectDevice(address);
    setTimeout(async () => {
      if (await btSerial.isConnected()) {
        setCamera({name, address});
      }
    }, 2000);
    setLoading(false);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.addressText}>{address}</Text>
    </TouchableOpacity>
  );
};

export default DeviceCard;

const styles = StyleSheet.create({
  card: {
    height: 100,
    width: '100%',
    backgroundColor: 'lightblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  addressText: {
    fontSize: 20,
    fontStyle: 'italic',
  },
  nameText: {
    fontSize: 20,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
});
