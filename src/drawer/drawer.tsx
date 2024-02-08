import { ButtonNode } from '@/__generated__/button'
import { SwitchNode } from '@/__generated__/switch'
import { TextNode } from '@/nodes/text'
import { Button, Flex, Switch, Text } from '@radix-ui/themes'
import { DrawerItemWrapper } from './drawer-item-wrapper'

export function Drawer() {
  return (
    <Flex
      direction="column"
      p="5"
      style={{
        width: 300,
        position: 'fixed',
        left: 0,
        top: 'var(--space-8)',
        bottom: 0,
        backgroundColor: '#fff',
        borderRight: '1px solid var(--gray-4)',
        zIndex: 100,
      }}
    >
      <Text size="5" weight="bold" mb="4">
        Drawer
      </Text>

      <DrawerItemWrapper
        createNode={() => {
          const button = new ButtonNode()
          const text = new TextNode()
          button.append(text)
          return button
        }}
      >
        <Button>Button</Button>
      </DrawerItemWrapper>

      <DrawerItemWrapper createNode={() => new SwitchNode()}>
        <Switch />
      </DrawerItemWrapper>
    </Flex>
  )
}
