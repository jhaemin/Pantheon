import prettierPluginEstree from 'prettier/plugins/estree'
import prettierPluginTypescript from 'prettier/plugins/typescript'
import prettier from 'prettier/standalone' // For browser

export async function format(code: string) {
  const formatted = await prettier.format(code, {
    parser: 'typescript',
    // To use typescript parser, typescript plugin and estree plugin are required
    plugins: [prettierPluginTypescript, prettierPluginEstree],
    semi: false,
    singleQuote: true,
    useTabs: false,
    tabWidth: 2,
    arrowParens: 'always',
    trailingComma: 'all',
    printWidth: 80,
  })

  return formatted
}
