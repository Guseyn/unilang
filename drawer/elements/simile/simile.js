'use strict'

import path from '#unilang/drawer/elements/basic/path.js'
import group from '#unilang/drawer/elements/basic/group.js'
import moveElement from '#unilang/drawer/elements/basic/moveElement.js'

export default function (numberOfSimileStrokes, simileYCorrection) {
  return (styles, leftOffset, topOffset) => {
    const drawnElements = []
    const { intervalBetweenStaveLines, fontColor, singleMixedSimile, mixedSimile, simile, xDistanceBetweenSimileStrokes } = styles
    if (numberOfSimileStrokes === 'single-mixed') {
      const drawnSimile = group(
        'singleMixedSimile',
        [
          path(
            singleMixedSimile.points,
            null,
            fontColor,
            leftOffset,
            topOffset + 1 * intervalBetweenStaveLines + singleMixedSimile.yCorrection
          )
        ]
      )
      drawnElements.push(drawnSimile)
    } else if (numberOfSimileStrokes === 'mixed') {
      const drawnSimile = group(
        'mixedSimile',
        [
          path(
            mixedSimile.points,
            null,
            fontColor,
            leftOffset,
            topOffset + 1 * intervalBetweenStaveLines + mixedSimile.yCorrection
          )
        ]
      )
      drawnElements.push(drawnSimile)
    } else {
      let currentLeftOffset = leftOffset
      const drawnStrokes = []
      let strokeWidth
      for (let index = 0; index < numberOfSimileStrokes; index++) {
        let currentStroke = path(
          simile.points,
          null,
          fontColor,
          currentLeftOffset + (index === 0 ? 0 : xDistanceBetweenSimileStrokes),
          topOffset + 1 * intervalBetweenStaveLines + simile.yCorrection
        )
        if (!strokeWidth) {
          strokeWidth = currentStroke.right - currentStroke.left
        }
        currentLeftOffset = currentStroke.right
        drawnStrokes.push(currentStroke)
      }
      const drawnSimile = group(
        'simileStrokes',
        drawnStrokes
      )
      drawnElements.push(drawnSimile)
    }
    const drawnSimile = group(
      'simile',
      drawnElements
    )
    moveElement(
      drawnSimile,
      0,
      simileYCorrection * intervalBetweenStaveLines
    )
    return drawnSimile
  }
}
