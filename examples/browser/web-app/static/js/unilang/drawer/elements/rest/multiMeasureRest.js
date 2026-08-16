'use strict'

import path from '#unilang/drawer/elements/basic/path.js'
import text from '#unilang/drawer/elements/basic/text.js'
import topOffsetForCurrentStave from '#unilang/drawer/elements/stave/topOffsetForCurrentStave.js'
import stavesPiece from '#unilang/drawer/elements/stave/stavesPiece.js'
import group from '#unilang/drawer/elements/basic/group.js'
import moveElement from '#unilang/drawer/elements/basic/moveElement.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (numberOfStaves, numberOfStaveLines, numberOfMeasures, stavesPieceWidthOfLastMeasureToCompletePageLine, measureIndexInGeneral) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaves, intervalBetweenStaveLines, measureRest, fontColor, multiMeasureRestNumberFontOptions, multiMeasureRestTextTopMarginOffset } = styles
    const components = []
    for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
      const calculatedTopOffsetForCurrentStave = topOffsetForCurrentStave(topOffset, staveIndex, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
      const multiRestShapeElements = []
      let lastLeftOffset = leftOffset
      const leftSide = path(
        measureRest.leftPoints,
        null,
        fontColor,
        lastLeftOffset,
        calculatedTopOffsetForCurrentStave + measureRest.leftYCorrection
      )
      multiRestShapeElements.push(leftSide)
      lastLeftOffset = leftSide.right + measureRest.centralSymbolXCorrection
      for (let index = 0; index < measureRest.numberOfCentralSymbols; index++) {
        const centerSide = path(
          measureRest.centerPoints,
          null,
          fontColor,
          lastLeftOffset,
          calculatedTopOffsetForCurrentStave + measureRest.centerYCorrection
        )
        multiRestShapeElements.push(centerSide)
        lastLeftOffset = centerSide.right + measureRest.centralSymbolXCorrection
      }
      const rightSide = path(
        measureRest.rightPoints,
        null,
        fontColor,
        lastLeftOffset,
        calculatedTopOffsetForCurrentStave + measureRest.rightYCorrection
      )
      multiRestShapeElements.push(rightSide)
      let multiRestShape = group(
        'multiRestShape',
        multiRestShapeElements
      )
      const multiRestShapeWidth = multiRestShape.right - multiRestShape.left
      const stavesPieceWidth = Math.max(stavesPieceWidthOfLastMeasureToCompletePageLine, 2 * measureRest.sidePadding + multiRestShapeWidth)
      const refParams = {
        measureIndexInGeneral
      }
      components.push(
        stavesPiece(
          numberOfStaves,
          numberOfStaveLines,
          stavesPieceWidth,
          numberOfStaves,
          refParams
        )(styles, leftOffset, topOffset)
      )
      moveElement(
        multiRestShape,
        (stavesPieceWidth - (multiRestShape.right - multiRestShape.left)) / 2
      )
      addPropertiesToElement(
        multiRestShape,
        {
          'ref-ids': `measure-rest-${measureIndexInGeneral + 1}`
        }
      )
      components.push(multiRestShape)
      if (numberOfMeasures && numberOfMeasures > 1) {
        const numberOfMeasuresText = text(
          numberOfMeasures + '',
          multiMeasureRestNumberFontOptions
        )(
          styles,
          leftOffset,
          calculatedTopOffsetForCurrentStave + multiMeasureRestTextTopMarginOffset
        )
        addPropertiesToElement(
          numberOfMeasuresText,
          {
            'ref-ids': `measure-rest-count-${measureIndexInGeneral + 1}`
          }
        )
        moveElement(
          numberOfMeasuresText,
          (stavesPieceWidth - (numberOfMeasuresText.right - numberOfMeasuresText.left)) / 2
        )
        components.push(numberOfMeasuresText)
      }
    }
    const drawnMultiMeasureRest = group(
      'measure rest', components
    )
    return drawnMultiMeasureRest
  }
}
