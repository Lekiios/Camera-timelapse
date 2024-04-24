import requests

url = 'http://82.66.23.161:42069/data?deviceId=time-cam-1&timelapse=script'
data = {
    'temp': "2",
    'humidity': "2",
    'timestamp': "eaetg"
}

r = requests.post(url, json=data)
print(r)
