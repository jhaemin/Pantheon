import {
  generatedNodeComponentMap,
  generatedNodeControlsMap,
} from '@/__generated__/generated-node-map'
import { type FC } from 'react'
import { type InferNodeByName } from './infer-node-by-name'
import {
  FragmentNodeComponent,
  FragmentNodeControls,
} from './node-class/fragment'
import { PageNodeComponent, PageNodeControls } from './node-class/page'
import { TextNodeComponent, TextNodeControls } from './node-class/text'
import { type NodeName } from './node-name'

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
  Fragment: FragmentNodeControls,
  Page: PageNodeControls,
  Text: TextNodeControls,
  View: () => <></>,
}
