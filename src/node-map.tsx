import { FC } from 'react'
import { PageNodeComponent, PageNodeControls } from './node-class/page'
import { NodeName } from './node-name'
import { InferNodeByName } from './node-name-node-map'
import { BadgeNodeComponent } from './nodes/badge'
import { ButtonNodeComponent, ButtonNodeControls } from './nodes/button'
import { ContainerNodeComponent } from './nodes/container'
import { FlexNodeComponent, FlexNodeControls } from './nodes/flex'
import { FragmentNodeComponent } from './nodes/fragment'
import { SwitchNodeComponent } from './nodes/switch'
import { TextNodeComponent, TextNodeControls } from './nodes/text'
export const nodeComponentMap: {
  [K in NodeName]: FC<{ node: InferNodeByName<K> }>
} = {
  Badge: BadgeNodeComponent,
  Button: ButtonNodeComponent,
  Container: ContainerNodeComponent,
  Flex: FlexNodeComponent,
  Fragment: FragmentNodeComponent,
  Page: PageNodeComponent,
  Switch: SwitchNodeComponent,
  Text: TextNodeComponent,
  View: () => <></>,
}

export const nodeControlsMap: {
  [K in NodeName]: FC<{ nodes: InferNodeByName<K>[] }>
} = {
  Badge: () => <></>,
  Button: ButtonNodeControls,
  Container: () => <></>,
  Flex: FlexNodeControls,
  Fragment: () => <></>,
  Page: PageNodeControls,
  Switch: () => <></>,
  Text: TextNodeControls,
  View: () => <></>,
}
