import { readInput, sumBy } from '../../utils.js'

function hash(input: string) {
  let currentValue = 0
  for (let i = 0; i < input.length; ++i) {
    const ascii = input.charCodeAt(i)
    currentValue += ascii
    currentValue *= 17
    currentValue = currentValue % 256
  }
  return currentValue
}

function parseInstruction(item: string) {
  const value = Number(item[item.length - 1])
  const operation = isNaN(value) ? '-' : '='
  const lens = item.split(operation)[0]
  return {
    value,
    operation,
    lens,
    box: hash(lens),
  }
}

export async function lensLibrary(extended = false) {
  const data = await readInput(import.meta.url, ',')
  if (!extended) {
    const sum = sumBy(data, item => hash(item))
    console.log(`Hashsum is ${sum}`)
  } else {
    const boxes: { lens: string; value: number }[][] = []
    for (const item of data) {
      const { lens, box, operation, value } = parseInstruction(item)
      boxes[box] ??= []
      const position = boxes[box].findIndex(item => item.lens === lens)
      if (operation === '=') {
        if (position === -1) {
          boxes[box].push({ lens, value })
        } else {
          boxes[box][position].value = value
        }
      } else if (position !== -1) {
        boxes[box].splice(position, 1)
      }
    }
    const sum = sumBy(boxes, (box, boxIndex) =>
      sumBy(box, ({ value }, slotIndex) => {
        return (boxIndex + 1) * (slotIndex + 1) * value
      })
    )
    console.log(`Focusing power is ${sum}`)
  }
}
