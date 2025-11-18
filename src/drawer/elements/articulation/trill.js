'use strict'

import path from '#unilang/drawer/elements/basic/path.js'
import wave from '#unilang/drawer/elements/basic/wave.js'
import group from '#unilang/drawer/elements/basic/group.js'
import articulationShouldBeAboveOrUnderStemLine from '#unilang/drawer/elements/articulation/articulationShouldBeAboveOrUnderStemLine.js'
import articulationKeysInVerticalLine from '#unilang/drawer/elements/articulation/articulationKeysInVerticalLine.js'
import moveElement from '#unilang/drawer/elements/basic/moveElement.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (drawnSingleUnit, articulationIndex, nextDrawnSingleUnit, currentArticulationParams, topOfCurrentStave, bottomOfCurrentStave, styles) {
  const components = []
  const { fontColor, trill, trillWavePeriod, trillWaveOffsetFromText, trillMinWaveLength, trillWaveOffsetFromNextSingleUnit } = styles
  const { direction, keyAbove, keyBelow, withWave } = currentArticulationParams
  const shouldBeAboveOrUnderStemLine = articulationShouldBeAboveOrUnderStemLine(drawnSingleUnit, direction)
  const leftEdge = drawnSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.left
  const rightEdge = drawnSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.right
  const startYPosition = direction === 'up'
    ? Math.min(drawnSingleUnit.top, topOfCurrentStave)
    : Math.max(drawnSingleUnit.bottom, bottomOfCurrentStave)
  const trillText = path(
    trill.points,
    null,
    fontColor,
    0,
    startYPosition
  )
  components.push(
    trillText
  )
  if (keyAbove) {
    components.push(
      articulationKeysInVerticalLine(drawnSingleUnit, articulationIndex, keyAbove, trillText, 'above', styles)
    )
  }
  if (keyBelow) {
    components.push(
      articulationKeysInVerticalLine(drawnSingleUnit, articulationIndex, keyBelow, trillText, 'below', styles)
    )
  }
  if (withWave) {
    const trillYCenter = (trillText.top + trillText.bottom) / 2
    const waveStartX = trillText.right + trillWaveOffsetFromText
    const waveEndX = waveStartX + (
      nextDrawnSingleUnit
        ? (nextDrawnSingleUnit.left - drawnSingleUnit.right - trillWaveOffsetFromNextSingleUnit)
        : trillMinWaveLength
    )
    const drawnWave = wave(
      { x: waveStartX, y: trillYCenter },
      { x: waveEndX, y: trillYCenter },
      trillWavePeriod,
      fontColor
    )
    addPropertiesToElement(
      drawnWave,
      {
        'ref-ids': `articulation-wave-${drawnSingleUnit.measureIndexInGeneral + 1}-${drawnSingleUnit.staveIndex + 1}-${drawnSingleUnit.voiceIndex + 1}-${drawnSingleUnit.singleUnitIndex + 1}-${articulationIndex + 1}`
      }
    )
    components.push(
      drawnWave
    )
  }
  let groupedTrill = group(
    'trill',
    components
  )
  const trillXCenter = (trillText.right + trillText.left) / 2
  const xCoordinateWhereTrillBelongs = shouldBeAboveOrUnderStemLine
    ? drawnSingleUnit.stemLeft - trillXCenter
    : (leftEdge + rightEdge) / 2 - trillXCenter
  moveElement(
    groupedTrill,
    xCoordinateWhereTrillBelongs,
    direction === 'up'
      ? (startYPosition - groupedTrill.bottom - trill.yOffset)
      : (startYPosition - groupedTrill.top + trill.yOffset)
  )
  return groupedTrill
}
