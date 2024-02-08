import { expect, test } from 'bun:test'
import { FlexNode } from './__generated__/flex'
import { commandInsertNodes } from './command'
import { History } from './history'
import { PageNode } from './node-class/page'
import { TextNode } from './nodes/text'

test('Command insert nodes', () => {
  const page = new PageNode()
  const text1 = new TextNode()
  const text2 = new TextNode()

  commandInsertNodes(page, [text1, text2], null)

  expect(page.children.length).toBe(2)
  expect(page.children[0]).toBe(text1)
  expect(page.children[1]).toBe(text2)

  expect(History.$historyStack.get().length).toBe(1)
  expect(History.$historyPointer.get()).toBe(0)

  History.undo()

  expect(page.children.length).toBe(0)
  expect(History.$historyPointer.get()).toBe(-1)
  expect(History.$historyStack.get().length).toBe(1)

  History.redo()

  expect(page.children.length).toBe(2)
  expect(History.$historyPointer.get()).toBe(0)
  expect(History.$historyStack.get().length).toBe(1)

  History.undo()

  expect(text1.parent).toBe(null)
  expect(text2.parent).toBe(null)
  expect(page.children.length).toBe(0)

  commandInsertNodes(page, [text1], null)
  commandInsertNodes(page, [text2], text1)

  expect(page.children.length).toBe(2)
  expect(page.children[0]).toBe(text2)
  expect(page.children[1]).toBe(text1)

  expect(History.$historyStack.get().length).toBe(2)
  expect(History.$historyPointer.get()).toBe(1)

  const flex = new FlexNode()
  commandInsertNodes(page, [flex], text2)

  expect(page.children[0]).toBe(flex)

  commandInsertNodes(flex, [text1], null)

  History.undo()

  expect(flex.children.length).toBe(0)
  expect(History.$historyStack.get().length).toBe(4)
  expect(History.$historyPointer.get()).toBe(2)
})
