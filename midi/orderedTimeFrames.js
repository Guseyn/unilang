'use strict'

module.exports = (somethingSplittedInTimeFrames) => {
  return Object.keys(somethingSplittedInTimeFrames).map(time => time * 1).sort((firstValue, secondValue) => firstValue - secondValue)
}
