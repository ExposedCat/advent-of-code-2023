import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

export async function readInput(metaUrl: string) {
  const __filename = fileURLToPath(metaUrl)
  const __dirname = dirname(__filename)
  try {
    const filePath = `${__dirname}/input.txt`
    const input = await readFile(filePath, 'utf8')
    return input
  } catch (error) {
    console.error('Ah no, input not found!', { error })
    process.exit(1)
  }
}
