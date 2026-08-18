import { create } from 'zustand';

type LedStripColorStore = {
  ledStripColor: string;
  leftLedStripColor: string;
  rightLedStripColor: string;
  setLedStripColor: (ledStripColor: string) => void;
  setLeftLedStripColor: (leftLedStripColor: string) => void;
  setRightLedStripColor: (rightLedStripColor: string) => void;
};

export const useLedStripColorStore = create<LedStripColorStore>((set) => ({
  ledStripColor: '',
  leftLedStripColor: '',
  rightLedStripColor: '',
  setLedStripColor: (ledStripColor) => set({ ledStripColor }),
  setLeftLedStripColor: (leftLedStripColor) => set({ leftLedStripColor }),
  setRightLedStripColor: (rightLedStripColor) => set({ rightLedStripColor }),
}));