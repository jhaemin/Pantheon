import { Library } from '@/library'
import { PageNode } from '@/node-class/page'
import { studioApp } from '@/studio-app'
import { expect, test } from 'bun:test'
import { Node } from './node'

const library: Library = {
  name: 'studio',
  version: '1.0.0',
}

test('Node creation', () => {
  const frag = new Node({ library, nodeName: '' })
  expect(frag.children.length).toBe(0)
  expect(frag.parent).toBe(null)
  expect(frag.previousSibling).toBe(null)
  expect(frag.nextSibling).toBe(null)
})

test('Children', () => {
  const frag = new Node({ library, nodeName: '' })
  const text = new Node({ library, nodeName: 'Text' })
  frag.append(text)
  expect(frag.children.length).toBe(1)
  expect(frag.children[0]).toBe(text)
  expect(text.parent).toBe(frag)

  const frag2 = new Node({ library, nodeName: '' })
  frag.append(frag2)
  expect(frag.children.length).toBe(2)
  expect(frag.allNestedChildren.length).toBe(2)

  const text2 = new Node({ library, nodeName: 'Text' })
  frag2.append(text2)
  expect(frag.allNestedChildren.length).toBe(3)
  expect(frag2.allNestedChildren.length).toBe(1)
})

test('Append children', () => {
  const frag = new Node({ library, nodeName: '' })
  const text1 = new Node({ library, nodeName: 'Text' })
  frag.append(text1)
  expect(frag.children.length).toBe(1)

  const text2 = new Node({ library, nodeName: 'Text' })
  frag.append(text2)
  expect(frag.children.length).toBe(2)

  expect(frag.children[0]).toBe(text1)
  expect(frag.children[1]).toBe(text2)

  expect(frag.children[0].previousSibling).toBe(null)
  expect(frag.children[0].nextSibling).toBe(text2)
  expect(frag.children[1].previousSibling).toBe(text1)
  expect(frag.children[1].nextSibling).toBe(null)
})

test('All nodes', () => {
  const page = new PageNode({ library, nodeName: 'Page' })
  studioApp.addPage(page)
  expect(studioApp.allNodes[page.id]).toBe(page)
  const text = new Node({ library, nodeName: 'Text' })
  page.append(text)
  expect(studioApp.allNodes[text.id]).toBe(text)

  studioApp.removePage(page)
})

test('Move', () => {
  const frag = new Node({ library, nodeName: '' })
  const frag2 = new Node({ library, nodeName: '' })
  const text = new Node({ library, nodeName: 'Text' })

  frag.append(text)
  frag2.append(text)

  expect(frag.children.length).toBe(0)
  expect(frag2.children.length).toBe(1)
  expect(frag2.children[0]).toBe(text)

  const text2 = new Node({ library, nodeName: 'Text' })
  frag2.append(text2)

  frag.append(text, text2)
  expect(frag.children.length).toBe(2)
  expect(frag.children[0]).toBe(text)
  expect(frag.children[1]).toBe(text2)
  expect(frag2.children.length).toBe(0)
})

test('Remove children', () => {
  const frag = new Node({ library, nodeName: '' })
  const text1 = new Node({ library, nodeName: 'Text' })
  const text2 = new Node({ library, nodeName: 'Text' })
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
  const frag = new Node({ library, nodeName: '' })
  const text1 = new Node({ library, nodeName: 'Text' })
  const text2 = new Node({ library, nodeName: 'Text' })
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
  const frag = new Node({ library, nodeName: '' })
  const text1 = new Node({ library, nodeName: 'Text' })
  const text2 = new Node({ library, nodeName: 'Text' })
  frag.append(text1)
  frag.insertBefore([text2], text1)
  expect(frag.children.length).toBe(2)
  expect(frag.children[0]).toBe(text2)
  expect(frag.children[1]).toBe(text1)
  expect(text2.nextSibling).toBe(text1)
  expect(text1.previousSibling).toBe(text2)

  const text3 = new Node({ library, nodeName: 'Text' })
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
  expect(studioApp.pages.length).toBe(0)
  expect(studioApp.$pages.get().length).toBe(0)

  const page1 = new PageNode({ library, nodeName: 'Page' })
  studioApp.addPage(page1)

  expect(studioApp.$pages.get().length).toBe(1)
  expect(studioApp.pages[0]).toBe(page1)

  const page2 = new PageNode({ library, nodeName: 'Page' })
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
  const frag = new Node({ library, nodeName: '' })
  const text = new Node({ library, nodeName: 'Text' })
  frag.append(text)

  expect(frag.ownerPage).toBe(null)
  expect(text.ownerPage).toBe(null)

  const page = new PageNode({ library, nodeName: 'Page' })
  page.append(frag)

  expect(frag.ownerPage).toBe(page)
  expect(page.ownerPage).toBe(page)

  frag.remove()
  expect(frag.ownerPage).toBe(null)
})

test('Siblings', () => {
  const frag = new Node({ library, nodeName: '' })
  const text1 = new Node({ library, nodeName: 'Text' })
  const text2 = new Node({ library, nodeName: 'Text' })

  frag.append(text1, text2)

  expect(text1.previousSibling).toBe(null)
  expect(text1.nextSibling).toBe(text2)
  expect(text2.previousSibling).toBe(text1)
  expect(text2.nextSibling).toBe(null)
})

test('Tree', () => {
  const page = new PageNode({ library, nodeName: 'Page' })
  const frag = new Node({ library, nodeName: '' })

  page.append(frag)

  const text = new Node({ library, nodeName: 'Text' })

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
  componentName: string | null = null

  slotsInfoArray = [
    {
      required: false,
      key: 'content',
      label: 'Content',
    },
  ]
}

test('Clone', () => {
  const node = new Node({ library, nodeName: '' })
  node.$style.setKey('color', 'red')

  expect(node.$style.get().color).toBe('red')

  const cloned = node.clone()
  expect(cloned.$style.get().color).toBe('red')
})

test('Nested clone', () => {
  const parent = new Node({ library, nodeName: '' })
  const child = new Node({ library, nodeName: '' })
  parent.append(child)
  child.$style.setKey('color', 'red')
  child.$style.setKey('flex', '1')

  const textChild = new Node({
    library,
    nodeName: 'Text',
    props: {
      value: 'Hello, world!',
    },
  })
  parent.append(textChild)

  const cloned = parent.clone()
  expect(cloned.children[0].$style.get().color).toBe('red')
  expect(cloned.children[1].nodeName).toBe('Text')
})
