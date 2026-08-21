import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, CustomButton } from '../../components/Button';
import { XStack } from 'tamagui';
import { commonStyles as styles } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBleStore } from '../../store/useBleStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  buildModeCommand,
  buildRainbowCommand,
  buildStopCommand,
  ensureCommandTerminator,
} from '../../utils/commands';
import type { RootStackParamList } from '../../types/navigation';
import { DemoCard } from '../../components/Card';
import { CustomSwitch } from '../../components/Switch';

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
    clearLogs,
    stopScan,
    connect,
    disconnect,
    sendCommand,
  } = useBleStore();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSendCustom = () => {
    if (!customCommand.trim()) {
      return;
    }

    sendCommand(ensureCommandTerminator(customCommand));
    setCustomCommand('');
  };

  const scanButtonTheme = (scanButtonState: boolean) => {
    return scanButtonState ? 'red' : 'green';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 外層 ScrollView 只負責上下滾動；左右滑動需另包 horizontal ScrollView */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <XStack gap="$4">
            <DemoCard
              transition="bouncy"
              size="$4"
              width={250}
              height={300}
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              pressStyle={{ scale: 0.875 }}
            />
            <DemoCard size="$5" width={250} height={300} />
          </XStack>
        </ScrollView>

        <XStack>
          <CustomSwitch defaultChecked={true} />
        </XStack>

        <Text style={styles.title}>ESP32 BLE Control</Text>

        <View style={styles.section}>
          <Text style={styles.label}>
            狀態：
            {connectedDevice
              ? `已連線 ${connectedDevice.name ?? connectedDevice.id}`
              : '尚未連線'}
          </Text>

          {connectedDevice ? (
            <CustomButton onPress={disconnect} theme="red">
              <Button.Text>斷線</Button.Text>
            </CustomButton>
          ) : (
            <CustomButton
              onPress={isScanning ? stopScan : startScan}
              theme={scanButtonTheme(isScanning)}
            >
              <Button.Text>{isScanning ? '停止掃描' : '開始掃描'}</Button.Text>
            </CustomButton>
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
            <CustomButton
              theme="red"
              onPress={() => sendCommand(buildStopCommand())}
            >
              <Button.Text>stop</Button.Text>
            </CustomButton>
            {modes.map(mode => (
              <CustomButton
                key={mode}
                onPress={() => sendCommand(buildModeCommand(mode as string))}
              >
                <Button.Text>{`mode${mode}`}</Button.Text>
              </CustomButton>
            ))}
            <CustomButton onPress={() => sendCommand(buildRainbowCommand(1))}>
              <Button.Text>rainbow1</Button.Text>
            </CustomButton>
            <CustomButton onPress={() => sendCommand(buildRainbowCommand(2))}>
              <Button.Text>rainbow2</Button.Text>
            </CustomButton>
          </View>
        </View>

        <View style={styles.section}>
          <CustomButton onPress={() => navigation.navigate('LedStripSettings')}>
            <Button.Text>選擇LED</Button.Text>
          </CustomButton>
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

          <CustomButton theme="green" onPress={handleSendCustom}>
            <Button.Text>送出</Button.Text>
          </CustomButton>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log</Text>
          <CustomButton theme="red" onPress={clearLogs}>
            <Button.Text>清空</Button.Text>
          </CustomButton>

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
