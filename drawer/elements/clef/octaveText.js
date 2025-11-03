'use strict'

import text from './../basic/text.js'
import group from './../basic/group.js'

export default function (octaveNumber, direction) {
  return (styles, leftOffset, topOffset) => {
    const { octaveTextFontOptions, leftOffsetMarginForOctaveText, topOffsetMarginForDownOctaveText, topOffsetMarginForUpOctaveText } = styles
    return group(
      'octaveText',
      [
        text(
          octaveNumber + '',
          octaveTextFontOptions
        )(
          styles,
          leftOffset + leftOffsetMarginForOctaveText,
          topOffset +
          (
            direction === 'down'
              ? topOffsetMarginForDownOctaveText
              : topOffsetMarginForUpOctaveText
          )
        )
      ]
    )
  }
}
