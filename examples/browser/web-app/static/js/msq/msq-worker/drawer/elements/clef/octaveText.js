'use strict'

import text from '/js/msq/msq-worker/drawer/elements/basic/text.js'
import group from '/js/msq/msq-worker/drawer/elements/basic/group.js'

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
