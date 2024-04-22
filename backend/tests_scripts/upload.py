#!/bin/python3
import requests

url = 'http://127.0.0.1:3000/uploadImage?deviceId=cam7&timelapse=1'
files = {'file': ('1.jpg', open('test_jpg/test1.jpg', 'rb'))}

r = requests.post(url, files=files)
print(r)

url = 'http://127.0.0.1:3000/uploadImage?deviceId=cam7&timelapse=1'
files = {'file': ('2.jpg', open('test_jpg/test2.jpg', 'rb'))}

r = requests.post(url, files=files)
print(r)

url = 'http://127.0.0.1:3000/uploadImage?deviceId=cam7&timelapse=1'
files = {'file': ('3.jpg', open('test_jpg/test3.jpg', 'rb'))}

r = requests.post(url, files=files)
print(r)

url = 'http://127.0.0.1:3000/uploadImage?deviceId=cam7&timelapse=1'
files = {'file': ('4.jpg', open('test_jpg/test4.jpg', 'rb'))}

r = requests.post(url, files=files)
print(r)
