'use strict'

const text = require('./../basic/text')
const path = require('./../basic/path')
const articulationShouldBeAboveOrUnderStemLine = require('./../articulation/articulationShouldBeAboveOrUnderStemLine')
const moveElement = require('./../basic/moveElement')
const moveElementAbovePointWithInterval = require('./../basic/moveElementAbovePointWithInterval')
const moveElementBelowPointWithInterval = require('./../basic/moveElementBelowPointWithInterval')
const moveElementInTheCenterBetweenPoints = require('./../basic/moveElementInTheCenterBetweenPoints')
const group = require('./../basic/group')
const elementWithAdditionalInformation = require('./../basic/elementWithAdditionalInformation')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (dynamicChangeParams, styles) => {
  const components = []
  const { intervalBetweenStaveLines, dynamicTextFontOptions, dynamicChangeYOffset, dynamicChangeSignOffsetFromDynamicText, dynamicChangeSignDefaultHeight, dynamicChangeLinesStrokeOptions, dynamicLetters, fontColor } = styles
  const tunedDynamicTextFontOptions = Object.assign({}, dynamicTextFontOptions)
  if (dynamicChangeParams.valueBefore) {
    const shouldBeAboveOrUnderStemLine = articulationShouldBeAboveOrUnderStemLine(
      dynamicChangeParams.leftSingleUnit, dynamicChangeParams.direction
    )
    const leftEdge = dynamicChangeParams.leftSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.left
    const rightEdge = dynamicChangeParams.leftSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.right
    const dynamicText = dynamicLetters[dynamicChangeParams.valueBefore]
      ? path(
        dynamicLetters[dynamicChangeParams.valueBefore].points,
        null,
        fontColor,
        0,
        dynamicChangeParams.startYPosition
      )
      : text(
        dynamicChangeParams.valueBefore || '??', tunedDynamicTextFontOptions
      )(styles, 0, dynamicChangeParams.startYPosition)
    if (shouldBeAboveOrUnderStemLine) {
      moveElementInTheCenterBetweenPoints(
        dynamicText,
        dynamicChangeParams.leftSingleUnit.stemLeft,
        dynamicChangeParams.leftSingleUnit.stemRight
      )
    } else {
      moveElementInTheCenterBetweenPoints(
        dynamicText,
        leftEdge,
        rightEdge
      )
    }
    addPropertiesToElement(
      dynamicText,
      {
        'ref-ids': dynamicChangeParams.key.replace('crescendo-or-diminuendo', 'crescendo-or-diminuendo-value-before')
      }
    )
    components.push(dynamicText)
  }
  if (dynamicChangeParams.valueAfter) {
    const shouldBeAboveOrUnderStemLine = articulationShouldBeAboveOrUnderStemLine(
      dynamicChangeParams.rightSingleUnit, dynamicChangeParams.direction
    )
    const leftEdge = dynamicChangeParams.rightSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.left
    const rightEdge = dynamicChangeParams.rightSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.right
    const dynamicText = dynamicLetters[dynamicChangeParams.valueAfter]
      ? path(
        dynamicLetters[dynamicChangeParams.valueAfter].points,
        null,
        fontColor,
        0,
        dynamicChangeParams.startYPosition
      )
      : text(
        dynamicChangeParams.valueAfter || '??', tunedDynamicTextFontOptions
      )(styles, 0, dynamicChangeParams.startYPosition)
    if (shouldBeAboveOrUnderStemLine) {
      moveElementInTheCenterBetweenPoints(
        dynamicText,
        dynamicChangeParams.rightSingleUnit.stemLeft,
        dynamicChangeParams.rightSingleUnit.stemRight
      )
    } else {
      moveElementInTheCenterBetweenPoints(
        dynamicText,
        leftEdge,
        rightEdge
      )
    }
    if (dynamicChangeParams.valueBefore) {
      const drawnTextBefore = components[0]
      const yDistanceToMove = (drawnTextBefore.bottom + drawnTextBefore.top) / 2 - (dynamicText.bottom + dynamicText.top) / 2
      moveElement(
        dynamicText,
        0,
        yDistanceToMove
      )
    }
    addPropertiesToElement(
      dynamicText,
      {
        'ref-ids': dynamicChangeParams.key.replace('crescendo-or-diminuendo', 'crescendo-or-diminuendo-value-after')
      }
    )
    components.push(dynamicText)
  }
  const dynamicChangePoints = []
  if (dynamicChangeParams.type === 'crescendo') {
    if (dynamicChangeParams.valueBefore) {
      const dynamicBeforeText = components[0]
      dynamicChangePoints.push(
        dynamicBeforeText.right + dynamicChangeSignOffsetFromDynamicText,
        (dynamicBeforeText.top + dynamicBeforeText.bottom) / 2
      )
    } else {
      if (dynamicChangeParams.valueAfter) {
        const dynamicAfterText = components[0]
        const dynamicAfterTextYCenter = (dynamicAfterText.top + dynamicAfterText.bottom) / 2
        dynamicChangePoints.push(
          dynamicChangeParams.leftSingleUnit.left,
          dynamicAfterTextYCenter
        )
      } else {
        dynamicChangePoints.push(
          dynamicChangeParams.leftSingleUnit.left,
          dynamicChangeParams.startYPosition
        )
      }
    }
    if (dynamicChangeParams.valueAfter) {
      const dynamicAfterText = components[1] || components[0]
      const dynamicAfterTextYCenter = (dynamicAfterText.top + dynamicAfterText.bottom) / 2
      dynamicChangePoints.push(
        dynamicAfterText.left - dynamicChangeSignOffsetFromDynamicText,
        dynamicAfterTextYCenter - dynamicChangeSignDefaultHeight / 2,
        dynamicAfterText.left - dynamicChangeSignOffsetFromDynamicText,
        dynamicAfterTextYCenter + dynamicChangeSignDefaultHeight / 2
      )
    } else {
      dynamicChangePoints.push(
        dynamicChangeParams.rightSingleUnit.right,
        dynamicChangePoints[1] + dynamicChangeSignDefaultHeight / 2,
        dynamicChangeParams.rightSingleUnit.right,
        dynamicChangePoints[1] - dynamicChangeSignDefaultHeight / 2
      )
    }
    components.push(
      path(
        [
          'M',
          dynamicChangePoints[0], dynamicChangePoints[1],
          'L',
          dynamicChangePoints[2], dynamicChangePoints[3],
          'M',
          dynamicChangePoints[0], dynamicChangePoints[1],
          'L',
          dynamicChangePoints[4], dynamicChangePoints[5]
        ],
        dynamicChangeLinesStrokeOptions
      )
    )
  } else if (dynamicChangeParams.type === 'diminuendo') {
    if (dynamicChangeParams.valueBefore) {
      const dynamicBeforeText = components[0]
      const dynamicBeforeTextYCenter = (dynamicBeforeText.top + dynamicBeforeText.bottom) / 2
      dynamicChangePoints.push(
        dynamicBeforeText.right + dynamicChangeSignOffsetFromDynamicText,
        dynamicBeforeTextYCenter - dynamicChangeSignDefaultHeight / 2,
        dynamicBeforeText.right + dynamicChangeSignOffsetFromDynamicText,
        dynamicBeforeTextYCenter + dynamicChangeSignDefaultHeight / 2
      )
    } else {
      if (dynamicChangeParams.valueAfter) {
        const dynamicAfterText = components[0]
        const dynamicAfterTextYCenter = (dynamicAfterText.top + dynamicAfterText.bottom) / 2
        dynamicChangePoints.push(
          dynamicChangeParams.leftSingleUnit.left,
          dynamicAfterTextYCenter - dynamicChangeSignDefaultHeight / 2,
          dynamicChangeParams.leftSingleUnit.left,
          dynamicAfterTextYCenter + dynamicChangeSignDefaultHeight / 2,
        )
      } else {
        dynamicChangePoints.push(
          dynamicChangeParams.leftSingleUnit.left,
          (dynamicChangeParams.startYPosition - dynamicChangeSignDefaultHeight / 2),
          dynamicChangeParams.leftSingleUnit.left,
          (dynamicChangeParams.startYPosition + dynamicChangeSignDefaultHeight / 2)
        )
      }
    }
    if (dynamicChangeParams.valueAfter) {
      const dynamicAfterText = components[1] || components[0]
      dynamicChangePoints.push(
        dynamicAfterText.left - dynamicChangeSignOffsetFromDynamicText,
        (dynamicAfterText.top + dynamicAfterText.bottom) / 2
      )
    } else {
      dynamicChangePoints.push(
        dynamicChangeParams.rightSingleUnit.right,
        (dynamicChangePoints[1] + dynamicChangePoints[3]) / 2
      )
    }
    components.push(
      path(
        [
          'M',
          dynamicChangePoints[0], dynamicChangePoints[1],
          'L',
          dynamicChangePoints[4], dynamicChangePoints[5],
          'M',
          dynamicChangePoints[2], dynamicChangePoints[3],
          'L',
          dynamicChangePoints[4], dynamicChangePoints[5]
        ],
        dynamicChangeLinesStrokeOptions
      )
    )
  }
  let drawndDynamicChange = elementWithAdditionalInformation(
    group(
      'dynamicChange',
      components
    ),
    { chords: dynamicChangeParams.chords }
  )
  addPropertiesToElement(
    drawndDynamicChange,
    {
      'ref-ids': dynamicChangeParams.key
    }
  )
  if (!drawndDynamicChange.isEmpty) {
    if (dynamicChangeParams.direction === 'up') {
      moveElementAbovePointWithInterval(
        drawndDynamicChange,
        dynamicChangeParams.startYPosition,
        dynamicChangeYOffset
      )
    } else {
      moveElementBelowPointWithInterval(
        drawndDynamicChange,
        dynamicChangeParams.startYPosition,
        dynamicChangeYOffset
      )
    }
    moveElement(
      drawndDynamicChange,
      0,
      (dynamicChangeParams.yCorrection || 0) * intervalBetweenStaveLines
    )
  }
  return drawndDynamicChange
}
