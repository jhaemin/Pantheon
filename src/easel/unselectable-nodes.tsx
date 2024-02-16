import { $selectedNodes } from '@/atoms'
import { Ground } from '@/ground'
import { PageNode } from '@/node-class/page'
import { useStore } from '@nanostores/react'
import { Button, Card, Flex, Text } from '@radix-ui/themes'

/**
 * TODO: rename to unreachable
 */
export function UnselectableNodes({ page }: { page: PageNode }) {
  const scale = useStore(Ground.$scale)
  const unselectableNodes = useStore(page.$unselectableNodes)

  if (unselectableNodes.length === 0) return null

  return (
    <Card
      size="2"
      variant="classic"
      style={{
        position: 'absolute',
        left: `calc(100% + ${10 / scale}px)`,
        transformOrigin: 'top left',
        transform: `scale(${1 / scale})`,
      }}
    >
      <Flex direction="column" gap="2" align="start">
        <Text size="2" weight="bold">
          Unreachable
        </Text>
        {unselectableNodes.map((node) => (
          <Button
            key={node.id}
            // color="gray"
            variant="soft"
            onMouseDown={() => {
              $selectedNodes.set([node])
            }}
          >
            {node.nodeName}
          </Button>
        ))}
      </Flex>
    </Card>
  )
}
