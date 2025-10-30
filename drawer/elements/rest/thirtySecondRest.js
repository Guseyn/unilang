'use strict'

const path = require('./../basic/path')
const ellipse = require('./../basic/ellipse')
const group = require('./../basic/group')

module.exports = (restPositionNumber) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, thirtySecondRest, fontColor, backgroundColor } = styles
    const restBody = group(
      'rest',
      [
        ellipse(
          thirtySecondRest.outlineRadiusX,
          thirtySecondRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + thirtySecondRest.outlineLeftOffset1,
          topOffset + restPositionNumber * intervalBetweenStaveLines + thirtySecondRest.outlineTopOffset1
        ),
        ellipse(
          thirtySecondRest.outlineRadiusX,
          thirtySecondRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + thirtySecondRest.outlineLeftOffset2,
          topOffset + restPositionNumber * intervalBetweenStaveLines + thirtySecondRest.outlineTopOffset2
        ),
        ellipse(
          thirtySecondRest.outlineRadiusX,
          thirtySecondRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + thirtySecondRest.outlineLeftOffset3,
          topOffset + restPositionNumber * intervalBetweenStaveLines + thirtySecondRest.outlineTopOffset3
        ),
        path(
          thirtySecondRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + restPositionNumber * intervalBetweenStaveLines + thirtySecondRest.yCorrection
        )
      ]
    )
    return restBody
  }
}
