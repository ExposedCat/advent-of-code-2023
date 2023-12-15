import { readInput, sumBy } from '../../utils.js'

const factorial = (n: number): number => (n < 2 ? 1 : factorial(n - 1) * n)

const calcCombinations = (n: number, k: number) =>
  factorial(n) / (factorial(k) * factorial(n - k))

function parseInput(input: string[]) {
  return input.map(line => {
    const [row, numbers] = line.split(' ')
    return {
      row,
      numbers: numbers.split(',').map(Number),
    }
  })
}

function compile(row: string, groups: number[]) {
  const { length } = row
  const requiredLength = sumBy(groups, number => number + 1) - 1
  const emptySpaces = length - requiredLength
  const groupsNumber = groups.length
  const combinations = calcCombinations(
    groupsNumber + emptySpaces,
    groupsNumber
  )
  return combinations
}

export async function main(extended = false) {
  const input = await readInput(import.meta.url)

  const data = parseInput(input)

  for (const { row, numbers } of data) {
    const combinations = compile(row, numbers)
    console.log(row, numbers, combinations)
  }

  console.log(data)
}

main()
