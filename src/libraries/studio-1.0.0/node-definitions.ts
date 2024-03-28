import { $selectedNodes } from '@/atoms'
import { PageNode } from '@/node-class/page'
import { NodeDefinition } from '@/node-definition'

export const nodeDefinitions: Record<string, NodeDefinition> = {
  Text: {
    mod: 'Text',
    nodeName: 'Text',
    leaf: true,
    props: [
      {
        key: 'value',
        format: { type: 'string' },
        default: 'Text',
        label: 'Value',
        required: true,
      },
    ],
    generateCode: (node) => {
      const value = node.$props.get().value

      if (node.parent instanceof PageNode) {
        return `<span>${value}</span>`
      }

      if ($selectedNodes.get().includes(node)) {
        return `\`${value.replace(/`/g, '\\`')}\``
      }

      return `${value}`
    },
  },
  Page: {
    mod: 'Page',
    nodeName: 'Page',
    props: [
      {
        key: 'title',
        format: { type: 'string' },
        default: 'New Page',
        label: 'Value',
      },
    ],
  },
  Image: {
    mod: 'Image',
    nodeName: 'Image',
    leaf: true,
    props: [
      {
        key: 'src',
        format: { type: 'string' },
      },
      {
        key: 'width',
        format: { type: 'string' },
      },
    ],
  },
}
