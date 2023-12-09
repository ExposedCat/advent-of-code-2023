import { lastElement, readInput, sumBy } from '../../utils.js'

function completeLine(line: number[]) {
  const result = [line]
  let last = line
  do {
    result.push(
      last.reduce(
        (diff, number, i) => (i === 0 ? diff : [...diff, number - last[i - 1]]),
        [] as number[]
      )
    )
    last = lastElement(result)
  } while (!last.every(number => number === 0))
  return result
}

const processBlock = (block: number[][], extended: boolean) =>
  block.reduce((result, _, i) => {
    const last = block[block.length - 1 - i]
    return last[extended ? 0 : last.length - 1] + result * (extended ? -1 : 1)
  }, 0)

export async function oasisReport(extended = false) {
  const input = await readInput(import.meta.url)

  const blocks = input.map(line => completeLine(line.split(' ').map(Number)))
  const sum = sumBy(blocks, (block: number[][]) =>
    processBlock(block, extended)
  )

  console.log(`Predictions sum: ${sum}`)
}
