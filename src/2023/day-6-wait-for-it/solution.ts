import { readInput } from '../../utils.js'

function parseInput(input: string, extended: boolean) {
  const result = input
    .split('\n')
    .map(line => line.match(/\d+/g)?.map(Number) as number[])
  if (extended) {
    return result.map(line => [Number(line.join(''))])
  }
  return result
}

function calculateWaysToWin(time: number, distance: number) {
  let ways = 0
  for (let t = 0; t <= time; ++t) {
    const result = t * (time - t)
    if (result > distance) {
      ways += 1
    }
  }
  return ways
}

export async function winningPossibilities(extended = false) {
  const input = await readInput(import.meta.url)
  const rows = parseInput(input, extended)
  console.log('===========================')
  console.log('Calculating Error Margin...')
  console.log('===========================')
  console.log()
  console.log(`                  
   __            |\\
__/__\\___________| \\_
|   ___    |  ,|   ___\`-.
|  /   \\   |___/  /   \\  \`-.
|_| (O) |________| (O) |____|
   \\___/          \\___/`)
  let margin = 1
  for (let i = 0; i < rows[0].length; ++i) {
    margin *= calculateWaysToWin(rows[0][i], rows[1][i])
  }
  console.log()
  console.log('===========================')
  console.log('      Ready to Race!')
  console.log('===========================')
  console.log(`Your margin of error is ${margin}`)
  console.log()
}
