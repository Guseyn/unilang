'use strict'

import quadrupleWholeRest from './quadrupleWholeRest.js'
import doubleWholeRest from './doubleWholeRest.js'
import wholeRest from './wholeRest.js'
import halfRest from './halfRest.js'
import quarterRest from './quarterRest.js'
import eighthRest from './eighthRest.js'
import sixteenthRest from './sixteenthRest.js'
import thirtySecondRest from './thirtySecondRest.js'
import sixtyFourthRest from './sixtyFourthRest.js'
import hundredTwentyEighthRest from './hundredTwentyEighthRest.js'
import twoHundredFiftySixthRest from './twoHundredFiftySixthRest.js'

const rests = {
  '4': quadrupleWholeRest,
  '2': doubleWholeRest,
  '1': wholeRest,
  '0.5': halfRest,
  '0.25': quarterRest,
  '0.125': eighthRest,
  '0.0625': sixteenthRest,
  '0.03125': thirtySecondRest,
  '0.015625': sixtyFourthRest,
  '0.0078125': hundredTwentyEighthRest,
  '0.00390625': twoHundredFiftySixthRest
}

export default function (duration, restPositionNumber) {
  return rests[`${duration}`](restPositionNumber)
}
