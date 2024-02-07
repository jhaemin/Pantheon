import { PageNode } from '@/node-class/page'
import { ButtonNode } from '@/nodes/button'
import { ContainerNode } from '@/nodes/container'
import { FlexNode } from '@/nodes/flex'
import { TextNode } from '@/nodes/text'
import { StudioApp } from '@/studio-app'
import { expect, test } from 'bun:test'

test('Node creation', () => {
  const flex = new FlexNode()
  expect(flex.children.length).toBe(0)
  expect(flex.parent).toBe(null)
  expect(flex.previousSibling).toBe(null)
  expect(flex.nextSibling).toBe(null)
})

test('Append children', () => {
  const flex = new FlexNode()
  const button1 = new ButtonNode()
  flex.append(button1)
  expect(flex.children.length).toBe(1)

  const button2 = new ButtonNode()
  flex.append(button2)
  expect(flex.children.length).toBe(2)

  expect(flex.children[0]).toBe(button1)
  expect(flex.children[1]).toBe(button2)

  expect(flex.children[0].previousSibling).toBe(null)
  expect(flex.children[0].nextSibling).toBe(button2)
  expect(flex.children[1].previousSibling).toBe(button1)
  expect(flex.children[1].nextSibling).toBe(null)
})

test('Remove children', () => {
  const flex = new FlexNode()
  const button1 = new ButtonNode()
  const button2 = new ButtonNode()
  flex.append(button1, button2)
  expect(flex.children.length).toBe(2)

  flex.removeChild(button1)
  expect(flex.children.length).toBe(1)
  expect(flex.children[0]).toBe(button2)
  expect(button1.parent).toBe(null)

  flex.removeChild(button2)
  expect(flex.children.length).toBe(0)
  expect(button2.parent).toBe(null)
})

test('Remove', () => {
  const flex = new FlexNode()
  const button1 = new ButtonNode()
  const button2 = new ButtonNode()
  flex.append(button1, button2)
  expect(flex.children.length).toBe(2)

  button1.remove()
  expect(flex.children.length).toBe(1)
  expect(flex.children[0]).toBe(button2)
  expect(button1.parent).toBe(null)

  button2.remove()
  expect(flex.children.length).toBe(0)
  expect(button2.parent).toBe(null)
})

test('Insert before', () => {
  const flex = new FlexNode()
  const button1 = new ButtonNode()
  const button2 = new ButtonNode()
  flex.append(button1)
  flex.insertBefore([button2], button1)
  expect(flex.children.length).toBe(2)
  expect(flex.children[0]).toBe(button2)
  expect(flex.children[1]).toBe(button1)
  expect(button2.nextSibling).toBe(button1)
  expect(button1.previousSibling).toBe(button2)

  const button3 = new ButtonNode()
  flex.append(button3)
  flex.insertBefore([button3], button3.previousSibling)
  expect(flex.children.length).toBe(3)
  expect(flex.children[0]).toBe(button2)
  expect(flex.children[1]).toBe(button3)
  expect(flex.children[2]).toBe(button1)

  flex.removeChild(button1)

  flex.insertBefore([button3], button3)
  expect(flex.children.length).toBe(2)
  expect(flex.children[0]).toBe(button2)
  expect(flex.children[1]).toBe(button3)
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
  const flex = new FlexNode()
  const button = new ButtonNode()
  flex.append(button)

  expect(flex.ownerPage).toBe(null)
  expect(button.ownerPage).toBe(null)

  const page = new PageNode()
  page.append(flex)

  expect(flex.ownerPage).toBe(page)
  expect(page.ownerPage).toBe(page)

  flex.remove()
  expect(flex.ownerPage).toBe(null)
})

test('Siblings', () => {
  const container = new ContainerNode()
  const text = new TextNode()
  const button = new ButtonNode()

  container.append(text, button)

  expect(text.previousSibling).toBe(null)
  expect(text.nextSibling).toBe(button)
  expect(button.previousSibling).toBe(text)
  expect(button.nextSibling).toBe(null)
})

test('Tree', () => {
  const page = new PageNode()
  const flex = new FlexNode()

  page.append(flex)

  const button = new ButtonNode()

  flex.append(button)

  expect(page.ownerPage).toBe(page)
  expect(flex.ownerPage).toBe(page)
  expect(button.ownerPage).toBe(page)

  flex.remove()

  expect(flex.ownerPage).toBe(null)
  expect(button.ownerPage).toBe(null)
  expect(button.parent).toBe(flex)
})
