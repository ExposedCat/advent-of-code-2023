import { readInput, sumBy } from '../../utils.js'

function rotateBlock(block: string[]) {
  return block[0].split('').map((_, i) =>
    block
      .map(row => row[i])
      .reverse()
      .join('')
  )
}

function gridsEqual(left: string[], right: string[], error = 0) {
  let differences = 0
  for (let y = 0; y < left.length; ++y) {
    const max = left[y].length
    for (let x = 0; x < max; ++x) {
      if (left[y][x] !== right[y][max - 1 - x]) {
        differences += 1
        if (differences > error) {
          return false
        }
      }
    }
  }
  return differences === error
}

function sliceBlock(block: string[], offset: number, side: string) {
  const offsetLeft = side === 'right' ? offset : 0
  const offsetRight = side === 'left' ? offset : 0
  const center =
    Math.floor((block[0].length - offsetLeft - offsetRight) / 2) + offsetLeft
  const left = block.map(line => line.slice(offsetLeft, center))
  const right = block.map(line => line.slice(center, line.length - offsetRight))
  return [left, right]
}

function getAxisMirrorValue(block: string[], error: number) {
  for (let offset = 0; offset < block[0].length - 1; ++offset) {
    for (const side of ['left', 'right']) {
      const [left, right] = sliceBlock(block, offset, side)
      if (
        left[0].length === right[0].length &&
        gridsEqual(left, right, error)
      ) {
        const onTheLeft =
          side === 'left' ? left[0].length : block[0].length - right[0].length
        return onTheLeft
      }
    }
  }
  return null
}

function getMirror(block: string[], error: number) {
  let value = getAxisMirrorValue(block, error)
  if (value) {
    return { value, vertical: false }
  } else {
    value = getAxisMirrorValue(rotateBlock(block), error)
    return { value: value ?? 0, vertical: true }
  }
}

export async function incidencePoint(extended = false) {
  const error = extended ? 1 : 0
  const data = await readInput(import.meta.url, '\n\n')
  const blocks = data.map(item => item.split('\n'))
  for (const block of blocks) {
    console.log(block.join('\n'), getMirror(block, error))
  }
  const sum = sumBy(blocks, block => {
    const mirror = getMirror(block, error)
    if (!mirror.vertical) {
      return mirror.value
    }
    return (block.length - mirror.value) * 100
  })
  console.log('Sum = ', sum)
}
