import { $designMode, $interactionMode } from '@/atoms'
import { $shortcutsDialogOpen } from '@/shortcuts-dialog'
import { studioApp } from '@/studio-app'
import { useStore } from '@nanostores/react'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import {
  Badge,
  Button,
  Flex,
  Heading,
  IconButton,
  Kbd,
  Select,
  Separator,
  Switch,
  Text,
} from '@radix-ui/themes'

export function GlobalHeader() {
  const interactionMode = useStore($interactionMode)
  const designMode = useStore($designMode)
  const library = useStore(studioApp.$library)

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
        <svg
          width="12"
          height="18"
          viewBox="0 0 15 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 23C3.13401 23 0 19.6422 0 15.5C0 11.3578 3.13401 8 7 8V23Z"
            fill="black"
          />
          <path d="M7 0H0V7H7V0Z" fill="black" />
          <path
            d="M11.5 7C13.433 7 15 5.433 15 3.5C15 1.567 13.433 0 11.5 0C9.56704 0 8 1.567 8 3.5C8 5.433 9.56704 7 11.5 7Z"
            fill="black"
          />
        </svg>

        <Heading size="4">Radix Studio</Heading>
        <Badge variant="outline">alpha</Badge>
      </Flex>

      <Flex align="center" gap="4">
        <Select.Root
          size="1"
          value={library}
          onValueChange={(value) => {
            studioApp.$library.set(value)
          }}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="radix-themes-2.0.3">
              Radix Themes 2.0.3
            </Select.Item>
            <Select.Item value="radix-themes-2.0.2">
              Radix Themes 2.0.2
            </Select.Item>
          </Select.Content>
        </Select.Root>

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

        <Separator orientation="vertical" />

        <IconButton
          variant="ghost"
          color="gray"
          onClick={() => {
            window.open('https://github.com/jhaemin/radix-studio', '_blank')
          }}
        >
          <GitHubLogoIcon width="17" height="17" />
        </IconButton>
      </Flex>
    </Flex>
  )
}
