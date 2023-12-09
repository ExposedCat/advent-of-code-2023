import { readInput, sumBy } from '../../utils.js'

function extractColor(pack: string, color: 'red' | 'green' | 'blue') {
  const data = pack.match(new RegExp(`(\\d+) ${color}`))
  if (!data || !data[1]) {
    return 0
  }
  return Number(data[1])
}

function getGameIdValue(line: string) {
  const id = Number(line.split(' ')[1].split(':')[0])
  for (const pack of line.split(';')) {
    const red = extractColor(pack, 'red')
    const green = extractColor(pack, 'green')
    const blue = extractColor(pack, 'blue')
    if (red > 12 || green > 13 || blue > 14) {
      return 0
    }
  }
  return id
}

function getGameCubesValue(line: string) {
  let minRed = 0
  let minGreen = 0
  let minBlue = 0
  for (const pack of line.split(';')) {
    const red = extractColor(pack, 'red')
    minRed = red > minRed ? red : minRed
    const green = extractColor(pack, 'green')
    minGreen = green > minGreen ? green : minGreen
    const blue = extractColor(pack, 'blue')
    minBlue = blue > minBlue ? blue : minBlue
  }
  return minRed * minGreen * minBlue
}

export async function possibleGames(extended = false) {
  const input = await readInput(import.meta.url)

  console.log('===============================')
  console.log('Resolving Cube Possibilities...')
  console.log('===============================')
  console.log(`   +--------+
  /        /|
 /        / |
+--------+  |   +----+
|        |  |  /    /|
|        |  + +----+ |
|        | /  |    | +
|        |/   |    |/
+--------+    +----+`)
  console.log()

  const sum = sumBy(input, (line: string) =>
    (extended ? getGameCubesValue : getGameIdValue)(line)
  )

  console.log('===========================')
  console.log('Cube Possibilities Resolved')
  console.log('===========================')
  console.log()
  console.log(`Game values sum is ${sum}`)
}
