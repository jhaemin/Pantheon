import { expect, test } from 'bun:test'
import { commandInsertNodes } from './command'
import { History } from './history'
import { PageNode } from './node-class/page'
import { ButtonNode } from './nodes/button'
import { FlexNode } from './nodes/flex'

test('Command insert nodes', () => {
  const page = new PageNode()
  const button1 = new ButtonNode()
  const button2 = new ButtonNode()

  commandInsertNodes(page, [button1, button2], null)

  expect(page.children.length).toBe(2)
  expect(page.children[0]).toBe(button1)
  expect(page.children[1]).toBe(button2)

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

  expect(button1.parent).toBe(null)
  expect(button2.parent).toBe(null)
  expect(page.children.length).toBe(0)

  commandInsertNodes(page, [button1], null)
  commandInsertNodes(page, [button2], button1)

  expect(page.children.length).toBe(2)
  expect(page.children[0]).toBe(button2)
  expect(page.children[1]).toBe(button1)

  expect(History.$historyStack.get().length).toBe(2)
  expect(History.$historyPointer.get()).toBe(1)

  const flex = new FlexNode()
  commandInsertNodes(page, [flex], button2)

  expect(page.children[0]).toBe(flex)

  commandInsertNodes(flex, [button1], null)

  History.undo()

  expect(flex.children.length).toBe(0)
  expect(History.$historyStack.get().length).toBe(4)
  expect(History.$historyPointer.get()).toBe(2)
})
