'use strict'

module.exports = (note, startTime, endTime, timeStampsMappedWithRefsOn, refsOnMappedWithTimeStamps) => {
  const noteTimeOn = startTime.toFixed(4) * 1
  let noteRefId
  if (note.isRepetition) {
    noteRefId = `unit-${note.measureIndexOnPage + 1}-${note.staveIndex + 1}-${note.voiceIndex + 1}-${note.unitIndex + 1}`
  }
  if (note.isRest && !note.isRepetition) {
    noteRefId = `rest-${note.measureIndexOnPage + 1}-${note.staveIndex + 1}-${note.voiceIndex + 1}-${note.unitIndex + 1}`
  }
  if (!note.isRest && !note.isRepetition) {
    noteRefId = `note-${note.measureIndexOnPage + 1}-${note.staveIndex + 1}-${note.voiceIndex + 1}-${note.unitIndex + 1}-${note.noteIndex + 1}`
  }
  timeStampsMappedWithRefsOn[noteTimeOn] = timeStampsMappedWithRefsOn[noteTimeOn] || []
  timeStampsMappedWithRefsOn[noteTimeOn].push({
    refId: noteRefId,
    duration: endTime - startTime,
    pageIndex: note.pageIndex,
    measureIndexOnPage: note.measureIndexOnPage
  })
  refsOnMappedWithTimeStamps[note.pageIndex] = refsOnMappedWithTimeStamps[note.pageIndex] || {}
  if (!refsOnMappedWithTimeStamps[note.pageIndex][noteRefId]) {
    refsOnMappedWithTimeStamps[note.pageIndex][noteRefId] = noteTimeOn
  }
}
