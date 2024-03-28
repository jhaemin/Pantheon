import { keepNodeSelectionAttribute } from '@/data-attributes'
import { EditorState } from '@/editor-state'
import { Library, stringifyLibraryKey } from '@/library'
import { Node } from '@/node-class/node'
import { CubeIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import {
  Flex,
  Heading,
  IconButton,
  ScrollArea,
  Separator,
  Text,
} from '@radix-ui/themes'
import { useEffect, useRef, useState } from 'react'
import { DrawerItemWrapper } from './drawer-item-wrapper'
import styles from './drawer.module.scss'

const studioLibrary: Library = {
  name: 'studio',
  version: '1.0.0',
}

const radixThemesLibrary: Library = {
  name: 'radix-themes',
  version: '3.0.1',
}

function createTextNode(value: string) {
  return new Node({
    library: studioLibrary,
    nodeName: 'Text',
    props: { value },
  })
}

export function Drawer({ library }: { library: Library }) {
  const ref = useRef<HTMLDivElement>(null)
  const [drawerItems, setDrawerItems] = useState<
    {
      createNode: () => Node
      render: () => JSX.Element
    }[]
  >([])

  useEffect(() => {
    const unsubscribe = EditorState.$drawerOpen.listen((drawerOpen) => {
      if (drawerOpen) {
        ref.current?.classList.add(styles.open)
      } else {
        ref.current?.classList.remove(styles.open)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    import(`@/libraries/${stringifyLibraryKey(library)}/drawer-items`).then(
      (mod) => {
        setDrawerItems(mod.drawerItems)
        return
      },
    )
  }, [library])

  return (
    <Flex
      ref={ref}
      direction="column"
      className={styles.drawer}
      {...keepNodeSelectionAttribute}
    >
      <Flex position="sticky" top="0" p="3" align="center" justify="between">
        <Heading size="3" weight="medium">
          <Flex align="center" gap="2">
            <CubeIcon />
            <Text>Drawer</Text>
          </Flex>
        </Heading>
        <IconButton
          variant="ghost"
          onClick={() => {
            EditorState.$drawerOpen.set(false)
          }}
        >
          <DoubleArrowRightIcon />
        </IconButton>
      </Flex>

      <Separator size="4" />

      <ScrollArea style={{ width: 280 }}>
        <Flex direction="column" p="4" gap="5" align="center">
          {drawerItems.map(({ createNode, render }, i) => (
            <DrawerItemWrapper key={i} createNode={createNode}>
              {render()}
            </DrawerItemWrapper>
          ))}
        </Flex>
      </ScrollArea>
    </Flex>
  )
}
