'use strict'

import quadrupleWholeRest from '#unilang/drawer/elements/rest/quadrupleWholeRest.js'
import doubleWholeRest from '#unilang/drawer/elements/rest/doubleWholeRest.js'
import wholeRest from '#unilang/drawer/elements/rest/wholeRest.js'
import halfRest from '#unilang/drawer/elements/rest/halfRest.js'
import quarterRest from '#unilang/drawer/elements/rest/quarterRest.js'
import eighthRest from '#unilang/drawer/elements/rest/eighthRest.js'
import sixteenthRest from '#unilang/drawer/elements/rest/sixteenthRest.js'
import thirtySecondRest from '#unilang/drawer/elements/rest/thirtySecondRest.js'
import sixtyFourthRest from '#unilang/drawer/elements/rest/sixtyFourthRest.js'
import hundredTwentyEighthRest from '#unilang/drawer/elements/rest/hundredTwentyEighthRest.js'
import twoHundredFiftySixthRest from '#unilang/drawer/elements/rest/twoHundredFiftySixthRest.js'

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
