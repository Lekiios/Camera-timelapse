#!/bin/python3
import requests

url = 'http://127.0.0.1:3000/data?deviceId=cam1&timelapseId=1&lines=10'

r = requests.get(url)
print(r.text)
