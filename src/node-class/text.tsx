import { $selectedNodes } from '@/atoms'
import { makeNodeProps } from '@/data-attributes'
import { Prop } from '@/node-definition'
import { useStore } from '@nanostores/react'
import { map } from 'nanostores'
import { Node } from './node'
import { PageNode } from './page'

export class TextNode extends Node {
  readonly nodeName = 'Text'

  readonly $props = map({
    value: 'Text',
  })

  public propsDefinition: Prop[] = [
    {
      key: 'value',
      type: 'string',
      default: 'Text',
      label: 'Value',
      required: true,
    },
  ]

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
    return this.$props.get().value
  }

  set value(value: string) {
    this.$props.setKey('value', value)
  }

  public generateCode(): string {
    if (this.parent instanceof PageNode) {
      return `<span>${this.value}</span>`
    }

    if ($selectedNodes.get().includes(this)) {
      return `\`${this.value.replace(/`/g, '\\`')}\``
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
  const { value } = useStore(node.$props, { keys: ['value'] })

  return <span {...makeNodeProps(node)}>{value}</span>
}
