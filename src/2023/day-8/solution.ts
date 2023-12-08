import { readInput } from '../../utils.js'

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

export async function main() {
  const input = await readInput(import.meta.url)

  const { nodes, directions } = parseInput(input)

  let direction = 0
  let steps = 0
  let node = 'AAA'
  while (node !== 'ZZZ') {
    if (direction === directions.length) {
      direction = 0
    }
    node = nodes[node][directions[direction]]
    steps += 1
    direction += 1
  }

  console.log(steps)
}
