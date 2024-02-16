import { kebabCase, pascalCase } from 'change-case'
import fs from 'node:fs/promises'
import { format } from './format'
import { CustomClass, NodeDefinition, Prop, Slot } from './node-definition'

async function main() {
  await fs.rm('src/__generated__', { recursive: true, force: true })

  const definitions = await import('./definitions/node-definitions')

  const allDefs = Object.values(definitions)

  await Promise.all(
    Object.entries(definitions).map(async ([key, def]) => {
      return generateNode(def)
    }),
  )

  const nodeNames = allDefs.map((def) => def.nodeName)

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
${allDefs
  .map(
    (def) =>
      `import { ${def.nodeName}NodeComponent, ${def.nodeName}NodeControls } from './${kebabCase(def.nodeName)}'`,
  )
  .join('\n')}

export const generatedNodeComponentMap = {
  ${allDefs
    .map((def) => `${def.nodeName}: ${def.nodeName}NodeComponent`)
    .join(',\n')}
}

export const generatedNodeControlsMap = {
  ${allDefs
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
${allDefs
  .map(
    (def) =>
      `import { ${def.nodeName}Node } from './${kebabCase(def.nodeName)}'`,
  )
  .join('\n')}

export const generatedNodeNameNodeMap = {
  ${allDefs.map((def) => `${def.nodeName}: ${def.nodeName}Node`).join(',\n')}
}
`,
    ),
  )
}

main()

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

async function generateNode(nodeDef: NodeDefinition) {
  const {
    lib,
    leaf,
    fragment,
    componentName,
    arbitraryChildren,
    nodeName,
    props,
    slots,
    unselectable,
  } = nodeDef

  const hasSlots = slots && slots.length > 0
  const hasProps = props && props.length > 0
  const propsTypeName = `${nodeName}NodeProps`
  const nodeClassName = `${nodeName}Node`
  const nodeComponentName = `${nodeName}NodeComponent`
  const nodeControlsName = `${nodeName}NodeControls`
  const tagName = fragment ? '' : `${componentName ?? lib.mod}`
  const openTag = `${tagName}${fragment ? '' : ' {...props}'}`

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
import { Card, Flex } from '@radix-ui/themes'
${hasProps ? `import { SelectControls, SwitchControls, SlotToggleControls, TextFieldControls } from '@/control-center/controls-template'` : ''}
import { NodeComponent } from '@/node-component'
import { type ReactNode } from 'react'
${(() => {
  if (lib.from === '@radix-ui/themes') {
    if (lib.mod !== 'Card' && lib.mod !== 'Flex') {
      return `import { ${lib.mod} } from '${lib.from}'`
    }
  }
  return ''
})()}

export type ${propsTypeName} = ${generatePropsType(props)}

${allSlots
  .map((slot) => {
    const { props } = slot

    if (!props) return ''

    return `
export type ${nodeName}Slot${pascalCase(slot.key)}Props = ${generatePropsType(props)}
  `
  })
  .join('')}

export class ${nodeClassName} extends Node {
  readonly nodeName = '${nodeName}'
  readonly componentName = '${componentName ?? lib.mod}'

  public readonly defaultProps: ${propsTypeName} = ${generateDefaultProps(props ?? [], nodeName)}

  ${
    hasSlots
      ? `
  get isDroppable() {
    return false
  }
  `
      : ''
  }

  readonly $props = map(this.defaultProps)

  slotsInfo = {
    ${allSlots
      .map(
        (slot) =>
          `
    ${slot.key}: {
      required: ${slot.required ? 'true' : 'false'},
      key: '${slot.key}',
      label: '${slot.label ?? slot.key}',
    }`,
      )
      .join(',\n')}
  }

  slotsInfoArray = [
    ${allSlots
      .map(
        (slot) =>
          `
    {
      required: ${slot.required ? 'true' : 'false'},
      key: '${slot.key}',
      label: '${slot.label ?? slot.key}',
    }`,
      )
      .join(',\n')}
  ]

  readonly $slots = atom<{ ${allSlots.map((slot) => `${slot.key}: ${slot.required ? 'FragmentNode' : 'FragmentNode | null'}`).join(';')} }>({
    ${allSlots.map((slot) => `${slot.key}: ${slot.required ? 'new FragmentNode()' : 'null'}`).join(',\n')}
  })

  ${allSlots
    .map((slot) => {
      const { key, props, slots } = slot

      if (!props) return ''

      return `
  public readonly ${key}DefaultProps: ${nodeName}Slot${pascalCase(slot.key)}Props = ${generateDefaultProps(props, nodeName)}

  readonly $${key}Props = map(this.${key}DefaultProps)
    `
    })
    .join('')}

  constructor() {
    super({
      isUnselectable: ${unselectable ? 'true' : 'false'},
    })

    // Enable required slot inside constructor instead of property initializer
    // because enableSlot() sets parent of the slot
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
  ${leaf || hasSlots ? '' : 'const children = useStore(node.$children)'}
  const props = useStore(node.$props)
  ${slots ? `const slots = useStore(node.$slots)` : ''}
  ${allSlots
    .map((slot) => {
      if (slot.props) {
        return `const ${slot.key}Props = useStore(node.$${slot.key}Props)`
      }
      return ''
    })
    .join('')}

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
        <EmptyPlaceholder name="${nodeName}" />
      )}`
      }
    </${tagName}>
  `
  }
}

export function ${nodeControlsName}({ nodes }: { nodes: ${nodeClassName}[] }) {
  return <>
  ${
    hasSlots
      ? `
      <Card size="1">
        <Flex direction="column" gap="3">
        ${allSlots
          .filter((slot) => !slot.required)
          .map((slot) => {
            return `
          <SlotToggleControls
            slotKey="${slot.key}"
            nodes={nodes}
          />`
          })
          .join('')}
        </Flex>
      </Card>
      `
      : ''
  }
  ${
    hasProps
      ? props
          .map((prop) => {
            const { key, type } = prop
            const label = prop.label ?? key

            if (Array.isArray(prop.type)) {
              return `
                <SelectControls
                  controlsLabel="${label}"
                  nodes={nodes}
                  propsAtomKey="$props"
                  propertyKey="${key}"
                  defaultValue=${getDefaultValue(prop.default)}
                  options={[
                    ${!prop.required ? `{ label: 'default', value: undefined },` : ''}
                    ${
                      Array.isArray(type)
                        ? type
                            .map((t) => {
                              const value = typeof t === 'string' ? t : t.value
                              const label = typeof t === 'string' ? t : t.label

                              return `{ label: '${label}', value: '${value}' }`
                            })
                            .join(',\n')
                        : ''
                    }
                  ]}
                />`
            } else if (type === 'boolean') {
              return `
                <SwitchControls
                  controlsLabel="${label}"
                  nodes={nodes}
                  propsAtomKey="$props"
                  propertyKey="${key}"
                  defaultValue=${getDefaultValue(prop.default)}
                />`
            } else if (type === 'string') {
              return `
                <TextFieldControls
                  controlsLabel="${label}"
                  nodes={nodes}
                  propsAtomKey="$props"
                  propertyKey="${key}"
                  defaultValue=${getDefaultValue(prop.default)}
                />`
            }
          })
          .join('')
      : ''
  }
  ${allSlots
    .map((slot) => {
      const { key: slotKey, props } = slot

      if (!props) return

      return props
        .map((prop) => {
          const { key, type } = prop
          const label = prop.label ?? key

          if (Array.isArray(prop.type)) {
            return `
            <SelectControls
              controlsLabel="${label}"
              nodes={nodes}
              propsAtomKey="$${slotKey}Props"
              propertyKey="${key}"
              defaultValue=${getDefaultValue(prop.default)}
              options={[
                ${!prop.required ? `{ label: 'default', value: undefined },` : ''}
                ${
                  Array.isArray(type)
                    ? type
                        .map((t) => {
                          const value = typeof t === 'string' ? t : t.value
                          const label = typeof t === 'string' ? t : t.label

                          return `{ label: '${label}', value: '${value}' }`
                        })
                        .join(',\n')
                    : ''
                }
              ]}
            />`
          } else if (type === 'boolean') {
            return `
            <SwitchControls
              controlsLabel="${label}"
              nodes={nodes}
              propsAtomKey="$${slotKey}Props"
              propertyKey="${key}"
              defaultValue=${getDefaultValue(prop.default)}
            />`
          } else if (type === 'string') {
            return `
            <TextFieldControls
              controlsLabel="${label}"
              nodes={nodes}
              propsAtomKey="$${slotKey}Props"
              propertyKey="${key}"
              defaultValue=${getDefaultValue(prop.default)}
            />`
          }
        })
        .join('')
    })
    .join('')}
  </>
}
`

  const formatted = await format(source)

  await Bun.write(
    'src/__generated__/' + kebabCase(nodeName) + '.tsx',
    formatted,
  )
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
