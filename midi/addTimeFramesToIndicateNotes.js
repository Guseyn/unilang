'use strict'

const splitNoteInTremoloNotes = require('./splitNoteInTremoloNotes')

module.exports = (unitParams, notesSplittedInTimeFrames, unitActualDuration, unitDurationInSeconds, calculatedOctaveAdjustmentForUnitParams, graceCountersForEachVoiceInEachStaveSplittedInTimeFrames, time, staveVoiceKey) => {
  if (unitParams.notes) {
    for (let noteIndex = 0; noteIndex < unitParams.notes.length; noteIndex++) {
      const note = unitParams.notes[noteIndex]
      if (unitParams.isGrace) {
        note.graceCount = graceCountersForEachVoiceInEachStaveSplittedInTimeFrames[time][staveVoiceKey]
      }

      note.time = time
      note.actualDuration = unitActualDuration
      note.durationInSeconds = unitDurationInSeconds
      note.octaveSignAdjustment = calculatedOctaveAdjustmentForUnitParams
      note.unitIsLastSingleUnitInVoiceOnPageLine = unitParams.isLastSingleUnitInVoiceOnPageLine
      note.unitIsLastSingleUnitOnPageInVoice = unitParams.isLastSingleUnitOnPageInVoice
      splitNoteInTremoloNotes(note)
      notesSplittedInTimeFrames[note.time] = notesSplittedInTimeFrames[note.time] || []
      notesSplittedInTimeFrames[note.time].push(note)
    }
  }
}
