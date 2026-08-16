'use strict'

import path from '#unilang/drawer/elements/basic/path.js'
import ellipse from '#unilang/drawer/elements/basic/ellipse.js'
import group from '#unilang/drawer/elements/basic/group.js'

export default function (restPositionNumber) {
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
