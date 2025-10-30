'use strict'

const polyline = require('./../basic/polyline')
const text = require('./../basic/text')
const moveElement = require('./../basic/moveElement')
const group = require('./../basic/group')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (voltaStructure, styles) => {
  const { voltaColumnHeight, voltaStrokeOptions, voltaValueFontOptions, voltaValueLeftOffset, voltaValueTopOffset, intervalBetweenStaveLines } = styles
  const voltaComponents = []
  const voltaShapePoints = []
  if (voltaStructure.withLeftColumn) {
    voltaShapePoints.push(
      voltaStructure.left, voltaStructure.top,
      voltaStructure.left, voltaStructure.top - voltaColumnHeight
    )
  } else {
    voltaShapePoints.push(
      voltaStructure.left, voltaStructure.top - voltaColumnHeight
    )
  }
  voltaShapePoints.push(
    voltaStructure.right, voltaStructure.top - voltaColumnHeight
  )
  if (voltaStructure.withRightColumn) {
    voltaShapePoints.push(
      voltaStructure.right, voltaStructure.top
    )
  }
  const voltaBrackets = polyline(
    voltaShapePoints,
    voltaStrokeOptions,
    false
  )
  voltaComponents.push(
    voltaBrackets
  )
  if (voltaStructure.value) {
    let voltaValueText = text(voltaStructure.value, voltaValueFontOptions)(
      styles,
      voltaStructure.left + voltaValueLeftOffset,
      voltaStructure.top
    )
    addPropertiesToElement(
      voltaValueText,
      {
        'ref-ids': voltaStructure.key.replace('volta-mark', 'volta-mark-text')
      }
    )
    moveElement(
      voltaValueText,
      0,
      voltaStructure.top - voltaColumnHeight - voltaValueText.top + voltaValueTopOffset
    )
    voltaComponents.push(
      voltaValueText
    )
  }
  const volta = group(
    'volta',
    voltaComponents
  )
  moveElement(
    volta,
    0,
    (voltaStructure.yCorrection || 0) * intervalBetweenStaveLines
  )
  return volta
}
