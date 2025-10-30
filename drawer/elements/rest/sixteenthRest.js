'use strict'

const path = require('./../basic/path')
const ellipse = require('./../basic/ellipse')
const group = require('./../basic/group')

module.exports = (restPositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, sixteenthRest, fontColor, backgroundColor } = styles
    const restBody = group(
      'rest',
      [
        ellipse(
          sixteenthRest.outlineRadiusX,
          sixteenthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + sixteenthRest.outlineLeftOffset1,
          topOffset + restPositionNumber * intervalBetweenStaveLines + sixteenthRest.outlineTopOffset1
        ),
        ellipse(
          sixteenthRest.outlineRadiusX,
          sixteenthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + sixteenthRest.outlineLeftOffset2,
          topOffset + restPositionNumber * intervalBetweenStaveLines + sixteenthRest.outlineTopOffset2
        ),
        path(
          sixteenthRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + restPositionNumber * intervalBetweenStaveLines + sixteenthRest.yCorrection
        )
      ]
    )
    return restBody
  }
}
