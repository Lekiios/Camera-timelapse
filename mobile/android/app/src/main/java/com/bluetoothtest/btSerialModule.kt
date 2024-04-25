package com.bluetoothtest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothDevice
import android.util.Log
import android.widget.Toast
import com.facebook.react.bridge.Arguments.createArray
import com.facebook.react.bridge.Arguments.createMap
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.harrysoft.androidbluetoothserial.BluetoothManager
import com.harrysoft.androidbluetoothserial.BluetoothSerialDevice
import com.harrysoft.androidbluetoothserial.SimpleBluetoothDeviceInterface


class btSerialModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private lateinit var bluetoothManager: BluetoothManager
    private var deviceInterface: SimpleBluetoothDeviceInterface? = null
    private var connected = false

    override fun getName(): String = "btSerialModule"

    @ReactMethod
    fun initBluetoothManager(promise: Promise) {
        this.bluetoothManager = BluetoothManager.getInstance()
        promise.resolve(true)
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun getPairedDevices(): MutableList<BluetoothDevice>? {
        val pairedDevices = this.bluetoothManager.pairedDevicesList
        for (device in pairedDevices) {
            Log.d(name, "Device: ${device.name} - ${device.address}")
        }
        return pairedDevices
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun getPairedCamera(promise: Promise) {
        val pairedDevices = this.bluetoothManager.pairedDevicesList
        val devices = createArray()
        for (device in pairedDevices) {
            if (device.name.contains("time-cam")) {
                val map = createMap()
                map.putString("name", device.name)
                map.putString("address", device.address)
                devices.pushMap(map)
            }
        }
        promise.resolve(devices)
    }

    @ReactMethod
    fun connectDevice(mac: String) {
        val res = this.bluetoothManager.openSerialDevice(mac).subscribe(this::onConnected, this::onError)
    }

    private fun onConnected(connectedDevice: BluetoothSerialDevice) {
        // You are now connected to this device!
        // Here you may want to retain an instance to your device:
        connected = true
        deviceInterface = connectedDevice.toSimpleDeviceInterface()
        // Listen to bluetooth events
        deviceInterface?.setListeners(this::onMessageReceived, this::onMessageSent, this::onError);
        //deviceInterface?.sendMessage("App connected!")

    }
    private fun onMessageSent(message: String) {
        // We sent a message! Handle it here.
       Log.d(name, "Sent: $message")
    }

    private fun onMessageReceived(message: String) {
        // We received a message! Handle it here.
       Log.d(name, "Received: $message")
    }
    private fun onError(error: Throwable) {
        // Handle the error
        Log.e(name, "Error: $error")
    }

    @ReactMethod
    fun sendMessage(message: String) {
        deviceInterface?.sendMessage(message)
    }

    @ReactMethod
    fun isConnected(promise: Promise) {
        promise.resolve(connected)
    }

    @ReactMethod
    fun disconnectDevice() {
        bluetoothManager.closeDevice(deviceInterface);
        connected = false
    }

}