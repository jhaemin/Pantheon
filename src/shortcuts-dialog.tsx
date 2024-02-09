import { useStore } from '@nanostores/react'
import { Box, Button, Dialog, Flex, Grid, Kbd, Text } from '@radix-ui/themes'
import { atom } from 'nanostores'

export const $shortcutsDialogOpen = atom(false)

const shortcuts: { action: string; key: string }[] = [
  {
    action: 'Add a Page',
    key: '⌘ P',
  },
  {
    action: 'Remove Node',
    key: '⌫',
  },
  {
    action: 'Toggle Design Mode',
    key: '⌘ D',
  },
  {
    action: 'Toggle Interaction Mode',
    key: '⌘ I',
  },
  {
    action: 'Toggle Text Node Editing',
    key: '⌘ E',
  },
  {
    action: 'Toggle Dev Tools',
    key: '⌘ V',
  },
  {
    action: 'Undo',
    key: '⌘ Z',
  },
  {
    action: 'Redo',
    key: '⇧ ⌘ Z',
  },
]

export function ShortcutsDialog() {
  const open = useStore($shortcutsDialogOpen)

  return (
    <Dialog.Root open={open} onOpenChange={(o) => $shortcutsDialogOpen.set(o)}>
      <Dialog.Content>
        <Dialog.Title mb="6">Keyboard Shortcuts</Dialog.Title>

        <Grid columns="2" gapX="6" gapY="6" width="auto">
          {shortcuts.map((shortcut) => (
            <Box key={shortcut.action}>
              <Flex align="center" justify="between" gap="4">
                <Text size="2">{shortcut.action}</Text>
                <Flex direction="column" align="end" gap="2">
                  <Kbd key={shortcut.key} size="3">
                    {shortcut.key}
                  </Kbd>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Grid>

        <Flex mt="6" justify="end">
          <Dialog.Close>
            <Button>Close</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
