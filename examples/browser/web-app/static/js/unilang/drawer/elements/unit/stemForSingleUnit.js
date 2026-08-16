'use strict'

import line from '#unilang/drawer/elements/basic/line.js'

const additionalStemHeightForUnitWithFlags = (numberOfStaveLines, stemDirection, unitDuration, numberOfTremoloStrokes, firstTwoNotesWithFlagsInWholeToneAndFirstOneIsIndented, firstTwoNoteswithFlagsInWholeToneAndFirstOneIsNotIndented, lastTwoNoteswithFlagsInWholeToneAndLastOneIsIndented, lastTwoNoteswithFlagsInWholeToneAndLastOneIsNotIndented, noteOnEdgeInSingleUnitwithFlagsIsOnStaveLine, noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines, thereAreDrawnStaveLinesIncludingAdditionalOnesAboveFirstNote, thereAreDrawnStaveLinesIncludingAdditionalOnesBelowLastNote, isGrace, styles) => {
  let result = 0
  if (stemDirection === 'up') {
    if (firstTwoNotesWithFlagsInWholeToneAndFirstOneIsIndented) {
      if (noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines) {
        if (thereAreDrawnStaveLinesIncludingAdditionalOnesAboveFirstNote) {
          result += styles.additionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesAbove
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesAbove : 0)
        } else {
          result += styles.additionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndBetweenStaveLines
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndBetweenStaveLines : 0)
        }
      } else {
        if (thereAreDrawnStaveLinesIncludingAdditionalOnesAboveFirstNote) {
          result += styles.additionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndOnStaveLineAndThereAreDrawnStaveLinesAbove
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndOnStaveLineAndThereAreDrawnStaveLinesAbove : 0)
        } else {
          result += styles.additionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndOnStaveLine
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndOnStaveLine : 0)
        }
      }
    } else if (firstTwoNoteswithFlagsInWholeToneAndFirstOneIsNotIndented) {
      if (noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines) {
        if (thereAreDrawnStaveLinesIncludingAdditionalOnesAboveFirstNote) {
          result += styles.additionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesAbove
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesAbove : 0)
        } else {
          result += styles.additionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndBetweenStaveLines
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndBetweenStaveLines : 0)
        }
      } else {
        if (thereAreDrawnStaveLinesIncludingAdditionalOnesAboveFirstNote) {
          result += styles.additionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndOnStaveLineAndThereAreDrawnStaveLinesAbove
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndOnStaveLineAndThereAreDrawnStaveLinesAbove : 0)
        } else {
          result += styles.additionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndOnStaveLine
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndOnStaveLine : 0)
        }
      }
    } else {
      if (noteOnEdgeInSingleUnitwithFlagsIsOnStaveLine) {
        if (thereAreDrawnStaveLinesIncludingAdditionalOnesAboveFirstNote) {
          result += styles.additionalHeightForUpStemWithFlagsWhereFirstNoteIsOnStaveLineAndThereAreDrawnStaveLinesAbove
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForUpStemWavesWhereFirstNoteIsOnStaveLineAndThereAreDrawnStaveLinesAbove : 0)
        } else {
          result += styles.additionalHeightForUpStemWithFlagsWhereFirstNoteIsOnStaveLine
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsOnStaveLine : 0)
        }
      } else if (noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines) {
        if (thereAreDrawnStaveLinesIncludingAdditionalOnesAboveFirstNote) {
          result += styles.additionalHeightForUpStemWithFlagsWhereFirstNoteBetweenStaveLinesAndThereAreDrawnStaveLinesAbove
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteBetweenStaveLinesAndThereAreDrawnStaveLinesAbove : 0)
        } else {
          result += styles.additionalHeightForUpStemWithFlagsWhereFirstNoteBetweenStaveLines
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteBetweenStaveLines : 0)
        }
      }
    }
  } else if (stemDirection === 'down') {
    if (lastTwoNoteswithFlagsInWholeToneAndLastOneIsIndented) {
      if (noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines) {
        if (thereAreDrawnStaveLinesIncludingAdditionalOnesBelowLastNote) {
          result += styles.additionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesBelow
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesBelow : 0)
        } else {
          result += styles.additionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndBetweenStaveLines
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndBetweenStaveLines : 0)
        }
      } else {
        if (thereAreDrawnStaveLinesIncludingAdditionalOnesBelowLastNote) {
          result += styles.additionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndOnStaveLineAndThereAreDrawnStaveLinesBelow
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndOnStaveLineAndThereAreDrawnStaveLinesBelow : 0)
        } else {
          result += styles.additionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndOnStaveLine
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndOnStaveLine : 0)
        }
      }
    } else if (lastTwoNoteswithFlagsInWholeToneAndLastOneIsNotIndented) {
      if (noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines) {
        if (thereAreDrawnStaveLinesIncludingAdditionalOnesBelowLastNote) {
          result += styles.additionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesBelow
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesBelow : 0)
        } else {
          result += styles.additionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndBetweenStaveLines
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndBetweenStaveLines : 0)
        }
      } else {
        if (thereAreDrawnStaveLinesIncludingAdditionalOnesBelowLastNote) {
          result += styles.additionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndOnStaveLineAndThereAreDrawnStaveLinesBelow
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndOnStaveLineAndThereAreDrawnStaveLinesBelow : 0)
        } else {
          result += styles.additionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndOnStaveLine
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndOnStaveLine : 0)
        }
      }
    } else {
      if (noteOnEdgeInSingleUnitwithFlagsIsOnStaveLine) {
        if (thereAreDrawnStaveLinesIncludingAdditionalOnesBelowLastNote) {
          result += styles.additionalHeightForDownStemWithFlagsWhereLastNoteIsOnStaveLineAndThereAreDrawnStaveLinesBelow
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsOnStaveLineAndThereAreDrawnStaveLinesBelow : 0)
        } else {
          result += styles.additionalHeightForDownStemWithFlagsWhereLastNoteIsOnStaveLine
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsOnStaveLine : 0)
        }
      } else if (noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines) {
        if (thereAreDrawnStaveLinesIncludingAdditionalOnesBelowLastNote) {
          result += styles.additionalHeightForDownStemWithFlagsWhereLastNoteBetweenStaveLinesAndThereAreDrawnStaveLinesBelow
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteBetweenStaveLinesAndThereAreDrawnStaveLinesBelow : 0)
        } else {
          result += styles.additionalHeightForDownStemWithFlagsWhereLastNoteBetweenStaveLines
          result += (isGrace ? styles.graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteBetweenStaveLines : 0)
        }
      }
    }
  }
  return result
}

const additionalStemHeightForSingleUnitWithTremoloStrokesAndNoFlags = (numberOfTremoloStrokes, withFlags, styles) => {
  if (!withFlags) {
    if (numberOfTremoloStrokes === 3) {
      return styles.additionalStemHeightForUnitWithThreeTremoloStrokes
    }
    if (numberOfTremoloStrokes === 2) {
      return styles.additionalStemHeightForUnitWithTwoTremoloStrokes
    }
    if (numberOfTremoloStrokes === 1) {
      return styles.additionalStemHeightForUnitWithOneTremoloStroke
    }
  }
  return 0
}

const additionalStemHeightForSingleUnitWithConnectedTremoloAndUnitDurationIsQuarterOrHalf = (hasConnectedTremolo, numberOfTremoloStrokes, unitDuration, styles) => {
  if (hasConnectedTremolo && (unitDuration === 1 / 4 || unitDuration === 1 / 2)) {
    if (numberOfTremoloStrokes === 2) {
      return styles.additionalStemHeightForUnitWithConnectedTwoStrokesTremoloAndUnitDurationIsQuarterOrHalf
    }
    if (numberOfTremoloStrokes === 3) {
      return styles.additionalStemHeightForUnitWithConnectedThreeStrokesTremoloAndUnitDurationIsQuarterOrHalf
    }
  }
  return 0
}

export default function (numberOfStaveLines, styles, sortedNotes, withFlags, numberOfTremoloStrokes, hasConnectedTremolo, nonIndentedPartOfSingleUnitWithCoordinates, indentedPartOfSingleUnitWithCoordinates, notesForNonIndentedPartOfUnit, notesForIndentedPartOfUnit, unitDuration, anyWholeTones, stemDirection, beamed, noteOnEdgeInSingleUnitwithFlagsIsOnStaveLine, noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines, thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsMoreThanMaxNotePositionNumberInCurrentSingleUnitOnTheSameStave, thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsLessThanMinNotePositionNumberInCurrentSingleUnitOnTheSameStave, isGrace) {
  const { noteStemStrokeOptions, defaultStemHeightForSingleUnit, defaultStemHeightForHalfSingleUnit, defaultStemHeightForQuadrupleSingleUnit, yDistanceFromNoteBodyForStem, verticalStemCorrectionForGhostHalfNoteAtEdgeOfUnitBody, verticalStemCorrectionForGhostNoteAtEdgeOfUnitBody, graceElementsScaleFactor } = styles
  const tunedNoteStemStrokeOptions = Object.assign({}, noteStemStrokeOptions)
  if (isGrace) {
    tunedNoteStemStrokeOptions.width *= graceElementsScaleFactor
  }
  const chordBodyTop = indentedPartOfSingleUnitWithCoordinates ? Math.min(nonIndentedPartOfSingleUnitWithCoordinates.top, indentedPartOfSingleUnitWithCoordinates.top) : nonIndentedPartOfSingleUnitWithCoordinates.top
  const chordBodyBottom = indentedPartOfSingleUnitWithCoordinates ? Math.max(nonIndentedPartOfSingleUnitWithCoordinates.bottom, indentedPartOfSingleUnitWithCoordinates.bottom) : nonIndentedPartOfSingleUnitWithCoordinates.bottom
  let stemHeight = defaultStemHeightForSingleUnit
  if (unitDuration === 1 / 2) {
    stemHeight = defaultStemHeightForHalfSingleUnit
  } else if (unitDuration === 4) {
    stemHeight = defaultStemHeightForQuadrupleSingleUnit
  }
  const isNotBeamedAndWithoutConnectedTremolo = !beamed && !hasConnectedTremolo
  if (stemDirection === 'up') {
    const xPosition = nonIndentedPartOfSingleUnitWithCoordinates.right - (unitDuration === 4 ? 0 : noteStemStrokeOptions.width / 2) * (isGrace ? graceElementsScaleFactor : 1)
    const isLastNoteGhost = notesForNonIndentedPartOfUnit[notesForNonIndentedPartOfUnit.length - 1].isGhost
    const bottomPoint = chordBodyBottom - (yDistanceFromNoteBodyForStem + (isLastNoteGhost && unitDuration !== 1 / 2 ? verticalStemCorrectionForGhostNoteAtEdgeOfUnitBody : 0) - (isLastNoteGhost && unitDuration === 1 / 2 ? verticalStemCorrectionForGhostHalfNoteAtEdgeOfUnitBody : 0)) * (isGrace ? graceElementsScaleFactor : 1)
    const firstTwoNotesWithFlagsInWholeToneAndFirstOneIsIndented = withFlags && sortedNotes[0] && sortedNotes[1] && sortedNotes[0].indented
    const firstTwoNoteswithFlagsInWholeToneAndFirstOneIsNotIndented = withFlags && sortedNotes[0] && sortedNotes[1] && sortedNotes[1].indented
    const thereAreDrawnStaveLinesIncludingAdditionalOnesAboveFirstNote = sortedNotes[0] && ((sortedNotes[0].positionNumber > 0) || thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsLessThanMinNotePositionNumberInCurrentSingleUnitOnTheSameStave)
    const stemLine = line(
      xPosition,
      isNotBeamedAndWithoutConnectedTremolo
        ? (
          chordBodyTop - (
            stemHeight + (
              additionalStemHeightForSingleUnitWithTremoloStrokesAndNoFlags(numberOfTremoloStrokes, withFlags, styles) +
              additionalStemHeightForUnitWithFlags(numberOfStaveLines, stemDirection, unitDuration, numberOfTremoloStrokes, firstTwoNotesWithFlagsInWholeToneAndFirstOneIsIndented, firstTwoNoteswithFlagsInWholeToneAndFirstOneIsNotIndented, false, false, noteOnEdgeInSingleUnitwithFlagsIsOnStaveLine, noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines, thereAreDrawnStaveLinesIncludingAdditionalOnesAboveFirstNote, false, isGrace, styles)
            )
          ) * (isGrace ? graceElementsScaleFactor : 1)
        )
        : chordBodyTop - additionalStemHeightForSingleUnitWithConnectedTremoloAndUnitDurationIsQuarterOrHalf(hasConnectedTremolo, numberOfTremoloStrokes, unitDuration, styles) * (isGrace ? graceElementsScaleFactor : 1),
      xPosition,
      bottomPoint,
      tunedNoteStemStrokeOptions, 0, 0, 'stem'
    )
    return stemLine
  } else {
    const xPosition = nonIndentedPartOfSingleUnitWithCoordinates.left + (unitDuration === 4 ? 0 : noteStemStrokeOptions.width / 2) * (isGrace ? graceElementsScaleFactor : 1)
    const isFirstNoteGhost = notesForNonIndentedPartOfUnit[0].isGhost
    const topPoint = chordBodyTop + (yDistanceFromNoteBodyForStem + (isFirstNoteGhost && unitDuration !== 1 / 2 ? verticalStemCorrectionForGhostNoteAtEdgeOfUnitBody : 0) - (isFirstNoteGhost && unitDuration === 1 / 2 ? verticalStemCorrectionForGhostHalfNoteAtEdgeOfUnitBody : 0)) * (isGrace ? graceElementsScaleFactor : 1)
    const lastTwoNoteswithFlagsInWholeToneAndLastOneIsIndented = withFlags && sortedNotes[sortedNotes.length - 1] && sortedNotes[sortedNotes.length - 2] && sortedNotes[sortedNotes.length - 1].indented
    const lastTwoNoteswithFlagsInWholeToneAndLastOneIsNotIndented = withFlags && sortedNotes[sortedNotes.length - 1] && sortedNotes[sortedNotes.length - 2] && sortedNotes[sortedNotes.length - 2].indented
    const thereAreDrawnStaveLinesIncludingAdditionalOnesBelowLastNote = sortedNotes[sortedNotes.length - 1] && ((sortedNotes[sortedNotes.length - 1].positionNumber < numberOfStaveLines - 1) || thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsMoreThanMaxNotePositionNumberInCurrentSingleUnitOnTheSameStave)
    const stemLine = line(
      xPosition,
      topPoint,
      xPosition,
      isNotBeamedAndWithoutConnectedTremolo
        ? (
          chordBodyBottom + (
            stemHeight + (
              additionalStemHeightForSingleUnitWithTremoloStrokesAndNoFlags(numberOfTremoloStrokes, withFlags, styles) +
              additionalStemHeightForUnitWithFlags(numberOfStaveLines, stemDirection, unitDuration, numberOfTremoloStrokes, false, false, lastTwoNoteswithFlagsInWholeToneAndLastOneIsIndented, lastTwoNoteswithFlagsInWholeToneAndLastOneIsNotIndented, noteOnEdgeInSingleUnitwithFlagsIsOnStaveLine, noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines, false, thereAreDrawnStaveLinesIncludingAdditionalOnesBelowLastNote, isGrace, styles)
            )
          ) * (isGrace ? graceElementsScaleFactor : 1)
        )
        : chordBodyBottom + additionalStemHeightForSingleUnitWithConnectedTremoloAndUnitDurationIsQuarterOrHalf(hasConnectedTremolo, numberOfTremoloStrokes, unitDuration, styles) * (isGrace ? graceElementsScaleFactor : 1),
      tunedNoteStemStrokeOptions, 0, 0, 'stem'
    )
    return stemLine
  }
}
