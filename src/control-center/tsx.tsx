import { format } from '@/format'
import { Node } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { CheckIcon, ClipboardIcon } from '@radix-ui/react-icons'
import { Flex, IconButton, Text } from '@radix-ui/themes'
import hljs from 'highlight.js'
import { useEffect, useRef, useState } from 'react'

export async function generateSourceCode(node: Node) {
  const sourceCode = `
    function Component() {
      return ${node.generateCode()}
    }
  `

  const formatted = await format(sourceCode)

  return formatted
}

export function TSX({ node }: { node: Node }) {
  const additionalProps = useStore(node.$additionalProps)
  const props = useStore(node.$props)
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
  }, [node, props, additionalProps])

  return (
    <Flex direction="column">
      <Flex align="center" justify="between">
        <Text size="2">TSX</Text>
        <IconButton
          variant="ghost"
          color="gray"
          onClick={() => {
            navigator.clipboard.writeText(sourceCode.current)
            setCopied(true)

            window.clearTimeout(copyTimeout.current)

            copyTimeout.current = window.setTimeout(() => {
              setCopied(false)
            }, 2000)
          }}
        >
          {copied ? <CheckIcon /> : <ClipboardIcon />}
        </IconButton>
      </Flex>

      <Flex direction="column" mt="4">
        <pre
          style={{
            fontSize: 12,
            width: '100%',
            overflow: 'auto',
            margin: 0,
            fontFamily: 'SF Mono, Menlo, monospace',
            lineHeight: 1.4,
          }}
        >
          <code
            dangerouslySetInnerHTML={{
              __html: syntaxHighlighted,
            }}
          />
        </pre>
        {/* <pre
              style={{
                fontSize: 12,
                width: '100%',
                overflow: 'auto',
              }}
            >
              <code>{sourceCode}</code>
            </pre> */}
      </Flex>
    </Flex>
  )
}
