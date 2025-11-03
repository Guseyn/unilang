'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'

export default function (restPositionNumber) {
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
