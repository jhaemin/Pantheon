// import { Node } from '@/node-class/node'
// import { MapStore, computed, map } from 'nanostores'

// export type Slot<K extends string = string> = Record<K, Node | undefined>

// /**
//  * Extracted from nanostores type definitions.
//  */
// type AllKeys<T> = T extends any ? keyof T : never

// /**
//  * @deprecated Node implements slots feature.
//  */
// export abstract class SlotMachineNode<K extends string = string> extends Node {
//   /**
//    * Slots are FragmentNodes mostly.
//    * They are toggled by `setSlot` and `removeSlot` methods.
//    * They cannot be removed by `removeChild` or `remove` method.
//    */
//   private _$slots: MapStore<Slot<K>> = map({})
//   public readonly $slots = computed(this._$slots, (slots) => slots)

//   /**
//    * Children + slot nodes
//    */
//   get children(): Node[] {
//     const slots = this.$slots.get()
//     const slotNodes = Object.values(slots).filter(
//       (node) => node !== null,
//     ) as Node[]

//     return [...this.$children.get(), ...slotNodes]
//   }

//   set children(children: Node[]) {
//     this._$children.set(children)
//   }

//   setSlot(slotName: AllKeys<Slot<K>>, node: Node) {
//     type A = K

//     Node.assignParent(node, this)
//     this._$slots.setKey(slotName, node)
//   }

//   removeSlot(slotName: AllKeys<Slot<K>>) {
//     const slots = this.$slots.get()
//     const node = slots[slotName]
//     if (node) {
//       Node.releaseParent(node)
//     }
//     this._$slots.setKey(slotName, undefined)
//   }
// }
