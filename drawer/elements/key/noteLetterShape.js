'use strict'

const text = require('./../basic/text')
const pathWithOutline = require('./../basic/pathWithOutline')
const group = require('./../basic/group')
const moveElement = require('./../basic/moveElement')

module.exports = (positionNumber, textValue = '?') => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, noteLetterKeysFontOptions, noteLetters, fontColor } = styles
    const isOnStaveLine = Math.abs(positionNumber * 10 % 2) === 0
    const yCenterOfStaveLine = topOffset + positionNumber * intervalBetweenStaveLines
    const yCenterBetweenPrevAndNextStavesLine = (
      (topOffset + (positionNumber - 0.5) * intervalBetweenStaveLines) +
      (topOffset + (positionNumber + 0.5) * intervalBetweenStaveLines)
    ) / 2
    const noteLetterWithCoordinates = noteLetters[textValue]
      ? pathWithOutline(
        noteLetters[textValue].points,
        null,
        fontColor,
        noteLetterKeysFontOptions.outlinePadding,
        noteLetterKeysFontOptions.outlineColor,
        noteLetterKeysFontOptions.outlineRadius,
        leftOffset,
        isOnStaveLine ? yCenterOfStaveLine : yCenterBetweenPrevAndNextStavesLine
      )
      : text(
        textValue,
        noteLetterKeysFontOptions
      )(
        styles,
        leftOffset,
        isOnStaveLine ? yCenterOfStaveLine : yCenterBetweenPrevAndNextStavesLine
      )
    const yCenterOfDrawnNoteLetter = (noteLetterWithCoordinates.top + noteLetterWithCoordinates.bottom) / 2
    if (isOnStaveLine) {
      moveElement(
        noteLetterWithCoordinates,
        0,
        yCenterOfStaveLine - yCenterOfDrawnNoteLetter
      )
    } else {
      moveElement(
        noteLetterWithCoordinates,
        0,
        yCenterBetweenPrevAndNextStavesLine - yCenterOfDrawnNoteLetter
      )
    }
    return group(
      'noteLetter',
      [
        noteLetterWithCoordinates
      ]
    )
  }
}
