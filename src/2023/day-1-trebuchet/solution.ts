import { readInput } from '../../utils.js'

export async function trebuchetCalibration(extended = false) {
  const input = await readInput(import.meta.url)

  const mappings: [string, number][] = [
    ['1', 1],
    ['2', 2],
    ['3', 3],
    ['4', 4],
    ['5', 5],
    ['6', 6],
    ['7', 7],
    ['8', 8],
    ['9', 9]
  ]
  if (extended) {
    mappings.push(
      ...([
        ['one', 1],
        ['two', 2],
        ['three', 3],
        ['four', 4],
        ['five', 5],
        ['six', 6],
        ['seven', 7],
        ['eight', 8],
        ['nine', 9]
      ] as [string, number][])
    )
  }

  console.log('=================================')
  console.log('Starting Trebuchet calibration...')
  console.log('=================================')

  let calibraionSum = 0
  for (const line of input.split('\n')) {
    const [_, __, first, last] = mappings.reduce(
      (result, mapping) => {
        const firstIndex = line.indexOf(mapping[0])
        const lastIndex = line.lastIndexOf(mapping[0])
        const newFirst = firstIndex < result[0] && firstIndex >= 0
        const newLast = lastIndex > result[1]
        return [
          newFirst ? firstIndex : result[0],
          newLast ? lastIndex : result[1],
          newFirst ? mapping[1] : result[2],
          newLast ? mapping[1] : result[3]
        ]
      },
      [Number.MAX_SAFE_INTEGER, -1, 0, 0]
    )

    process.stdout.write(`${first} ${last} `)
    calibraionSum += first * 10 + last
  }

  console.log()
  console.log('==========================')
  console.log('Trebuchet Calibration done')
  console.log('==========================')
  console.log()
  console.log('----@')
  console.log(`!  /^\\ ${calibraionSum}`)
}
