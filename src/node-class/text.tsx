import { triggerRerenderGuides } from '@/atoms'
import { useStore } from '@nanostores/react'
import { Flex, Text, TextField } from '@radix-ui/themes'
import { atom } from 'nanostores'
import { useCallback, useEffect } from 'react'
import { Node } from './node'

export class TextNode extends Node {
  readonly nodeName = 'Text'

  readonly $value = atom('Text')

  constructor(value?: string) {
    super()
    if (value) {
      this.value = value
    }
  }

  get isDroppable() {
    return false
  }

  get value() {
    return this.$value.get()
  }

  set value(value: string) {
    this.$value.set(value)
  }
}

export function TextNodeComponent({ node }: { node: TextNode }) {
  const value = useStore(node.$value)

  return <span>{value}</span>
}

export function TextNodeControls({ nodes }: { nodes: TextNode[] }) {
  const value = useStore(nodes[0].$value)
  const allSame = nodes.every((node) => node.$value.get() === value)

  const handleEmpty = useCallback(() => {
    if (nodes[0].value.trim().length === 0) {
      console.log(nodes)
      nodes.forEach((node) => node.$value.set('Text'))
    }
  }, [nodes])

  useEffect(() => {
    return () => {
      handleEmpty()
    }
  }, [handleEmpty])

  useEffect(() => {
    triggerRerenderGuides(true)
  }, [value])

  return (
    <Flex>
      <Text>Text Value</Text>
      <Flex>
        <TextField.Root>
          <TextField.Input
            placeholder={allSame ? '' : 'Multiple values'}
            onBlur={handleEmpty} // Set default value on blur without text
            onChange={(e) => {
              nodes.forEach((node) => node.$value.set(e.currentTarget.value))
            }}
          />
        </TextField.Root>
      </Flex>
    </Flex>
  )
}
