import { Label, Separator, Switch, XStack } from 'tamagui';
import { SwitchProps } from 'tamagui';

export { Switch };

export function CustomSwitch({
  defaultChecked = false,
  ...props
}: SwitchProps) {
  return (
    <XStack items="center" gap="$4">
      <Label
        pr="$0"
        minW={90}
        justify="flex-end"
        size={props.size}
      >
        Accept
      </Label>
      <Separator minH={20} vertical />
      <Switch
        transition="300ms"
        size={props.size}
        defaultChecked={defaultChecked}
        // use activeStyle to choose youra active color
        // default to $backgroundActive unless "unstyled" boolean prop is on
        activeStyle={{
          backgroundColor: '$color6',
        }}
      >
        <Switch.Thumb transition="quickest" />
      </Switch>
    </XStack>
  );
}
