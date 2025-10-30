'use strict'

const topOffsetForCurrentStave = require('./../stave/topOffsetForCurrentStave')
const text = require('./../basic/text')
const rect = require('./../basic/rect')
const moveElement = require('./../basic/moveElement')
const moveElementInTheCenterBetweenPointsAboveAndBelow = require('./../basic/moveElementInTheCenterBetweenPointsAboveAndBelow')
const group = require('./../basic/group')

module.exports = (staveStartNumber, staveEndNumber, numberOfAllStaves, numberOfStaveLines) => {
  return (styles, leftOffset, topOffset) => {
    const { musicFontSource, musicFontSourceSize, intervalBetweenStaveLines, intervalBetweenStaves, fontColor, curlySmallBrace, curlyLargeBrace, curlyLargerBrace, curlyFlatBrace, spaceAfterBrace } = styles
    const topOffsetForStartStave = topOffsetForCurrentStave(topOffset, staveStartNumber, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
    const numberOfStavesIncludedInBrace = staveEndNumber - staveStartNumber + 1
    const bottomOffset = topOffsetForStartStave + (numberOfStavesIncludedInBrace - 1) * intervalBetweenStaves + ((numberOfStaveLines - 1) * numberOfStavesIncludedInBrace) * intervalBetweenStaveLines
    const bottomOffsetOfStartStave = topOffsetForStartStave + (numberOfStaveLines - 1) * intervalBetweenStaveLines
    const height = bottomOffset - topOffsetForStartStave
    const heightOfStartStave = bottomOffsetOfStartStave - topOffsetForStartStave
    const fontSizeOfBrace = musicFontSourceSize * height / heightOfStartStave
    let unicodeOfBraceShape
    if (
      (height > curlySmallBrace.minHeight) &&
      (height <= curlySmallBrace.maxHeight)
    ) {
      unicodeOfBraceShape = curlySmallBrace.unicode
    } else if (
      (height > curlyLargeBrace.minHeight) &&
      (height <= curlyLargeBrace.maxHeight)
    ) {
      unicodeOfBraceShape = curlyLargeBrace.unicode
    } else if (
      (height > curlyLargerBrace.minHeight) &&
      (height <= curlyLargerBrace.maxHeight)
    ) {
      unicodeOfBraceShape = curlyLargerBrace.unicode
    } else if  (
      (height > curlyFlatBrace.minHeight) &&
      (height <= curlyFlatBrace.maxHeight)
    ) {
      unicodeOfBraceShape = curlyFlatBrace.unicode
    }
    const braceLineWithCoordinates = text(
      unicodeOfBraceShape,
      {
        source: musicFontSource,
        color: fontColor,
        size: fontSizeOfBrace * intervalBetweenStaveLines,
        anchor: 'center middle',
      }
    )(styles, leftOffset, 0)
    moveElementInTheCenterBetweenPointsAboveAndBelow(
      braceLineWithCoordinates,
      topOffsetForStartStave,
      bottomOffset
    )
    const spaceAfterBraceLine = rect(
      spaceAfterBrace,
      bottomOffset - topOffsetForStartStave,
      {},
      'none',
      braceLineWithCoordinates.right, topOffsetForStartStave
    )
    const drawnBraceConnection = group(
      'braceConnection',
      [ braceLineWithCoordinates, spaceAfterBraceLine ]
    )
    moveElement(drawnBraceConnection, leftOffset - drawnBraceConnection.left)
    return drawnBraceConnection
  }
}
