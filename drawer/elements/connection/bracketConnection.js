'use strict'

const topOffsetForCurrentStave = require('./../stave/topOffsetForCurrentStave')
const path = require('./../basic/path')
const moveElementAbovePointWithInterval = require('./../basic/moveElementAbovePointWithInterval')
const moveElementBelowPointWithInterval = require('./../basic/moveElementBelowPointWithInterval')
const group = require('./../basic/group')

module.exports = (staveStartNumber, staveEndNumber, numberOfAllStaves, numberOfStaveLines) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, intervalBetweenStaves, bracketLineWidth, bracketTop, bracketBottom, bracketXCorrection, fontColor, staveLineHeight } = styles
    const topOffsetForStartStave = topOffsetForCurrentStave(topOffset, staveStartNumber, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
    const numberOfStavesIncludedInBracket = staveEndNumber - staveStartNumber + 1
    const bottomOffset = topOffsetForStartStave + (numberOfStavesIncludedInBracket - 1) * intervalBetweenStaves + ((numberOfStaveLines - 1) * numberOfStavesIncludedInBracket) * intervalBetweenStaveLines
    const bracketLineWithCoordinates = path(
      [
        'M',
        0, topOffsetForStartStave - staveLineHeight,
        'L',
        bracketLineWidth, topOffsetForStartStave - staveLineHeight,
        'L',
        bracketLineWidth, bottomOffset + staveLineHeight,
        'L',
        0, bottomOffset + staveLineHeight,
        'Z'
      ],
      null,
      fontColor,
      leftOffset,
      0
    )
    const bracketTopShape = path(
      bracketTop.points,
      null,
      fontColor,
      leftOffset,
      topOffsetForStartStave - staveLineHeight
    )
    const bracketBottomShape = path(
      bracketBottom.points,
      null,
      fontColor,
      leftOffset,
      bottomOffset + staveLineHeight
    )
    moveElementAbovePointWithInterval(
      bracketTopShape,
      topOffsetForStartStave - staveLineHeight,
      0
    )
    moveElementBelowPointWithInterval(
      bracketBottomShape,
      bottomOffset + staveLineHeight,
      0
    )
    const drawnBracketConnection = group(
      'bracketConnection',
      [ bracketLineWithCoordinates, bracketTopShape, bracketBottomShape ]
    )
    drawnBracketConnection.right -= bracketXCorrection
    return drawnBracketConnection
  }
}
