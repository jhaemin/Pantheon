import { ButtonNode } from '@/nodes/button'
import { Button } from '@radix-ui/themes'
import { DrawerItemWrapper } from '../drawer-item-wrapper'

export function ButtonDrawerItem() {
  return (
    <DrawerItemWrapper createNode={() => new ButtonNode()}>
      <Button>Button</Button>
    </DrawerItemWrapper>
  )
}
