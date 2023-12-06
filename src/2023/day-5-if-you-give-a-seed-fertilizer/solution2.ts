import { readInput } from '../../utils.js'

type Cathegories = Record<string, number[][]>

const CATHEGORIES = [
  'soil',
  'fertilizer',
  'water',
  'light',
  'temperature',
  'humidity',
  'location',
] as const

function parseInput(input: string): {
  seeds: number[][]
  cathegories: Cathegories
} {
  const [seedBlock, ...blocks] = input.split('\n\n')
  const seedList = seedBlock.split(': ')[1].split(' ')
  const seeds = []
  for (let i = 0; i < seedList.length; i += 2) {
    seeds.push([
      Number(seedList[i]),
      Number(seedList[i]) + Number(seedList[i + 1]) - 1,
    ])
  }
  const cathegories = blocks.reduce(
    (blocks, block) => {
      const [header, ...body] = block.split('\n')
      const source = header.split('-to-')[1].split(' ')[0]
      return [
        ...blocks,
        [
          source,
          body
            .map(line => {
              const [value, from, number] = line.split(' ')
              return [
                Number(value),
                Number(from),
                Number(from) + Number(number) - 1,
              ]
            })
            .sort((a, b) => a[1] - b[1]),
        ],
      ]
    },
    [] as (string | number[][])[][]
  )
  return { seeds, cathegories: Object.fromEntries(cathegories) }
}

function getSeedRangeLocation(seedRange: number[][], cathegories: Cathegories) {
  let ranges = seedRange
  let newRanges: number[][]
  for (const cathegory of CATHEGORIES) {
    newRanges = []
    for (const range of ranges) {
      newRanges = [...newRanges, ...mapRange(range, cathegories[cathegory])]
    }
    ranges = [...newRanges]
  }
  return ranges
}

function mapRange(range: number[], list: number[][]): number[][] {
  const resultRanges: number[][] = []
  // eslint-disable-next-line prefer-const
  let [from, to] = range
  for (const [value, targetFrom, targetTo] of list) {
    const offset = value - targetFrom
    if (from > to) {
      break
    }
    if (targetFrom > to || targetTo < from) {
      continue
    }

    const newRange = [
      Math.max(targetFrom, from) + offset,
      Math.min(targetTo, to) + offset,
    ]
    resultRanges.push(newRange)

    if (from < targetFrom) {
      resultRanges.push([from, targetTo - 1])
    }

    from = newRange[1] - offset + 1
  }
  if (from <= to) {
    resultRanges.push([from, to])
  }
  return resultRanges
}

export async function lowestSeedRangeLocation() {
  const input = await readInput(import.meta.url)
  const { seeds, cathegories } = parseInput(input)
  console.log('==============================')
  console.log('     Looking for seeds...')
  console.log('==============================')
  console.log()
  console.log(`                        ▓▓    
                    ▓▓▓▓▒▒▓▓  
                ▓▓▓▓▒▒▒▒▒▒▒▒▓▓
      ▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▓▓
    ▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
  ▓▓▒▒▒▒▒▒░░░░██▒▒▒▒▒▒▒▒▒▒▒▒▓▓
▓▓▒▒▒▒▒▒░░░░░░░░██▒▒▒▒▒▒▒▒▓▓  
▓▓▒▒▒▒▒▒██░░░░████▒▒▒▒▒▒▒▒▓▓  
▓▓▒▒▒▒▒▒▒▒██████▒▒▒▒▒▒▒▒▓▓    
▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓    
▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓    
▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓      
  ▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓        
    ▓▓▒▒▒▒▒▒▒▒▒▒▒▒▓▓          
      ▓▓▓▓▓▓▓▓▓▓▓▓            `)

  const locations = getSeedRangeLocation(seeds, cathegories).map(
    location => location[0]
  )
  console.log()
  console.log('==============================')
  console.log('     All seed paths found')
  console.log('==============================')
  console.log(`Nearest location is ${Math.min(...locations)}`)
  console.log()
}
