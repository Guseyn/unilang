'use strict'

import line from './../basic/line.js'

export default function (drawnVoicesOnPageLine, styles) {
  const { intervalBetweenStaveLines, additionalStaveLinesStrokeOptions, additionalStaveLinesRadiusFromNoteBody, graceElementsScaleFactor } = styles
  const drawnAdditionalStaveLines = []
  for (let measureIndex = 0; measureIndex < drawnVoicesOnPageLine.length; measureIndex++) {
    if (drawnVoicesOnPageLine[measureIndex]) {
      const { drawnSingleUnitsInAllCrossStaveUnits, numberOfStaveLines, topOffsetsForEachStave, withoutVoices } = drawnVoicesOnPageLine[measureIndex]
      if (!withoutVoices) {
        for (let crossStaveUnitIndex = 0; crossStaveUnitIndex < drawnSingleUnitsInAllCrossStaveUnits.length; crossStaveUnitIndex++) {
          const currentCrossStaveUnit = drawnSingleUnitsInAllCrossStaveUnits[crossStaveUnitIndex]
          const informationThatHelpsToDrawAdditionalStaveLines = {}
          for (let crossVoiceUnitIndex = 0; crossVoiceUnitIndex < currentCrossStaveUnit.length; crossVoiceUnitIndex++) {
            const currentCrossVoiceUnitInCurrentCrossStaveUnit = currentCrossStaveUnit[crossVoiceUnitIndex]
            for (let singleUnitIndex = 0; singleUnitIndex < currentCrossVoiceUnitInCurrentCrossStaveUnit.length; singleUnitIndex++) {
              const currentSingleUnit = currentCrossVoiceUnitInCurrentCrossStaveUnit[singleUnitIndex]
              const additionalStaveLinesShouldBeDrawn = !currentSingleUnit.isRest || currentSingleUnit.unitDuration === 1 || currentSingleUnit.unitDuration === 1 / 2
              if (additionalStaveLinesShouldBeDrawn) {
                for (let noteIndex = 0; noteIndex < currentSingleUnit.notesWithCoordinates.length; noteIndex++) {
                  const currentNote = currentSingleUnit.notesWithCoordinates[noteIndex]
                  let staveIndex = currentSingleUnit.staveIndex
                  if (currentNote.stave === 'prev') {
                    staveIndex -= 1
                  } else if (currentNote.stave === 'next') {
                    staveIndex += 1
                  }
                  if (!informationThatHelpsToDrawAdditionalStaveLines[staveIndex]) {
                    informationThatHelpsToDrawAdditionalStaveLines[staveIndex] = {
                      aboveMainStaveLines: {
                        notesByPositions: {},
                        minLeft: undefined,
                        maxRight: undefined,
                        minNotePosition: undefined
                      },
                      belowMainStaveLines: {
                        notesByPositions: {},
                        minLeft: undefined,
                        maxRight: undefined,
                        maxNotePosition: undefined
                      }
                    }
                    if (currentSingleUnit.isGrace) {
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].isGrace = true
                    }
                  }
                  if (currentNote.positionNumber < -0.5) {
                    if (!informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.notesByPositions[currentNote.positionNumber]) {
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.notesByPositions[currentNote.positionNumber] = []
                    }
                    informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.notesByPositions[currentNote.positionNumber].push(
                      currentNote
                    )
                    if (informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.minLeft === undefined || informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.minLeft > currentNote.left) {
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.minLeft = currentNote.left
                    }
                    if (informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.maxRight === undefined || informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.maxRight < currentNote.right) {
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.maxRight = currentNote.right
                    }
                    if (informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.minNotePosition === undefined || informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.minNotePosition > currentNote.positionNumber) {
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.minNotePosition = currentNote.positionNumber
                    }
                  }
                  if (currentNote.positionNumber > numberOfStaveLines - 0.5) {
                    if (!informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.notesByPositions[currentNote.positionNumber]) {
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.notesByPositions[currentNote.positionNumber] = []
                    }
                    informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.notesByPositions[currentNote.positionNumber].push(
                      currentNote
                    )
                    if (informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.minLeft === undefined || informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.minLeft > currentNote.left) {
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.minLeft = currentNote.left
                    }
                    if (informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.maxRight === undefined || informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.maxRight < currentNote.right) {
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.maxRight = currentNote.right
                    }
                    if (informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.maxNotePosition === undefined || informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.maxNotePosition < currentNote.positionNumber) {
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.maxNotePosition = currentNote.positionNumber
                    }
                  }
                }
              }
            }
          }
          for (let staveIndex in informationThatHelpsToDrawAdditionalStaveLines) {
            const tunedAdditionalLinesStrokeOptions = Object.assign({}, additionalStaveLinesStrokeOptions)
            let tunedAdditionalLinesOffsetFromNoteBody = additionalStaveLinesRadiusFromNoteBody
            if (topOffsetsForEachStave[staveIndex] !== undefined) {
              if (informationThatHelpsToDrawAdditionalStaveLines[staveIndex].isGrace) {
                tunedAdditionalLinesStrokeOptions.width *= graceElementsScaleFactor
                tunedAdditionalLinesOffsetFromNoteBody *= graceElementsScaleFactor
              }
              for (let positionIndex = -1; positionIndex >= informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.minNotePosition; positionIndex -= 1) {
                const topOffsetForAdditionalLine = topOffsetsForEachStave[staveIndex] + positionIndex * intervalBetweenStaveLines
                if (positionIndex === informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.minNotePosition) {
                  const minLeft = Math.min(...informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.notesByPositions[positionIndex].map(note => note.left))
                  const maxRight = Math.max(...informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.notesByPositions[positionIndex].map(note => note.right))
                  drawnAdditionalStaveLines.push(
                    line(
                      minLeft - tunedAdditionalLinesOffsetFromNoteBody,
                      topOffsetForAdditionalLine,
                      maxRight + tunedAdditionalLinesOffsetFromNoteBody,
                      topOffsetForAdditionalLine,
                      tunedAdditionalLinesStrokeOptions,
                      0, 0,
                      'additionalStaveLine'
                    )
                  )
                } else {
                  drawnAdditionalStaveLines.push(
                    line(
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.minLeft - tunedAdditionalLinesOffsetFromNoteBody,
                      topOffsetForAdditionalLine,
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].aboveMainStaveLines.maxRight + tunedAdditionalLinesOffsetFromNoteBody,
                      topOffsetForAdditionalLine,
                      tunedAdditionalLinesStrokeOptions,
                      0, 0,
                      'additionalStaveLine'
                    )
                  )
                }
              }
              for (let positionIndex = numberOfStaveLines; positionIndex <= informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.maxNotePosition; positionIndex += 1) {
                const topOffsetForAdditionalLine = topOffsetsForEachStave[staveIndex] + positionIndex * intervalBetweenStaveLines
                if (positionIndex === informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.maxNotePosition) {
                  const minLeft = Math.min(...informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.notesByPositions[positionIndex].map(note => note.left))
                  const maxRight = Math.max(...informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.notesByPositions[positionIndex].map(note => note.right))
                  drawnAdditionalStaveLines.push(
                    line(
                      minLeft - tunedAdditionalLinesOffsetFromNoteBody,
                      topOffsetForAdditionalLine,
                      maxRight + tunedAdditionalLinesOffsetFromNoteBody,
                      topOffsetForAdditionalLine,
                      tunedAdditionalLinesStrokeOptions,
                      0, 0,
                      'additionalStaveLine'
                    )
                  )
                } else {
                  drawnAdditionalStaveLines.push(
                    line(
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.minLeft - tunedAdditionalLinesOffsetFromNoteBody,
                      topOffsetForAdditionalLine,
                      informationThatHelpsToDrawAdditionalStaveLines[staveIndex].belowMainStaveLines.maxRight + tunedAdditionalLinesOffsetFromNoteBody,
                      topOffsetForAdditionalLine,
                      tunedAdditionalLinesStrokeOptions,
                      0, 0,
                      'additionalStaveLine'
                    )
                  )
                }
              }
            }
          }
        }
      }
    }
  }
  return drawnAdditionalStaveLines
}
