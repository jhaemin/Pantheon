import { PageNode } from '@/node-class/page'
import { TextNode } from '@/node-class/text'
import { StudioApp } from '@/studio-app'
import { expect, test } from 'bun:test'
import { FragmentNode, Node } from './node'

test('Node creation', () => {
  const frag = new FragmentNode()
  expect(frag.children.length).toBe(0)
  expect(frag.parent).toBe(null)
  expect(frag.previousSibling).toBe(null)
  expect(frag.nextSibling).toBe(null)
})

test('Children', () => {
  const frag = new FragmentNode()
  const text = new TextNode()
  frag.append(text)
  expect(frag.children.length).toBe(1)
  expect(frag.children[0]).toBe(text)
  expect(text.parent).toBe(frag)

  const frag2 = new FragmentNode()
  frag.append(frag2)
  expect(frag.children.length).toBe(2)
  expect(frag.allNestedChildren.length).toBe(2)

  const text2 = new TextNode()
  frag2.append(text2)
  expect(frag.allNestedChildren.length).toBe(3)
  expect(frag2.allNestedChildren.length).toBe(1)
})

test('Append children', () => {
  const frag = new FragmentNode()
  const text1 = new TextNode()
  frag.append(text1)
  expect(frag.children.length).toBe(1)

  const text2 = new TextNode()
  frag.append(text2)
  expect(frag.children.length).toBe(2)

  expect(frag.children[0]).toBe(text1)
  expect(frag.children[1]).toBe(text2)

  expect(frag.children[0].previousSibling).toBe(null)
  expect(frag.children[0].nextSibling).toBe(text2)
  expect(frag.children[1].previousSibling).toBe(text1)
  expect(frag.children[1].nextSibling).toBe(null)
})

test('Move', () => {
  const frag = new FragmentNode()
  const frag2 = new FragmentNode()
  const text = new TextNode()

  frag.append(text)
  frag2.append(text)

  expect(frag.children.length).toBe(0)
  expect(frag2.children.length).toBe(1)
  expect(frag2.children[0]).toBe(text)

  const text2 = new TextNode()
  frag2.append(text2)

  frag.append(text, text2)
  expect(frag.children.length).toBe(2)
  expect(frag.children[0]).toBe(text)
  expect(frag.children[1]).toBe(text2)
  expect(frag2.children.length).toBe(0)
})

test('Remove children', () => {
  const frag = new FragmentNode()
  const text1 = new TextNode()
  const text2 = new TextNode()
  frag.append(text1, text2)
  expect(frag.children.length).toBe(2)

  frag.removeChild(text1)
  expect(frag.children.length).toBe(1)
  expect(frag.children[0]).toBe(text2)
  expect(text1.parent).toBe(null)

  frag.removeChild(text2)
  expect(frag.children.length).toBe(0)
  expect(text2.parent).toBe(null)
})

test('Remove', () => {
  const frag = new FragmentNode()
  const text1 = new TextNode()
  const text2 = new TextNode()
  frag.append(text1, text2)
  expect(frag.children.length).toBe(2)

  text1.remove()
  expect(frag.children.length).toBe(1)
  expect(frag.children[0]).toBe(text2)
  expect(text1.parent).toBe(null)

  text2.remove()
  expect(frag.children.length).toBe(0)
  expect(text2.parent).toBe(null)
})

test('Insert before', () => {
  const frag = new FragmentNode()
  const text1 = new TextNode()
  const text2 = new TextNode()
  frag.append(text1)
  frag.insertBefore([text2], text1)
  expect(frag.children.length).toBe(2)
  expect(frag.children[0]).toBe(text2)
  expect(frag.children[1]).toBe(text1)
  expect(text2.nextSibling).toBe(text1)
  expect(text1.previousSibling).toBe(text2)

  const text3 = new TextNode()
  frag.append(text3)
  frag.insertBefore([text3], text3.previousSibling)
  expect(frag.children.length).toBe(3)
  expect(frag.children[0]).toBe(text2)
  expect(frag.children[1]).toBe(text3)
  expect(frag.children[2]).toBe(text1)

  frag.removeChild(text1)

  frag.insertBefore([text3], text3)
  expect(frag.children.length).toBe(2)
  expect(frag.children[0]).toBe(text2)
  expect(frag.children[1]).toBe(text3)
})

test('Page creation, removal', () => {
  const studioApp = new StudioApp()

  expect(studioApp.pages.length).toBe(0)
  expect(studioApp.$pages.get().length).toBe(0)

  const page1 = new PageNode()
  studioApp.addPage(page1)

  expect(studioApp.$pages.get().length).toBe(1)
  expect(studioApp.pages[0]).toBe(page1)

  const page2 = new PageNode()
  studioApp.addPage(page2)

  expect(studioApp.$pages.get().length).toBe(2)
  expect(studioApp.pages[1]).toBe(page2)

  studioApp.removePage(page1)
  expect(studioApp.$pages.get().length).toBe(1)
  expect(studioApp.pages[0]).toBe(page2)

  expect(page1.parent).toBe(null)

  studioApp.removePage(page2)
  expect(studioApp.$pages.get().length).toBe(0)
})

test('Owner page', () => {
  const frag = new FragmentNode()
  const text = new TextNode()
  frag.append(text)

  expect(frag.ownerPage).toBe(null)
  expect(text.ownerPage).toBe(null)

  const page = new PageNode()
  page.append(frag)

  expect(frag.ownerPage).toBe(page)
  expect(page.ownerPage).toBe(page)

  frag.remove()
  expect(frag.ownerPage).toBe(null)
})

test('Siblings', () => {
  const frag = new FragmentNode()
  const text1 = new TextNode()
  const text2 = new TextNode()

  frag.append(text1, text2)

  expect(text1.previousSibling).toBe(null)
  expect(text1.nextSibling).toBe(text2)
  expect(text2.previousSibling).toBe(text1)
  expect(text2.nextSibling).toBe(null)
})

test('Tree', () => {
  const page = new PageNode()
  const frag = new FragmentNode()

  page.append(frag)

  const text = new TextNode()

  frag.append(text)

  expect(page.ownerPage).toBe(page)
  expect(frag.ownerPage).toBe(page)
  expect(text.ownerPage).toBe(page)

  frag.remove()

  expect(frag.ownerPage).toBe(null)
  expect(text.ownerPage).toBe(null)
  expect(text.parent).toBe(frag)
})

class TestNode extends Node {
  readonly nodeName = 'Fragment'

  slotsInfo = {
    content: {
      required: false,
      key: 'content',
      label: 'Content',
    },
  }
}

test('Slot', () => {
  const frag = new TestNode()

  const content = new FragmentNode({ slotKey: 'content', slotLabel: 'Content' })
  frag.setSlot('content', content)

  expect(frag.slots.content).toBe(content)
  expect(frag.slots.content?.parent).toBe(frag)

  frag.disableSlot(content)
  expect(frag.slots.content).toBe(null)

  frag.setSlot('content', content)
  content.remove()
  expect(frag.slots.content).toBe(null)

  frag.setSlot('content', content)
  frag.removeChild(content)
  expect(frag.slots.content).toBe(null)

  frag.setSlot('content', content)
  expect(frag.childrenWithSlots.length).toBe(1)

  frag.removeAllChildren()
  expect(frag.slots.content).toBe(content)
})
