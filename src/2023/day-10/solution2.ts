import { readInput } from '../../utils.js'

type Tile = 'v' | 'h' | 'lb' | 'rb' | 'rt' | 'lt' | 'g' | 's'

type ParsedTile = { tile: Tile; distance: number; nextTiles: number[][] }

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

function isPointInPath(x: number, y: number, poly: number[][]) {
  // Determine if the point is on the path, corner, or boundary of the polygon
  const num = poly.length
  let j = num - 1
  let c = false

  for (let i = 0; i < num; i++) {
    if (x === poly[i][0] && y === poly[i][1]) {
      // console.log(x, y, 'Point is a corner')
      return false
    }
    if (poly[i][1] > y !== poly[j][1] > y) {
      const slope =
        (x - poly[i][0]) * (poly[j][1] - poly[i][1]) -
        (poly[j][0] - poly[i][0]) * (y - poly[i][1])
      if (slope === 0) {
        // console.log(x, y, 'Point is INSIDE 1')
        return false
      }
      if (slope < 0 !== poly[j][1] < poly[i][1]) {
        c = !c
      }
    }
    j = i
  }
  if (c) {
    // console.log(x, y, 'Point is INSIDE')
  } else {
    // console.log(x, y, 'Point is outside')
  }
  return c
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
  newMap[startY][startX] ??= { tile: currentTile, distance: -1, nextTiles: [] }
  newMap[startY][startX].distance = _distance
  const tileConnections: Connection = connections[currentTile]
  for (const [axis, ox, oy] of directions) {
    const x = startX + ox
    const y = startY + oy
    if (x < 0 || x >= input[0].length || y < 0 || y >= input.length) {
      continue
    }
    const targetTile = newMap[y][x]
    if (
      tileConnections[axis].includes(targetTile.tile) &&
      (targetTile.distance === -1 || targetTile.distance > _distance + 1)
    ) {
      newMap[y][x].distance = _distance + 1
      todo.push([x, y, _distance + 1])
      newMap[startY][startX].nextTiles.push([x, y, _distance + 1])
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
        nextTiles: [],
      }
    }
  }
  const todo = [[startX, startY, 0]]
  while (todo.length !== 0) {
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
  console.log('    0 1 2 3 4 5 6 7 8 9 0')
  console.log(
    newMap
      .map(
        (row, i) =>
          `[${i}] ${row
            .map(tile => (tile.tile !== 'g' && tile.distance >= 0 ? 'X' : '.'))
            .join(' ')}`
      )
      .join('\n')
  )
  // console.log(
  //   Math.max(...newMap.map(row => Math.max(...row.map(tile => tile.distance))))
  // )
  // const nexttiled = newMap
  //   .map(row =>
  //     row
  //       .filter(tile => tile.tile !== 'g' && tile.distance >= 0)
  //       .map(tile => ({
  //         tile: tile.tile,
  //         distance: tile.distance,
  //         next: tile.nextTiles.sort(
  //           (a, b) => newMap[a[1]][a[0]].distance - newMap[b[1]][b[0]].distance
  //         )[0]?.[2],
  //       }))
  //   )
  //   .filter(row => row.length != 0)

  const borders = newMap
    .flatMap((row, y) => row.map((tile, x) => [x, y, tile.distance]))
    .filter(tile => tile[2] >= 0)

  console.log(borders)

  let last = borders.find(border => border[2] === 0) as number[]
  if (!last) {
    throw new Error('Start not found for fill')
  }
  let reversed = false
  const orderedBorders = []
  while (borders.length !== 0) {
    const next = borders.findIndex(
      tile =>
        tile[2] === last[2] + 1 * (reversed ? -1 : 1) &&
        Math.abs(tile[1] - last[1]) <= 1 &&
        Math.abs(tile[0] - last[0]) <= 1
    )
    if (next === -1) {
      if (reversed) {
        console.error('Dead loop for', last)
        break
      }
      // console.log('Finished half, reversing')
      reversed = true
    }
    if (next !== -1) {
      last = borders[next]
      // console.log('Found next, pushing', last)
      orderedBorders.push(last)
      borders.splice(next, 1)
    }
  }

  console.log(orderedBorders)

  // const borders = nexttiled
  //   .flatMap((row, y) =>
  //     row.map((tile, x) => {
  //       return [x, y, tile.next ?? 0]
  //     })
  //   )
  //   .sort((a, b) => (b?.[2] ?? 0) - (a?.[2] ?? 0))
  //   .map(coords => [coords?.[0], coords?.[1]]) as number[][]
  // console.log()
  let total = 0
  for (let y = 0; y < input.length; ++y) {
    for (let x = 0; x < input[0].length; ++x) {
      if (isPointInPath(x, y, orderedBorders)) {
        total += 1
      }
    }
  }
  // console.log(borders)
  console.log('Total = ', total)
}

oasisReport()
