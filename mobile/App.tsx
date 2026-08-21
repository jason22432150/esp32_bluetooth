import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getVariableValue, TamaguiProvider, useTheme, YStack } from 'tamagui';

import { ControlScreen } from './src/page/screens/ControlScreen';
import { LedStripSettingsScreen } from './src/page/screens/LedStripSettingsScreen';
import { ColorPickerPage } from './src/page/components/ColorPickerPage';
import type { RootStackParamList } from './src/types/navigation';
import { config } from './tamagui.config';
import { useThemeStore } from './src/store/useThemeStore';

async function requestAndroidBlePermissions() {
  if (Platform.OS !== 'android') {
    return;
  }

  // Android 12 以上請求 BLUETOOTH_SCAN、BLUETOOTH_CONNECT
  // Android 11 以下請求 ACCESS_FINE_LOCATION
  if (Platform.Version >= 31) {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);

    return;
  }

  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * 在 TamaguiProvider 內讀取 theme token，驅動 Navigator / 根背景
 */
function ThemedNavigation() {
  const theme = useTheme();
  const background = String(getVariableValue(theme.background));
  const color = String(getVariableValue(theme.color));
  const surface = String(
    getVariableValue(theme.backgroundHover ?? theme.background),
  );

  return (
    <GestureHandlerRootView style={[styles.flex, { backgroundColor: background }]}>
      <YStack flex={1} bg="$background">
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                contentStyle: { backgroundColor: background },
                headerStyle: { backgroundColor: surface },
                headerTintColor: color,
                headerTitleStyle: { color },
              }}
            >
              <Stack.Screen name="Control" component={ControlScreen} />
              <Stack.Screen
                name="LedStripSettings"
                component={LedStripSettingsScreen}
              />
              <Stack.Screen
                name="ColorPicker"
                component={ColorPickerPage}
                options={{
                  presentation: 'modal',
                  title: '選擇顏色',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </YStack>
    </GestureHandlerRootView>
  );
}

function App() {
  const scheme = useThemeStore(state => state.scheme);

  useEffect(() => {
    requestAndroidBlePermissions();
  }, []);

  return (
    <TamaguiProvider config={config} defaultTheme={scheme}>
      <ThemedNavigation />
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

export default App;
