import { generateSourceCode } from '@/generate-source-code'
import { studioApp } from '@/studio-app'
import { DownloadIcon } from '@radix-ui/react-icons'
import { Button, Flex } from '@radix-ui/themes'

export function AppControls() {
  return (
    <Flex direction="column" align="center">
      <Button
        variant="ghost"
        onClick={async () => {
          const sourceCode = await generateSourceCode(studioApp)

          console.log(sourceCode)

          // const element = document.createElement('a')
          // element.setAttribute(
          //   'href',
          //   'data:text/plain;charset=utf-8,' + encodeURIComponent(sourceCode),
          // )
          // element.setAttribute('download', 'Component.tsx')

          // element.style.display = 'none'
          // document.body.appendChild(element)

          // element.click()

          // document.body.removeChild(element)
        }}
      >
        <DownloadIcon />
        Download source code (Log)
      </Button>
    </Flex>
  )
}
