import { readInput, sumBy } from '../../utils.js'

const values: Record<string, number> = {
  A: 14,
  K: 13,
  Q: 12,
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

type Hand = {
  cards: number[]
  tiers: number[]
  bid: number
}

function parseHand(line: string, jokersBehaviour: '11' | 'cast'): Hand {
  const [hand, bid] = line.split(' ')
  let cleanHand = hand
  let jokers = 0

  if (jokersBehaviour === 'cast') {
    jokers = hand.split('J').length - 1
    if (jokers === 5) {
      return {
        cards: [1, 1, 1, 1, 1],
        tiers: [0, 0, 0, 0, 1],
        bid: Number(bid),
      }
    }
    cleanHand = hand.replaceAll('J', '')
  } else {
    values['J'] = 11
  }

  const max = { card: '', value: -1 }
  const cards: Record<string, number> = {}
  for (const card of cleanHand) {
    cards[card] ??= 0
    cards[card] += 1
    if (cards[card] > max.value) {
      max.card = card
      max.value = cards[card]
    }
  }

  // Jokers become the most repeated card
  cards[max.card] += jokers

  const tiers = new Array(5).fill(0)
  for (const value of Object.values(cards)) {
    tiers[value - 1] += 1
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
    .map(hand => parseHand(hand, extended ? 'cast' : '11'))
    .sort((left, right) => {
      if (compareHands(left.tiers, right.tiers)) {
        return compareHands(left.tiers, right.tiers)
      }
      for (let i = 0; i < 5; ++i) {
        if (left.cards[i] === right.cards[i]) {
          continue
        } else {
          return left.cards[i] - right.cards[i]
        }
      }
      return 0
    })

  const winnings = sumBy(
    hands,
    (hand: Hand, position) => hand.bid * (position + 1)
  )

  console.log(`Winnings are ${winnings}`)
}
