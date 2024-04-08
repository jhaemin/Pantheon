import { Box, ScrollArea, Tabs, Text } from '@radix-ui/themes'
import { ControlCenterNode } from './control-center-node'

export function ControlCenter() {
  return (
    <Tabs.Root
      defaultValue="node"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: '50%',
        width: '100%',
        zIndex: 100,
        backgroundColor: 'var(--color-background)',
      }}
    >
      <Tabs.List highContrast size="2">
        <Tabs.Trigger value="node">Node</Tabs.Trigger>
        <Tabs.Trigger value="store">Store</Tabs.Trigger>
      </Tabs.List>

      <ScrollArea
        type="hover"
        style={{
          height: 'calc(100% - var(--space-7))',
        }}
      >
        <Tabs.Content value="node">
          <ControlCenterNode />
        </Tabs.Content>

        <Tabs.Content value="store">
          <Box p="3">
            <Text size="5" weight="bold">
              Store
            </Text>
          </Box>
        </Tabs.Content>
      </ScrollArea>
    </Tabs.Root>
  )
}
