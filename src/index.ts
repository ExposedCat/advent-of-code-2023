import * as readline from 'readline'
import { trebuchetCalibration } from './2023/day-1-trebuchet/solution.js'
import { possibleGames } from './2023/day-2-cube-conundrum/solution.js'

console.log('===========================')
console.log("ExposedCat's Advent of Code")
console.log('===========================')
console.log()

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const solutions = `- Day 1: Trebuchet?! (tasks 1, 2)
- Day 2: Cube Conundrum (tasks 1, 2)`
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
    default: {
      console.log('This solution is not done by ExposedCat yet..')
    }
  }
  reader.close()
})
