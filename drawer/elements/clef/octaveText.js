'use strict'

const text = require('./../basic/text')
const group = require('./../basic/group')

module.exports = (octaveNumber, direction) => {
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
