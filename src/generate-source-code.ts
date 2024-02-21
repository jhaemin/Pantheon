import { format } from './format'
import { studioApp } from './studio-app'

export async function generateSourceCode() {
  const firstPage = studioApp.pages[0]

  const sourceCode = `
    function Page() {
      return ${firstPage.generateCode()}
    }
  `

  const formatted = await format(sourceCode)

  return formatted
}
