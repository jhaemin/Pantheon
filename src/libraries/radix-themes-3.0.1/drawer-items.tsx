import { Library } from '@/library'
import { Node } from '@/node-class/node'
import { NodeUtil } from '@/node-class/node-util'
import { Blockquote, Code, Heading, Text } from '@radix-ui/themes-3.0.1'
import { nodeDefinitions as def } from './node-definitions'

const studioLibrary: Library = {
  name: 'studio',
  version: '1.0.0',
}

const library: Library = {
  name: 'radix-themes',
  version: '3.0.1',
}

const createStudioNode = NodeUtil.createNodeFactory(studioLibrary)
const createRadixNode = NodeUtil.createNodeFactory(library)

function createTextNode(value: string) {
  return createStudioNode({ nodeName: 'Text', props: { value } })
}

export const drawerItems: {
  createNode: () => Node
  render: () => JSX.Element
}[] = [
  {
    createNode: () =>
      createRadixNode({
        nodeName: def.RadixText.nodeName,
        children: [createTextNode('Radix Text')],
      }),
    render: () => <Text>Radix Text</Text>,
  },
  {
    createNode: () =>
      createRadixNode({
        nodeName: def.Heading.nodeName,
        children: [createTextNode('Heading')],
      }),
    render: () => <Heading>Heading</Heading>,
  },
  {
    createNode: () =>
      createRadixNode({
        nodeName: def.Code.nodeName,
        children: [createTextNode('Radix Code')],
      }),
    render: () => <Code>Code</Code>,
  },
  {
    createNode: () =>
      createRadixNode({
        nodeName: def.Blockquote.nodeName,
        children: [createTextNode('Blockquote')],
      }),
    render: () => <Blockquote>Blockquote</Blockquote>,
  },
]
