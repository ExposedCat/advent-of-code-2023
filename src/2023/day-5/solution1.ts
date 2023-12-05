import { readInput } from '../../utils.js'

type Mapping = {
  source: number
  dest: number
  range: number
}

type Cathegories = Record<string, Mapping[]>

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
  seeds: number[]
  cathegories: Cathegories
} {
  const [seedBlock, ...blocks] = input.split('\n\n')
  const seeds = seedBlock.split(': ')[1].split(' ').map(Number)
  const cathegories = blocks.reduce(
    (blocks, block) => {
      const [header, ...body] = block.split('\n')
      const source = header.split('-to-')[1].split(' ')[0]
      return [
        ...blocks,
        [
          source,
          body.map(line => {
            const [first, second, range] = line.split(' ')
            return {
              dest: Number(first),
              source: Number(second),
              range: Number(range),
            }
          }),
        ],
      ]
    },
    [] as (string | Mapping[])[][]
  )
  return { seeds, cathegories: Object.fromEntries(cathegories) }
}

function getSeedLocation(seed: number, cathegories: Cathegories) {
  let value = seed
  for (const cathegory of CATHEGORIES) {
    const mapping = cathegories[cathegory].find(
      cathegory =>
        value >= cathegory.source && value <= cathegory.source + cathegory.range
    )
    if (mapping) {
      value = value - mapping.source + mapping.dest
    }
  }
  return value
}

export async function lowestSeedListLocation() {
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
  const lowestLocation = seeds.reduce(
    (location, seed) => Math.min(location, getSeedLocation(seed, cathegories)),
    Number.MAX_SAFE_INTEGER
  )
  console.log()
  console.log('==============================')
  console.log('     All seed paths found')
  console.log('==============================')
  console.log(`Nearest location is ${lowestLocation}`)
  console.log()
}
