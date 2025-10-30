'use strict'

const octaveSignText = require('./../octave-sign/octaveSignText')
const line = require('./../basic/line')
const articulationShouldBeAboveOrUnderStemLine = require('./../articulation/articulationShouldBeAboveOrUnderStemLine')
const group = require('./../basic/group')
const moveElement = require('./../basic/moveElement')
const moveElementAbovePointWithInterval = require('./../basic/moveElementAbovePointWithInterval')
const moveElementBelowPointWithInterval = require('./../basic/moveElementBelowPointWithInterval')
const moveElementInTheCenterBetweenPoints = require('./../basic/moveElementInTheCenterBetweenPoints')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (octaveSignParams, styles) => {
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
