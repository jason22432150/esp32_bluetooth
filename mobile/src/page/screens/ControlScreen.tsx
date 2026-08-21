import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Button, CustomButton } from '../../components/Button';
import {
  Input,
  ScrollView,
  Text,
  XStack,
  YStack,
} from 'tamagui';
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
import { useThemeStore } from '../../store/useThemeStore';

export function ControlScreen() {
  const [customCommand, setCustomCommand] = useState('');
  const modes = [
    '(固定)藍紫',
    '(固定)白白',
    '(爆閃)藍紫',
    '(互閃)警燈',
    '(呼吸)紅色',
  ];

  const scheme = useThemeStore(state => state.scheme);
  const setDarkMode = useThemeStore(state => state.setDarkMode);

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
    <YStack flex={1} bg="$background">
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScrollView flex={1}>
          <YStack p="$4" gap="$4">
          {/* 外層 ScrollView 只負責上下滾動；左右滑動需另包 horizontal ScrollView */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$4" px="$4">
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
            <CustomSwitch
              checked={scheme === 'dark'}
              onCheckedChange={setDarkMode}
            />
          </XStack>

          <Text fontSize={24} fontWeight="700" color="$color12">
            ESP32 BLE Control
          </Text>

          <YStack gap="$3">
            <Text fontSize={16} color="$color11">
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
                <Button.Text>
                  {isScanning ? '停止掃描' : '開始掃描'}
                </Button.Text>
              </CustomButton>
            )}

            {isConnecting ? (
              <Text color="$color10">連線中...</Text>
            ) : null}
          </YStack>

          {!connectedDevice ? (
            <YStack gap="$3">
              <Text fontSize={18} fontWeight="600" color="$color12">
                找到的裝置
              </Text>

              <FlatList
                scrollEnabled={false}
                data={devices}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                  <Text color="$color10">尚未找到 ESP32_BT</Text>
                }
                renderItem={({ item }) => (
                  <YStack
                    p="$3"
                    mb="$2"
                    borderWidth={1}
                    borderColor="$borderColor"
                    rounded="$3"
                    bg="$color2"
                    pressStyle={{ opacity: 0.8 }}
                    onPress={() => connect(item.id)}
                  >
                    <Text fontSize={16} fontWeight="600" color="$color12">
                      {item.name ?? item.localName ?? 'Unknown'}
                    </Text>
                    <Text color="$color10" mt="$1">
                      {item.id}
                    </Text>
                  </YStack>
                )}
              />
            </YStack>
          ) : null}

          <YStack gap="$3">
            <Text fontSize={18} fontWeight="600" color="$color12">
              快捷指令
            </Text>

            <YStack gap="$2">
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
            </YStack>
          </YStack>

          <YStack gap="$3">
            <CustomButton
              onPress={() => navigation.navigate('LedStripSettings')}
            >
              <Button.Text>選擇LED</Button.Text>
            </CustomButton>
          </YStack>

          <YStack gap="$3">
            <Text fontSize={18} fontWeight="600" color="$color12">
              自訂指令
            </Text>

            <Input
              value={customCommand}
              onChangeText={setCustomCommand}
              placeholder="例如 rgb255,000,000,000,000,255%"
              autoCapitalize="none"
              autoCorrect={false}
              borderColor="$borderColor"
              bg="$color2"
              color="$color12"
            />

            <CustomButton theme="green" onPress={handleSendCustom}>
              <Button.Text>送出</Button.Text>
            </CustomButton>
          </YStack>

          <YStack gap="$3">
            <Text fontSize={18} fontWeight="600" color="$color12">
              Log
            </Text>
            <CustomButton theme="red" onPress={clearLogs}>
              <Button.Text>清空</Button.Text>
            </CustomButton>

            {logs.map(log => (
              <Text key={log.id} fontSize={13} color="$color11" mb="$1">
                {log.message}
              </Text>
            ))}
          </YStack>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}
