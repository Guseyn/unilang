'use strict'

import octaveSignText from '#unilang/drawer/elements/octave-sign/octaveSignText.js'
import line from '#unilang/drawer/elements/basic/line.js'
import articulationShouldBeAboveOrUnderStemLine from '#unilang/drawer/elements/articulation/articulationShouldBeAboveOrUnderStemLine.js'
import group from '#unilang/drawer/elements/basic/group.js'
import moveElement from '#unilang/drawer/elements/basic/moveElement.js'
import moveElementAbovePointWithInterval from '#unilang/drawer/elements/basic/moveElementAbovePointWithInterval.js'
import moveElementBelowPointWithInterval from '#unilang/drawer/elements/basic/moveElementBelowPointWithInterval.js'
import moveElementInTheCenterBetweenPoints from '#unilang/drawer/elements/basic/moveElementInTheCenterBetweenPoints.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (octaveSignParams, styles) {
  const { intervalBetweenStaveLines, octaveSignYOffset, octaveSignXCorrection, twoOctavesSignXCorrection, octaveSignHorizontalLineStrokeOptions, octaveSignVerticalLineStrokeOptions, octaveSignHorizontalLineLeftOffset, octaveSignHorizontalLineRightOffset } = styles
  const components = []
  const shouldBeAboveOrUnderStemLine = articulationShouldBeAboveOrUnderStemLine(octaveSignParams.leftSingleUnit, octaveSignParams.direction)
  const leftEdge = octaveSignParams.leftSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.left
  const rightEdge = octaveSignParams.leftSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.right
  let drawnOctaveSignText = octaveSignText(octaveSignParams.octaveNumber, octaveSignParams.octavePostfix, octaveSignParams.direction)(styles, 0, octaveSignParams.y)
  const xCorrectionForOctaveSign = {
    '8': octaveSignXCorrection,
    '15': twoOctavesSignXCorrection
  }
  if (shouldBeAboveOrUnderStemLine) {
    moveElementInTheCenterBetweenPoints(
      drawnOctaveSignText,
      octaveSignParams.leftSingleUnit.stemLeft,
      octaveSignParams.leftSingleUnit.stemRight
    )
  } else {
    moveElementInTheCenterBetweenPoints(
      drawnOctaveSignText,
      leftEdge,
      rightEdge
    )
  }
  moveElement(
    drawnOctaveSignText,
    xCorrectionForOctaveSign[octaveSignParams.octaveNumber]
  )
  if (octaveSignParams.direction === 'up') {
    moveElementAbovePointWithInterval(
      drawnOctaveSignText,
      octaveSignParams.y,
      octaveSignYOffset
    )
  } else {
    moveElementBelowPointWithInterval(
      drawnOctaveSignText,
      octaveSignParams.y,
      octaveSignYOffset
    )
  }
  components.push(drawnOctaveSignText)
  const yCenterOfOctaveSignText = (drawnOctaveSignText.top + drawnOctaveSignText.bottom) / 2
  components.push(
    line(
      drawnOctaveSignText.right + octaveSignHorizontalLineLeftOffset,
      yCenterOfOctaveSignText,
      octaveSignParams.rightSingleUnit.right + octaveSignHorizontalLineRightOffset,
      yCenterOfOctaveSignText,
      octaveSignHorizontalLineStrokeOptions
    ),
    line(
      octaveSignParams.rightSingleUnit.right + octaveSignHorizontalLineRightOffset,
      yCenterOfOctaveSignText,
      octaveSignParams.rightSingleUnit.right + octaveSignHorizontalLineRightOffset,
      octaveSignParams.direction === 'up'
        ? drawnOctaveSignText.bottom
        : drawnOctaveSignText.top,
      octaveSignVerticalLineStrokeOptions
    )
  )
  const drawnOctaveSign = group(
    'octaveSign',
    components
  )
  addPropertiesToElement(
    drawnOctaveSign,
    {
      'ref-ids': octaveSignParams.key
    }
  )
  moveElement(
    drawnOctaveSign,
    0,
    (octaveSignParams.yCorrection || 0) * intervalBetweenStaveLines
  )
  octaveSignParams.chords.forEach(chord => {
    chord.top = Math.min(chord.top, drawnOctaveSign.top)
    chord.bottom = Math.max(chord.bottom, drawnOctaveSign.bottom)
  })
  return drawnOctaveSign
}
