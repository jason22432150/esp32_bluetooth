import { Label, Separator, Switch, XStack } from 'tamagui';
import type { SwitchProps } from 'tamagui';

export { Switch };

type CustomSwitchProps = SwitchProps & {
  /** Label 文案，預設「深色模式」 */
  label?: string;
};

export function CustomSwitch({
  label = '深色模式',
  ...props
}: CustomSwitchProps) {
  return (
    <XStack items="center" gap="$4">
      <Label pr="$0" minW={90} justify="flex-end" size={props.size}>
        {label}
      </Label>
      <Separator minH={20} vertical />
      <Switch
        transition="300ms"
        // use activeStyle to choose your active color
        // default to $backgroundActive unless "unstyled" boolean prop is on
        activeStyle={{
          backgroundColor: '$color6',
        }}
        {...props}
      >
        <Switch.Thumb transition="quickest" />
      </Switch>
    </XStack>
  );
}
