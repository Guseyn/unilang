'use strict'

import quadrupleWholeRest from '#repertoire/drawer/elements/rest/quadrupleWholeRest.js'
import doubleWholeRest from '#repertoire/drawer/elements/rest/doubleWholeRest.js'
import wholeRest from '#repertoire/drawer/elements/rest/wholeRest.js'
import halfRest from '#repertoire/drawer/elements/rest/halfRest.js'
import quarterRest from '#repertoire/drawer/elements/rest/quarterRest.js'
import eighthRest from '#repertoire/drawer/elements/rest/eighthRest.js'
import sixteenthRest from '#repertoire/drawer/elements/rest/sixteenthRest.js'
import thirtySecondRest from '#repertoire/drawer/elements/rest/thirtySecondRest.js'
import sixtyFourthRest from '#repertoire/drawer/elements/rest/sixtyFourthRest.js'
import hundredTwentyEighthRest from '#repertoire/drawer/elements/rest/hundredTwentyEighthRest.js'
import twoHundredFiftySixthRest from '#repertoire/drawer/elements/rest/twoHundredFiftySixthRest.js'

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
