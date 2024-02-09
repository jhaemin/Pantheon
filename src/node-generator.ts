import { kebabCase } from 'change-case'
import fs from 'node:fs/promises'
import { format } from './format'
import { NodeDefinition } from './node-definition'

async function main() {
  await fs.rm('src/__generated__', { recursive: true, force: true })

  const definitions = await import('./definitions/node-definitions')

  const nodeNames: string[] = []

  Object.entries(definitions).forEach(async ([key, def]) => {
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
${Object.values(definitions)
  .map(
    (def) =>
      `import { ${def.nodeName}NodeComponent, ${def.nodeName}NodeControls } from './${kebabCase(def.nodeName)}'`,
  )
  .join('\n')}

export const generatedNodeComponentMap = {
  ${Object.values(definitions)
    .map((def) => `${def.nodeName}: ${def.nodeName}NodeComponent`)
    .join(',\n')}
}

export const generatedNodeControlsMap = {
  ${Object.values(definitions)
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
${Object.values(definitions)
  .map(
    (def) =>
      `import { ${def.nodeName}Node } from './${kebabCase(def.nodeName)}'`,
  )
  .join('\n')}

export const generatedNodeNameNodeMap = {
  ${Object.values(definitions)
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
    lib,
    leaf,
    componentName,
    arbitraryChildren,
    nodeName,
    props,
    slots,
  } = nodeDef

  const hasProps = props && props.length > 0
  const propsTypeName = `${nodeName}NodeProps`
  const nodeClassName = `${nodeName}Node`
  const nodeComponentName = `${nodeName}NodeComponent`
  const nodeControlsName = `${nodeName}NodeControls`

  return `
${
  leaf
    ? ''
    : `
import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'`
}
import { Node } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { ${lib.mod} } from '${lib.from}'
${hasProps ? `import { SelectControls } from '@/control-center/controls-template'` : ''}

export type ${propsTypeName} = ${
    props
      ? `
{
  ${props.map((prop) => {
    const { key, type, required } = prop

    const tsType = Array.isArray(type)
      ? type.map((t) => `'${t}'`).join(' | ')
      : type

    return `${key}${required ? '' : '?'}: ${tsType}`
  })}
}
`
      : '{}'
  }

export class ${nodeClassName} extends Node {
  readonly nodeName = '${nodeName}'

  public readonly defaultProps: ${propsTypeName} = ${
    props
      ? JSON.stringify(
          props.reduce((acc, prop) => {
            const defaultValue = prop.default

            if (!defaultValue) return acc

            return {
              ...acc,
              [prop.key]: defaultValue,
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

export function ${nodeComponentName}({ node }: { node: ${nodeClassName} }) {
  ${leaf ? '' : 'const children = useStore(node.$children)'}
  const props = useStore(node.$props)

  return ${
    leaf
      ? `<${componentName ?? lib.mod} {...props} />`
      : `<${componentName ?? lib.mod} {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="${nodeName}" />
      )}
    </${componentName ?? lib.mod}>
  `
  }
}

export function ${nodeControlsName}({ nodes }: { nodes: ${nodeClassName}[] }) {
  return <>${
    hasProps
      ? props
          .map(
            (prop) => `
    <SelectControls
      controlsLabel="${prop.key}"
      nodes={nodes}
      propertyKey="${prop.key}"
      options={[
        ${!prop.required ? `{ label: 'default', value: undefined },` : ''}
        ${Array.isArray(prop.type) ? prop.type.map((t) => `{ label: '${t}', value: '${t}' }`).join(',\n') : ''}
      ]}
    />`,
          )
          .join('')
      : ''
  }
  </>
}
  `
}
