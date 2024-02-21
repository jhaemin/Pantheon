import { $selectedNodes, triggerRerenderGuides } from '@/atoms'
import { makeNodeProps } from '@/data-attributes'
import { useStore } from '@nanostores/react'
import { Flex, Text, TextField } from '@radix-ui/themes'
import { atom } from 'nanostores'
import { useCallback, useEffect } from 'react'
import { Node } from './node'
import { PageNode } from './page'

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

  public generateCode(): string {
    if (this.parent instanceof PageNode) {
      return `<span>${this.value}</span>`
    }

    if ($selectedNodes.get().includes(this)) {
      return `'${this.value}'`
    }

    return `${this.value}`
  }

  public serialize() {
    return {
      ...super.serialize(),
      value: this.value,
    }
  }
}

export function TextNodeComponent({ node }: { node: TextNode }) {
  const value = useStore(node.$value)

  return <span {...makeNodeProps(node)}>{value}</span>
}

export function TextNodeControls({ nodes }: { nodes: TextNode[] }) {
  const value = useStore(nodes[0].$value)
  const allSame = nodes.every((node) => node.$value.get() === value)

  const handleEmpty = useCallback(() => {
    if (nodes[0].value.trim().length === 0) {
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
    <Flex direction="row" align="center" justify="between">
      <Text size="2">Value</Text>
      <TextField.Root>
        <TextField.Input
          value={allSame ? value : ''}
          placeholder={allSame ? '' : 'Multiple values'}
          onBlur={handleEmpty} // Set default value on blur without text
          onChange={(e) => {
            nodes.forEach((node) => node.$value.set(e.currentTarget.value))
          }}
        />
      </TextField.Root>
    </Flex>
  )
}
