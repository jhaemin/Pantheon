import { keepNodeSelectionAttribute } from '@/data-attributes'
import { format } from '@/format'
import { Node } from '@/node-class/node'
import { PageNode } from '@/node-class/page'
import { useStore } from '@nanostores/react'
import { CheckIcon, ClipboardIcon, SizeIcon } from '@radix-ui/react-icons'
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  IconButton,
  Inset,
  ScrollArea,
  Text,
} from '@radix-ui/themes'
import { pascalCase } from 'change-case'
import hljs from 'highlight.js'
import { useEffect, useRef, useState } from 'react'

export async function generateSourceCode(node: Node) {
  // TODO: allow only available javascript function name
  const componentName =
    node instanceof PageNode
      ? pascalCase(node.$props.get().title.trim() || 'UntitledPage')
      : pascalCase(node.componentName ?? node.nodeName)

  const sourceCode = `
    function ${componentName}() {
      return ${node.generateCode()}
    }
  `

  const formatted = await format(sourceCode)

  return formatted
}

/**
 * TODO: Add large view button
 */
export function TSX({ node }: { node: Node }) {
  const slots = useStore(node.$slots)
  const additionalProps = useStore(node.$additionalProps)
  const props = useStore(node.$props)
  const pageTitle = node instanceof PageNode ? props.title : undefined
  const copyTimeout = useRef<number>(0)
  const [copied, setCopied] = useState(false)
  const sourceCode = useRef('')
  const [syntaxHighlighted, setSyntaxHighlighted] = useState('')

  useEffect(() => {
    generateSourceCode(node).then((code): void => {
      sourceCode.current = code
      const highlighted = hljs.highlight(code, {
        language: 'tsx',
      }).value
      setSyntaxHighlighted(highlighted)
    })
  }, [node, props, additionalProps, slots, pageTitle])

  function copyToClipboard() {
    navigator.clipboard.writeText(sourceCode.current)
    setCopied(true)

    window.clearTimeout(copyTimeout.current)

    copyTimeout.current = window.setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Flex direction="column">
      <Flex align="center" justify="between">
        <Text size="2">TSX</Text>

        <Flex align="center" gap="3">
          <Dialog.Root>
            <Dialog.Trigger>
              <IconButton variant="ghost" color="gray">
                <SizeIcon />
              </IconButton>
            </Dialog.Trigger>

            <Dialog.Content {...keepNodeSelectionAttribute}>
              <Dialog.Title>TSX</Dialog.Title>

              <Card>
                <Inset>
                  <ScrollArea>
                    <Box p="3">
                      <pre
                        style={{
                          fontSize: 12,
                          width: '100%',
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        <code
                          style={{
                            fontFamily: 'SF Mono, Menlo, monospace',
                          }}
                          dangerouslySetInnerHTML={{
                            __html: syntaxHighlighted,
                          }}
                        />
                      </pre>
                    </Box>
                  </ScrollArea>
                </Inset>
              </Card>

              <Flex mt="6" align="center" justify="between">
                <IconButton
                  onClick={copyToClipboard}
                  variant="soft"
                  color={copied ? 'green' : undefined}
                >
                  {copied ? <CheckIcon /> : <ClipboardIcon />}
                </IconButton>
                <Dialog.Close>
                  <Button>Close</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

          <IconButton
            variant="ghost"
            color={copied ? 'green' : 'gray'}
            onClick={copyToClipboard}
          >
            {copied ? <CheckIcon /> : <ClipboardIcon />}
          </IconButton>
        </Flex>
      </Flex>

      <Flex direction="column" mt="4">
        <Card size="1">
          <Inset>
            <ScrollArea>
              <Box p="3">
                <pre
                  style={{
                    fontSize: 12,
                    width: '100%',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  <code
                    style={{
                      fontFamily: 'SF Mono, Menlo, monospace',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: syntaxHighlighted,
                    }}
                  />
                </pre>
              </Box>
            </ScrollArea>
          </Inset>
        </Card>
      </Flex>
    </Flex>
  )
}
