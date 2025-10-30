'use strict'

const isInt = (value) => {
  const parsedValue = parseFloat(value)
  return !isNaN(value) && (parsedValue | 0) === parsedValue
}

module.exports = (currentSingleUnit, topOffsetsForEachStave, staveIndex, positionIndex, numberOfStaveLines, tieSide, correspondingLeftTieJunctionPoint, styles) => {
  const { intervalBetweenStaveLines, tieJunctionPointXOffset, tieJunctionPointXOffsetFromStem, tieJunctionPointXOffsetFromStemForNotesOnAdditionalStaveLines, tieJunctionPointForAdditionalLinesXOffset, tieJunctionPointYOffset, tieJunctionPointOfTieWithUpDirectionThatIsOnTopFirstNoteInSingleUnitYOffset, tieJunctionPointOfTieWithDownDirectionThatIsOnBottomOfLastNoteInSingleUnitYOffset, additionalStaveLinesStrokeOptions } = styles
  const diapasonThatCanBeConsideredAsSurroundingsForNote = 1
  const currentNote = currentSingleUnit.sortedNotes[positionIndex]
  const currentNoteWithCoordinates = currentSingleUnit.notesWithCoordinates[positionIndex]
  const prevNote = currentSingleUnit.sortedNotes[positionIndex - 1]
  const nextNote = currentSingleUnit.sortedNotes[positionIndex + 1]
  const numberOfNotes = currentSingleUnit.sortedNotes.length
  const noteIsFirst = positionIndex === 0
  const noteIsLast = positionIndex === currentSingleUnit.sortedNotesPositionNumbers.length - 1
  const currentNoteIsIndented = currentNote.indented
  const correspondingNoteIsFirstInLeftTieJunctionPoint = correspondingLeftTieJunctionPoint ? correspondingLeftTieJunctionPoint.isFirst : false
  const correspondingNoteIsLastInLeftTieJunctionPoint = correspondingLeftTieJunctionPoint ? correspondingLeftTieJunctionPoint.isLast : false
  const noteIsNotFirstOrLast = !noteIsFirst && !noteIsLast
  const correspondingNoteIsNotFirstOrLastInLeftTieJunctionPoint = !correspondingNoteIsFirstInLeftTieJunctionPoint && !correspondingNoteIsLastInLeftTieJunctionPoint

  let topOffsetsForStaveThatCurrentNoteIsOn = topOffsetsForEachStave[staveIndex]
  if (currentNote.stave === 'prev' && topOffsetsForEachStave[staveIndex - 1]) {
    topOffsetsForStaveThatCurrentNoteIsOn = topOffsetsForEachStave[staveIndex - 1]
  } else if (currentNote.stave === 'next' && topOffsetsForEachStave[staveIndex + 1]) {
    topOffsetsForStaveThatCurrentNoteIsOn = topOffsetsForEachStave[staveIndex + 1]
  }
  const currentNotePositionNumber = currentNote.positionNumber

  const isOnAdditionalStaveLines = currentNotePositionNumber <= -1 || currentNotePositionNumber >= numberOfStaveLines
  const underAdditionalLine = currentNotePositionNumber >= numberOfStaveLines && !isInt(currentNotePositionNumber)
  const aboveAdditionalLine = currentNotePositionNumber <= -1 && !isInt(currentNotePositionNumber)
  const isOnAdditionalStaveLinesThatCrossInTheMiddle = isOnAdditionalStaveLines && !underAdditionalLine && !aboveAdditionalLine
  const currentNoteIsSurroundedWithIndentedNotes = (
    (prevNote !== undefined && (prevNote.stave === currentNote.stave) && ((currentNotePositionNumber - prevNote.positionNumber) < diapasonThatCanBeConsideredAsSurroundingsForNote) && !noteIsLast) ||
    (nextNote !== undefined && (nextNote.stave === currentNote.stave) && ((nextNote.positionNumber - currentNotePositionNumber) < diapasonThatCanBeConsideredAsSurroundingsForNote) && !noteIsFirst)
  )
  const currentNoteIsSurroundedWithIndentedNotesOnAdditionalStaveLines = (
    (prevNote !== undefined && (prevNote.stave === currentNote.stave) && ((currentNotePositionNumber - prevNote.positionNumber) < diapasonThatCanBeConsideredAsSurroundingsForNote) && !noteIsLast && ((prevNote.positionNumber <= -1) || (prevNote.positionNumber >= numberOfStaveLines))) ||
    (nextNote !== undefined && (nextNote.stave === currentNote.stave) && ((nextNote.positionNumber - currentNotePositionNumber) < diapasonThatCanBeConsideredAsSurroundingsForNote) && !noteIsFirst && ((nextNote.positionNumber <= -1) || (nextNote.positionNumber >= numberOfStaveLines)))
  )
  let xPosition
  let yPosition = topOffsetsForStaveThatCurrentNoteIsOn + currentNotePositionNumber * intervalBetweenStaveLines
  let presumedTieDirectionForSimpleCase
  const customDirection = currentSingleUnit.tiedWithNext.direction ||
    currentSingleUnit.tiedBefore.direction ||
    currentSingleUnit.tiedAfter.direction ||
    currentSingleUnit.tiedBeforeMeasure.direction ||
    currentSingleUnit.tiedAfterMeasure.direction
  if (correspondingLeftTieJunctionPoint && typeof correspondingLeftTieJunctionPoint.presumedTieDirectionForSimpleCase === 'string') {
    presumedTieDirectionForSimpleCase = correspondingLeftTieJunctionPoint.presumedTieDirectionForSimpleCase
  } else if (correspondingLeftTieJunctionPoint) {
    presumedTieDirectionForSimpleCase = (correspondingLeftTieJunctionPoint.singleUnit.stemDirection === 'up') ? 'down' : 'up'
  } else {
    presumedTieDirectionForSimpleCase = customDirection || ((currentSingleUnit.stemDirection === 'up') ? 'down' : 'up')
  }
  if (noteIsFirst && currentSingleUnit.anyWholeTones) {
    presumedTieDirectionForSimpleCase = 'up'
  } else if (noteIsLast && currentSingleUnit.anyWholeTones) {
    presumedTieDirectionForSimpleCase = 'down'
  }
  let tiedFromTopOrBottomOfNote = false
  if (
    (
      tieSide === 'right' &&
      (
        (currentSingleUnit.sortedNotes.length === 1) ||
        ((currentSingleUnit.sortedNotes.length === 1) && !correspondingLeftTieJunctionPoint) ||
        (noteIsFirst && correspondingLeftTieJunctionPoint && (correspondingLeftTieJunctionPoint.presumedTieDirectionForSimpleCase === 'up')) ||
        (noteIsLast && correspondingLeftTieJunctionPoint && (correspondingLeftTieJunctionPoint.presumedTieDirectionForSimpleCase === 'down')) ||
        ((noteIsFirst || noteIsLast) && !correspondingLeftTieJunctionPoint && currentSingleUnit.stemless) ||
        ((noteIsFirst || noteIsLast) && !correspondingLeftTieJunctionPoint && currentSingleUnit.anyWholeTones)
      )
    ) ||
    (
      tieSide === 'left' &&
      (
        (currentSingleUnit.sortedNotes.length === 1) ||
        ((noteIsFirst || noteIsLast) && currentSingleUnit.stemless) ||
        ((noteIsFirst || noteIsLast) && currentSingleUnit.anyWholeTones)
      )
    )
  ) {
    tiedFromTopOrBottomOfNote = true
    if (
      tieSide === 'left' ||
      (tieSide === 'right' && correspondingLeftTieJunctionPoint && correspondingLeftTieJunctionPoint.tiedFromTopOrBottomOfNote) ||
      (tieSide === 'right' && !correspondingLeftTieJunctionPoint && numberOfNotes === 1)
    ) {
      xPosition = (currentNoteWithCoordinates.right + currentNoteWithCoordinates.left) / 2
    } else {
      xPosition = currentNoteWithCoordinates.left - (isOnAdditionalStaveLinesThatCrossInTheMiddle ? tieJunctionPointForAdditionalLinesXOffset : tieJunctionPointXOffset)
    }
    yPosition = correspondingLeftTieJunctionPoint
      ? correspondingLeftTieJunctionPoint.yPosition
      : (
        presumedTieDirectionForSimpleCase === 'up'
          ? currentNoteWithCoordinates.top - tieJunctionPointOfTieWithUpDirectionThatIsOnTopFirstNoteInSingleUnitYOffset
          : currentNoteWithCoordinates.bottom + tieJunctionPointOfTieWithDownDirectionThatIsOnBottomOfLastNoteInSingleUnitYOffset
      ) + (
        ((underAdditionalLine && presumedTieDirectionForSimpleCase === 'up') || (aboveAdditionalLine && presumedTieDirectionForSimpleCase === 'down'))
          ? (presumedTieDirectionForSimpleCase === 'up' ? -1 : +1) * additionalStaveLinesStrokeOptions.width / 2
          : 0
      )
  } else {
    if (tieSide === 'left') {
      if (currentSingleUnit.numberOfDots === 0) {
        if (!currentSingleUnit.stemless && currentSingleUnit.stemDirection === 'up') {
          if (currentNoteIsSurroundedWithIndentedNotes) {
            xPosition = currentSingleUnit.right + (
              currentNoteIsIndented
                ? (isOnAdditionalStaveLines ? tieJunctionPointForAdditionalLinesXOffset : tieJunctionPointXOffset)
                : (isOnAdditionalStaveLines ? tieJunctionPointXOffsetFromStemForNotesOnAdditionalStaveLines : tieJunctionPointXOffsetFromStem)
            )
          } else {
            xPosition = currentSingleUnit.stemRight + (isOnAdditionalStaveLines ? tieJunctionPointXOffsetFromStemForNotesOnAdditionalStaveLines : tieJunctionPointXOffsetFromStem)
          }
        } else {
          if (!currentNoteIsIndented && !currentNoteIsSurroundedWithIndentedNotes) {
            xPosition = currentNoteWithCoordinates.right + (isOnAdditionalStaveLines ? tieJunctionPointForAdditionalLinesXOffset : tieJunctionPointXOffset)
          } else {
            xPosition = currentSingleUnit.right + (isOnAdditionalStaveLines ? tieJunctionPointForAdditionalLinesXOffset : tieJunctionPointXOffset)
          }
        }
      } else {
        xPosition = currentSingleUnit.right + tieJunctionPointXOffset
      }
      if (noteIsFirst && (currentNote.indented || (nextNote && nextNote.indented && (nextNote.positionNumber - currentNotePositionNumber < diapasonThatCanBeConsideredAsSurroundingsForNote)))) {
        yPosition -= tieJunctionPointYOffset
      } else if (noteIsLast && (currentNote.indented || (prevNote && prevNote.indented && (currentNotePositionNumber - prevNote.positionNumber < diapasonThatCanBeConsideredAsSurroundingsForNote)))) {
        yPosition += tieJunctionPointYOffset
      }
    } else {
      const correspondingLeftSingleUnitDoesNotContainNextOrPreviousNotePositionNumber = correspondingLeftTieJunctionPoint
        ? (
          (nextNote ? correspondingLeftTieJunctionPoint.singleUnit.sortedNotesPositionNumbers.indexOf(nextNote.positionNumber) === -1 : false) ||
          (prevNote ? correspondingLeftTieJunctionPoint.singleUnit.sortedNotesPositionNumbers.indexOf(prevNote.positionNumber) === -1 : false)
        )
        : false
      if (currentNoteIsSurroundedWithIndentedNotes && (noteIsNotFirstOrLast || correspondingNoteIsNotFirstOrLastInLeftTieJunctionPoint || correspondingLeftSingleUnitDoesNotContainNextOrPreviousNotePositionNumber)) {
        xPosition = currentSingleUnit.left - ((isOnAdditionalStaveLines || currentNoteIsSurroundedWithIndentedNotesOnAdditionalStaveLines) ? tieJunctionPointForAdditionalLinesXOffset : tieJunctionPointXOffset)
      } else {
        if (!currentSingleUnit.stemless && currentSingleUnit.stemDirection === 'down') {
          if (currentNoteIsSurroundedWithIndentedNotes || currentNoteIsSurroundedWithIndentedNotesOnAdditionalStaveLines) {
            xPosition = currentSingleUnit.left - (
              currentNoteIsIndented
                ? (isOnAdditionalStaveLines ? tieJunctionPointForAdditionalLinesXOffset : tieJunctionPointXOffset)
                : (isOnAdditionalStaveLines ? tieJunctionPointXOffsetFromStemForNotesOnAdditionalStaveLines : tieJunctionPointXOffsetFromStem)
            )
          } else {
            xPosition = currentSingleUnit.stemLeft - ((isOnAdditionalStaveLines || currentNoteIsSurroundedWithIndentedNotesOnAdditionalStaveLines) ? tieJunctionPointXOffsetFromStemForNotesOnAdditionalStaveLines : tieJunctionPointXOffsetFromStem)
          }
        } else {
          if (!currentNoteIsIndented && !currentNoteIsSurroundedWithIndentedNotes) {
            xPosition = currentNoteWithCoordinates.left - (isOnAdditionalStaveLines ? tieJunctionPointForAdditionalLinesXOffset : tieJunctionPointXOffset)
          } else {
            xPosition = currentSingleUnit.left - ((isOnAdditionalStaveLines || currentNoteIsSurroundedWithIndentedNotesOnAdditionalStaveLines) ? tieJunctionPointForAdditionalLinesXOffset : tieJunctionPointXOffset)
          }
        }
      }
      if (correspondingLeftTieJunctionPoint) {
        yPosition = correspondingLeftTieJunctionPoint.yPosition
      }
    }
  }
  return {
    isFirst: positionIndex === 0,
    isLast: positionIndex === currentSingleUnit.sortedNotesPositionNumbers.length - 1,
    positionIndex: positionIndex,
    isInNonIndentedPartOfUnitWithCoordinates: !currentNoteIsIndented,
    yPosition: yPosition,
    xPosition: xPosition,
    tiedFromTopOrBottomOfNote,
    singleUnit: currentSingleUnit,
    numberOfNotes,
    isOnAdditionalStaveLines: isOnAdditionalStaveLines,
    notePositionNumber: currentNotePositionNumber,
    presumedTieDirectionForSimpleCase,
    stave: currentNote.stave,
    customDirection
  }
}
