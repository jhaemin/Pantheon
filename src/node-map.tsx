import {
  generatedNodeComponentMap,
  generatedNodeControlsMap,
} from '@/__generated__/generated-node-map'
import { FC } from 'react'
import { FragmentNodeComponent } from './node-class/fragment'
import { PageNodeComponent, PageNodeControls } from './node-class/page'
import { TextNodeComponent, TextNodeControls } from './node-class/text'
import { NodeName } from './node-name'
import { InferNodeByName } from './node-name-node-map'

export const nodeComponentMap: {
  [K in NodeName]: FC<{ node: InferNodeByName<K> }>
} = {
  ...generatedNodeComponentMap,
  Fragment: FragmentNodeComponent,
  Page: PageNodeComponent,
  Text: TextNodeComponent,
  View: () => <></>,
}

export const nodeControlsMap: {
  [K in NodeName]: FC<{ nodes: InferNodeByName<K>[] }>
} = {
  ...generatedNodeControlsMap,
  Fragment: () => <></>,
  Page: PageNodeControls,
  Text: TextNodeControls,
  View: () => <></>,
}
