import { expect, test } from 'bun:test'
import { InsertNodeAction } from './action'
import { commandInsertNodes } from './command'
import { History } from './history'
import { Library } from './library'
import { Node } from './node-class/node'
import { PageNode } from './node-class/page'

const library: Library = {
  name: 'studio',
  version: '1.0.0',
}

test('Command insert nodes', () => {
  const page = new PageNode({ library, nodeName: 'Page' })
  const text1 = new Node({ library, nodeName: 'Text' })
  const text2 = new Node({ library, nodeName: 'Text' })

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

  const flex = new Node({ library, nodeName: '' })
  commandInsertNodes(page, [flex], text2)

  expect(page.children[0]).toBe(flex)

  commandInsertNodes(flex, [text1], null)

  History.undo()

  expect(flex.children.length).toBe(0)
  expect(History.$historyStack.get().length).toBe(4)
  expect(History.$historyPointer.get()).toBe(2)
})

test('Command insert nodes order', () => {
  const page = new PageNode({ library, nodeName: 'Page' })

  const node1 = new Node({ library, nodeName: 'Node1' })
  const node2 = new Node({ library, nodeName: 'Node2' })

  commandInsertNodes(page, [node1, node2], null)

  History.historyStack[0].actions.forEach((action, i) => {
    expect(action).toBeInstanceOf(InsertNodeAction)
  })

  expect(page.children.length).toBe(2)
  expect(page.children[0]).toBe(node1)
  expect(page.children[1]).toBe(node2)

  History.undo()

  expect(page.children.length).toBe(0)

  History.redo()

  expect(page.children.length).toBe(2)
  expect(page.children[0]).toBe(node1)
  expect(page.children[1]).toBe(node2)
})
