'use strict'

import path from './../basic/path.js'
import ellipse from './../basic/ellipse.js'
import group from './../basic/group.js'

export default function (restPositionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, twoHundredFiftySixthRest, fontColor, backgroundColor } = styles
    const restBody = group(
      'rest',
      [
        ellipse(
          twoHundredFiftySixthRest.outlineRadiusX,
          twoHundredFiftySixthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + twoHundredFiftySixthRest.outlineLeftOffset1,
          topOffset + restPositionNumber * intervalBetweenStaveLines + twoHundredFiftySixthRest.outlineTopOffset1
        ),
        ellipse(
          twoHundredFiftySixthRest.outlineRadiusX,
          twoHundredFiftySixthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + twoHundredFiftySixthRest.outlineLeftOffset2,
          topOffset + restPositionNumber * intervalBetweenStaveLines + twoHundredFiftySixthRest.outlineTopOffset2
        ),
        ellipse(
          twoHundredFiftySixthRest.outlineRadiusX,
          twoHundredFiftySixthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + twoHundredFiftySixthRest.outlineLeftOffset3,
          topOffset + restPositionNumber * intervalBetweenStaveLines + twoHundredFiftySixthRest.outlineTopOffset3
        ),
        ellipse(
          twoHundredFiftySixthRest.outlineRadiusX,
          twoHundredFiftySixthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + twoHundredFiftySixthRest.outlineLeftOffset4,
          topOffset + restPositionNumber * intervalBetweenStaveLines + twoHundredFiftySixthRest.outlineTopOffset4
        ),
        ellipse(
          twoHundredFiftySixthRest.outlineRadiusX,
          twoHundredFiftySixthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + twoHundredFiftySixthRest.outlineLeftOffset5,
          topOffset + restPositionNumber * intervalBetweenStaveLines + twoHundredFiftySixthRest.outlineTopOffset5
        ),
        ellipse(
          twoHundredFiftySixthRest.outlineRadiusX,
          twoHundredFiftySixthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + twoHundredFiftySixthRest.outlineLeftOffset6,
          topOffset + restPositionNumber * intervalBetweenStaveLines + twoHundredFiftySixthRest.outlineTopOffset6
        ),
        path(
          twoHundredFiftySixthRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + restPositionNumber * intervalBetweenStaveLines + twoHundredFiftySixthRest.yCorrection
        )
      ]
    )
    return restBody
  }
}
