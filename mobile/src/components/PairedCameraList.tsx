import React, {Dispatch, FC} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import usePairedCameras from '../hooks/usePairedCameras.ts';
import DeviceCard from './DeviceCard.tsx';
import {ICameraDevice} from '../Modules/BtSerial.ts';

interface IPairedCameraListProps {
  managerOk: boolean;
  setCamera: Dispatch<ICameraDevice | undefined>;
  setLoading: Dispatch<boolean>;
}

const PairedCameraList: FC<IPairedCameraListProps> = ({
  managerOk,
  setCamera,
  setLoading,
}) => {
  const cameras = usePairedCameras(managerOk);

  return (
    <View style={styles.parent}>
      <Text style={styles.title}>Camera list</Text>
      <ScrollView style={styles.scrollView}>
        {cameras.map((camera, key) => (
          <DeviceCard
            name={camera.name}
            address={camera.address}
            setCamera={setCamera}
            setLoading={setLoading}
            key={key}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default PairedCameraList;

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    width: '100%',
    display: 'flex',
    gap: 10,
    padding: 20,
  },
  scrollView: {
    height: '100%',
    width: '100%',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
