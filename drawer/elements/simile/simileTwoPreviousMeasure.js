'use strict'

const simile = require('./simile')
const text = require('./../basic/text')
const polyline = require('./../basic/polyline')
const topOffsetForCurrentStave = require('./../stave/topOffsetForCurrentStave')
const stavesPiece = require('./../stave/stavesPiece')
const group = require('./../basic/group')
const moveElement = require('./../basic/moveElement')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (numberOfStaves, numberOfStaveLines, simileYCorrection, numberOfMeasures, stavesPieceWidthOfLastMeasureToCompletePageLine, measureIndexInGeneral, previousMeasure, measureBeforePreviousMeasure) => {
  return (styles, leftOffset, topOffset) => {
    const { fontColor, intervalBetweenStaves, intervalBetweenStaveLines, simileCountNumberFontOptions, similePreviousMeasureTextTopMarginOffset, simileTwoPreviousMeasuresStaveWidth, barLineWidth } = styles
    const components = []
    const stavesPieceWidth = Math.max(stavesPieceWidthOfLastMeasureToCompletePageLine, simileTwoPreviousMeasuresStaveWidth)
    const refParams = {
      measureIndexInGeneral
    }
    const stavesPieceWithCoordinates = stavesPiece(
      numberOfStaves,
      numberOfStaveLines,
      stavesPieceWidth,
      numberOfStaves,
      refParams
    )(styles, leftOffset, topOffset)
    components.push(stavesPieceWithCoordinates)
    for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
      const calculatedTopOffsetForCurrentStave = topOffsetForCurrentStave(topOffset, staveIndex, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
      const drawnSimile = simile('mixed', simileYCorrection)(styles, leftOffset, calculatedTopOffsetForCurrentStave)
      addPropertiesToElement(
        drawnSimile,
        {
          'ref-ids': `simile-${measureIndexInGeneral + 1}`
        }
      )
      moveElement(
        drawnSimile,
        (stavesPieceWidth - (drawnSimile.right - drawnSimile.left)) / 2
      )
      components.push(drawnSimile)
      const xCenter = (stavesPieceWithCoordinates.left + stavesPieceWithCoordinates.right) / 2
      const halfBarLineWidth = barLineWidth / 2
      const drawnBarLine = polyline(
        [
          xCenter - halfBarLineWidth, stavesPieceWithCoordinates.top,
          xCenter + halfBarLineWidth, stavesPieceWithCoordinates.top,
          xCenter + halfBarLineWidth, stavesPieceWithCoordinates.bottom,
          xCenter - halfBarLineWidth, stavesPieceWithCoordinates.bottom
        ],
        null, fontColor, 0, 0
      )
      components.push(drawnBarLine)
      if (numberOfMeasures > 1) {
        const numberOfMeasuresText = text(
          numberOfMeasures + '',
          simileCountNumberFontOptions
        )(
          styles,
          leftOffset,
          Math.min(drawnSimile.top, calculatedTopOffsetForCurrentStave) + similePreviousMeasureTextTopMarginOffset
        )
        addPropertiesToElement(
          numberOfMeasuresText,
          {
            'ref-ids': `simile-count-${measureIndexInGeneral + 1}`
          }
        )
        moveElement(
          numberOfMeasuresText,
          (stavesPieceWidth - (numberOfMeasuresText.right - numberOfMeasuresText.left)) / 2
        )
        components.push(numberOfMeasuresText)
      }
    }
    if (previousMeasure) {
      addPropertiesToElement(
        previousMeasure,
        {
          'ref-ids': `simile-two-prev-measures-${measureIndexInGeneral + 1}`
        }
      )
      if (measureBeforePreviousMeasure) {
        addPropertiesToElement(
          measureBeforePreviousMeasure,
          {
            'ref-ids': `simile-two-prev-measures-${measureIndexInGeneral + 1}`
          }
        )
      }
    }
    return group(
      'simile', components
    )
  }
}
