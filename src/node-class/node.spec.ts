import { PageNode } from '@/node-class/page'
import { FragmentNode } from '@/nodes/fragment'
import { TextNode } from '@/nodes/text'
import { StudioApp } from '@/studio-app'
import { expect, test } from 'bun:test'

test('Node creation', () => {
  const frag = new FragmentNode()
  expect(frag.children.length).toBe(0)
  expect(frag.parent).toBe(null)
  expect(frag.previousSibling).toBe(null)
  expect(frag.nextSibling).toBe(null)
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
