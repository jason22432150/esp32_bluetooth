import { GetProps, YStack, styled } from 'tamagui'; // or '@tamagui/core' if extending just that

export const Circle = styled(YStack, {
  items: 'center',
  justify: 'center',
  rounded: 100_000_000,
  overflow: 'hidden',
  variants: {
    color: {
      red: {
        backgroundColor: 'red',
      },
    },
    size: {
      '...size': (size, { tokens }) => {
        return {
          width: tokens.size[size as keyof typeof tokens.size] ?? size,
          height: tokens.size[size as keyof typeof tokens.size] ?? size,
        };
      },
    },
  },
});

export type CircleProps = GetProps<typeof Circle>;
