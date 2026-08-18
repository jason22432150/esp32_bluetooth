import { create } from 'zustand';

type LedStripColorStore = {
  leftLedStripColor: string;
  rightLedStripColor: string;
  setLeftLedStripColor: (leftLedStripColor: string) => void;
  setRightLedStripColor: (rightLedStripColor: string) => void;
};

export const useLedStripColorStore = create<LedStripColorStore>((set) => ({
  leftLedStripColor: '',
  rightLedStripColor: '',
  setLeftLedStripColor: (leftLedStripColor) => set({ leftLedStripColor }),
  setRightLedStripColor: (rightLedStripColor) => set({ rightLedStripColor }),
}));