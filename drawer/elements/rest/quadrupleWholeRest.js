'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')

module.exports = (restPositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, quadrupleWholeRest } = styles
    return group(
      'rest',
      [
        path(
          quadrupleWholeRest.points,
          null,
          true,
          leftOffset,
          topOffset + Math.floor(restPositionNumber) * intervalBetweenStaveLines + quadrupleWholeRest.yCorrection
        )
      ]
    )
  }
}
