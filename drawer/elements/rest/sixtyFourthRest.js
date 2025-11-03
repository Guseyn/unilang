'use strict'

import path from './../basic/path.js'
import ellipse from './../basic/ellipse.js'
import group from './../basic/group.js'

export default function (restPositionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, sixtyFourthRest, fontColor, backgroundColor } = styles
    const restBody = group(
      'rest',
      [
        ellipse(
          sixtyFourthRest.outlineRadiusX,
          sixtyFourthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + sixtyFourthRest.outlineLeftOffset1,
          topOffset + restPositionNumber * intervalBetweenStaveLines + sixtyFourthRest.outlineTopOffset1
        ),
        ellipse(
          sixtyFourthRest.outlineRadiusX,
          sixtyFourthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + sixtyFourthRest.outlineLeftOffset2,
          topOffset + restPositionNumber * intervalBetweenStaveLines + sixtyFourthRest.outlineTopOffset2
        ),
        ellipse(
          sixtyFourthRest.outlineRadiusX,
          sixtyFourthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + sixtyFourthRest.outlineLeftOffset3,
          topOffset + restPositionNumber * intervalBetweenStaveLines + sixtyFourthRest.outlineTopOffset3
        ),
        ellipse(
          sixtyFourthRest.outlineRadiusX,
          sixtyFourthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + sixtyFourthRest.outlineLeftOffset4,
          topOffset + restPositionNumber * intervalBetweenStaveLines + sixtyFourthRest.outlineTopOffset4
        ),
        path(
          sixtyFourthRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + restPositionNumber * intervalBetweenStaveLines + sixtyFourthRest.yCorrection
        )
      ]
    )
    return restBody
  }
}
