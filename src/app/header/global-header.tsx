import {
  $designMode,
  $interactiveMode,
  $massMode,
  $shortcutsDialogOpen,
} from '@/atoms'
import { Command } from '@/command'
import { useStore } from '@nanostores/react'
import { FilePlusIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import {
  Badge,
  Button,
  Flex,
  Heading,
  IconButton,
  Kbd,
  Separator,
  Switch,
  Text,
} from '@radix-ui/themes'

export function GlobalHeader() {
  const interactiveMode = useStore($interactiveMode)
  const designMode = useStore($designMode)
  const massMode = useStore($massMode)

  return (
    <Flex
      px="4"
      align="center"
      justify="between"
      style={{
        height: 'var(--space-8)',
        backgroundColor: 'var(--color-background)',
        borderBottom: '1px solid var(--accent-a6)',
        zIndex: 200,
      }}
    >
      <Flex gap="4" align="center">
        <Flex gap="2" align="center">
          <img alt="Pantheon" src="/favicon.png" width={20} height={20} />
          <Heading size="4">Pantheon</Heading>
          <Badge highContrast variant="solid">
            alpha
          </Badge>
        </Flex>

        <Separator orientation="vertical" />

        <Flex gap="2" align="center">
          <Button variant="ghost" onClick={Command.addPage}>
            <FilePlusIcon />
            Page
          </Button>
        </Flex>
      </Flex>

      <Flex align="center" gap="4">
        <Text as="label" size="2">
          <Flex align="center" gap="2">
            Mass mode
            <Switch
              highContrast
              checked={massMode}
              onCheckedChange={(checked) => {
                $massMode.set(checked)
              }}
            />
          </Flex>
        </Text>

        <Separator orientation="vertical" />

        <Text as="label" size="2">
          <Flex align="center" gap="2">
            Interactive mode
            <Switch
              highContrast
              checked={interactiveMode}
              onCheckedChange={(checked) => {
                $interactiveMode.set(checked)
              }}
            />
          </Flex>
        </Text>

        <Separator orientation="vertical" />

        <Text as="label" size="2">
          <Flex align="center" gap="2">
            Design mode
            <Switch
              highContrast
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

        <Separator orientation="vertical" />

        <IconButton
          variant="ghost"
          color="gray"
          onClick={() => {
            window.open('https://github.com/jhaemin/pantheon', '_blank')
          }}
        >
          <GitHubLogoIcon width="17" height="17" />
        </IconButton>
      </Flex>
    </Flex>
  )
}
