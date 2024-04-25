import {NativeModules} from 'react-native';
const {btSerialModule} = NativeModules;

export interface ICameraDevice {
  name: string;
  address: string;
}

export interface ITimelapseCommand {
  command: 'begin_timelapse';
  timelapse: string;
  duration: number;
  interval: number;
}

interface BtSerial {
  initBluetoothManager(): Promise<boolean>;
  getPairedDevices(): Array<any>;
  getPairedCamera(): Promise<Array<ICameraDevice>>;
  connectDevice(mac: string): void;
  sendMessage(message: string): void;
  isConnected(): Promise<boolean>;
  disconnectDevice(): void;
}
export default btSerialModule as BtSerial;
