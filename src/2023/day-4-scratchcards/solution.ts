import { readInput, sumBy } from '../../utils.js'

function getNumbers(line: string) {
  const parseNumbers = (index: 0 | 1) =>
    line
      .replaceAll('  ', ' ')
      .trim()
      .split(':')[1]
      // eslint-disable-next-line prettier/prettier
      .split('|')[index]
      .split(' ')
      .map(Number)
  const winning = parseNumbers(0)
  const received = parseNumbers(1)
  return { winning, received }
}

function getResult({
  winning,
  received,
}: {
  winning: number[]
  received: number[]
}) {
  return received.reduce(
    (result, number) =>
      winning.includes(number) ? (result === 0 ? 1 : result * 2) : result,
    0
  )
}

function getMatchingAmount({
  winning,
  received,
}: {
  winning: number[]
  received: number[]
}) {
  return received.reduce(
    (result, number) => (winning.includes(number) ? result + 1 : result),
    0
  )
}

function getCardCopies(
  cards: { winning: number[]; received: number[] }[],
  cardNumber: number
) {
  const copies = []
  const matches = getMatchingAmount(cards[cardNumber - 1])
  if (matches) {
    for (let i = 1; i < matches; ++i) {
      copies.push(cardNumber + i)
    }
  }
  return copies
}

export async function calculateScratchcards(extended = false) {
  const input = await readInput(import.meta.url)

  console.log('===================')
  console.log('Scratching cards...')
  console.log('===================')
  console.log(
    `
                         _____
                 _____  |15 WW|          
         _____  |99 ww| | ^ {)|                 
  _____ |8  ww| | ^ {(| |(.)%%| _____
 |10 ^ || ^ {)| |(.)%%| | |%%%||32 . |
 |^ ^ ^||(.)% | | |%%%| |_____|| /.\\ |
 |^ ^ ^|| | % | |____C|        |(_._)|
 |^ ^ ^||_____|                |  |  |
 |____C|                       |____C|
`
  )
  if (extended) {
    const cards = []
    for (const line of input) {
      cards.push(getNumbers(line))
    }
    const received = new Array(cards.length).fill(0).map((_, i) => i + 1)
    for (const cardNumber of received) {
      received.push(...getCardCopies(cards, cardNumber))
    }
    console.log('===================')
    console.log('Last Card Scratched')
    console.log('===================')
    console.log()
    console.log(`Number of scratched cards is ${received.length}`)
  } else {
    console.log('====================')
    console.log('Calculating Prize...')
    console.log('====================')
    const sum = sumBy(input, (line: string) => getResult(getNumbers(line)))
    console.log('Prize Calculated')
    console.log('====================')
    console.log()
    console.log(
      `Prize is ${sum}\n- Maybe check the back side of cards before letting Elf know...`
    )
  }
}
