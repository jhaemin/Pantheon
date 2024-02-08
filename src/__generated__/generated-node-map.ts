import { ButtonNodeComponent, ButtonNodeControls } from './button'
import { ContainerNodeComponent, ContainerNodeControls } from './container'
import { FlexNodeComponent, FlexNodeControls } from './flex'
import { SwitchNodeComponent, SwitchNodeControls } from './switch'

export const generatedNodeComponentMap = {
  Button: ButtonNodeComponent,
  Container: ContainerNodeComponent,
  Flex: FlexNodeComponent,
  Switch: SwitchNodeComponent,
}

export const generatedNodeControlsMap = {
  Button: ButtonNodeControls,
  Container: ContainerNodeControls,
  Flex: FlexNodeControls,
  Switch: SwitchNodeControls,
}
