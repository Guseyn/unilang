'use strict'

import path from './../basic/path.js'
import ellipse from './../basic/ellipse.js'
import group from './../basic/group.js'

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
