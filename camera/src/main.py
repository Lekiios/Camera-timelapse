from bluedot.btcomm import BluetoothServer
from signal import pause
import json
import requests
from picamera import PiCamera
from time import sleep
import datetime
import Adafruit_DHT

#Configuration du type de sonde et du PIN
sensor = 22
pin = 4

def data_received(data):
        s.send("{\"received\": \"true\"}")
        print(data)
        json_data = json.loads(data)

        if(json_data["command"] == "begin_timelapse"):
            print("Begin timelapse")
            timelapse = json_data["timelapse"]
            url = 'http://82.66.23.161:42069/begin-timelapse?deviceId=time-cam-1&timelapse=' + timelapse
            r = requests.post(url)
            if r.status_code == 200:
                interval = json_data["interval"] # seconds
                time = json_data["time"] * 60 # minutes -> seconds

                camera = PiCamera()
                camera.resolution = (640, 480)
                camera.rotation = 90

                for i in range(time//interval):
                    file_path = '/home/pi/image{}.jpg'.format(str(i))
                    camera.capture(file_path)

                    url = 'http://82.66.23.161:42069/uploadImage?deviceId=time-cam-1&timelapse=' + timelapse
                    files = {str(i): ('{}.jpg'.format(str(i)), open('image{}.jpg'.format(str(i)), 'rb'))}

                    r = requests.post(url, files=files)
                    print("uploadImage: " + r.text)

                    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
                    #Récupération du temps
                    ts = str(datetime.datetime.now())

                    url = 'http://82.66.23.161:42069/data?deviceId=time-cam-1&timelapse=' + timelapse
                    data = {
                        'temp': str(temperature),
                        'humidity': str(humidity),
                        'timestamp': ts
                    }

                    r = requests.post(url, json=data)
                    print("postData: " + r.text)
                    sleep(interval)

                camera.close()

                url = 'http://82.66.23.161:42069/end-timelapse?deviceId=time-cam-1&timelapse=' + timelapse
                r = requests.post(url)
                print('Timelapse ended')



s = BluetoothServer(data_received)
print("BluetoothServer started !")
print("Waiting for connection...")
pause()
