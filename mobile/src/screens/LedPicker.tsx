import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button } from 'react-native';
import { useLedStripColorStore } from '../store/useLedStripColor';
import { commonStyles as styles } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LedPicker() {
  const { ledStripColor, setLedStripColor } = useLedStripColorStore();
  const [leftLedStripColor, setLeftLedStripColor] = useState('');
  const [rightLedStripColor, setRightLedStripColor] = useState('');
  const [allLedStripColor, setAllLedStripColor] = useState('');

  const handleSave = () => {
    setLedStripColor(allLedStripColor);
    setLeftLedStripColor(leftLedStripColor);
    setRightLedStripColor(rightLedStripColor);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Led Picker</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>左側燈條設定</Text>
          <TextInput
            style={styles.input}
            value={leftLedStripColor}
            onChangeText={setLeftLedStripColor}
            placeholder="Enter LED strip color"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>右側燈條設定</Text>
          <TextInput
            style={styles.input}
            value={rightLedStripColor}
            onChangeText={setRightLedStripColor}
            placeholder="Enter LED strip color"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>全燈條設定</Text>
          <TextInput
            style={styles.input}
            value={allLedStripColor}
            onChangeText={setAllLedStripColor}
            placeholder="Enter LED strip color"
          />
        </View>

        <View style={styles.section}>
          <TextInput style={styles.input} value={ledStripColor} onChangeText={setLedStripColor} placeholder="Enter LED strip color" />
          <Button title="儲存" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
