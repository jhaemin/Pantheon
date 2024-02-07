import { NodeDefinition } from '@/node-definition'

export const buttonDef: NodeDefinition = {
  nodeName: 'Button',
  importDefinition: {
    named: 'Button',
    from: '@radix-ui/themes',
  },
  propsDefinition: {
    asChild: {
      type: 'boolean',
      required: false,
      default: false,
    },
    size: {
      type: ['1', '2', '3'],
      required: false,
      default: '2',
    },
    variant: {
      type: ['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'],
      required: false,
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
      required: false,
    },
    radius: {
      type: ['none', 'small', 'medium', 'large', 'full'],
      required: false,
    },
  },
}

export const switchDef: NodeDefinition = {
  nodeName: 'Switch',
  importDefinition: {
    named: 'Switch',
    from: '@radix-ui/themes',
  },
  leaf: true,
  propsDefinition: {
    size: {
      type: ['1', '2', '3'],
      required: false,
      default: '2',
    },
    variant: {
      type: ['classic', 'surface', 'soft'],
      required: false,
      default: 'surface',
    },
    highContrast: {
      type: 'boolean',
      required: false,
    },
    radius: {
      type: ['none', 'small', 'medium', 'large', 'full'],
      required: false,
    },
  },
}
