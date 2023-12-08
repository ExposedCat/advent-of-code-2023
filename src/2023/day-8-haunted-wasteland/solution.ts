import { readInput } from '../../utils.js'

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

const lcm = (a: number, b: number): number => (a * b) / gcd(a, b)

function parseInput(input: string) {
  const [instructions, _, ...data] = input.split('\n')
  console.log()
  const nodes = data.map(node => {
    const [name, directions] = node.split(' = ')
    const [left, right] = directions.slice(1, -1).split(', ')
    return [name, { L: left, R: right }]
  })
  return {
    directions: instructions.split('') as ('L' | 'R')[],
    nodes: Object.fromEntries(nodes) as Record<
      string,
      { L: string; R: string }
    >,
  }
}

export async function ghostDirections(extended = false) {
  const input = await readInput(import.meta.url)

  const { nodes, directions } = parseInput(input)

  const startingNodes = extended
    ? Object.keys(nodes).filter(node => node.endsWith('A'))
    : ['AAA']

  let direction = 0
  let steps = 0
  const found = new Array(startingNodes.length).fill(-1)
  let currentNodes = startingNodes
  let finish = false
  while (!finish && currentNodes.some(node => !node.endsWith('Z'))) {
    if (direction === directions.length) {
      direction = 0
    }
    currentNodes = currentNodes.map(node => nodes[node][directions[direction]])
    for (let i = 0; i < currentNodes.length; ++i) {
      if (currentNodes[i].endsWith('Z')) {
        found[i] = steps + 1
        if (found.every(steps => steps !== -1)) {
          finish = true
          break
        } else {
          console.log(found)
        }
      }
    }
    steps += 1
    direction += 1
  }

  const result = extended
    ? found.reduce((result, number) => lcm(result, number))
    : found[0]

  if (extended) {
    console.log(
      '[W] This solution only work on AoC inputs. Otherwise task 2 has no fast solution'
    )
  }
  console.log(result)
}
