import { setTimeout } from 'timers/promises'
import { readInput, sumBy } from '../../utils.js'

type Part<T extends number | RangingValue = number> = {
  x: T
  m: T
  a: T
  s: T
}

type Rule<T extends number | RangingValue = number> = {
  property: keyof Part<T>
  operation: '?' | '<' | '>'
  value: number
  next: string
}

type Workflows<T extends number | RangingValue = number> = Record<
  string,
  Rule<T>[]
>

function parseRules(input: string): Rule[] {
  return input.split(',').map(ruleInput => {
    const [rule, next] = ruleInput.split(':')
    if (!next) {
      return {
        property: 'x',
        operation: '?',
        value: 0,
        next: rule,
      }
    }
    return {
      property: rule[0] as Rule['property'],
      operation: rule[1] as Rule['operation'],
      value: Number(rule.slice(2)),
      next: next,
    }
  })
}

function parseWorkflows(input: string): Workflows {
  const map = input.split('\n').map(line => {
    const [name, rules] = line.split('{')
    return [name, parseRules(rules.slice(0, -1))]
  })
  return Object.fromEntries(map)
}

function parseParts(input: string) {
  return input.split('\n').map(line => {
    const [x, m, a, s] = line.split(',')
    return {
      x: Number(x.split('=')[1]),
      m: Number(m.split('=')[1]),
      a: Number(a.split('=')[1]),
      s: Number(s.slice(0, -1).split('=')[1]),
    } as Part
  })
}

function getNextWorkflow(part: Part<number>, rules: Rule[]) {
  for (const rule of rules) {
    if (rule.operation === '?') {
      return rule.next
    }
    if (
      (rule.operation === '<' && part[rule.property] < rule.value) ||
      (rule.operation === '>' && part[rule.property] > rule.value)
    ) {
      return rule.next
    }
  }
  return 'R'
}

function getPartValue(part: Part, workflows: Workflows): number {
  let workflow = 'in'
  while (workflow !== 'A' && workflow !== 'R') {
    workflow = getNextWorkflow(part, workflows[workflow])
  }
  if (workflow === 'A') {
    return part.x + part.m + part.a + part.s
  }
  return 0
}

class RangingValue {
  constructor(
    private start: number,
    private end: number
  ) {}

  compare(value: number, operation: '<' | '>') {
    if (this.start > value || this.end < value) {
      return { match: this, rest: new RangingValue(0, 0) }
    }
    if (operation === '<') {
      return {
        match: new RangingValue(this.start, value - 1),
        rest: new RangingValue(value, this.end),
      }
    } else {
      return {
        match: new RangingValue(value + 1, this.end),
        rest: new RangingValue(this.start, value),
      }
    }
  }

  get length(): number {
    return this.end - this.start + 1
  }
}

function getCombinations(
  part: Part<RangingValue>,
  workflow: string,
  workflows: Workflows<RangingValue>
): number {
  let total = 0

  if (workflow === 'A') {
    // console.log(
    //   'A',
    //   part.x.length * part.m.length * part.a.length * part.s.length,
    //   total
    // )
    return part.x.length * part.m.length * part.a.length * part.s.length
  }

  if (workflow === 'R') {
    // console.log('R')
    return 0
  }

  for (const rule of workflows[workflow]) {
    if (rule.operation === '?') {
      total += getCombinations(part, rule.next, workflows)
    } else {
      const { match, rest } = part[rule.property].compare(
        rule.value,
        rule.operation
      )
      part[rule.property] = rest

      // console.log('Adding match', match, total)
      total += getCombinations(
        { ...part, [rule.property]: match },
        rule.next,
        workflows
      )
      // console.log('..done', total)
    }
  }

  return total
}

export async function main(extended = false) {
  const [workflowLines, partLines] = await readInput(import.meta.url, '\n\n')
  const workflows = parseWorkflows(workflowLines)
  const parts = parseParts(partLines)

  if (!extended) {
    const sum = sumBy(parts, part => getPartValue(part, workflows))
    console.log(sum)
  } else {
    const combinations = getCombinations(
      {
        x: new RangingValue(1, 4000),
        m: new RangingValue(1, 4000),
        a: new RangingValue(1, 4000),
        s: new RangingValue(1, 4000),
      },
      'in',
      workflows
    )
    console.log('Combinations =', combinations)
  }
}
