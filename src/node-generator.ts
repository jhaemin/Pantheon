import { kebabCase } from 'change-case'
import fs from 'node:fs/promises'
import { format } from './format'
import { NodeDefinition } from './node-definition'

async function main() {
  await fs.rm('src/__generated__', { recursive: true, force: true })

  const mod = await import('./definitions/node-definitions')

  const nodeNames: string[] = []

  Object.entries(mod).forEach(async ([key, def]) => {
    nodeNames.push(def.nodeName)

    const nodeSource = generateNode(def)

    const formatted = await format(nodeSource)

    await Bun.write(
      'src/__generated__/' + kebabCase(def.nodeName) + '.tsx',
      formatted,
    )
  })

  Bun.write(
    'src/__generated__/generated-node-name.ts',
    await format(
      `export type GeneratedNodeName = ${nodeNames
        .sort()
        .map((name) => `'${name}'`)
        .join(' | ')}`,
    ),
  )

  Bun.write(
    'src/__generated__/generated-node-map.ts',
    await format(
      `
${Object.values(mod)
  .map(
    (def) =>
      `import { ${def.nodeName}NodeComponent, ${def.nodeName}NodeControls } from './${kebabCase(def.nodeName)}'`,
  )
  .join('\n')}

export const generatedNodeComponentMap = {
  ${Object.values(mod)
    .map((def) => `${def.nodeName}: ${def.nodeName}NodeComponent`)
    .join(',\n')}
}

export const generatedNodeControlsMap = {
  ${Object.values(mod)
    .map((def) => `${def.nodeName}: ${def.nodeName}NodeControls`)
    .join(',\n')}
}
`,
    ),
  )

  Bun.write(
    'src/__generated__/generated-node-name-node-map.ts',
    await format(
      `
${Object.values(mod)
  .map(
    (def) =>
      `import { ${def.nodeName}Node } from './${kebabCase(def.nodeName)}'`,
  )
  .join('\n')}

export const generatedNodeNameNodeMap = {
  ${Object.values(mod)
    .map((def) => `${def.nodeName}: ${def.nodeName}Node`)
    .join(',\n')}
}
`,
    ),
  )
}

main()

function generateNode(nodeDef: NodeDefinition) {
  const {
    importDefinition,
    leaf,
    arbitraryChildren,
    nodeName,
    propsDefinition,
    slotsDefinition,
  } = nodeDef

  return `
${
  leaf
    ? ''
    : `
import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
`
}
import { Node } from '@/node-class/node'
import { NodeName } from '@/node-name'
import { useStore } from '@nanostores/react'
import { ${importDefinition.named} } from '${importDefinition.from}'

export type ${nodeName}NodeProps = ${
    propsDefinition
      ? `
{
  ${Object.keys(propsDefinition).map((key) => {
    const { type, required } = propsDefinition[key]

    const tsType = Array.isArray(type)
      ? type.map((t) => `'${t}'`).join(' | ')
      : type

    return `${key}${required ? '' : '?'}: ${tsType}`
  })}
}
`
      : '{}'
  }

export class ${nodeName}Node extends Node {
  readonly nodeName = '${nodeName}' satisfies NodeName

  defaultProps = ${
    propsDefinition
      ? JSON.stringify(
          Object.keys(propsDefinition).reduce((acc, key) => {
            const defaultValue = propsDefinition[key].default

            if (!defaultValue) return acc

            return {
              ...acc,
              [key]: defaultValue,
            }
          }, {}),
          null,
          2,
        )
      : '{}'
  }

  ${
    leaf
      ? `
  get isDroppable() {
    return false
  }
  `
      : ''
  }
}

export function ${nodeName}NodeComponent({ node }: { node: ${nodeName}Node }) {
  ${leaf ? '' : 'const children = useStore(node.$children)'}
  const props = useStore(node.$props)

  return ${
    leaf
      ? `<${importDefinition.named} {...props} />`
      : `<${importDefinition.named} {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="${nodeName}" />
      )}
    </${importDefinition.named}>
  `
  }
}

export function ${nodeName}NodeControls({ nodes }: { nodes: ${nodeName}Node[] }) {
  return <></>
}
  `
}
