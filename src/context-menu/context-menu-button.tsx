import { $isContextMenuOpen } from '@/atoms'
import { Button, Flex, Text } from '@radix-ui/themes'
import { ComponentProps } from 'react'

export type ContextMenuButtonProps = {
  label: string
  color?: ComponentProps<typeof Button>['color']
  onClick: () => void
  icon: React.FC
}

export function ContextMenuButton({
  label,
  onClick,
  color,
  icon,
}: ContextMenuButtonProps) {
  const Icon = icon as React.FC<{ size: number; color: string }>

  return (
    <Button
      variant="ghost"
      color="gray"
      onClick={() => {
        onClick()
        $isContextMenuOpen.set(false)
      }}
    >
      <Flex align="center" justify="between" width="100%" gap="6">
        <Text style={{ color: '#000' }} size="2">
          {label}
        </Text>
        <Text color="gray" style={{ opacity: 0.8 }}>
          ⌘ K
        </Text>
      </Flex>
    </Button>
  )
}
