import { NodeDefinition, Prop } from '@/node-definition'

const color = [
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
]
const radius = ['none', 'small', 'medium', 'large', 'full']

const oneToNine = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

const zeroToNine = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const commonMarginProps: Prop[] = [
  {
    key: 'm',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'mx',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'my',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'mt',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'mr',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'mb',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'ml',
    format: { type: 'options', options: zeroToNine },
  },
]

const commonLayoutProps: Prop[] = [
  ...commonMarginProps,
  {
    key: 'p',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'px',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'py',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'pt',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'pr',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'pb',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'pl',
    format: { type: 'options', options: zeroToNine },
  },
  {
    key: 'position',
    format: {
      type: 'options',
      options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    },
  },
  {
    key: 'inset',
    format: { type: 'options', options: ['auto', '0', '50%', '100%'] },
  },
  {
    key: 'top',
    format: { type: 'options', options: ['auto', '0', '50%', '100%'] },
  },
  {
    key: 'right',
    format: { type: 'options', options: ['auto', '0', '50%', '100%'] },
  },
  {
    key: 'bottom',
    format: { type: 'options', options: ['auto', '0', '50%', '100%'] },
  },
  {
    key: 'left',
    format: { type: 'options', options: ['auto', '0', '50%', '100%'] },
  },
  {
    key: 'shrink',
    format: { type: 'options', options: ['0', '1'] },
  },
  {
    key: 'grow',
    format: { type: 'options', options: ['0', '1'] },
  },
]

export const nodeDefinitions = {
  RadixText: {
    nodeName: 'RadixText',
    mod: 'Text',
    gapless: true,
    props: [
      // TODO: `as` cannot be used in combination with `asChild`
      // {
      //   key: 'asChild',
      //   type: 'boolean',
      //   default: false,
      // },
      {
        key: 'as',
        format: { type: 'options', options: ['p', 'label', 'div', 'span'] },
        default: 'span',
      },
      {
        key: 'size',
        format: { type: 'options', options: oneToNine },
      },
      {
        key: 'weight',
        format: {
          type: 'options',
          options: ['light', 'regular', 'medium', 'bold'],
        },
      },
      {
        key: 'align',
        format: { type: 'options', options: ['left', 'center', 'right'] },
      },
      {
        key: 'trim',
        format: {
          type: 'options',
          options: ['normal', 'start', 'end', 'both'],
        },
      },
      {
        key: 'color',
        format: { type: 'options', options: color },
      },
      {
        key: 'highContrast',
        format: { type: 'boolean' },
      },
    ],
  },
  Heading: {
    nodeName: 'Heading',
    gapless: true,
    props: [
      {
        key: 'as',
        format: {
          type: 'options',
          options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        },
        default: 'h1',
      },
      {
        key: 'size',
        format: {
          type: 'options',
          options: oneToNine,
        },
        default: '6',
      },
      {
        key: 'weight',
        format: {
          type: 'options',
          options: ['light', 'regular', 'medium', 'bold'],
        },
        default: 'bold',
      },
      {
        key: 'align',
        format: { type: 'options', options: ['left', 'center', 'right'] },
      },
      {
        key: 'trim',
        format: {
          type: 'options',
          options: ['normal', 'start', 'end', 'both'],
        },
      },
      {
        key: 'color',
        format: { type: 'options', options: color },
      },
      {
        key: 'highContrast',
        format: { type: 'boolean' },
      },
    ],
  },
  Blockquote: {
    nodeName: 'Blockquote',
    gapless: true,
    props: [
      {
        key: 'size',
        format: {
          type: 'options',
          options: oneToNine,
        },
      },
      {
        key: 'weight',
        format: {
          type: 'options',
          options: ['light', 'regular', 'medium', 'bold'],
        },
      },
      {
        key: 'color',
        format: { type: 'options', options: color },
      },
      {
        key: 'highContrast',
        format: { type: 'boolean' },
      },
      {
        key: 'truncate',
        format: { type: 'boolean' },
      },
      {
        key: 'wrap',
        format: {
          type: 'options',
          options: ['wrap', 'nowrap', 'pretty', 'balance'],
        },
      },
    ],
  },
  Code: {
    nodeName: 'Code',
    gapless: true,
    props: [
      {
        key: 'size',
        format: {
          type: 'options',
          options: oneToNine,
        },
      },
      {
        key: 'variant',
        format: {
          type: 'options',
          options: ['solid', 'soft', 'outline', 'ghost'],
        },
        default: 'soft',
      },
      {
        key: 'weight',
        format: {
          type: 'options',
          options: ['light', 'regular', 'medium', 'bold'],
        },
      },
      {
        key: 'color',
        format: { type: 'options', options: color },
      },
      {
        key: 'highContrast',
        format: { type: 'boolean' },
      },
    ],
  },
} satisfies Record<string, NodeDefinition>
