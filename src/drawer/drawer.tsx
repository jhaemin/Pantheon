import { RadixBlockquoteNode } from '@/__generated__/radix-blockquote'
import { RadixButtonNode } from '@/__generated__/radix-button'
import { RadixDialogNode } from '@/__generated__/radix-dialog'
import { RadixFlexNode } from '@/__generated__/radix-flex'
import { RadixSwitchNode } from '@/__generated__/radix-switch'
import { RadixTextNode } from '@/__generated__/radix-text'
import { TextNode } from '@/node-class/text'
import { Blockquote, Button, Flex, Switch, Text } from '@radix-ui/themes'
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

      <Flex direction="column" gap="4">
        <DrawerItemWrapper createNode={() => new RadixFlexNode()}>
          <Flex
            align="center"
            justify="center"
            style={{
              backgroundColor: 'var(--gray-3)',
              padding: 'var(--space-4) var(--space-8)',
            }}
          >
            Flex
          </Flex>
        </DrawerItemWrapper>

        <DrawerItemWrapper createNode={() => new TextNode()}>
          <span>Text</span>
        </DrawerItemWrapper>

        <DrawerItemWrapper createNode={() => new RadixTextNode()}>
          <Text size="3">Radix Text</Text>
        </DrawerItemWrapper>

        <DrawerItemWrapper
          createNode={() => {
            const button = new RadixButtonNode()
            const text = new TextNode()
            button.append(text)
            return button
          }}
        >
          <Button>Button</Button>
        </DrawerItemWrapper>

        <DrawerItemWrapper createNode={() => new RadixSwitchNode()}>
          <Switch />
        </DrawerItemWrapper>

        <DrawerItemWrapper createNode={() => new RadixBlockquoteNode()}>
          <Blockquote>Blockquote</Blockquote>
        </DrawerItemWrapper>

        <DrawerItemWrapper createNode={() => new RadixDialogNode()}>
          <Flex
            align="center"
            justify="center"
            style={{
              backgroundColor: 'var(--gray-3)',
              padding: 'var(--space-4) var(--space-8)',
            }}
          >
            Dialog
          </Flex>
        </DrawerItemWrapper>
      </Flex>
    </Flex>
  )
}
