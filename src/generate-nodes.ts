import { kebabCase, pascalCase } from 'change-case'
import fs from 'node:fs/promises'
import { format } from './format'
import { LibraryDefinition } from './library-definition'
import { CustomClass, NodeDefinition, Prop, Slot } from './node-definition'

const libArgIndex = Bun.argv.indexOf('--lib')
const lib = Bun.argv[libArgIndex + 1]

if (libArgIndex === -1 || !lib) {
  console.error('Please provide --lib argument')
  process.exit(1)
}

const generatedDir = `src/__generated__/${lib}`

main()

async function main() {
  await fs.rm(generatedDir, { recursive: true, force: true })

  const mod = await import(`./definitions/${lib}`)

  if (!mod || !mod.libraryDefinition) {
    console.error(`Library definition for ${lib} is not found`)
    process.exit(1)
  }

  const libraryDefinition = mod.libraryDefinition as LibraryDefinition
  const { from, nodeDefinitions } = libraryDefinition

  const allDefs = Object.values(nodeDefinitions)

  await Promise.all(
    Object.entries(nodeDefinitions).map(async ([key, def]) => {
      return generateNode(def, from)
    }),
  )

  const nodeNames = allDefs.map(({ nodeName }) => nodeName)

  Bun.write(
    `${generatedDir}/node-name.ts`,
    await format(
      `export type NodeName = ${nodeNames
        .sort()
        .map((name) => `'${name}'`)
        .join(' | ')}`,
    ),
  )

  Bun.write(
    `${generatedDir}/node-component-map.ts`,
    await format(
      `
${allDefs
  .map(({ nodeName }) => {
    return `import { ${nodeName}NodeComponent } from './${kebabCase(nodeName)}'`
  })
  .join('\n')}

export const nodeComponentMap = {
  ${allDefs.map(({ nodeName }) => `${nodeName}: ${nodeName}NodeComponent`).join(',\n')}
}
`,
    ),
  )

  Bun.write(
    `${generatedDir}/node-map.ts`,
    await format(
      `
${allDefs
  .map(
    ({ nodeName }) =>
      `import { ${nodeName}Node } from './${kebabCase(nodeName)}'`,
  )
  .join('\n')}

export const nodeMap = {
  ${allDefs.map(({ nodeName }) => `${nodeName}: ${pascalCase(nodeName)}Node`).join(',\n')}
}
`,
    ),
  )

  Bun.write(
    `${generatedDir}/index.ts`,
    await format(`
export * from './node-name'
export * from './node-map'
export * from './node-component-map'
${allDefs.map(({ nodeName }) => `export * from './${kebabCase(nodeName)}'`).join('\n')}
`),
  )
}

function flattenSlots(slots: Slot[]): Slot[] {
  return [...slots, ...slots.flatMap((slot) => flattenSlots(slot.slots ?? []))]
}

function getDefaultValue(value: any) {
  if (typeof value === 'string') {
    return `'${value}'`
  } else if (typeof value === 'number') {
    return `{${value}}`
  } else if (value === undefined) {
    return `{undefined}`
  } else if (typeof value === 'boolean') {
    return `{${value}}`
  }
}

async function generateNode(nodeDef: NodeDefinition, from: string) {
  const {
    nodeName,
    leaf,
    fragment,
    componentName,
    arbitraryChildren,
    mod,
    props,
    slots,
    unselectable,
  } = nodeDef

  const hasSlots = slots && slots.length > 0
  const hasProps = props && props.length > 0
  const nodeClassName = `${nodeName}Node`
  const propsTypeName = `${nodeClassName}Props`
  const slotKeyTypeName = `${nodeClassName}SlotKey`
  const nodeComponentName = `${nodeClassName}Component`
  const nodeControlsName = `${nodeClassName}Controls`
  const tagName = fragment ? '' : `${componentName ?? mod}`
  const openTag = `${tagName}${fragment ? '' : ' {...props} {...nodeProps}'}`

  const allSlots = flattenSlots(slots ?? [])

  const source = `
${
  leaf
    ? ''
    : `
import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'`
}
import { Node, FragmentNode } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { Card as RadixCard, Flex as RadixFlex } from '@radix-ui/themes'
${hasProps ? `import { SelectControls, SwitchControls, SlotToggleControls, TextFieldControls } from '@/control-center/controls-template'` : ''}
import { NodeComponent } from '@/node-component'
import { Prop } from '@/node-definition'
import { makeNodeProps } from '@/data-attributes'
import { type ReactNode } from 'react'
import { ${mod} } from '${from}'
${(() => {
  if (from === '@radix-ui/themes') {
    if (mod !== 'Card' && mod !== 'Flex') {
      return `import { ${mod} } from '${from}'`
    }
  }
  return ''
})()}

export type ${propsTypeName} = ${generatePropsType(props)}

${
  hasSlots
    ? `export type ${slotKeyTypeName} = ${allSlots.map((slot) => `'${slot.key}'`).join(' | ')}`
    : ''
}

${allSlots
  .map((slot) => {
    const { props } = slot

    if (!props) return ''

    return `
export type ${nodeClassName}Slot${pascalCase(slot.key)}Props = ${generatePropsType(props)}
  `
  })
  .join('')}

export class ${nodeClassName} extends Node${hasSlots ? `<${slotKeyTypeName}>` : ''} {
  readonly nodeName = '${nodeName}'
  readonly componentName = '${componentName ?? mod}'

  public readonly defaultProps: ${propsTypeName} = ${generateDefaultProps(props ?? [], mod)}

  ${
    hasSlots
      ? `
  get isDroppable() {
    return false
  }
  `
      : ''
  }

  ${props ? `propsDefinition: Prop[] = ${JSON.stringify(props)}` : ''}

  readonly $props = map(this.defaultProps)
  readonly slotProps = {
    ${allSlots
      .filter((slot) => slot.props !== undefined)
      .map((slot) => {
        return `$${slot.key}: map<${nodeClassName}Slot${pascalCase(slot.key)}Props>({
          ${
            slot.props
              ? slot.props
                  .map((prop) =>
                    prop.default
                      ? `${prop.key}: ${getDefaultValue(prop.default)}`
                      : '',
                  )
                  .join(',\n')
              : ''
          }
        })`
      })
      .join(',\n')}
  }

  slotsInfoArray = [
    ${allSlots
      .map(
        (slot) =>
          `
    {
      required: ${slot.required ? 'true' : 'false'},
      key: '${slot.key}' as ${slotKeyTypeName},
      label: '${slot.label ?? slot.key}',
      ${slot.componentName ? `componentName: '${slot.componentName}',` : ''}
      ${slot.props ? `props: ${JSON.stringify(slot.props)},` : ''}
    }`,
      )
      .join(',')}
  ]

  ${slots ? `slotsDefinition = ${JSON.stringify(slots)}` : ''}

  ${allSlots
    .map((slot) => {
      const { key, props, slots } = slot

      if (!props) return ''

      return `
  public readonly ${key}DefaultProps: ${nodeClassName}Slot${pascalCase(slot.key)}Props = ${generateDefaultProps(props, mod)}

  readonly $${key}Props = map(this.${key}DefaultProps)
    `
    })
    .join('')}

  constructor() {
    super({
      isUnselectable: ${unselectable ? 'true' : 'false'},
    })

    ${allSlots
      .map((slot) => {
        if (slot.required) {
          return `this.enableSlot('${slot.key}')`
        }
        return ''
      })
      .join('\n')}
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
  const nodeProps = makeNodeProps(node)
  ${leaf || hasSlots ? '' : 'const children = useStore(node.$children)'}
  const props = useStore(node.$props)
  ${slots ? `const slots = useStore(node.$slots)` : ''}
  ${allSlots
    .filter((slot) => slot.props !== undefined)
    .map(
      (slot) =>
        `const ${slot.key}Props = useStore(node.slotProps.$${slot.key})`,
    )
    .join('\n')}

  return ${
    leaf
      ? fragment
        ? `<></>`
        : `<${openTag} />`
      : `<${openTag}>
      ${
        hasSlots
          ? generateSlots(slots)
          : `
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="${mod}" />
      )}`
      }
    </${tagName}>
  `
  }
}
`

  const formatted = await format(source)

  await Bun.write(`${generatedDir}/` + kebabCase(nodeName) + '.tsx', formatted)
}

function generateSlots(slots: Slot[], parentSlotKey = ''): string {
  return slots
    .map((slot) => {
      const { key, componentName, props, slots } = slot

      const inside = slots
        ? generateSlots(slots, key)
        : `<NodeComponent node={slots.${key}} />`

      if (componentName) {
        return `
{slots.${key} && <${componentName}${props ? ` {...${key}Props}` : ''}>${inside}</${componentName}>}`
      }

      return `{slots.${key} && <NodeComponent node={slots.${key}} />}`
    })
    .join('')
}

function generatePropsType(props?: Prop[]): string {
  return props
    ? `
{
${props.map((prop) => {
  const { key, type, required } = prop

  const tsType =
    type instanceof CustomClass
      ? type.type
      : Array.isArray(type)
        ? type.map((t) => `'${t}'`).join(' | ')
        : type

  return `${key}${required ? '' : '?'}: ${tsType}`
})}
}
`
    : '{}'
}

function generateDefaultProps(props: Prop[], nodeName: string): string {
  return props
    ? JSON.stringify(
        props.reduce((acc, prop) => {
          const defaultValue =
            prop.default instanceof CustomClass
              ? prop.default.type
              : prop.default

          if (prop.required && defaultValue === undefined) {
            throw new Error(
              `Required prop ${prop.key} of ${nodeName} has no default value`,
            )
          }

          if (!prop.required) {
            return acc
          }

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
