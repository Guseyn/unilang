'use strict'

import line from '/js/unilang-in-worker-environment/drawer/elements/basic/line.js'
import elementWithAdditionalInformation from '/js/unilang-in-worker-environment/drawer/elements/basic/elementWithAdditionalInformation.js'

export default function (styles, stemPlaceholderLeft, stemPlaceholderYStart, stemPlaceholderYEnd, isGrace) {
  const { noteSquareStemStrokeOptions, graceElementsScaleFactor } = styles
  const tunedNoteSquareStemStrokeOptions = Object.assign({}, noteSquareStemStrokeOptions)
  if (isGrace) {
    tunedNoteSquareStemStrokeOptions.width *= graceElementsScaleFactor
  }
  return elementWithAdditionalInformation(
    line(
      stemPlaceholderLeft,
      stemPlaceholderYStart,
      stemPlaceholderLeft,
      stemPlaceholderYEnd,
      tunedNoteSquareStemStrokeOptions,
      0, 0, 'stemForBeamedSingleUnit'
    ),
    {
      isGrace
    }
  )
}
