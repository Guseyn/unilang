'use strict'

import sortedNotesForSingleUnitConsideringStaves from './sortedNotesForSingleUnitConsideringStaves.js'
import singleUnitBody from './singleUnitBody.js'
import singleUnitDots from './singleUnitDots.js'
import singleUnitWithParentheses from './singleUnitWithParentheses.js'
import areAnyWholeTonesInSingleUnit from './areAnyWholeTonesInSingleUnit.js'
import areAnyNotesOnAdditionalStaveLinesInSingleUnit from './areAnyNotesOnAdditionalStaveLinesInSingleUnit.js'
import calculatedNotesForIndentedPartOfSingleUnit from './calculatedNotesForIndentedPartOfSingleUnit.js'
import additionalOffsetForIndentedPartOfUnit from './additionalOffsetForIndentedPartOfUnit.js'
import stemForSingleUnit from './stemForSingleUnit.js'
import flagsForSingleUnit from './flagsForSingleUnit.js'
import noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines from './noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines.js'
import noteOnEdgeInSingleUnitWithFlagsIsOnStaveLine from './noteOnEdgeInSingleUnitWithFlagsIsOnStaveLine.js'
import rest from './../rest/rest.js'
import topOffsetOfElementConsideringItsStave from './../stave/topOffsetOfElementConsideringItsStave.js'
import simile from './../simile/simile.js'
import calculatedNumberOfTremoloStrokes from './calculatedNumberOfTremoloStrokes.js'
import scaleElementAroundPoint from './../basic/scaleElementAroundPoint.js'
import elementWithAdditionalInformation from './../basic/elementWithAdditionalInformation.js'
import addPropertiesToElement from './../basic/addPropertiesToElement.js'
import group from './../basic/group.js'

export default function ({
  pageLineNumber,
  numberOfStaveLines,
  measureIndexOnPageLine,
  measureIndexInGeneral,
  staveIndex,
  voiceIndex,
  singleUnitIndex,
  containsNotesOnCurrentStave,
  containsNotesOnPrevStave,
  containsNotesOnNextStave,
  containsKeysOnCurrentStave,
  containsKeysOnPrevStave,
  containsKeysOnNextStave,
  notes,
  unitDuration,
  actualDuration,
  stemDirection,
  numberOfDots,
  keysParams,
  parentheses,
  arpeggiated,
  beamedWithNext,
  beamedWithNextWithJustOneBeam,
  beamedWithPrevious,
  isRest,
  isOnlyUnitOnStaveWithoutMidMeasureElementsOrLyricsOrChordLettersOrSimilesOnThatStave,
  isFullMeasure,
  isFullMeasureAndShouldBeCentralizedBecauseOfThat,
  isSimile,
  isGrace,
  isGraceUnitAndNextUnitIsNotGrace,
  hasGraceCrushLine,
  simileRefId,
  simileYCorrection,
  numberOfSimileStrokes,
  tiedWithNext,
  slurMarks,
  tiedBefore,
  tiedAfter,
  tiedBeforeMeasure,
  tiedAfterMeasure,
  glissandoMarks,
  tupletMarks,
  octaveSignMark,
  pedalMark,
  dynamicChangeMark,
  articulationParams,
  withArticulations,
  tremoloParams,
  isOnLastMeasureOfPageLine,
  isLastSingleUnitInVoiceOnPageLine,
  thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsMoreThanMaxNotePositionNumberInCurrentSingleUnitOnTheSameStave,
  thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsLessThanMinNotePositionNumberInCurrentSingleUnitOnTheSameStave
}) {
  return (styles, leftOffset, topOffset) => {
    const { graceElementsScaleFactor } = styles

    if (isSimile) {
      const simileNote = notes[0]
      const similePositionNumber = simileNote.positionNumber
      const simileStave = simileNote.stave
      const topOffsetOfSimileConsideringItsStave = topOffsetOfElementConsideringItsStave(simileNote, numberOfStaveLines, topOffset, styles)
      const simileBody = elementWithAdditionalInformation(
        simile(numberOfSimileStrokes, simileYCorrection)(styles, leftOffset, topOffsetOfSimileConsideringItsStave),
        {
          positionNumber: similePositionNumber,
          stave: simileStave
        }
      )
      if (isGrace) {
        scaleElementAroundPoint(
          simileBody,
          graceElementsScaleFactor,
          graceElementsScaleFactor,
          {
            x: (simileBody.left + simileBody.right) / 2,
            y: (simileBody.top + simileBody.bottom) / 2
          }
        )
      }
      const singleUnit = elementWithAdditionalInformation(
        group(
          'singleUnit',
          [
            simileBody
          ]
        ),
        {
          measureIndexOnPageLine,
          measureIndexInGeneral,
          staveIndex,
          voiceIndex,
          singleUnitIndex,
          containsNotesOnCurrentStave,
          containsNotesOnPrevStave,
          containsNotesOnNextStave,
          containsKeysOnCurrentStave,
          containsKeysOnPrevStave,
          containsKeysOnNextStave,
          isRest,
          isOnlyUnitOnStaveWithoutMidMeasureElementsOrLyricsOrChordLettersOrSimilesOnThatStave,
          isFullMeasure,
          isFullMeasureAndShouldBeCentralizedBecauseOfThat,
          isSimile,
          isGrace,
          isGraceUnitAndNextUnitIsNotGrace,
          hasGraceCrushLine: false,
          tiedWithNext,
          slurMarks,
          tiedBefore,
          tiedAfter,
          tiedBeforeMeasure,
          tiedAfterMeasure,
          glissandoMarks,
          tupletMarks,
          octaveSignMark,
          pedalMark,
          dynamicChangeMark,
          isOnLastMeasureOfPageLine,
          isLastSingleUnitInVoiceOnPageLine,
          anyWholeTones: false,
          anyNotesOnAdditionalStaveLines: false,
          unitDuration: 0,
          actualDuration,
          sortedNotes: [ simileNote ],
          sortedNotesPositionNumbers: [ similePositionNumber ],
          stemDirection: 'up',
          withFlags: false,
          beamedWithNext: false,
          beamedWithNextWithJustOneBeam: false,
          beamedWithPrevious: false,
          beamed: false,
          numberOfDots: 0,
          keysParams,
          arpeggiated,
          articulationParams,
          stemless: false,
          tremoloDurationFactor: 1,
          numberOfTremoloStrokes: 0,
          hasConnectedTremolo: false,
          tremoloWithNext: false,
          tremoloWithPrevious: false,
          notesWithCoordinates: [ simileBody ],
          notesPositionNumbersInNonIndentedPartOfSingleUnit: [ similePositionNumber ],
          notesPositionNumbersInIndentedPartOfSingleUnit: [],
          nonIndentedPartOfSingleUnitWithCoordinates: {
            isEmpty: true,
            name: 'g',
            transformations: [],
            top: simileBody.top,
            right: simileBody.right,
            bottom: simileBody.bottom,
            left: simileBody.left
          },
          bodyTop: simileBody.top,
          bodyRight: simileBody.right,
          bodyLeft: simileBody.left,
          bodyBottom: simileBody.bottom,
          stemTop: simileBody.top,
          stemRight: simileBody.right,
          stemBottom: simileBody.bottom,
          stemLeft: simileBody.right,
          dotsTop: simileBody.top,
          dotsRight: simileBody.right,
          dotsBottom: simileBody.bottom,
          dotsLeft: simileBody.right
        }
      )
      if (simileRefId) {
        addPropertiesToElement(
          singleUnit,
          {
            'ref-ids': simileRefId
          }
        )
      }
      return singleUnit
    }

    const sortedNotes = sortedNotesForSingleUnitConsideringStaves(notes)
    const sortedNotesPositionNumbers = sortedNotes.map(note => note.positionNumber)
    const hasConnectedTremolo = tremoloParams && (tremoloParams.type === 'withNext' || tremoloParams.type === 'withPrevious') && (unitDuration > 1 / 32)
    const tremoloWithNext = hasConnectedTremolo && (tremoloParams.type === 'withNext')
    const tremoloWithPrevious = hasConnectedTremolo && (tremoloParams.type === 'withPrevious')
    const stemless = (unitDuration === 1) || (unitDuration === 2)
    const withFlags = (!beamedWithNext && !beamedWithPrevious && !hasConnectedTremolo) && (unitDuration < 1 / 4)
    const beamed = ((beamedWithNext || beamedWithPrevious) && (unitDuration < 1 / 4)) || hasConnectedTremolo

    if (isRest) {
      const restNote = notes[0]
      const anyNotesOnAdditionalStaveLines = false
      const anyWholeTones = false
      const restPositionNumber = restNote.positionNumber
      const restStave = restNote.stave
      const topOffsetOfRestConsideringItsStave = topOffsetOfElementConsideringItsStave(restNote, numberOfStaveLines, topOffset, styles)
      const restBody = elementWithAdditionalInformation(
        rest(unitDuration, restPositionNumber, isGrace)(styles, leftOffset, topOffsetOfRestConsideringItsStave),
        {
          positionNumber: restPositionNumber,
          stave: restStave
        }
      )
      if (isGrace) {
        scaleElementAroundPoint(
          restBody,
          graceElementsScaleFactor,
          graceElementsScaleFactor,
          {
            x: (restBody.left + restBody.right) / 2,
            y: (restBody.top + restBody.bottom) / 2
          }
        )
      }
      addPropertiesToElement(
        restBody,
        {
          'ref-ids': `rest-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${singleUnitIndex + 1}`
        }
      )
      addPropertiesToElement(
        restBody,
        {
          'ref-ids': `unit-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${singleUnitIndex + 1}`
        }
      )
      addPropertiesToElement(
        restBody,
        {
          'ref-ids': `note-with-index-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${singleUnitIndex + 1}-1`
        }
      )
      const dotsWithCoordinates = singleUnitDots(numberOfStaveLines, [ restNote ], numberOfDots, unitDuration, stemDirection, anyWholeTones, anyNotesOnAdditionalStaveLines, withFlags, isRest, isGrace)(styles, restBody.right, topOffset)
      addPropertiesToElement(
        dotsWithCoordinates,
        {
          'ref-ids': `dots-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${singleUnitIndex + 1}`
        }
      )
      const stemPoint = stemDirection === 'up' ? restBody.right : restBody.left

      const singleUnit = elementWithAdditionalInformation(
        group(
          'singleUnit',
          [
            restBody,
            dotsWithCoordinates
          ]
        ),
        {
          measureIndexOnPageLine,
          measureIndexInGeneral,
          staveIndex,
          voiceIndex,
          singleUnitIndex,
          containsNotesOnCurrentStave,
          containsNotesOnPrevStave,
          containsNotesOnNextStave,
          containsKeysOnCurrentStave,
          containsKeysOnPrevStave,
          containsKeysOnNextStave,
          isRest,
          isOnlyUnitOnStaveWithoutMidMeasureElementsOrLyricsOrChordLettersOrSimilesOnThatStave,
          isFullMeasure,
          isFullMeasureAndShouldBeCentralizedBecauseOfThat,
          isSimile,
          isGrace,
          isGraceUnitAndNextUnitIsNotGrace,
          hasGraceCrushLine: false,
          tiedWithNext,
          slurMarks,
          tiedBefore,
          tiedAfter,
          tiedBeforeMeasure,
          tiedAfterMeasure,
          glissandoMarks,
          tupletMarks,
          octaveSignMark,
          pedalMark,
          dynamicChangeMark,
          isOnLastMeasureOfPageLine,
          isLastSingleUnitInVoiceOnPageLine,
          anyWholeTones: false,
          anyNotesOnAdditionalStaveLines: false,
          unitDuration,
          actualDuration,
          sortedNotes: [ restNote ],
          sortedNotesPositionNumbers: [ restPositionNumber ],
          stemDirection,
          withFlags: false,
          beamedWithNext,
          beamedWithNextWithJustOneBeam,
          beamedWithPrevious,
          beamed,
          numberOfDots,
          keysParams,
          arpeggiated,
          articulationParams,
          stemless,
          tremoloDurationFactor: 1,
          numberOfTremoloStrokes: 0,
          hasConnectedTremolo: false,
          tremoloWithNext: false,
          tremoloWithPrevious: false,
          notesWithCoordinates: [ restBody ],
          notesPositionNumbersInNonIndentedPartOfSingleUnit: [ restPositionNumber ],
          notesPositionNumbersInIndentedPartOfSingleUnit: [],
          nonIndentedPartOfSingleUnitWithCoordinates: {
            isEmpty: true,
            name: 'g',
            transformations: [],
            top: restBody.top,
            right: restBody.right,
            bottom: restBody.bottom,
            left: restBody.left
          },
          bodyTop: restBody.top,
          bodyRight: restBody.right,
          bodyLeft: restBody.left,
          bodyBottom: restBody.bottom,
          stemTop: restBody.top,
          stemRight: stemPoint,
          stemBottom: restBody.bottom,
          stemLeft: stemPoint,
          dotsTop: dotsWithCoordinates.top,
          dotsRight: dotsWithCoordinates.right,
          dotsBottom: dotsWithCoordinates.bottom,
          dotsLeft: dotsWithCoordinates.left
        }
      )
      return singleUnit
    }

    const anyNotesOnAdditionalStaveLines = areAnyNotesOnAdditionalStaveLinesInSingleUnit(numberOfStaveLines, sortedNotesPositionNumbers)
    const anyWholeTones = areAnyWholeTonesInSingleUnit(sortedNotes)
    const numberOfTremoloStrokes = calculatedNumberOfTremoloStrokes(unitDuration, tremoloParams)

    const notesForIndentedPartOfUnit = calculatedNotesForIndentedPartOfSingleUnit(sortedNotes, stemDirection)
    const notesPositionNumbersInIndentedPartOfSingleUnit = notesForIndentedPartOfUnit.map(note => note.positionNumber)
    const notesForNonIndentedPartOfUnit = sortedNotes.filter(note => !note.indented)
    const notesPositionNumbersInNonIndentedPartOfSingleUnit = notesForNonIndentedPartOfUnit.map(note => note.positionNumber)

    const leftOffsetForUnitBody = leftOffset

    let nonIndentedPartOfSingleUnitWithCoordinates
    let indentedPartOfSingleUnitWithCoordinates
    let dotsWithCoordinates
    let stemWithCoordinates
    let chordFlagsWithCoordinates

    const isNoteOnEdgeInSingleUnitIsOnStaveLineInUnitwithFlags = noteOnEdgeInSingleUnitWithFlagsIsOnStaveLine(numberOfStaveLines, sortedNotes, withFlags, stemDirection)
    const isNoteOnEdgeInSingleUnitIsBetweenStaveLinesInUnitwithFlags = noteOnEdgeInSingleUnitWithFlagsIsBetweenStaveLines(numberOfStaveLines, sortedNotes, withFlags, stemDirection)

    const singleUnitBodyParts = []
    if (anyWholeTones) {
      const allNotesInNonIndentedUnitBodyAreGhosts = (stemDirection === 'up' ? notesForNonIndentedPartOfUnit : notesForIndentedPartOfUnit).every(note => note.isGhost)
      const calculatedAdditionalOffsetForIndentedPartOfUnit = additionalOffsetForIndentedPartOfUnit(unitDuration, isGrace, allNotesInNonIndentedUnitBodyAreGhosts, styles)
      if (stemDirection === 'up') {
        nonIndentedPartOfSingleUnitWithCoordinates = singleUnitBody(measureIndexInGeneral, staveIndex, voiceIndex, singleUnitIndex, numberOfStaveLines, notesForNonIndentedPartOfUnit, unitDuration, anyWholeTones, stemDirection, false, isGrace)(styles, leftOffsetForUnitBody, topOffset)
        indentedPartOfSingleUnitWithCoordinates = singleUnitBody(measureIndexInGeneral, staveIndex, voiceIndex, singleUnitIndex, numberOfStaveLines, notesForIndentedPartOfUnit, unitDuration, anyWholeTones, stemDirection, true, isGrace)(styles, nonIndentedPartOfSingleUnitWithCoordinates.right + calculatedAdditionalOffsetForIndentedPartOfUnit, topOffset)
        dotsWithCoordinates = singleUnitDots(numberOfStaveLines, sortedNotes, numberOfDots, unitDuration, stemDirection, anyWholeTones, anyNotesOnAdditionalStaveLines, withFlags, isRest, isGrace)(styles, indentedPartOfSingleUnitWithCoordinates.right, topOffset)
        addPropertiesToElement(
          dotsWithCoordinates,
          {
            'ref-ids': `dots-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${singleUnitIndex + 1}`
          }
        )
      } else {
        indentedPartOfSingleUnitWithCoordinates = singleUnitBody(measureIndexInGeneral, staveIndex, voiceIndex, singleUnitIndex, numberOfStaveLines, notesForIndentedPartOfUnit, unitDuration, anyWholeTones, stemDirection, true, isGrace)(styles, leftOffsetForUnitBody, topOffset)
        nonIndentedPartOfSingleUnitWithCoordinates = singleUnitBody(measureIndexInGeneral, staveIndex, voiceIndex, singleUnitIndex, numberOfStaveLines, notesForNonIndentedPartOfUnit, unitDuration, anyWholeTones, stemDirection, false, isGrace)(styles, indentedPartOfSingleUnitWithCoordinates.right + calculatedAdditionalOffsetForIndentedPartOfUnit, topOffset)
        dotsWithCoordinates = singleUnitDots(numberOfStaveLines, sortedNotes, numberOfDots, unitDuration, stemDirection, anyWholeTones, anyNotesOnAdditionalStaveLines, withFlags, isRest, isGrace)(styles, nonIndentedPartOfSingleUnitWithCoordinates.right, topOffset)
        addPropertiesToElement(
          dotsWithCoordinates,
          {
            'ref-ids': `dots-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${singleUnitIndex + 1}`
          }
        )
      }
      if (!stemless) {
        stemWithCoordinates = stemForSingleUnit(numberOfStaveLines, styles, sortedNotes, withFlags, numberOfTremoloStrokes, hasConnectedTremolo, nonIndentedPartOfSingleUnitWithCoordinates, indentedPartOfSingleUnitWithCoordinates, notesForNonIndentedPartOfUnit, notesForIndentedPartOfUnit, unitDuration, anyWholeTones, stemDirection, beamed, isNoteOnEdgeInSingleUnitIsOnStaveLineInUnitwithFlags, isNoteOnEdgeInSingleUnitIsBetweenStaveLinesInUnitwithFlags, thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsMoreThanMaxNotePositionNumberInCurrentSingleUnitOnTheSameStave, thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsLessThanMinNotePositionNumberInCurrentSingleUnitOnTheSameStave, isGrace)
        addPropertiesToElement(
          stemWithCoordinates,
          {
            'ref-ids': `stem-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${singleUnitIndex + 1}`
          }
        )
        if (withFlags) {
          chordFlagsWithCoordinates = flagsForSingleUnit(styles, unitDuration, stemWithCoordinates, stemDirection, isGrace)
          if (isGrace) {
            scaleElementAroundPoint(
              chordFlagsWithCoordinates,
              graceElementsScaleFactor,
              graceElementsScaleFactor,
              {
                x: chordFlagsWithCoordinates.left,
                y: chordFlagsWithCoordinates.stemEndY
              }
            )
          }
        }
      }
      singleUnitBodyParts.push(
        nonIndentedPartOfSingleUnitWithCoordinates,
        indentedPartOfSingleUnitWithCoordinates
      )
    } else {
      nonIndentedPartOfSingleUnitWithCoordinates = singleUnitBody(measureIndexInGeneral, staveIndex, voiceIndex, singleUnitIndex, numberOfStaveLines, notesForNonIndentedPartOfUnit, unitDuration, anyWholeTones, stemDirection, false, isGrace)(styles, leftOffsetForUnitBody, topOffset)
      dotsWithCoordinates = singleUnitDots(numberOfStaveLines, sortedNotes, numberOfDots, unitDuration, stemDirection, anyWholeTones, anyNotesOnAdditionalStaveLines, withFlags, isRest, isGrace)(styles, nonIndentedPartOfSingleUnitWithCoordinates.right, topOffset)
      addPropertiesToElement(
        dotsWithCoordinates,
        {
          'ref-ids': `dots-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${singleUnitIndex + 1}`
        }
      )
      if (!stemless) {
        stemWithCoordinates = stemForSingleUnit(numberOfStaveLines, styles, sortedNotes, withFlags, numberOfTremoloStrokes, hasConnectedTremolo, nonIndentedPartOfSingleUnitWithCoordinates, null, notesForNonIndentedPartOfUnit, null, unitDuration, anyWholeTones, stemDirection, beamed, isNoteOnEdgeInSingleUnitIsOnStaveLineInUnitwithFlags, isNoteOnEdgeInSingleUnitIsBetweenStaveLinesInUnitwithFlags, thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsMoreThanMaxNotePositionNumberInCurrentSingleUnitOnTheSameStave, thereAreNotesInTheSameCrossStaveUnitThatTheirPositionNumberIsLessThanMinNotePositionNumberInCurrentSingleUnitOnTheSameStave, isGrace)
        addPropertiesToElement(
          stemWithCoordinates,
          {
            'ref-ids': `stem-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${singleUnitIndex + 1}`
          }
        )
        if (withFlags) {
          chordFlagsWithCoordinates = flagsForSingleUnit(styles, unitDuration, stemWithCoordinates, stemDirection, isGrace)
          if (isGrace) {
            scaleElementAroundPoint(
              chordFlagsWithCoordinates,
              graceElementsScaleFactor,
              graceElementsScaleFactor,
              {
                x: chordFlagsWithCoordinates.left,
                y: chordFlagsWithCoordinates.stemEndY
              }
            )
          }
        }
      }
      singleUnitBodyParts.push(
        nonIndentedPartOfSingleUnitWithCoordinates
      )
    }
    const groupForSingleUnitBodyParts = group(
      'singleUnitBodyParts',
      singleUnitBodyParts
    )
    addPropertiesToElement(
      groupForSingleUnitBodyParts,
      {
        'ref-ids': `unit-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${singleUnitIndex + 1}`
      }
    )

    let notesWithCoordinates = []
    if (nonIndentedPartOfSingleUnitWithCoordinates) {
      notesWithCoordinates.push(...nonIndentedPartOfSingleUnitWithCoordinates.notes)
    }
    if (indentedPartOfSingleUnitWithCoordinates) {
      notesWithCoordinates.push(...indentedPartOfSingleUnitWithCoordinates.notes)
    }
    notesWithCoordinates = notesWithCoordinates.sort((n1, n2) => n1.top - n2.top)
    notesWithCoordinates.forEach((noteWithCoordinates, noteIndex) => {
      addPropertiesToElement(
        noteWithCoordinates,
        {
          'ref-ids': `note-with-index-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${singleUnitIndex + 1}-${noteIndex + 1}`
        }
      )
    })

    const additionalInformation = {
      measureIndexOnPageLine,
      measureIndexInGeneral,
      staveIndex,
      voiceIndex,
      singleUnitIndex,
      containsNotesOnCurrentStave,
      containsNotesOnPrevStave,
      containsNotesOnNextStave,
      containsKeysOnCurrentStave,
      containsKeysOnPrevStave,
      containsKeysOnNextStave,
      isRest,
      isOnlyUnitOnStaveWithoutMidMeasureElementsOrLyricsOrChordLettersOrSimilesOnThatStave,
      isFullMeasure,
      isFullMeasureAndShouldBeCentralizedBecauseOfThat,
      isSimile,
      isGrace,
      isGraceUnitAndNextUnitIsNotGrace,
      hasGraceCrushLine,
      tiedWithNext,
      slurMarks,
      tiedBefore,
      tiedAfter,
      tiedBeforeMeasure,
      tiedAfterMeasure,
      glissandoMarks,
      tupletMarks,
      octaveSignMark,
      pedalMark,
      dynamicChangeMark,
      isOnLastMeasureOfPageLine,
      isLastSingleUnitInVoiceOnPageLine,
      anyWholeTones,
      anyNotesOnAdditionalStaveLines,
      isNoteOnEdgeInSingleUnitIsBetweenStaveLinesInUnitwithFlags,
      isNoteOnEdgeInSingleUnitIsOnStaveLineInUnitwithFlags,
      unitDuration,
      actualDuration,
      sortedNotes,
      sortedNotesPositionNumbers,
      stemDirection,
      withFlags,
      beamedWithNext,
      beamedWithNextWithJustOneBeam,
      beamedWithPrevious,
      beamed,
      numberOfDots,
      keysParams,
      arpeggiated,
      articulationParams,
      notesPositionNumbersInIndentedPartOfSingleUnit,
      notesPositionNumbersInNonIndentedPartOfSingleUnit,
      indentedPartOfSingleUnitWithCoordinates,
      nonIndentedPartOfSingleUnitWithCoordinates,
      notesWithCoordinates,
      stemless,
      tremoloDurationFactor: tremoloParams ? tremoloParams.tremoloDurationFactor : 1,
      numberOfTremoloStrokes,
      hasConnectedTremolo,
      tremoloWithNext,
      tremoloWithPrevious,
      bodyTop: groupForSingleUnitBodyParts.top,
      bodyRight: groupForSingleUnitBodyParts.right,
      bodyLeft: groupForSingleUnitBodyParts.left,
      bodyBottom: groupForSingleUnitBodyParts.bottom,
      stemTop: stemWithCoordinates ? stemWithCoordinates.top : groupForSingleUnitBodyParts.top,
      stemRight: stemWithCoordinates ? stemWithCoordinates.right : (stemDirection === 'up' ? nonIndentedPartOfSingleUnitWithCoordinates.right : nonIndentedPartOfSingleUnitWithCoordinates.left),
      stemBottom: stemWithCoordinates ? stemWithCoordinates.bottom : groupForSingleUnitBodyParts.bottom,
      stemLeft: stemWithCoordinates ? stemWithCoordinates.left : (stemDirection === 'up' ? nonIndentedPartOfSingleUnitWithCoordinates.right : nonIndentedPartOfSingleUnitWithCoordinates.left),
      flagsTop: chordFlagsWithCoordinates ? chordFlagsWithCoordinates.top : undefined,
      flagsRight: chordFlagsWithCoordinates ? chordFlagsWithCoordinates.right : undefined,
      flagsBottom: chordFlagsWithCoordinates ? chordFlagsWithCoordinates.bottom : undefined,
      flagsLeft: chordFlagsWithCoordinates ? chordFlagsWithCoordinates.right : undefined,
      dotsTop: dotsWithCoordinates.top,
      dotsRight: dotsWithCoordinates.right,
      dotsBottom: dotsWithCoordinates.bottom,
      dotsLeft: dotsWithCoordinates.left
    }

    let singleUnit = elementWithAdditionalInformation(
      group(
        'singleUnit',
        [
          groupForSingleUnitBodyParts,
          dotsWithCoordinates,
          stemWithCoordinates,
          chordFlagsWithCoordinates
        ]
      ),
      additionalInformation
    )

    if (parentheses.length > 0) {
      return singleUnitWithParentheses(singleUnit, additionalInformation, numberOfStaveLines, parentheses, topOffset, styles)
    }

    return singleUnit
  }
}
