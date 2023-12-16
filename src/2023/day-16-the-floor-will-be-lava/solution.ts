import { readInput, sumBy } from '../../utils.js'

type Direction = 'left' | 'right' | 'up' | 'down'
type Cell = {
  energized: boolean
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}
type Beam = [number, number, Direction]

function getNextBeams(beam: Beam, map: string[]): Beam[] {
  const [fromX, fromY, direction] = beam
  const changeX = direction === 'left' ? -1 : direction === 'right' ? 1 : 0
  const changeY = direction === 'up' ? -1 : direction === 'down' ? 1 : 0
  const x = fromX + changeX
  const y = fromY + changeY
  if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) {
    return []
  }
  const nextCell = map[y][x]
  const current: Beam[] = [[x, y, direction]]
  const up: Beam = [x, y, 'up']
  const down: Beam = [x, y, 'down']
  const left: Beam = [x, y, 'left']
  const right: Beam = [x, y, 'right']
  switch (nextCell) {
    case '|':
      return direction === 'left' || direction === 'right'
        ? [up, down]
        : current
    case '-':
      return direction === 'up' || direction === 'down'
        ? [left, right]
        : current
    case '/':
      return {
        left: [down],
        right: [up],
        up: [right],
        down: [left],
      }[direction]
    case '\\':
      return {
        left: [up],
        right: [down],
        up: [left],
        down: [right],
      }[direction]
    default:
      return current
  }
}

function launchBeam(map: string[], energyMap: Cell[][], beam: Beam) {
  const beams = getNextBeams(beam, map)
  for (const [x, y, direction] of beams) {
    const cell = energyMap[y][x]
    cell.energized = true
    if (!cell[direction]) {
      cell[direction] = true
      beams.push(...launchBeam(map, energyMap, [x, y, direction]))
    }
  }
  return beams
}

function getEnergizedNumber(map: string[], beam: Beam) {
  const energyMap: Cell[][] = Array.from({ length: map.length }, () =>
    Array.from({ length: map[0].length }, () => ({
      energized: false,
      up: false,
      down: false,
      left: false,
      right: false,
    }))
  )
  launchBeam(map, energyMap, beam)
  return sumBy(energyMap, line => sumBy(line, cell => (cell.energized ? 1 : 0)))
}

export async function energizedCells(extended = false) {
  const map = await readInput(import.meta.url, '\n')
  if (extended) {
    console.warn(
      '[!] The solution is far from being optimal - this may take a few minutes to calculate'
    )
    let max = 0
    for (let y = 0; y < map.length; ++y) {
      for (const beam of [
        [-1, y, 'right'],
        [map[0].length, y, 'left'],
      ]) {
        const number = getEnergizedNumber(map, beam as Beam)
        if (max < number) {
          max = number
        }
      }
    }
    for (let x = 0; x < map.length; ++x) {
      for (const beam of [
        [x, -1, 'down'],
        [map.length, x, 'up'],
      ]) {
        const number = getEnergizedNumber(map, beam as Beam)
        if (max < number) {
          max = number
        }
      }
    }
    console.log(`There can be maximum of ${max} emergized cells`)
  } else {
    const number = getEnergizedNumber(map, [-1, 0, 'right'])
    console.log(`There are ${number} emergized cells`)
  }
}

energizedCells()
