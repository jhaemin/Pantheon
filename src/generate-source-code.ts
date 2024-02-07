import { format } from './format'
import { StudioApp } from './studio-app'

export async function generateSourceCode(studioApp: StudioApp) {
  const firstPage = studioApp.pages[0]

  const sourceCode = `
    function Page() {
      return ${firstPage.generateCode()}
    }
  `

  const formatted = await format(sourceCode)

  return formatted
}
