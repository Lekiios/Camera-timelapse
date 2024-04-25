import btSerial, {ICameraDevice} from '../Modules/BtSerial.ts';
import {useEffect, useState} from 'react';

const usePairedCameras = (managerOk: boolean) => {
  const [devices, setDevices] = useState<Array<ICameraDevice>>([]);
  useEffect(() => {
    (async () => {
      if (managerOk) {
        setDevices(await btSerial.getPairedCamera());
      }
    })();
  }, [managerOk]);
  return devices;
};

export default usePairedCameras;
