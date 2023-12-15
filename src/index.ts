import * as readline from 'readline'
import { trebuchetCalibration } from './2023/day-1-trebuchet/solution.js'
import { possibleGames } from './2023/day-2-cube-conundrum/solution.js'
import { missingParts } from './2023/day-3-gear-ratios/solution.js'
import { calculateScratchcards } from './2023/day-4-scratchcards/solution.js'
import { lowestSeedRangeLocation } from './2023/day-5-if-you-give-a-seed-fertilizer/solution2.js'
import { lowestSeedListLocation } from './2023/day-5-if-you-give-a-seed-fertilizer/solution1.js'
import { winningPossibilities } from './2023/day-6-wait-for-it/solution.js'
import { ghostDirections } from './2023/day-8-haunted-wasteland/solution.js'
import { camelPoker } from './2023/day-7-camel-cards/solution.js'
import { oasisReport } from './2023/day-9-mirage-maintenance/solution.js'
import { oasisReport as day101 } from './2023/day-10/solution.js'
import { oasisReport as day102 } from './2023/day-10/solution2.js'
import { cosmicExpansion } from './2023/day-11-cosmic-expansion/solution.js'
import { lensLibrary } from './2023/day-15/solution.js'
import { reflectorDish } from './2023/day-14/solution.js'

console.log('===========================')
console.log("ExposedCat's Advent of Code")
console.log('===========================')
console.log()

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const solutions = `- Day 1: Trebuchet?! (tasks 1, 2)
- Day 2: Cube Conundrum (tasks 1, 2)
- Day 3: Gear Ratios (tasks 1, 2)
- Day 4: Scratchcards (tasks 1, 2)
- Day 5: If You Give A Seed A Fertilizer (tasks 1, 2)
- Day 6: Wait For It (tasks 1, 2)
- Day 7: Camel Cards (tasks 1, 2)
- Day 8: Haunted Wasteland (tasks 1, 2)
- Day 9: Mirage Maintenance (tasks 1, 2)
- Day 10: [WIP] Pipe Maze (tasks 1, 2)
- Day 11: Cosmic Expansion (tasks 1, 2)
- Day 12: Hot Springs (tasks 1, 2)
- Day 13: Point of Incidence (tasks 1, 2)
- Day 14: Parabolic Reflector Dish (tasks 1, 2)
- Day 15: Lens Library (tasks 1, 2)`
const question = 'Enter a problem in the format `day.task` = '

reader.question(`${solutions}\n\n${question}`, answer => {
  const [day, task] = answer.split('.')
  console.clear()
  switch (day) {
    case '1': {
      trebuchetCalibration(task === '2')
      break
    }
    case '2': {
      possibleGames(task === '2')
      break
    }
    case '3': {
      missingParts(task === '2')
      break
    }
    case '4': {
      calculateScratchcards(task === '2')
      break
    }
    case '5': {
      if (task === '2') {
        lowestSeedRangeLocation()
      } else {
        lowestSeedListLocation()
      }
      break
    }
    case '6': {
      winningPossibilities(task === '2')
      break
    }
    case '7': {
      camelPoker(task === '2')
      break
    }
    case '8': {
      ghostDirections(task === '2')
      break
    }
    case '9': {
      oasisReport(task === '2')
      break
    }
    case '10': {
      if (task === '2') {
        day102()
      } else {
        day101()
      }
      break
    }
    case '11': {
      cosmicExpansion(task === '2')
      break
    }
    case '12': {
      console.log('This solution is not done by ExposedCat yet..')
      break
    }
    case '13': {
      console.log('This solution is not done by ExposedCat yet..')
      break
    }
    case '14': {
      reflectorDish(task === '2')
      break
    }
    case '15': {
      lensLibrary(task === '2')
      break
    }
    default: {
      console.log('This solution is not done by ExposedCat yet..')
    }
  }
  reader.close()
})
