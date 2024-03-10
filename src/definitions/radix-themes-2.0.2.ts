import { LibraryDefinition } from '@/library-definition'
import { Custom, Prop } from '@/node-definition'

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

const zeroToNine = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const commonMarginProps: Prop[] = [
  {
    key: 'm',
    type: zeroToNine,
  },
  {
    key: 'mx',
    type: zeroToNine,
  },
  {
    key: 'my',
    type: zeroToNine,
  },
  {
    key: 'mt',
    type: zeroToNine,
  },
  {
    key: 'mr',
    type: zeroToNine,
  },
  {
    key: 'mb',
    type: zeroToNine,
  },
  {
    key: 'ml',
    type: zeroToNine,
  },
]

const commonLayoutProps: Prop[] = [
  ...commonMarginProps,
  {
    key: 'p',
    type: zeroToNine,
  },
  {
    key: 'px',
    type: zeroToNine,
  },
  {
    key: 'py',
    type: zeroToNine,
  },
  {
    key: 'pt',
    type: zeroToNine,
  },
  {
    key: 'pr',
    type: zeroToNine,
  },
  {
    key: 'pb',
    type: zeroToNine,
  },
  {
    key: 'pl',
    type: zeroToNine,
  },
  {
    key: 'position',
    type: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
  },
  {
    key: 'inset',
    type: ['auto', '0', '50%', '100%'],
  },
  {
    key: 'top',
    type: ['auto', '0', '50%', '100%'],
  },
  {
    key: 'right',
    type: ['auto', '0', '50%', '100%'],
  },
  {
    key: 'bottom',
    type: ['auto', '0', '50%', '100%'],
  },
  {
    key: 'left',
    type: ['auto', '0', '50%', '100%'],
  },
  {
    key: 'shrink',
    type: ['0', '1'],
  },
  {
    key: 'grow',
    type: ['0', '1'],
  },
]

export const libraryDefinition: LibraryDefinition = {
  from: '@radix-ui/themes-2.0.2',
  nodeDefinitions: [
    {
      nodeName: 'RadixText',
      mod: 'Text',
      props: [
        // TODO: `as` cannot be used in combination with `asChild`
        // {
        //   key: 'asChild',
        //   type: 'boolean',
        //   default: false,
        // },
        {
          key: 'as',
          type: ['p', 'label', 'div', 'span'],
          default: 'span',
        },
        {
          key: 'size',
          type: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        },
        {
          key: 'weight',
          type: ['light', 'regular', 'medium', 'bold'],
        },
        {
          key: 'align',
          type: ['left', 'center', 'right'],
        },
        {
          key: 'trim',
          type: ['normal', 'start', 'end', 'both'],
        },
        {
          key: 'color',
          type: color,
        },
        {
          key: 'highContrast',
          type: 'boolean',
        },
      ],
    },
    {
      nodeName: 'RadixHeading',
      mod: 'Heading',
      props: [
        {
          key: 'as',
          type: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          default: 'h1',
        },
        {
          key: 'size',
          type: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
          default: '6',
        },
        {
          key: 'weight',
          type: ['light', 'regular', 'medium', 'bold'],
          default: 'bold',
        },
        {
          key: 'align',
          type: ['left', 'center', 'right'],
        },
        {
          key: 'trim',
          type: ['normal', 'start', 'end', 'both'],
        },
        {
          key: 'color',
          type: color,
        },
        {
          key: 'highContrast',
          type: 'boolean',
        },
      ],
    },
    {
      nodeName: 'RadixCode',
      mod: 'Code',
      props: [
        {
          key: 'size',
          type: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        },
        {
          key: 'variant',
          type: ['solid', 'soft', 'outline', 'ghost'],
          default: 'soft',
        },
        {
          key: 'weight',
          type: ['light', 'regular', 'medium', 'bold'],
        },
        {
          key: 'color',
          type: color,
        },
        {
          key: 'highContrast',
          type: 'boolean',
        },
      ],
    },
    {
      nodeName: 'RadixLink',
      mod: 'Link',
      props: [
        {
          key: 'href',
          label: 'URL',
          type: 'string',
        },
        {
          key: 'size',
          type: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        },
        {
          key: 'weight',
          type: ['light', 'regular', 'medium', 'bold'],
        },
        {
          key: 'trim',
          type: ['normal', 'start', 'end', 'both'],
        },
        {
          key: 'underline',
          type: ['auto', 'hover', 'always'],
        },
        {
          key: 'color',
          type: color,
        },
        {
          key: 'highContrast',
          type: 'boolean',
        },
      ],
    },
    {
      nodeName: 'RadixButton',
      mod: 'Button',
      props: [
        // {
        //   key: 'asChild',
        //   type: 'boolean',
        //   default: false,
        // },
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
          type: color,
        },
        {
          key: 'radius',
          type: radius,
        },
      ],
    },
    {
      nodeName: 'RadixBadge',
      mod: 'Badge',
      props: [
        {
          key: 'size',
          type: ['1', '2'],
          default: '1',
        },
        {
          key: 'variant',
          type: ['solid', 'soft', 'surface', 'outline'],
          default: 'soft',
        },
        {
          key: 'color',
          type: color,
        },
        {
          key: 'highContrast',
          type: 'boolean',
        },
        {
          key: 'radius',
          type: radius,
        },
      ],
    },
    {
      nodeName: 'RadixSwitch',
      mod: 'Switch',
      leaf: true,
      props: [
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
          type: radius,
        },
      ],
    },
    {
      nodeName: 'RadixBox',
      mod: 'Box',
      props: [
        {
          key: 'display',
          type: ['none', 'inline', 'inline-block', 'block'],
        },
        ...commonLayoutProps,
      ],
    },
    {
      nodeName: 'RadixFlex',
      mod: 'Flex',
      props: [
        // {
        //   key: 'asChild',
        //   type: 'boolean',
        //   default: false,
        // },
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
        ...commonLayoutProps,
      ],
    },
    {
      nodeName: 'RadixGrid',
      mod: 'Grid',
      props: [
        {
          key: 'display',
          type: ['none', 'inline-grid', 'grid'],
          default: 'grid',
        },
        {
          key: 'columns',
          type: 'string',
        },
        {
          key: 'rows',
          type: 'string',
        },
        {
          key: 'flow',
          type: ['row', 'column', 'dense', 'row-dense', 'column-dense'],
        },
        {
          key: 'align',
          type: ['start', 'center', 'end', 'stretch', 'baseline'],
        },
        {
          key: 'justify',
          type: ['start', 'center', 'end', 'between'],
        },
        {
          key: 'gap',
          type: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        },
        {
          key: 'gapX',
          type: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        },
        {
          key: 'gapY',
          type: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        },
        ...commonLayoutProps,
      ],
    },
    {
      nodeName: 'RadixContainer',
      mod: 'Container',
      props: [
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
    },
    {
      nodeName: 'RadixBlockquote',
      mod: 'Blockquote',
      props: [
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
          type: color,
        },
        {
          key: 'highContrast',
          type: 'boolean',
        },
      ],
    },
    {
      nodeName: 'RadixDialog',
      mod: 'Dialog',
      componentName: 'Dialog.Root',
      unselectable: true,
      portal: true,
      props: [
        {
          key: 'open',
          type: 'boolean',
        },
      ],
      slots: [
        {
          key: 'content',
          required: true,
          componentName: 'Dialog.Content',
          props: [{ key: 'size', type: ['1', '2', '3', '4'], default: '3' }],
          slots: [
            {
              key: 'title',
              componentName: 'Dialog.Title',
            },
            {
              key: 'description',
              componentName: 'Dialog.Description',
            },
            {
              key: 'contentBody',
              required: true,
            },
          ],
        },
      ],
    },
    {
      nodeName: 'RadixCallout',
      mod: 'Callout',
      componentName: 'Callout.Root',
      props: [
        {
          key: 'size',
          type: ['1', '2', '3'],
          default: '2',
        },
        {
          key: 'variant',
          type: ['soft', 'surface', 'outline'],
          default: 'soft',
        },
        {
          key: 'color',
          type: color,
        },
        {
          key: 'highContrast',
          type: 'boolean',
        },
      ],
      slots: [
        {
          key: 'icon',
          componentName: 'Callout.Icon',
        },
        {
          key: 'text',
          componentName: 'Callout.Text',
          required: true,
        },
      ],
    },
    {
      nodeName: 'RadixAvatar',
      mod: 'Avatar',
      leaf: true,
      props: [
        {
          key: 'src',
          type: 'string',
        },
        {
          key: 'size',
          type: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
          default: '3',
        },
        {
          key: 'variant',
          type: ['solid', 'soft'],
          default: 'soft',
        },
        {
          key: 'color',
          type: color,
        },
        {
          key: 'highContrast',
          type: 'boolean',
        },
        {
          key: 'radius',
          type: radius,
        },
        {
          key: 'fallback',
          type: Custom('NonNullable<ReactNode>'),
          required: true,
          default: 'A',
        },
      ],
    },
    {
      nodeName: 'RadixCard',
      mod: 'Card',
      props: [
        {
          key: 'size',
          type: ['1', '2', '3', '4', '5'],
          default: '1',
        },
        {
          key: 'variant',
          type: ['surface', 'classic', 'ghost'],
          default: 'surface',
        },
      ],
    },
    {
      nodeName: 'RadixCheckbox',
      mod: 'Checkbox',
      leaf: true,
      props: [
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
          key: 'color',
          type: color,
        },
        {
          key: 'highContrast',
          type: 'boolean',
        },
      ],
    },
    {
      nodeName: 'RadixTextField',
      mod: 'TextField',
      componentName: 'TextField.Input',
      leaf: true,
      props: [
        {
          key: 'placeholder',
          type: 'string',
        },
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
          key: 'color',
          type: color,
        },
        {
          key: 'radius',
          type: radius,
        },
      ],
    },
    {
      nodeName: 'RadixTable',
      mod: 'Table',
      componentName: 'Table.Root',
      props: [
        {
          key: 'size',
          type: ['1', '2', '3'],
          default: '2',
        },
        {
          key: 'variant',
          type: ['surface', 'ghost'],
          default: 'ghost',
        },
      ],
    },
    {
      nodeName: 'RadixTableHeader',
      mod: 'Table',
      componentName: 'Table.Header',
    },
    {
      nodeName: 'RadixTableBody',
      mod: 'Table',
      componentName: 'Table.Body',
    },
    {
      nodeName: 'RadixTableRow',
      mod: 'Table',
      componentName: 'Table.Row',
    },
    {
      nodeName: 'RadixTableCell',
      mod: 'Table',
      componentName: 'Table.Cell',
    },
    {
      nodeName: 'RadixTableColumnHeaderCell',
      mod: 'Table',
      componentName: 'Table.ColumnHeaderCell',
    },
    {
      nodeName: 'RadixTableRowHeaderCell',
      mod: 'Table',
      componentName: 'Table.RowHeaderCell',
    },
  ],
}
