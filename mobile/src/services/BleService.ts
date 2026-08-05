import { BleManager, Device, State } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

import {
  BLE_DEVICE_NAME,
  NUS_RX_UUID,
  NUS_SERVICE_UUID,
} from '../constants/ble';

export type BleDevice = Device;

type ScanDeviceHandler = (device: Device) => void;
type ErrorHandler = (message: string) => void;

class BleService {
  private manager = new BleManager();
  private connectedDevice: Device | null = null;

  async getBluetoothState() {
    return this.manager.state();
  }

  onStateChange(callback: (state: State) => void) {
    return this.manager.onStateChange(callback, true);
  }

  startScan(onDevice: ScanDeviceHandler, onError: ErrorHandler) {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        onError(error.message);
        return;
      }

      if (!device) {
        return;
      }

      const name = device.name ?? device.localName;

      if (name === BLE_DEVICE_NAME) {
        onDevice(device);
      }
    });
  }

  stopScan() {
    this.manager.stopDeviceScan();
  }

  async connect(deviceId: string) {
    const device = await this.manager.connectToDevice(deviceId, {
      autoConnect: false,
    });

    const discoveredDevice =
      await device.discoverAllServicesAndCharacteristics();

    this.connectedDevice = discoveredDevice;

    return discoveredDevice;
  }

  async disconnect() {
    if (!this.connectedDevice) {
      return;
    }

    await this.manager.cancelDeviceConnection(this.connectedDevice.id);
    this.connectedDevice = null;
  }

  async sendCommand(command: string) {
    if (!this.connectedDevice) {
      throw new Error('尚未連線到 ESP32');
    }

    const payload = Buffer.from(command, 'utf8').toString('base64');

    await this.manager.writeCharacteristicWithResponseForDevice(
      this.connectedDevice.id,
      NUS_SERVICE_UUID,
      NUS_RX_UUID,
      payload,
    );
  }

  destroy() {
    this.manager.destroy();
  }
}

export const bleService = new BleService();
