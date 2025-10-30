'use strict'

const path = require('./../basic/path')
const stavesPiece = require('./../stave/stavesPiece')
const topOffsetForCurrentStave = require('./../stave/topOffsetForCurrentStave')
const group = require('./../basic/group')

module.exports = (numberOfStaves, numberOfStaveLines) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaves, intervalBetweenStaveLines, repeatDots, repeatDotsPadding, fontColor } = styles
    const allDrawnRepeatDotsOnAllStaves = []
    const xPositionOfDots = leftOffset + repeatDotsPadding
    for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
      const calculatedTopOffsetForCurrentStave = topOffsetForCurrentStave(topOffset, staveIndex, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
      const drawnRepeatDotsOnCurrentStave = path(
        repeatDots.points,
        null,
        fontColor,
        xPositionOfDots,
        calculatedTopOffsetForCurrentStave + repeatDots.yCorrection
      )
      allDrawnRepeatDotsOnAllStaves.push(drawnRepeatDotsOnCurrentStave)
    }
    const groupedDrawnDots = group(
      'repeatDots',
      allDrawnRepeatDotsOnAllStaves
    )
    const repeatDotsStaveWidth = groupedDrawnDots.right + repeatDotsPadding - leftOffset
    const stavesPieceWithCoordinates = stavesPiece(numberOfStaves, numberOfStaveLines, repeatDotsStaveWidth, numberOfStaves)(styles, leftOffset, topOffset)
    return group(
      'repeatDotsWithStaveLines',
      [
        groupedDrawnDots,
        stavesPieceWithCoordinates
      ]
    )
  }
}
