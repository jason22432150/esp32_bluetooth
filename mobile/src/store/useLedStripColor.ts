import { create } from 'zustand';

type LedStripColorStore = {
  ledStripColor: string;
  setLedStripColor: (ledStripColor: string) => void;
};

export const useLedStripColorStore = create<LedStripColorStore>((set) => ({
  ledStripColor: '',
  setLedStripColor: (ledStripColor) => set({ ledStripColor }),
}));