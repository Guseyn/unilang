'use strict'

import stavePiece from './../stave/stavePiece.js'
import path from './../basic/path.js'
import group from './../basic/group.js'
import moveElement from './../basic/moveElement.js'

export default function (numberOfStaveLines, numerator, denominator, cMode, isClefBefore, isKeySignatureBefore) {
  return (styles, leftOffset, topOffset) => {
    const { timeSignatureLetters, fontColor, timeSignatureDigitLeftOffset, timeSignatureXPaddingAfterKeySignature, timeSignatureXPaddingAfterClef, timeSignatureXPaddingIfThereIsNoClefAndNoKeySignatureBefore, timeSignatureXPaddingAfterItself, cTimeTopOffset, croccedCTimeTopOffset, numeratorTopOffset, denominatorTopOffset } = styles
    const elementsWithCoordinates = []
    if (numerator === '4' && denominator === '4' && cMode) {
      elementsWithCoordinates.push(
        path(
          timeSignatureLetters['c'].points,
          null,
          fontColor,
          leftOffset,
          topOffset + cTimeTopOffset
        )
      )
    } else if (numerator === '2' && denominator === '2' && cMode) {
      elementsWithCoordinates.push(
        path(
          timeSignatureLetters['crossedC'].points,
          null,
          fontColor,
          leftOffset,
          topOffset + croccedCTimeTopOffset
        )
      )
    } else {
      const numeratorDigits = []
      let numeratorLastLeftOffset = leftOffset
      numerator.split('').forEach(digit => {
        const drawnDigit = path(
          timeSignatureLetters[digit].points,
          null,
          fontColor,
          numeratorLastLeftOffset,
          topOffset + numeratorTopOffset
        )
        numeratorLastLeftOffset = drawnDigit.right + timeSignatureDigitLeftOffset
        numeratorDigits.push(drawnDigit)
      })
      const numeratorElement = group(
        'numerator',
        numeratorDigits
      )
      const denominatorDigits = []
      let denominatorLastLeftOffset = leftOffset
      denominator.split('').forEach(digit => {
        const drawnDigit = path(
          timeSignatureLetters[digit].points,
          null,
          fontColor,
          denominatorLastLeftOffset,
          topOffset + denominatorTopOffset
        )
        denominatorLastLeftOffset = drawnDigit.right + timeSignatureDigitLeftOffset
        denominatorDigits.push(drawnDigit)
      })
      const denominatorElement = group(
        'numerator',
        denominatorDigits
      )
      const numberatorXCenter = (numeratorElement.left + numeratorElement.right) / 2
      const denominatorXCenter = (denominatorElement.left + denominatorElement.right) / 2
      const maxXCenter = Math.max(numberatorXCenter, denominatorXCenter)
      const xDistanceToMoveNumberatorElementSoItCanBeInCenter = maxXCenter - numberatorXCenter
      const xDistanceToMoveDenominatorElementSoItCanBeInCenter = maxXCenter - denominatorXCenter
      moveElement(numeratorElement, xDistanceToMoveNumberatorElementSoItCanBeInCenter)
      moveElement(denominatorElement, xDistanceToMoveDenominatorElementSoItCanBeInCenter)
      elementsWithCoordinates.push(
        numeratorElement,
        denominatorElement
      )
    }
    const groupedTime = group(
      'time',
      elementsWithCoordinates
    )
    const timeSignatureXPaddingBeforeItself = (
      isKeySignatureBefore
        ? timeSignatureXPaddingAfterKeySignature
        : isClefBefore
          ? timeSignatureXPaddingAfterClef
          : timeSignatureXPaddingIfThereIsNoClefAndNoKeySignatureBefore
    )
    const stavePieceWidth = groupedTime.right - groupedTime.left + timeSignatureXPaddingBeforeItself + timeSignatureXPaddingAfterItself
    moveElement(
      groupedTime,
      timeSignatureXPaddingBeforeItself
    )
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePieceWidth)(styles, leftOffset, topOffset)
    return group(
      'timeSignature',
      [
        stavePieceWithCoordinates,
        groupedTime
      ]
    )
  }
}
