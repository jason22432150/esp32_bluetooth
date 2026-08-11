import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useLedStripColorStore } from '../store/useLedStripColor';
import { commonStyles as styles } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LedColorField, RootStackParamList } from '../navigation/types';

/**
 * LED 燈條顏色設定頁
 * 分別設定左側、右側、全燈條顏色，並可開啟 ColorPicker 選色
 */
export function LedStripSettingsScreen() {
  const { ledStripColor, setLedStripColor } = useLedStripColorStore();
  const [leftLedStripColor, setLeftLedStripColor] = useState('');
  const [rightLedStripColor, setRightLedStripColor] = useState('');

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'LedStripSettings'>>();

  // 接收 ColorPicker 回傳的顏色並寫入對應欄位
  useEffect(() => {
    const { selectedColor, colorField } = route.params ?? {};
    if (!selectedColor || !colorField) {
      return;
    }

    const setters: Record<LedColorField, (value: string) => void> = {
      left: setLeftLedStripColor,
      right: setRightLedStripColor,
    };

    setters[colorField](selectedColor);

    // 清除 params，避免重複套用
    navigation.setParams({
      selectedColor: undefined,
      colorField: undefined,
    });
  }, [route.params, navigation]);

  /**
   * 開啟 ColorPicker modal，並指定回寫欄位
   */
  const openColorPicker = (colorField: LedColorField, initialColor: string) => {
    navigation.navigate('ColorPicker', {
      colorField,
      initialColor: initialColor || undefined,
    });
  };

  const handleSave = () => {
    setLeftLedStripColor(leftLedStripColor);
    setRightLedStripColor(rightLedStripColor);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>LED 燈條設定</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>左側燈條設定</Text>
          <View style={styles.horizontalRow}>
            <View
              style={[
                styles.colorPreview,
                leftLedStripColor
                  ? { backgroundColor: leftLedStripColor }
                  : null,
              ]}
            />
            <TextInput
              style={[styles.input, styles.inputFlex]}
              value={leftLedStripColor}
              onChangeText={setLeftLedStripColor}
              placeholder="Enter LED strip color"
            />
          </View>
          <Button
            title="選擇顏色"
            onPress={() => openColorPicker('left', leftLedStripColor)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>右側燈條設定</Text>
          <View style={styles.horizontalRow}>
            <View
              style={[
                styles.colorPreview,
                rightLedStripColor
                  ? { backgroundColor: rightLedStripColor }
                  : null,
              ]}
            />
            <TextInput
              style={[styles.input, styles.inputFlex]}
              value={rightLedStripColor}
              onChangeText={setRightLedStripColor}
              placeholder="Enter LED strip color"
            />
          </View>
          <Button
            title="選擇顏色"
            onPress={() => openColorPicker('right', rightLedStripColor)}
          />
        </View>

        <View style={styles.section}>
          <TextInput
            style={styles.input}
            value={ledStripColor}
            onChangeText={setLedStripColor}
            placeholder="Enter LED strip color"
          />
          <Button title="儲存" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
