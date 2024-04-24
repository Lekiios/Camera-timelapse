from bluedot.btcomm import BluetoothServer
from signal import pause
import json
import requests
from picamera import PiCamera
import time
from time import sleep
import Adafruit_DHT
import os

# Configuration du type de sonde et du PIN
sensor = 22
pin = 4


def data_received(data):
    s.send("{\"received\": \"true\"}")
    print(data)
    json_data = json.loads(data)

    if json_data["command"] == "begin_timelapse":
        print("Begin timelapse")

        try:
            timelapse = json_data["timelapse"]
        except KeyError:
            s.send("{\"error\": \"Timelapse not found\"}")
            return
        try:
            interval = json_data["interval"]  # seconds
        except KeyError:
            s.send("{\"error\": \"Interval not found\"}")
            return
        try:
            duration = json_data["duration"] * 60  # minutes -> seconds
        except KeyError:
            s.send("{\"error\": \"Duration not found\"}")
            return

        url = 'http://82.66.23.161:42069/begin-timelapse?deviceId=time-cam-1&timelapse=' + timelapse
        r = requests.post(url)
        if r.status_code == 200:

            camera = PiCamera()
            camera.resolution = (640, 480)
            camera.rotation = 180

            it = duration // interval
            for i in range(it):
                start_time = time.time()

                file_path = '/home/pi/image{}.jpg'.format(str(i))
                camera.capture(file_path)

                url = 'http://82.66.23.161:42069/uploadImage?deviceId=time-cam-1&timelapse=' + timelapse
                files = {str(i): ('{}.jpg'.format(str(i)), open('image{}.jpg'.format(str(i)), 'rb'))}

                r = requests.post(url, files=files)
                if r.status_code != 200:
                    print("Error uploading image " + r.text)
                    s.send("{\"error\": \"{0}\"}".format(r.text))
                    break

                humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
                # Récupération du temps
                ts = round(time.time(), 0)

                url = 'http://82.66.23.161:42069/data?deviceId=time-cam-1&timelapse=' + timelapse
                data = {
                    'temp': "{0:0.1f}".format(temperature),
                    'humidity': "{0:0.1f}".format(humidity),
                    'timestamp': str(ts)
                }

                r = requests.post(url, json=data)
                if r.status_code != 200:
                    print("Error uploading data " + r.text)
                    s.send("{\"error\": \"{0}\"}".format(r.text))
                    break

                r_interval = interval - (time.time() - start_time)
                sleep(r_interval) if r_interval > 0 else None

            camera.close()

            url = 'http://82.66.23.161:42069/end-timelapse?deviceId=time-cam-1&timelapse=' + timelapse
            r = requests.post(url)
            print('Timelapse ended')

            for i in range(it):
                os.remove('/home/pi/image{}.jpg'.format(str(i)))

        else:
            print("Error beginning timelapse " + r.text)
            s.send("{\"error\": \"{0}\"}".format(r.text))


s = BluetoothServer(data_received)
print("BluetoothServer started !")
print("Waiting for connection...")
pause()
