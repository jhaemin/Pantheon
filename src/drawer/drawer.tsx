import { RadixAvatarNode } from '@/__generated__/radix-avatar'
import { RadixBadgeNode } from '@/__generated__/radix-badge'
import { RadixBlockquoteNode } from '@/__generated__/radix-blockquote'
import { RadixBoxNode } from '@/__generated__/radix-box'
import { RadixButtonNode } from '@/__generated__/radix-button'
import { RadixCalloutNode } from '@/__generated__/radix-callout'
import { RadixCardNode } from '@/__generated__/radix-card'
import { RadixDialogNode } from '@/__generated__/radix-dialog'
import { RadixFlexNode } from '@/__generated__/radix-flex'
import { RadixGridNode } from '@/__generated__/radix-grid'
import { RadixSwitchNode } from '@/__generated__/radix-switch'
import { RadixTextNode } from '@/__generated__/radix-text'
import { TextNode } from '@/node-class/text'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import {
  Avatar,
  Badge,
  Blockquote,
  Box,
  Button,
  Callout,
  Card,
  Flex,
  Switch,
  Text,
} from '@radix-ui/themes'
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

      <Flex direction="column" gap="5">
        <DrawerItemWrapper createNode={() => new RadixBoxNode()}>
          <Box
            style={{
              backgroundColor: 'var(--gray-3)',
              padding: 'var(--space-4) var(--space-8)',
            }}
          >
            Box
          </Box>
        </DrawerItemWrapper>

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

        <DrawerItemWrapper createNode={() => new RadixGridNode()}>
          <Flex
            align="center"
            justify="center"
            style={{
              backgroundColor: 'var(--gray-3)',
              padding: 'var(--space-4) var(--space-8)',
            }}
          >
            Grid
          </Flex>
        </DrawerItemWrapper>

        <DrawerItemWrapper createNode={() => new TextNode()}>
          <span>Text</span>
        </DrawerItemWrapper>

        <DrawerItemWrapper
          createNode={() => {
            const radixText = new RadixTextNode()
            radixText.append(new TextNode())
            return radixText
          }}
        >
          <Text size="3">Radix Text</Text>
        </DrawerItemWrapper>

        <DrawerItemWrapper
          createNode={() => {
            const button = new RadixButtonNode()
            const text = new TextNode('Button')
            button.append(text)
            return button
          }}
        >
          <Button>Button</Button>
        </DrawerItemWrapper>

        <DrawerItemWrapper
          createNode={() => {
            const badge = new RadixBadgeNode()
            const text = new TextNode('Badge')
            badge.append(text)
            return badge
          }}
        >
          <Badge>Badge</Badge>
        </DrawerItemWrapper>

        <DrawerItemWrapper createNode={() => new RadixSwitchNode()}>
          <Switch />
        </DrawerItemWrapper>

        <DrawerItemWrapper createNode={() => new RadixBlockquoteNode()}>
          <Blockquote>Blockquote</Blockquote>
        </DrawerItemWrapper>

        <DrawerItemWrapper
          createNode={() => {
            const callout = new RadixCalloutNode()
            const text = new TextNode()
            callout.$slots.get().text.append(text)
            return callout
          }}
        >
          <Callout.Root>
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>Callout</Callout.Text>
          </Callout.Root>
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

        <DrawerItemWrapper
          createNode={() => {
            const avatar = new RadixAvatarNode()
            avatar.$props.setKey(
              'src',
              'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop',
            )
            return avatar
          }}
        >
          <Avatar
            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
            fallback="A"
            size="4"
          />
        </DrawerItemWrapper>

        <DrawerItemWrapper
          createNode={() => {
            const card = new RadixCardNode()
            const flex = new RadixFlexNode()
            flex.$props.setKey('gap', '3')
            flex.$props.setKey('align', 'center')
            const avatar = new RadixAvatarNode()
            avatar.$props.setKey(
              'src',
              'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop',
            )
            avatar.$props.setKey('size', '3')
            avatar.$props.setKey('radius', 'full')
            avatar.$props.setKey('fallback', 'T')
            const box = new RadixBoxNode()
            const text1 = new RadixTextNode()
            text1.$props.setKey('as', 'div')
            text1.$props.setKey('size', '2')
            text1.$props.setKey('weight', 'bold')
            text1.append(new TextNode('Teodros Girmay'))
            const text2 = new RadixTextNode()
            text2.$props.setKey('as', 'div')
            text2.$props.setKey('size', '2')
            text2.$props.setKey('color', 'gray')
            text2.append(new TextNode('Engineering'))

            box.append(text1, text2)
            flex.append(avatar, box)
            card.append(flex)

            return card
          }}
        >
          <Card>
            <Flex gap="3" align="center">
              <Avatar
                size="3"
                src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                radius="full"
                fallback="T"
              />
              <Box>
                <Text as="div" size="2" weight="bold">
                  Teodros Girmay
                </Text>
                <Text as="div" size="2" color="gray">
                  Engineering
                </Text>
              </Box>
            </Flex>
          </Card>
        </DrawerItemWrapper>
      </Flex>
    </Flex>
  )
}
