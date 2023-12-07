import { readInput } from '../../utils.js'

const values: Record<string, number> = {
  A: 13,
  K: 12,
  Q: 11,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
  J: 1,
}

function compareHands(left: number[], right: number[]) {
  for (let i = 4; i >= 0; --i) {
    if (left[i] !== right[i]) {
      return left[i] - right[i]
    }
  }
  return 0
}

function parseHand(line: string) {
  const [hand, bid] = line.split(' ')
  const jokers = hand.split('J').length - 1
  if (jokers === 5) {
    return {
      cards: [1, 1, 1, 1, 1],
      tiers: [0, 0, 0, 0, 1],
      bid: Number(bid),
    }
  }
  const newHand = hand.replaceAll('J', '')

  const cards: Record<string, number> = {}
  for (const card of newHand) {
    cards[card] ??= 0
    cards[card] += 1
  }

  const [maxCard] = Object.entries(cards).reduce(
    ([maxCard, maxTimes], [card, times]) =>
      times > maxTimes ? [card, times] : [maxCard, maxTimes],
    ['', -1]
  )

  cards[maxCard] += jokers

  const tiers = new Array(5).fill(0)
  for (const value of Object.values(cards)) {
    tiers[value - 1] += 1
  }

  // tiers[max - 1] += jokers
  if (jokers) {
    console.log(hand, cards)
  }

  return {
    cards: hand.split('').map(card => values[card]),
    tiers,
    bid: Number(bid),
  }
}

export async function camelPoker(extended = false) {
  const input = await readInput(import.meta.url)
  const hands = input
    .split('\n')
    .map(parseHand)
    .sort((left, right) => {
      if (compareHands(left.tiers, right.tiers)) {
        return compareHands(left.tiers, right.tiers)
      }
      for (let i = 0; i < 5; ++i) {
        if (left.cards[i] === right.cards[i]) {
          continue
        } else {
          // console.log('Result> ', left.cards[i] - right.cards[i])
          return left.cards[i] - right.cards[i]
        }
      }
      return 0
    })
  // console.log(hands)
  //   console.log('===========================')
  //   console.log('Calculating Error Margin...')
  //   console.log('===========================')
  //   console.log()
  //   console.log(`
  //    __            |\\
  // __/__\\___________| \\_
  // |   ___    |  ,|   ___\`-.
  // |  /   \\   |___/  /   \\  \`-.
  // |_| (O) |________| (O) |____|
  //    \\___/          \\___/`)
  // TODO: Sort
  console.log(
    hands.reduce((total, hand, position) => {
      return total + hand.bid * (position + 1)
    }, 0)
  )
  // console.log()
  // console.log('===========================')
  // console.log('      Ready to Race!')
  // console.log('===========================')
  // console.log(`Your margin of error is ${hands}`)
  // console.log()
}

camelPoker()
