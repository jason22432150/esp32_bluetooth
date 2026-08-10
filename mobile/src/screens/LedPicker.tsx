import React from 'react';
import { View, Text,  TextInput } from 'react-native';
import { useLedStripColorStore } from '../store/useLedStripColor';
export function LedPicker() {
  const { ledStripColor, setLedStripColor } = useLedStripColorStore();

  return (
    <View>
      <Text>Led Picker</Text>
      <TextInput
        value={ledStripColor}
        onChangeText={setLedStripColor}
        placeholder="Enter LED strip color"
      />
    </View>
  );
}
