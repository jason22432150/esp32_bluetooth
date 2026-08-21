import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  HueSlider,
  type ColorFormatsObject,
} from 'reanimated-color-picker';
import type { RootStackParamList } from '../../types/navigation';
import { Button, CustomButton } from '../../components/Button';
import { Text, XStack, YStack } from 'tamagui';

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
    const rgb = color.rgb.replace(/^rgb\(/i, '').replace(/\)$/, '');
    selectedColorRef.current = rgb;
    setSelectedColor(rgb);
  };

  /** 確認選色並回傳給 LedStripSettings */
  const handleConfirm = () => {
    console.log('selectedColorRef.current', selectedColorRef.current);
    console.log('colorField', colorField);
    navigation.popTo('LedStripSettings', {
      selectedColor: selectedColorRef.current,
      colorField,
    });
  };

  return (
    <YStack flex={1} bg="$background">
      <SafeAreaView edges={['top', 'bottom']}>
          <YStack p="$4" gap="$4">
            <Text fontSize={24} fontWeight="700" color="$color12">
              選擇顏色
            </Text>
            <Text fontSize={16} color="$color11">
              目前：{selectedColor}
            </Text>

            <ColorPicker
              style={{ width: '100%', gap: 10 }}
              value={'rgb(' + initialColor + ')'}
              onCompleteJS={onSelectColor}
            >
              <Preview />

              <XStack
                gap={10}
                items="stretch"
              >
                <Panel1 style={{ flex: 1, height: 200 }} />
                <HueSlider style={{ height: 200 }} vertical />
              </XStack>

              <Swatches />
            </ColorPicker>

            <XStack
              justify="space-around"
              pt="$4"
              borderTopWidth={1}
              borderColor="$borderColor"
            >
              <CustomButton theme="red" onPress={() => navigation.goBack()}>
                <Button.Text>取消</Button.Text>
              </CustomButton>
              <CustomButton theme="green" onPress={handleConfirm}>
                <Button.Text>確認</Button.Text>
              </CustomButton>
            </XStack>
          </YStack>
      </SafeAreaView>
    </YStack>
  );
}
