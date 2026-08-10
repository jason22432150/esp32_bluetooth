import React, { useState } from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useBleStore } from '../store/useBleStore';
import {
  buildModeCommand,
  buildRainbowCommand,
  buildStopCommand,
  ensureCommandTerminator,
} from '../utils/commands';

export function ControlScreen() {
  const [customCommand, setCustomCommand] = useState('');

  const {
    isScanning,
    isConnecting,
    connectedDevice,
    devices,
    logs,
    startScan,
    stopScan,
    connect,
    disconnect,
    sendCommand,
  } = useBleStore();

  const handleSendCustom = () => {
    if (!customCommand.trim()) {
      return;
    }

    sendCommand(ensureCommandTerminator(customCommand));
    setCustomCommand('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>ESP32 BLE Control</Text>

        <View style={styles.section}>
          <Text style={styles.label}>
            狀態：
            {connectedDevice
              ? `已連線 ${connectedDevice.name ?? connectedDevice.id}`
              : '尚未連線'}
          </Text>

          {connectedDevice ? (
            <Button title="斷線" onPress={disconnect} />
          ) : (
            <Button
              title={isScanning ? '停止掃描' : '開始掃描'}
              onPress={isScanning ? stopScan : startScan}
            />
          )}

          {isConnecting ? <Text style={styles.hint}>連線中...</Text> : null}
        </View>

        {!connectedDevice ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>找到的裝置</Text>

            <FlatList
              scrollEnabled={false}
              data={devices}
              keyExtractor={item => item.id}
              ListEmptyComponent={
                <Text style={styles.hint}>尚未找到 ESP32_BT</Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.deviceRow}
                  onPress={() => connect(item.id)}
                >
                  <Text style={styles.deviceName}>
                    {item.name ?? item.localName ?? 'Unknown'}
                  </Text>
                  <Text style={styles.deviceId}>{item.id}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷指令</Text>

          <View style={styles.buttonGrid}>
            <Button
              title="stop"
              onPress={() => sendCommand(buildStopCommand())}
            />
            {[1, 2, 3, 4, 5].map(mode => (
              <Button
                key={mode}
                title={`mode${mode}`}
                onPress={() =>
                  sendCommand(buildModeCommand(mode as 1 | 2 | 3 | 4 | 5))
                }
              />
            ))}
            <Button
              title="rainbow1"
              onPress={() => sendCommand(buildRainbowCommand(1))}
            />
            <Button
              title="rainbow2"
              onPress={() => sendCommand(buildRainbowCommand(2))}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>自訂指令</Text>

          <TextInput
            style={styles.input}
            value={customCommand}
            onChangeText={setCustomCommand}
            placeholder="例如 rgb255,000,000,000,000,255%"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Button title="送出" onPress={handleSendCustom} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log</Text>

          {logs.map(log => (
            <Text key={log.id} style={styles.logText}>
              {log.message}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  label: {
    fontSize: 16,
    color: '#334155',
  },
  hint: {
    color: '#64748b',
  },
  deviceRow: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  deviceId: {
    color: '#64748b',
    marginTop: 4,
  },
  buttonGrid: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  logText: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 4,
  },
});
