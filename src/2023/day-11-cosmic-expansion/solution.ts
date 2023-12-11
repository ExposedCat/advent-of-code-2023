import { readInput } from '../../utils.js'

type Galaxy = { x: number; y: number; offsetX: number; offsetY: number }

function expand(input: string[], galaxies: Galaxy[], offset: number) {
  for (let x = 0; x < input[0].length; ++x) {
    let duplicate = true
    for (let y = 0; y < input.length; ++y) {
      if (input[y][x] === '#') {
        duplicate = false
      }
    }
    if (duplicate) {
      for (const galaxy of galaxies) {
        if (galaxy.x >= x) {
          galaxy.offsetX += offset
        }
      }
    }
  }
  for (let y = 0; y < input.length; ++y) {
    if (!input[y].includes('#')) {
      for (const galaxy of galaxies) {
        if (galaxy.y >= y) {
          galaxy.offsetY += offset
        }
      }
    }
  }
  return galaxies
}

function getDistance(galaxy1: Galaxy, galaxy2: Galaxy) {
  const x1 = galaxy1.x + galaxy1.offsetX
  const y1 = galaxy1.y + galaxy1.offsetY

  const x2 = galaxy2.x + galaxy2.offsetX
  const y2 = galaxy2.y + galaxy2.offsetY

  return Math.abs(y2 - y1) + Math.abs(x2 - x1)
}

export async function cosmicExpansion(extended = false) {
  const input = await readInput(import.meta.url)

  const galaxies = []
  for (let y = 0; y < input.length; ++y) {
    for (let x = 0; x < input[y].length; ++x) {
      if (input[y][x] === '#') {
        galaxies.push({ x, y, offsetX: 0, offsetY: 0 })
      }
    }
  }

  expand(input, galaxies, extended ? 1000000 - 1 : 1)

  let sum = 0
  for (let i = 0; i < galaxies.length; ++i) {
    for (let j = i + 1; j < galaxies.length; ++j) {
      sum += getDistance(galaxies[i], galaxies[j])
    }
  }

  console.log(`Sum: ${sum}`)
}
