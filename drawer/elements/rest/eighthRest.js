'use strict'

const path = require('./../basic/path')
const ellipse = require('./../basic/ellipse')
const group = require('./../basic/group')

module.exports = (restPositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, eighthRest, fontColor, backgroundColor } = styles
    const restBody = group(
      'rest',
      [
        ellipse(
          eighthRest.outlineRadiusX,
          eighthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + eighthRest.outlineLeftOffset,
          topOffset + restPositionNumber * intervalBetweenStaveLines + eighthRest.outlineTopOffset
        ),
        path(
          eighthRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + restPositionNumber * intervalBetweenStaveLines + eighthRest.yCorrection
        )
      ]
    )
    return restBody
  }
}
