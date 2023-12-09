import { readInput, sumBy } from '../../utils.js'

type InputMap = (number | 'dot' | '*')[][]

function ensureHasSymbol(map: InputMap, x: number, y: number) {
  for (let i = -1; i < 2; ++i) {
    for (let j = -1; j < 2; ++j) {
      if (map[y + i] === undefined || map[y + i][x + j] === undefined) {
        continue
      }
      if (map[y + i][x + j] === '*') {
        return [y + i, x + j]
      }
    }
  }
  return null
}

function getMap(input: string[]): InputMap {
  return input.map(line =>
    line
      .split('')
      .map(character =>
        !isNaN(Number(character))
          ? Number(character)
          : character === '*'
            ? '*'
            : 'dot'
      )
  )
}

function getSum(map: InputMap, y: number) {
  let number = -1
  let hasSymbol = false
  const sum = map[y].reduce<number>((sum, digit, x) => {
    if (typeof digit !== 'number') {
      if (number >= 0 && hasSymbol) {
        sum += number
      }
      number = -1
      hasSymbol = false
    } else {
      number = number < 0 ? digit : number * 10 + digit
      if (!hasSymbol) {
        const symbolInfo = ensureHasSymbol(map, x, y)
        if (symbolInfo) {
          hasSymbol = true
        }
      }
      if (x === map[y].length - 1 && hasSymbol) {
        sum += number
      }
    }
    return sum
  }, 0)
  return sum
}

function getGears(map: InputMap) {
  let number = -1
  let relatedSymbols = new Set<string>()
  const gears: Record<string, Set<number>> = {}
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      const digit = map[y][x]
      const updateGears = () => {
        if (relatedSymbols.size > 0) {
          for (const symbol of relatedSymbols) {
            gears[symbol] ??= new Set()
            gears[symbol].add(number)
          }
        }
      }
      if (typeof digit !== 'number') {
        if (number >= 0) {
          updateGears()
        }
        number = -1
        relatedSymbols = new Set()
      } else {
        number = number < 0 ? digit : number * 10 + digit
        const symbolInfo = ensureHasSymbol(map, x, y)
        if (symbolInfo) {
          relatedSymbols.add(symbolInfo.join(';'))
        }
        if (x === map[y].length - 1) {
          updateGears()
        }
      }
    }
  }
  return Object.values(gears).map(values => Array.from(values))
}

export async function missingParts(extended = false) {
  const input = await readInput(import.meta.url)

  if (extended) {
    const gears = getGears(getMap(input))
    console.log('=================')
    console.log('Checking Gears...')
    console.log('=================')

    console.log(
      `   ⢀⣴⣾⣦⣀⣀⣠⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣾⣿⡿⠋⠁⠈⠙⢿⣿⣷⣶⣶⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢸⣿⣿⣿⣿⡇⠀⠀⠀⠀⢸⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠘⠛⠛⠻⣿⣷⣤⣀⣀⣴⣿⣿⠏⢀⣀⠀⠀⠀⠀⣾⣿⣿⡇⠀⠀⠀⠀⣀⠀
⠀⠀⠀⠀⠀⣾⣿⣿⡿⠿⢿⣿⣿⣷⣿⣿⣧⠀⣀⣀⣿⣿⣿⣇⣀⡀⠀⣼⣿⠀
⠀⠀⠀⠀⠸⠿⣿⡿⠀⠀⠀⠻⠿⠋⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠁⢀⣴⣤⣀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠿⣿⣿⣿⣿⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⠀
⠀⠀⠀⠀⠀⠀⠘⠛⠛⠻⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠛⠛⠛⠛⠛⠛⠛⠛⠂⠀⠀⠀⠀⠒⠛⠛⠛⠛`
    )
    console.log()
    const sum = sumBy(gears, (gearValues: number[]) =>
      gearValues.length === 2 ? gearValues[0] * gearValues[1] : 0
    )
    console.log('=================')
    console.log('All Gears Checked')
    console.log('=================')
    console.log()
    console.log(`Engine Gear values sum is ${sum}`)
  } else {
    console.log('=========================')
    console.log('Gathering Part Numbers...')
    console.log('=========================')
    console.log(
      `.-----.
| 294 | .-=-=-.
'-----' '-=-=-'`
    )
    console.log()
    const map = getMap(input)
    const sum = sumBy(map, (_, y) => getSum(map, y))
    console.log('=====================')
    console.log('Part Numbers Gathered')
    console.log('=====================')
    console.log()
    console.log(`Numbers sum is ${sum}`)
  }
}
