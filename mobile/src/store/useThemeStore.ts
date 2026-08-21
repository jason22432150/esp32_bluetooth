import { create } from 'zustand';

export type AppColorScheme = 'light' | 'dark';

type ThemeStore = {
  /** 目前根主題名稱，對應 Tamagui `light` / `dark` */
  scheme: AppColorScheme;
  setScheme: (scheme: AppColorScheme) => void;
  /** Switch 勾選時切到 dark，取消則 light */
  setDarkMode: (enabled: boolean) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  scheme: 'light',
  setScheme: (scheme) => set({ scheme }),
  setDarkMode: (enabled) => set({ scheme: enabled ? 'dark' : 'light' }),
}));
