import { readInput, sumBy } from '../../utils.js'

function rotateMap(map: string[][]) {
  return map[0].map((_, i) => map.map(row => row[i]).reverse())
}

function rotateDish(map: string[][]): string[][] {
  for (let i = 0; i < 4; ++i) {
    moveNorth(map)
    map = rotateMap(map)
  }
  return map
}

function moveNorth(map: string[][]): number {
  let sum = 0
  const spacesAbove = new Array(map[0].length).fill(0)
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      const cell = map[y][x]
      if (cell === 'O') {
        sum += map.length - y + spacesAbove[x]
        map[y][x] = '.'
        map[y - spacesAbove[x]][x] = 'O'
      }
      spacesAbove[x] =
        cell === '.' ? spacesAbove[x] + 1 : cell === '#' ? 0 : spacesAbove[x]
    }
  }
  return sum
}

function getNorthLoad(map: string[][]): number {
  return sumBy(map, (line, y) =>
    sumBy(line, item => (item === 'O' ? map.length - y : 0))
  )
}

export async function reflectorDish(extended = false) {
  const lines = await readInput(import.meta.url, '\n')
  let map = lines.map(line => line.split(''))

  if (!extended) {
    const load = moveNorth(map)
    console.log(`Total north load is ${load}`)
  } else {
    const totalCycles = 1_000_000_000
    const hashmap: Record<string, number> = {}
    let leftAfterMain = 0
    for (let i = 1; i <= totalCycles; ++i) {
      map = rotateDish(map)
      const hash = map.map(line => line.join('')).join('')
      if (hashmap[hash]) {
        const loopStart = hashmap[hash]
        const length = i - loopStart
        const repeats = ((totalCycles - loopStart) / length) | 0
        leftAfterMain = totalCycles - loopStart - repeats * length
        break
      }
      hashmap[hash] = i
    }
    for (let i = 0; i < leftAfterMain; ++i) {
      map = rotateDish(map)
    }
    const load = getNorthLoad(map)
    console.log(`Total north load is ${load}`)
  }
}

reflectorDish(true)
