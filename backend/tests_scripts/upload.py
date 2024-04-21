#!/bin/python3
import requests

url = 'http://127.0.0.1:3000/uploadImage?deviceId=45485&timelapse=dadr45fds'
files = {'file': ('test.jpg', open('test.jpg', 'rb'))}

r = requests.post(url, files=files)
print(r)
