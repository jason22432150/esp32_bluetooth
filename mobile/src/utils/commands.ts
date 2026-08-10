const clampColor = (value: number) => {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(255, Math.round(value)));
};

const formatColor = (value: number) => {
  return clampColor(value).toString().padStart(3, '0');
};

export const buildStopCommand = () => {
  return 'stop%';
};

export const buildModeCommand = (mode: string) => {
  return `mode${mode}%`;
};

export const buildRainbowCommand = (mode: 1 | 2) => {
  return `rainbow${mode}%`;
};

export const buildRgbCommand = (
  first: { r: number; g: number; b: number },
  second: { r: number; g: number; b: number },
) => {
  return `rgb${formatColor(first.r)},${formatColor(first.g)},${formatColor(
    first.b,
  )},${formatColor(second.r)},${formatColor(second.g)},${formatColor(
    second.b,
  )}%`;
};

export const ensureCommandTerminator = (command: string) => {
  const trimmed = command.trim();

  if (trimmed.endsWith('%')) {
    return trimmed;
  }

  return `${trimmed}%`;
};
