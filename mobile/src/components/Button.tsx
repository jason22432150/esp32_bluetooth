import type { ButtonProps } from '@tamagui/button';
import { Button } from '@tamagui/button';

/** 供畫面直接使用 Button.Text 等子元件 */
export { Button };

/**
 * 包裝 Tamagui Button，以 children 傳入內容。
 * `<CustomButton onPress={...}><Button.Text>斷線</Button.Text></CustomButton>`
 */
export function CustomButton({ theme = 'blue', ...props }: ButtonProps) {
  return <Button theme={theme} {...props} />;
}
