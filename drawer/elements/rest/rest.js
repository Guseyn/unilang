'use strict'

const rests = {
  '4': require('./quadrupleWholeRest'),
  '2': require('./doubleWholeRest'),
  '1': require('./wholeRest'),
  '0.5': require('./halfRest'),
  '0.25': require('./quarterRest'),
  '0.125': require('./eighthRest'),
  '0.0625': require('./sixteenthRest'),
  '0.03125': require('./thirtySecondRest'),
  '0.015625': require('./sixtyFourthRest'),
  '0.0078125': require('./hundredTwentyEighthRest'),
  '0.00390625': require('./twoHundredFiftySixthRest')
}

module.exports = (duration, restPositionNumber) => {
  return rests[`${duration}`](restPositionNumber)
}
