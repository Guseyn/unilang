'use strict'

import path from '/js/unilang-worker/drawer/elements/basic/path.js'
import group from '/js/unilang-worker/drawer/elements/basic/group.js'

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
