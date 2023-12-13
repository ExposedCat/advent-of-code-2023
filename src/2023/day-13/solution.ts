import { readInput, sumBy } from '../../utils.js'

function rotateBlock(block: string[]) {
  return block[0].split('').map((_, i) =>
    block
      .map(row => row[i])
      .reverse()
      .join('')
  )
}

function isReflection(line: string, offsetLeft = 0, offsetRight = 0) {
  const center = Math.floor((line.length - offsetLeft - offsetRight) / 2)
  return {
    center: offsetLeft ? center + offsetLeft : center,
    result:
      line.slice(offsetLeft, center + offsetLeft) ===
      line
        .slice(center + offsetLeft, -offsetRight || line.length)
        .split('')
        .reverse()
        .join(''),
  }
}

function getAxisMirror(
  block: string[],
  vertical = false
): {
  position: number
  vertical: boolean
} | null {
  const positionsList: number[][] = []
  for (const line of block) {
    const positions = []
    for (let offset = 0; offset < line.length - 1; ++offset) {
      const left = isReflection(line, offset)
      if (left.result) {
        positions.push(left.center)
      }
      const right = isReflection(line, 0, offset)
      if (right.result) {
        positions.push(right.center)
      }
    }

    if (positions.length === 0) {
      return null
    }

    positionsList.push(positions)
  }
  const mirror = positionsList[0].find(number =>
    positionsList.every(list => list.includes(number))
  )
  return mirror
    ? { position: vertical ? block[0].length - mirror : mirror, vertical }
    : null
}

function getMirror(block: string[]) {
  return getAxisMirror(block) ?? getAxisMirror(rotateBlock(block), true)
}

export async function main(extended = false) {
  const blocks = await readInput(import.meta.url, '\n\n')

  const mirrors = blocks.flatMap(block => getMirror(block.split('\n')))

  const sum = sumBy(mirrors, mirror =>
    mirror ? (mirror.vertical ? 100 : 1) * mirror.position : 0
  )

  console.log(sum)
}

main()
