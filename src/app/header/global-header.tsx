import { $designMode, $interactionMode, $textNodeEditing } from '@/atoms'
import { $shortcutsDialogOpen } from '@/shortcuts-dialog'
import { useStore } from '@nanostores/react'
import {
  Badge,
  Button,
  Flex,
  Heading,
  Kbd,
  Separator,
  Switch,
  Text,
} from '@radix-ui/themes'

export function GlobalHeader() {
  const interactionMode = useStore($interactionMode)
  const designMode = useStore($designMode)
  const textNodeEditing = useStore($textNodeEditing)

  return (
    <Flex
      px="5"
      align="center"
      justify="between"
      height="8"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderBottom: '1px solid var(--gray-4)',
        zIndex: 200,
      }}
    >
      <Flex gap="2" align="center">
        <Heading size="4">Radix Studio</Heading>
        <Badge variant="outline">alpha</Badge>
      </Flex>

      <Flex align="center" gap="4">
        <Text as="label" size="2">
          <Flex align="center" gap="2">
            Text Editing
            <Switch
              checked={textNodeEditing}
              onCheckedChange={(checked) => {
                $textNodeEditing.set(checked)
              }}
            />
          </Flex>
        </Text>

        <Separator orientation="vertical" />

        <Text as="label" size="2">
          <Flex align="center" gap="2">
            Interaction Mode
            <Switch
              checked={interactionMode}
              onCheckedChange={(checked) => {
                $interactionMode.set(checked)
              }}
            />
          </Flex>
        </Text>

        <Separator orientation="vertical" />

        <Text as="label" size="2">
          <Flex align="center" gap="2">
            Design Mode
            <Switch
              checked={designMode}
              onCheckedChange={(checked) => {
                $designMode.set(checked)
              }}
            />
          </Flex>
        </Text>

        <Separator orientation="vertical" />

        <Button
          variant="ghost"
          onClick={() => {
            $shortcutsDialogOpen.set(true)
          }}
        >
          <Text size="2">
            <Flex gap="3" align="center">
              See All Shortcuts<Kbd size="3">⌘ K</Kbd>
            </Flex>
          </Text>
        </Button>
      </Flex>
    </Flex>
  )
}
