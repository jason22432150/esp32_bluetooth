import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ControlScreen } from './src/screens/ControlScreen';
import { LedStripSettingsScreen } from './src/screens/LedStripSettingsScreen';
import { ColorPickerPage } from './src/components/ColorPickerPage';
import type { RootStackParamList } from './src/navigation/types';

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

function App() {
  useEffect(() => {
    requestAndroidBlePermissions();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
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
    </GestureHandlerRootView>
  );
}

export default App;
