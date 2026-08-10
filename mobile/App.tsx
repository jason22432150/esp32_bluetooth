import React, { useEffect } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ControlScreen } from './src/screens/ControlScreen';
import { LedPicker } from './src/screens/LedPicker';

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

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    requestAndroidBlePermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Control" component={ControlScreen} />
          <Stack.Screen name="LedPicker" component={LedPicker} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
