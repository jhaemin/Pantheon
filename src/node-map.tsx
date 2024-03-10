import { type FC } from 'react'
import { type InferNodeByName } from './infer-node-by-name'
import { FragmentNodeComponent } from './node-class/fragment'
import { PageNodeComponent } from './node-class/page'
import { TextNodeComponent } from './node-class/text'
import { type NodeName } from './node-name'

export const nativeNodeComponentMap: {
  [K in NodeName]?: FC<{ node: InferNodeByName<K> }>
} = {
  Fragment: FragmentNodeComponent,
  Page: PageNodeComponent,
  Text: TextNodeComponent,
  View: () => <></>,
}

/**
 * Its properties are being changed dynamically based on the chosen library.
 */
export const nodeComponentMap: {
  [K in NodeName]?: FC<{ node: InferNodeByName<K> }>
} = {
  ...nativeNodeComponentMap,
}
