import { readInput } from '../../utils.js'

export async function main() {
  const lines = await readInput(import.meta.url, '\n')

  let sum = 0
  const spacesAbove = new Array(lines[0].length).fill(0)
  for (let y = 0; y < lines.length; ++y) {
    for (let x = 0; x < lines[y].length; ++x) {
      const cell = lines[y][x]
      if (cell === 'O') {
        sum += lines.length - y + spacesAbove[x]
      }
      spacesAbove[x] = cell === '.' ? spacesAbove[x] + 1 : 0
    }
  }

  console.log(sum)
}

main()
