import { Library } from '@/library'
import { Node } from '@/node-class/node'
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

function createTextNode(value: string) {
  return new Node({
    library: studioLibrary,
    nodeName: 'Text',
    props: { value },
  })
}

export const drawerItems: {
  createNode: () => Node
  render: () => JSX.Element
}[] = [
  {
    createNode: () =>
      new Node({
        library,
        nodeName: def.RadixText.nodeName,
        children: [createTextNode('Radix Text')],
      }),
    render: () => <Text>Radix Text</Text>,
  },
  {
    createNode: () =>
      new Node({
        library,
        nodeName: def.Heading.nodeName,
        children: [createTextNode('Heading')],
      }),
    render: () => <Heading>Heading</Heading>,
  },
  {
    createNode: () =>
      new Node({
        library,
        nodeName: def.Code.nodeName,
        children: [createTextNode('Radix Code')],
      }),
    render: () => <Code>Code</Code>,
  },
  {
    createNode: () =>
      new Node({
        library,
        nodeName: def.Blockquote.nodeName,
        children: [createTextNode('Blockquote')],
      }),
    render: () => <Blockquote>Blockquote</Blockquote>,
  },
]
