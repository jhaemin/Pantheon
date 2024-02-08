import { NodeDefinition } from '@/node-definition'

const importFrom = '@radix-ui/themes'

export const buttonDef: NodeDefinition = {
  nodeName: 'Button',
  importDefinition: {
    named: 'Button',
    from: importFrom,
  },
  propsDefinition: {
    asChild: {
      type: 'boolean',
      default: false,
    },
    size: {
      type: ['1', '2', '3'],
      default: '2',
    },
    variant: {
      type: ['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'],
      default: 'solid',
    },
    color: {
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
    radius: {
      type: ['none', 'small', 'medium', 'large', 'full'],
    },
  },
}

export const switchDef: NodeDefinition = {
  nodeName: 'Switch',
  importDefinition: {
    named: 'Switch',
    from: importFrom,
  },
  leaf: true,
  propsDefinition: {
    size: {
      type: ['1', '2', '3'],
      default: '2',
    },
    variant: {
      type: ['classic', 'surface', 'soft'],
      default: 'surface',
    },
    highContrast: {
      type: 'boolean',
    },
    radius: {
      type: ['none', 'small', 'medium', 'large', 'full'],
    },
  },
}

export const flexDef: NodeDefinition = {
  nodeName: 'Flex',
  importDefinition: {
    named: 'Flex',
    from: importFrom,
  },
  propsDefinition: {
    asChild: {
      type: 'boolean',
      default: false,
    },
    display: {
      type: ['none', 'inline-flex', 'flex'],
      default: 'flex',
    },
    direction: {
      type: ['row', 'row-reverse', 'column', 'column-reverse'],
    },
    align: {
      type: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      type: ['start', 'center', 'end', 'between'],
      default: 'start',
    },
    wrap: {
      type: ['wrap', 'nowrap', 'wrap-reverse'],
    },
    gap: {
      type: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    },
  },
}

export const containerDef: NodeDefinition = {
  nodeName: 'Container',
  importDefinition: {
    named: 'Container',
    from: importFrom,
  },
  propsDefinition: {
    size: {
      type: ['1', '2', '3', '4'],
      default: '4',
    },
    display: {
      type: ['none', 'block'],
    },
  },
}
