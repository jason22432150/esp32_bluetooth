import type { CardProps } from 'tamagui';
import { Button, Card, H2, Image, Paragraph, XStack } from 'tamagui';

export function DemoCard(props: CardProps) {
  return (
    <Card size="$4" borderWidth={1} borderColor="$borderColor" {...props}>
      <Card.Header p="$4">
        <H2>Sony A7IV</H2>
        <Paragraph>Now available</Paragraph>
      </Card.Header>
      <Card.Footer p="$4">
        <XStack flex={1} />
        <Button rounded="$10">Purchase</Button>
      </Card.Footer>
      <Card.Background items="center">
        <Image
          objectFit="contain"
          width={300}
          height={300}
          src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format"
        />
      </Card.Background>
    </Card>
  );
}
