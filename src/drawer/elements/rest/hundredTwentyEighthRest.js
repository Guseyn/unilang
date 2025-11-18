'use strict'

import path from '#unilang/drawer/elements/basic/path.js'
import ellipse from '#unilang/drawer/elements/basic/ellipse.js'
import group from '#unilang/drawer/elements/basic/group.js'

export default function (restPositionNumber) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, hundredTwentyEighthRest, fontColor, backgroundColor } = styles
    const restBody = group(
      'rest',
      [
        ellipse(
          hundredTwentyEighthRest.outlineRadiusX,
          hundredTwentyEighthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + hundredTwentyEighthRest.outlineLeftOffset1,
          topOffset + restPositionNumber * intervalBetweenStaveLines + hundredTwentyEighthRest.outlineTopOffset1
        ),
        ellipse(
          hundredTwentyEighthRest.outlineRadiusX,
          hundredTwentyEighthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + hundredTwentyEighthRest.outlineLeftOffset2,
          topOffset + restPositionNumber * intervalBetweenStaveLines + hundredTwentyEighthRest.outlineTopOffset2
        ),
        ellipse(
          hundredTwentyEighthRest.outlineRadiusX,
          hundredTwentyEighthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + hundredTwentyEighthRest.outlineLeftOffset3,
          topOffset + restPositionNumber * intervalBetweenStaveLines + hundredTwentyEighthRest.outlineTopOffset3
        ),
        ellipse(
          hundredTwentyEighthRest.outlineRadiusX,
          hundredTwentyEighthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + hundredTwentyEighthRest.outlineLeftOffset4,
          topOffset + restPositionNumber * intervalBetweenStaveLines + hundredTwentyEighthRest.outlineTopOffset4
        ),
        ellipse(
          hundredTwentyEighthRest.outlineRadiusX,
          hundredTwentyEighthRest.outlineRadiusY,
          null,
          backgroundColor,
          0,
          leftOffset + hundredTwentyEighthRest.outlineLeftOffset5,
          topOffset + restPositionNumber * intervalBetweenStaveLines + hundredTwentyEighthRest.outlineTopOffset5
        ),
        path(
          hundredTwentyEighthRest.points,
          null,
          fontColor,
          leftOffset,
          topOffset + restPositionNumber * intervalBetweenStaveLines + hundredTwentyEighthRest.yCorrection
        )
      ]
    )
    return restBody
  }
}
