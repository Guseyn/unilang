'use strict'

const topOffsetOfElementConsideringItsStave = require('./../stave/topOffsetOfElementConsideringItsStave')
const path = require('./../basic/path')
const scaleElementAroundPoint = require('./../basic/scaleElementAroundPoint')
const group = require('./../basic/group')

const noteInWholeToneWithNoteAbove = (note, noteIndex, sortedNotes) => {
  const wholeToneDelta = 0.5
  return (
    (sortedNotes[noteIndex - 1] !== undefined) &&
    (sortedNotes[noteIndex].stave === sortedNotes[noteIndex - 1].stave) &&
    (sortedNotes[noteIndex].positionNumber - sortedNotes[noteIndex - 1].positionNumber === wholeToneDelta)
  )
}

const noteInWholeToneWithNoteBelow = (note, noteIndex, sortedNotes) => {
  const wholeToneDelta = 0.5
  return (
    (sortedNotes[noteIndex + 1] !== undefined) &&
    (sortedNotes[noteIndex + 1].stave === sortedNotes[noteIndex].stave) &&
    (sortedNotes[noteIndex + 1].positionNumber - sortedNotes[noteIndex].positionNumber === wholeToneDelta)
  )
}

const noteInWholeToneWithNotesAboveAndBelow = (note, noteIndex, sortedNotes) => {
  return noteInWholeToneWithNoteAbove(note, noteIndex, sortedNotes) &&
    noteInWholeToneWithNoteBelow(note, noteIndex, sortedNotes)
}

module.exports = (numberOfStaveLines, sortedNotes, numberOfDots, unitDuration, stemDirection, anyWholeTonesInSingleUnit, anyNotesOnAdditionalStaveLines, withFlags, isRest, isGrace) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaveLines, fontColor, noteDot, distanceBetweenDots, leftOffsetForDotsInSingleUnitWithNotesOnStaveLinesAndStemDirectionIsUpAndUnitDurationIsEqualToEighth, leftOffsetForDotsInSingleUnitWithNotesOnStaveLinesAndStemDirectionIsUpAndUnitDurationIsLessThanEighth, leftOffsetForDotsInSingleUnit, graceElementsScaleFactor } = styles
    const singleUnitsDotsWithCoordinates = []
    const tunedDistanceBetweenDots = distanceBetweenDots * (isGrace ? graceElementsScaleFactor : 1)
    if (isRest) {
      const rest = sortedNotes[0]
      const restPositionNumber = rest.positionNumber
      const isRestOnStaveLine = Math.abs(restPositionNumber * 10 % 2) === 0
      const topOffsetForDots = topOffset +
        (isRestOnStaveLine ? (restPositionNumber - 0.5) : restPositionNumber) * intervalBetweenStaveLines +
        ((isRestOnStaveLine && unitDuration === 1) ? 1 * intervalBetweenStaveLines : 0) +
        ((!isRestOnStaveLine && unitDuration === 1 / 2) ? -1 * intervalBetweenStaveLines : 0)
      const topOffsetForDotsConsideringItsStave = topOffsetOfElementConsideringItsStave(rest, numberOfStaveLines, topOffsetForDots, styles) + noteDot.yCorrection
      let lastLeftOffset = leftOffset + leftOffsetForDotsInSingleUnit
      for (let i = 0; i < numberOfDots; i++) {
        const drawnDot = path(
          noteDot.points,
          null,
          fontColor,
          lastLeftOffset,
          topOffsetForDotsConsideringItsStave
        )
        lastLeftOffset = drawnDot.right + tunedDistanceBetweenDots
        if (isGrace) {
          scaleElementAroundPoint(
            drawnDot,
            graceElementsScaleFactor,
            graceElementsScaleFactor,
            {
              x: drawnDot.left,
              y: (drawnDot.top + drawnDot.bottom) / 2
            }
          )
        }
        singleUnitsDotsWithCoordinates.push(drawnDot)
      }
      return group(
        'singleUnitsDots',
        singleUnitsDotsWithCoordinates
      )
    }

    const leftOffsetForDots = leftOffset +
      (
        unitDuration <= 1 / 8 && stemDirection === 'up' && withFlags
          ? unitDuration === 1 / 8
            ? leftOffsetForDotsInSingleUnitWithNotesOnStaveLinesAndStemDirectionIsUpAndUnitDurationIsEqualToEighth
            : leftOffsetForDotsInSingleUnitWithNotesOnStaveLinesAndStemDirectionIsUpAndUnitDurationIsLessThanEighth
          : leftOffsetForDotsInSingleUnit
      )
    sortedNotes.forEach((note, noteIndex) => {
      const notePositionNumber = note.positionNumber
      const isNoteOnStaveLine = Math.abs(notePositionNumber * 10 % 2) === 0
      const isNoteInWholeToneWithNotesAboveAndBelow = noteInWholeToneWithNotesAboveAndBelow(note, noteIndex, sortedNotes)
      if (!(isNoteInWholeToneWithNotesAboveAndBelow && isNoteOnStaveLine)) {
        const isNoteInWholeToneWithNoteAbove = noteInWholeToneWithNoteAbove(note, noteIndex, sortedNotes)
        const isLastNote = noteIndex === (sortedNotes.length - 1)
        const topOffsetForDots = topOffset +
          (isNoteOnStaveLine ? (notePositionNumber - 0.5) : notePositionNumber) * intervalBetweenStaveLines +
          ((isLastNote && isNoteOnStaveLine && isNoteInWholeToneWithNoteAbove) ? 1 * intervalBetweenStaveLines : 0) +
          noteDot.yCorrection
        const topOffsetForDotsConsideringItsStave = topOffsetOfElementConsideringItsStave(note, numberOfStaveLines, topOffsetForDots, styles)
        let lastLeftOffset = leftOffsetForDots
        for (let i = 0; i < numberOfDots; i++) {
          const drawnDot = path(
            noteDot.points,
            null,
            fontColor,
            lastLeftOffset,
            topOffsetForDotsConsideringItsStave
          )
          lastLeftOffset = drawnDot.right + tunedDistanceBetweenDots
          if (isGrace) {
            scaleElementAroundPoint(
              drawnDot,
              graceElementsScaleFactor,
              graceElementsScaleFactor,
              {
                x: drawnDot.left,
                y: (drawnDot.top + drawnDot.bottom) / 2
              }
            )
          }
          singleUnitsDotsWithCoordinates.push(drawnDot)
        }
      }
    })
    return group(
      'singleUnitsDots',
      singleUnitsDotsWithCoordinates
    )
  }
}
