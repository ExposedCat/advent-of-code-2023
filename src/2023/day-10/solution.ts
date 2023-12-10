import { readInput } from '../../utils.js'

type Tile = 'v' | 'h' | 'lb' | 'rb' | 'rt' | 'lt' | 'g' | 's'

type ParsedTile = { tile: Tile; distance: number }

function parseInput(input: string[]): Tile[][] {
  return input.map(line =>
    line.split('').map(
      tile =>
        (({
          '|': 'v',
          '-': 'h',
          L: 'lb',
          J: 'rb',
          '7': 'rt',
          F: 'lt',
          '.': 'g',
          S: 's',
        })[tile] ?? 'g') as Tile
    )
  )
}

function getStart(input: Tile[][]) {
  let start = [-1, -1]
  for (let y = 0; y < input.length; ++y) {
    for (let x = 0; x < input[0].length; ++x) {
      if (input[y][x] === 's') {
        start = [x, y]
        break
      }
    }
  }
  if (start[0] === -1) {
    throw new Error('Start was not found')
  }
  return start
}

const LEFT = ['l', -1, 0]
const RIGHT = ['r', 1, 0]
const UP = ['u', 0, -1]
const DOWN = ['d', 0, 1]

const directions = [LEFT, RIGHT, UP, DOWN] as [
  'l' | 'r' | 'u' | 'd',
  number,
  number,
][]

type Connection = { l: Tile[]; r: Tile[]; u: Tile[]; d: Tile[] }

const connections: Record<Tile, Connection> = {
  v: {
    l: [],
    r: [],
    u: ['v', 'lt', 'rt'],
    d: ['v', 'lb', 'rb'],
  },
  h: {
    l: ['h', 'lt', 'lb'],
    r: ['h', 'rt', 'rb'],
    u: [],
    d: [],
  },
  lb: {
    l: [],
    r: ['h', 'rb', 'rt'],
    u: ['v', 'lt', 'rt'],
    d: [],
  },
  lt: {
    l: [],
    r: ['h', 'rt', 'rb'],
    u: [],
    d: ['v', 'lb', 'rb'],
  },
  rt: {
    l: ['h', 'lt', 'lb'],
    r: [],
    u: [],
    d: ['v', 'lb', 'rb'],
  },
  rb: {
    l: ['h', 'lt', 'lb'],
    r: [],
    u: ['v', 'lt', 'rt'],
    d: [],
  },
  g: {
    l: [],
    r: [],
    u: [],
    d: [],
  },
  s: {
    l: ['h', 'lt', 'lb'],
    r: ['h', 'rt', 'rb'],
    u: ['v', 'lt', 'rt'],
    d: ['v', 'lb', 'rb'],
  },
}

function calculateDistances(
  input: Tile[][],
  newMap: ParsedTile[][],
  todo: number[][]
) {
  if (todo.length === 0) {
    return
  }
  const [startX, startY, _distance] = todo.shift() as number[]
  const currentTile = input[startY][startX]
  newMap[startY] ??= []
  newMap[startY][startX] ??= { tile: currentTile, distance: -1 }
  newMap[startY][startX].distance = _distance
  const tileConnections: Connection = connections[currentTile]
  for (const [axis, ox, oy] of directions) {
    const x = startX + ox
    const y = startY + oy
    if (x < 0 || x >= input.length || y < 0 || y >= input[0].length) {
      continue
    }
    const targetTile = newMap[y][x]
    if (
      tileConnections[axis].includes(targetTile.tile) &&
      (targetTile.distance === -1 || targetTile.distance > _distance + 1)
    ) {
      newMap[y][x].distance = _distance + 1
      todo.push([x, y, _distance + 1])
    }
  }
}

export async function oasisReport() {
  const input = await readInput(import.meta.url)

  const map = parseInput(input)
  const [startX, startY] = getStart(map)
  const newMap: ParsedTile[][] = []
  newMap[startX] = []
  for (let y = 0; y < input.length; ++y) {
    newMap[y] = []
    for (let x = 0; x < input[0].length; ++x) {
      newMap[y][x] = {
        tile: map[y][x],
        distance: -1,
      }
    }
  }
  console.log([startX, startY])
  const todo = [[startX, startY, 0]]
  while (todo.length !== 0) {
    console.log(todo.length)
    calculateDistances(map, newMap, todo)
  }

  console.log(
    newMap
      .map(
        (row, i) =>
          `[${i}] ${row
            .map(tile =>
              tile.tile === 'g' || tile.distance === -1 ? '.' : tile.distance
            )
            .join(' ')}`
      )
      .join('\n')
  )
  console.log()
  console.log(
    newMap
      .map(
        (row, i) =>
          `[${i}] ${row
            .map(tile =>
              tile.tile === 's'
                ? 'S'
                : tile.distance > 0
                  ? {
                      v: '|',
                      h: '-',
                      lb: '└',
                      rb: '┘',
                      rt: '┐',
                      lt: '┌',
                      g: '.',
                      s: 'S',
                    }[tile.tile]
                  : '.'
            )
            .join(' ')}`
      )
      .join('\n')
  )
  console.log(
    Math.max(...newMap.map(row => Math.max(...row.map(tile => tile.distance))))
  )
}

oasisReport()
