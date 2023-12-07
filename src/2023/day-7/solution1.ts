import { readInput } from '../../utils.js'

const CARDS = ['T', 'J', 'Q', 'K', 'A']

const getCard = (card: number) => (card < 8 ? card : CARDS[card - 10])

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
  const cards: Record<string, [number, number]> = {}
  for (const card of hand) {
    const value = CARDS.indexOf(card)
    cards[card] ??= [value !== -1 ? value + 10 : Number(card), 0]
    cards[card][1] += 1
  }
  const tiers = new Array(5).fill(0)
  for (const [_, value] of Object.values(cards)) {
    tiers[value - 1] += 1
  }
  return {
    cards: hand.split('').map(card => {
      const value = CARDS.indexOf(card)
      return value !== -1 ? value + 10 : Number(card)
    }),
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
        console.log(getCard(left.cards[i]), '?', getCard(right.cards[i]))
        if (left.cards[i] === right.cards[i]) {
          continue
        } else {
          console.log('Result> ', left.cards[i] - right.cards[i])
          return left.cards[i] - right.cards[i]
        }
      }
      return 0
    })
  console.log(hands)
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
      console.log(
        `${hand.cards.map(card => getCard(card)).join('')} - ${hand.bid} * ${
          position + 1
        }`
      )
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
