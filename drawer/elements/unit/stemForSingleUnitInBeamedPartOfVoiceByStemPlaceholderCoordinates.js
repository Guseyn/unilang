'use strict'

const line = require('./../basic/line')
const elementWithAdditionalInformation = require('./../basic/elementWithAdditionalInformation')

module.exports = (styles, stemPlaceholderLeft, stemPlaceholderYStart, stemPlaceholderYEnd, isGrace) => {
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
