import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useLedStripColorStore } from '../../store/useLedStripColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LedColorField, RootStackParamList } from '../../types/navigation';
import { Switch } from 'react-native-gesture-handler';
import { Button, CustomButton } from '../../components/Button';
import { Input, ScrollView, Text, XStack, YStack } from 'tamagui';

/**
 * LED 燈條顏色設定頁
 * 分別設定左側、右側、全燈條顏色，並可開啟 ColorPicker 選色
 */
export function LedStripSettingsScreen() {
  const {
    leftLedStripColor,
    setLeftLedStripColor,
    rightLedStripColor,
    setRightLedStripColor,
  } = useLedStripColorStore();
  const [isSynced, setIsSynced] = useState(false);

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

    if (isSynced) {
      setRightLedStripColor(selectedColor);
      setLeftLedStripColor(selectedColor);
    }

    // 清除 params，避免重複套用
    navigation.setParams({
      selectedColor: undefined,
      colorField: undefined,
    });
  }, [
    route.params,
    navigation,
    isSynced,
    leftLedStripColor,
    rightLedStripColor,
    setLeftLedStripColor,
    setRightLedStripColor,
  ]);

  /**
   * 開啟 ColorPicker modal，並指定回寫欄位
   */
  const openColorPicker = (colorField: LedColorField, initialColor: string) => {
    console.log('initialColor', initialColor);
    console.log('colorField', colorField);
    navigation.navigate('ColorPicker', {
      colorField,
      initialColor: initialColor || undefined,
    });
  };

  /**
   * 同步開關變更時的處理
   */
  const handleSyncedChange = (value: boolean) => {
    setIsSynced(value);
    if (value) {
      setRightLedStripColor(leftLedStripColor);
    }
  };

  /**
   * 儲存設定
   */
  function handleSave() {
    setLeftLedStripColor(leftLedStripColor);
    setRightLedStripColor(rightLedStripColor);
    navigation.goBack();
  }

  return (
    <YStack flex={1} bg="$background">
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScrollView flex={1}>
          <YStack p="$4" gap="$4">
            <Text fontSize={24} fontWeight="700" color="$color12">
              LED 燈條設定
            </Text>

            <YStack gap="$3">
              <Text fontSize={18} fontWeight="600" color="$color12">
                左側燈條設定
              </Text>
              <XStack items="center" gap="$3">
                <YStack
                  width={44}
                  height={44}
                  rounded="$3"
                  borderWidth={1}
                  borderColor="$borderColor"
                  bg="$color2"
                  style={
                    leftLedStripColor
                      ? { backgroundColor: 'rgb(' + leftLedStripColor + ')' }
                      : undefined
                  }
                />
                <Input
                  flex={1}
                  value={leftLedStripColor}
                  onChangeText={setLeftLedStripColor}
                  placeholder="Enter LED strip color"
                  borderColor="$borderColor"
                  bg="$color2"
                  color="$color12"
                />
              </XStack>
              <CustomButton
                onPress={() => {
                  openColorPicker('left', leftLedStripColor);
                }}
              >
                <Button.Text>選擇顏色</Button.Text>
              </CustomButton>
            </YStack>

            <YStack gap="$3">
              <Text fontSize={18} fontWeight="600" color="$color12">
                全燈條設定
              </Text>
              <Text fontSize={18} fontWeight="600" color="$color12">
                (勾選後左側、右側燈條顏色會同步)
              </Text>
              <XStack items="center" gap="$3">
                <Switch value={isSynced} onValueChange={handleSyncedChange} />
              </XStack>
            </YStack>

            <YStack
              gap="$3"
              opacity={isSynced ? 0.4 : 1}
              pointerEvents={isSynced ? 'none' : 'auto'}
            >
              <Text fontSize={18} fontWeight="600" color="$color12">
                右側燈條設定
              </Text>
              <XStack items="center" gap="$3">
                <YStack
                  width={44}
                  height={44}
                  rounded="$3"
                  borderWidth={1}
                  borderColor="$borderColor"
                  bg="$color2"
                  style={
                    rightLedStripColor
                      ? { backgroundColor: 'rgb(' + rightLedStripColor + ')' }
                      : undefined
                  }
                />
                <Input
                  flex={1}
                  value={rightLedStripColor}
                  onChangeText={setRightLedStripColor}
                  placeholder="Enter LED strip color"
                  borderColor="$borderColor"
                  bg="$color2"
                  color="$color12"
                />
              </XStack>
              <CustomButton
                disabled={isSynced}
                onPress={() => openColorPicker('right', rightLedStripColor)}
              >
                <Button.Text>選擇顏色</Button.Text>
              </CustomButton>
            </YStack>

            <YStack gap="$3">
              <CustomButton theme="green" onPress={handleSave}>
                <Button.Text>儲存</Button.Text>
              </CustomButton>
            </YStack>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}
