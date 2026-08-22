'use sttrict'

export default function (unitDuration, isGrace, allNotesInNonIndentedUnitBodyAreGhosts, styles) {
  const { additionalOffsetForIndentedPartOfUnitWithWholeDuration, additionalOffsetForIndentedPartOfUnitWithQuadrupleDuration, additionalOffsetForIndentedPartOfUnitWithDoubleDuration, additionalOffsetForIndentedPartOfUnitWithAllGhostNotes, noteStemStrokeOptions, graceElementsScaleFactor } = styles
  const graceFactor = isGrace ? graceElementsScaleFactor : 1
  if (unitDuration === 1) {
    return additionalOffsetForIndentedPartOfUnitWithWholeDuration * graceFactor
  }
  if (unitDuration === 2) {
    return additionalOffsetForIndentedPartOfUnitWithDoubleDuration * graceFactor
  }
  if (unitDuration === 4) {
    return additionalOffsetForIndentedPartOfUnitWithQuadrupleDuration * graceFactor
  }
  if (allNotesInNonIndentedUnitBodyAreGhosts) {
    return additionalOffsetForIndentedPartOfUnitWithAllGhostNotes * graceFactor
  }
  return -noteStemStrokeOptions.width / 2 * graceFactor
}
