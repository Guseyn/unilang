'use strict'

import path from '/js/unilang-in-worker-environment/drawer/elements/basic/path.js'
import ellipse from '/js/unilang-in-worker-environment/drawer/elements/basic/ellipse.js'
import group from '/js/unilang-in-worker-environment/drawer/elements/basic/group.js'

export default function (restPositionNumber) {
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
