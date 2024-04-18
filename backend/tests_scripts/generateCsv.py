#!/usr/bin/env python3

import csv
import random
import datetime

with open('data.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["temperature","humidity","timestamp"])
    start_time = datetime.datetime(2016, 1, 1)
    end_time = datetime.datetime(2016, 1, 3)
    time_delta = datetime.timedelta(minutes=5)
    humidity = 50.0
    temperature = 22.0
    while start_time < end_time:
        writer.writerow([format(temperature,".1f"),format(humidity,".1f"),start_time])
        start_time += time_delta
        temperature += random.uniform(-1, 1)
        humidity += random.uniform(-1, 1)
