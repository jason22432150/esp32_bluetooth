import { create } from 'zustand';
import { Device, State } from 'react-native-ble-plx';

import { bleService } from '../services/BleService';

type LogEntry = {
  id: string;
  message: string;
};

type BleStore = {
  bluetoothState: State | null;
  isScanning: boolean;
  isConnecting: boolean;
  connectedDevice: Device | null;
  devices: Device[];
  logs: LogEntry[];

  setBluetoothState: (state: State) => void;
  startScan: () => void;
  stopScan: () => void;
  connect: (deviceId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  sendCommand: (command: string) => Promise<void>;
  addLog: (message: string) => void;
  clearLogs: () => void;
};

const createLog = (message: string): LogEntry => {
  return {
    id: `${Date.now()}-${Math.random()}`,
    message: `[${new Date().toLocaleTimeString()}] ${message}`,
  };
};

export const useBleStore = create<BleStore>((set, get) => ({
  bluetoothState: null,
  isScanning: false,
  isConnecting: false,
  connectedDevice: null,
  devices: [],
  logs: [],

  setBluetoothState: state => {
    set({ bluetoothState: state });
  },

  startScan: () => {
    set({ isScanning: true, devices: [] });
    get().addLog('開始掃描 ESP32_BT');

    bleService.startScan(
      device => {
        set(state => {
          const exists = state.devices.some(item => item.id === device.id);

          if (exists) {
            return state;
          }

          return {
            devices: [...state.devices, device],
          };
        });
      },
      message => {
        set({ isScanning: false });
        get().addLog(`掃描錯誤: ${message}`);
      },
    );
  },

  stopScan: () => {
    bleService.stopScan();
    set({ isScanning: false });
    get().addLog('停止掃描');
  },

  connect: async deviceId => {
    set({ isConnecting: true });
    get().addLog('正在連線');

    try {
      const device = await bleService.connect(deviceId);
      bleService.stopScan();

      set({
        connectedDevice: device,
        isConnecting: false,
        isScanning: false,
      });

      get().addLog(`連線成功: ${device.name ?? device.localName ?? device.id}`);
    } catch (error) {
      set({ isConnecting: false });
      get().addLog(
        `連線失敗: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },

  disconnect: async () => {
    await bleService.disconnect();

    set({
      connectedDevice: null,
    });

    get().addLog('已斷線');
  },

  sendCommand: async command => {
    try {
      await bleService.sendCommand(command);
      get().addLog(`已送出: ${command}`);
    } catch (error) {
      get().addLog(
        `送出失敗: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },

  addLog: message => {
    set(state => ({
      logs: [createLog(message), ...state.logs].slice(0, 80),
    }));
  },

  clearLogs: () => {
    set({ logs: [] });
  },
}));
