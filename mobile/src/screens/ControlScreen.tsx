import React, { useState } from 'react';
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { commonStyles as styles } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBleStore } from '../store/useBleStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  buildModeCommand,
  buildRainbowCommand,
  buildStopCommand,
  ensureCommandTerminator,
} from '../utils/commands';
import { LedPicker } from './LedPicker';

export function ControlScreen() {
  const [customCommand, setCustomCommand] = useState('');
  const modes = [
    '(固定)藍紫',
    '(固定)白白',
    '(爆閃)藍紫',
    '(互閃)警燈',
    '(呼吸)紅色',
  ];

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

  type RootStackParamList = {
    Control: undefined;
    LedPicker: undefined;
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
            {modes.map(mode => (
              <Button
                key={mode}
                title={`mode${mode}`}
                onPress={() => sendCommand(buildModeCommand(mode as string))}
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
          <Button
            title="選擇LED"
            onPress={() => navigation.navigate('LedPicker')}
          />
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
