import { NodeDefinition } from '@/node-definition'

const importFrom = '@radix-ui/themes'

export const buttonDef: NodeDefinition = {
  nodeName: 'RadixButton',
  importDefinition: {
    named: 'Button',
    from: importFrom,
  },
  propsDefinition: [
    {
      key: 'asChild',
      type: 'boolean',
      default: false,
    },
    {
      key: 'size',
      type: ['1', '2', '3'],
      default: '2',
    },
    {
      key: 'variant',
      type: ['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'],
      default: 'solid',
    },
    {
      key: 'color',
      type: [
        'tomato',
        'red',
        'ruby',
        'crimson',
        'pink',
        'plum',
        'purple',
        'violet',
        'iris',
        'indigo',
        'blue',
        'cyan',
        'teal',
        'jade',
        'green',
        'grass',
        'brown',
        'orange',
        'sky',
        'mint',
        'lime',
        'yellow',
        'amber',
        'gold',
        'bronze',
        'gray',
      ],
    },
    {
      key: 'radius',
      type: ['none', 'small', 'medium', 'large', 'full'],
    },
  ],
}

export const switchDef: NodeDefinition = {
  nodeName: 'RadixSwitch',
  importDefinition: {
    named: 'Switch',
    from: importFrom,
  },
  leaf: true,
  propsDefinition: [
    {
      key: 'size',
      type: ['1', '2', '3'],
      default: '2',
    },
    {
      key: 'variant',
      type: ['classic', 'surface', 'soft'],
      default: 'surface',
    },
    {
      key: 'highContrast',
      type: 'boolean',
    },
    {
      key: 'radius',
      type: ['none', 'small', 'medium', 'large', 'full'],
    },
  ],
}

export const flexDef: NodeDefinition = {
  nodeName: 'RadixFlex',
  importDefinition: {
    named: 'Flex',
    from: importFrom,
  },
  propsDefinition: [
    {
      key: 'asChild',
      type: 'boolean',
      default: false,
    },
    {
      key: 'display',
      type: ['none', 'inline-flex', 'flex'],
      default: 'flex',
    },
    {
      key: 'direction',
      type: ['row', 'row-reverse', 'column', 'column-reverse'],
    },
    {
      key: 'align',
      type: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    {
      key: 'justify',
      type: ['start', 'center', 'end', 'between'],
      default: 'start',
    },
    {
      key: 'wrap',
      type: ['wrap', 'nowrap', 'wrap-reverse'],
    },
    {
      key: 'gap',
      type: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    },
  ],
}

export const containerDef: NodeDefinition = {
  nodeName: 'RadixContainer',
  importDefinition: {
    named: 'Container',
    from: importFrom,
  },
  propsDefinition: [
    {
      key: 'size',
      type: ['1', '2', '3', '4'],
      default: '4',
    },
    {
      key: 'display',
      type: ['none', 'block'],
    },
  ],
}

export const blockquoteDef: NodeDefinition = {
  nodeName: 'RadixBlockquote',
  importDefinition: {
    named: 'Blockquote',
    from: importFrom,
  },
  propsDefinition: [
    {
      key: 'size',
      type: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    },
    {
      key: 'weight',
      type: ['light', 'regular', 'medium', 'bold'],
    },
    {
      key: 'color',
      type: [
        'tomato',
        'red',
        'ruby',
        'crimson',
        'pink',
        'plum',
        'purple',
        'violet',
        'iris',
        'indigo',
        'blue',
        'cyan',
        'teal',
        'jade',
        'green',
        'grass',
        'brown',
        'orange',
        'sky',
        'mint',
        'lime',
        'yellow',
        'amber',
        'gold',
        'bronze',
        'gray',
      ],
    },
    {
      key: 'highContrast',
      type: 'boolean',
    },
  ],
}
