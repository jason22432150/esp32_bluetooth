/**
 * App 導航參數型別定義
 */
export type RootStackParamList = {
  Control: undefined;
  /** 可選 params：接收 ColorPicker 回傳的選色結果 */
  LedPicker:
    | {
        selectedColor?: string;
        colorField?: LedColorField;
      }
    | undefined;
  ColorPicker: {
    /** 初始顏色（hex） */
    initialColor?: string;
    /** 選色後寫回哪個欄位 */
    colorField: LedColorField;
  };
};

/** LED 燈條顏色欄位 */
export type LedColorField = 'left' | 'right' | 'all';
