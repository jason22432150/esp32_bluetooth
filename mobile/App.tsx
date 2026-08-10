import React, { useEffect } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ControlScreen } from './src/screens/ControlScreen';

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

  useEffect(() => {
    requestAndroidBlePermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ControlScreen />
    </SafeAreaProvider>
  );
}

export default App;
