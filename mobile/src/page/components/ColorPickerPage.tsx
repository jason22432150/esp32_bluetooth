import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  // OpacitySlider,
  HueSlider,
  type ColorFormatsObject,
} from 'reanimated-color-picker';
import { ScrollView } from 'react-native-gesture-handler';
import type { RootStackParamList } from '../../types/navigation';
import { commonStyles as styles } from '../../theme';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Button, CustomButton } from '../../components/Button';

const DEFAULT_COLOR = '255, 0, 0';

/**
 * 顏色選擇頁面（modal）
 * 確認後透過 navigation.popTo 將 hex 回傳給 LedStripSettings
 */
export function ColorPickerPage() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ColorPicker'>>();

  const initialColor = route.params?.initialColor || DEFAULT_COLOR;
  const colorField = route.params.colorField;

  const [selectedColor, setSelectedColor] = useState(initialColor);
  /** 以 ref 保存最新顏色，避免確認時讀到過期 state */
  const selectedColorRef = useRef(initialColor);

  /**
   * 手勢結束時更新選中顏色（JS thread）
   */
  const onSelectColor = (color: ColorFormatsObject) => {
    selectedColorRef.current = color.rgb;
    setSelectedColor(color.rgb);
  };

  /** 確認選色並回傳給 LedStripSettings */
  const handleConfirm = () => {
    navigation.popTo('LedStripSettings', {
      selectedColor: selectedColorRef.current,
      colorField,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={[styles.content, localStyles.content]}>
        <Text style={styles.title}>選擇顏色</Text>
        <Text style={styles.label}>目前：{selectedColor}</Text>

        <ColorPicker
          style={localStyles.picker}
          value={initialColor}
          onCompleteJS={onSelectColor}
        >
          <Preview />

          <View style={localStyles.panelRow}>
            <Panel1 style={localStyles.panel} />
            <HueSlider style={localStyles.hueSlider} vertical />
          </View>

          <Swatches />
        </ColorPicker>

        <View style={localStyles.actions}>
          <CustomButton theme="red" onPress={() => navigation.goBack()}>
            <Button.Text>取消</Button.Text>
          </CustomButton>
          <CustomButton theme="green" onPress={handleConfirm}>
            <Button.Text>確認</Button.Text>
          </CustomButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  picker: {
    width: '100%',
    gap: spacing.md,
  },
  panelRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'stretch',
  },
  panel: {
    flex: 1,
    height: 200,
  },
  hueSlider: {
    height: 200,
  },
  opacitySection: {
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
