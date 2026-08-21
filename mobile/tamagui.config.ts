import {
  createV5Theme,
  defaultChildrenThemes,
  defaultConfig,
} from '@tamagui/config/v5';
import { animations } from '@tamagui/config/v5-reanimated';
import { cyan, cyanDark, amber, amberDark } from '@tamagui/colors';
import { createTamagui } from 'tamagui';

const themes = createV5Theme({
  childrenThemes: {
    // include defaults (blue, red, green, yellow, etc.)
    ...defaultChildrenThemes,
    // add new colors（需為 NamedColors palette，不可用單一 hex）
    cyan: { light: cyan, dark: cyanDark },
    amber: { light: amber, dark: amberDark },
  },
});

export const config = createTamagui({
  ...defaultConfig,
  themes,
  animations,
});
