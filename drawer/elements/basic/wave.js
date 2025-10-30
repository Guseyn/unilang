'use strict'

const path = require('./path')
const group = require('./group')
const rotateElementAroundPoint = require('./rotateElementAroundPoint')
const scaleElementAroundPoint = require('./scaleElementAroundPoint')

module.exports = (startPoint, endPoint, wavePeriodSymbol, fontColor, graceElementsScaleFactor, isGrace, minNumberOfWavePeriods = 2, lastWavePeriodSymbol = null) => {
  const waveXLength = endPoint.x - startPoint.x
  const waveYLength = endPoint.y - startPoint.y
  const waveLength = Math.sqrt(Math.pow(waveXLength, 2) + Math.pow(waveYLength, 2))
  const waveTan = waveYLength / waveXLength
  const waveAngle = Math.atan(waveTan) * (180 / Math.PI)
  const wavePeriods = []
  let numberOfWavePeriods = 1
  const drawnWavePeriodStandAlone = path(
    wavePeriodSymbol.points,
    null,
    fontColor,
    0,
    0
  )
  let drawnLastWavePeriodStandAlone
  let drawnLastWavePeriodStandAloneLength
  if (lastWavePeriodSymbol !== null) {
    drawnLastWavePeriodStandAlone = path(
      lastWavePeriodSymbol.points,
      null,
      fontColor,
      0,
      0
    )
    if (isGrace) {
      scaleElementAroundPoint(
        drawnLastWavePeriodStandAlone,
        graceElementsScaleFactor,
        graceElementsScaleFactor,
        {
          x: drawnLastWavePeriodStandAlone.left,
          y: (drawnLastWavePeriodStandAlone.top + drawnLastWavePeriodStandAlone.bottom) / 2
        }
      )
    }
    drawnLastWavePeriodStandAloneLength = drawnLastWavePeriodStandAlone.right - drawnLastWavePeriodStandAlone.left
  }
  if (isGrace) {
    scaleElementAroundPoint(
      drawnWavePeriodStandAlone,
      graceElementsScaleFactor,
      graceElementsScaleFactor,
      {
        x: drawnWavePeriodStandAlone.left,
        y: (drawnWavePeriodStandAlone.top + drawnWavePeriodStandAlone.bottom) / 2
      }
    )
  }
  const drawnWavePeriodStandAloneLength = drawnWavePeriodStandAlone.right - drawnWavePeriodStandAlone.left
  let lastWavePeriodSymbolIsDrawn = false
  while (
    (
      (drawnWavePeriodStandAloneLength * numberOfWavePeriods - wavePeriodSymbol.intersectionLength * (numberOfWavePeriods - 1) <= (waveLength + drawnWavePeriodStandAloneLength / 2)) ||
      (numberOfWavePeriods <= minNumberOfWavePeriods)
    ) && !lastWavePeriodSymbolIsDrawn
  ) {
    const leftOffsetOfWavePeriod = startPoint.x + (numberOfWavePeriods - 1) * drawnWavePeriodStandAloneLength - wavePeriodSymbol.intersectionLength * (numberOfWavePeriods - 1)
    const currentLength = (drawnWavePeriodStandAloneLength * numberOfWavePeriods - wavePeriodSymbol.intersectionLength * (numberOfWavePeriods - 1))
    if (
      (lastWavePeriodSymbol !== null) &&
      (currentLength + drawnLastWavePeriodStandAloneLength - lastWavePeriodSymbol.intersectionLength > (waveLength + drawnLastWavePeriodStandAloneLength / 2)) &&
      (numberOfWavePeriods >= minNumberOfWavePeriods)
    ) {
      const drawnWavePeriod = path(
        lastWavePeriodSymbol.points,
        null,
        fontColor,
        leftOffsetOfWavePeriod + wavePeriodSymbol.intersectionLength - lastWavePeriodSymbol.intersectionLength,
        startPoint.y + lastWavePeriodSymbol.yCorrection
      )
      if (isGrace) {
        scaleElementAroundPoint(
          drawnWavePeriod,
          graceElementsScaleFactor,
          graceElementsScaleFactor,
          {
            x: drawnWavePeriod.left,
            y: (drawnWavePeriod.top + drawnWavePeriod.bottom) / 2
          }
        )
      }
      wavePeriods.push(
        drawnWavePeriod
      )
      lastWavePeriodSymbolIsDrawn = true
    } else {
      const drawnWavePeriod = path(
        wavePeriodSymbol.points,
        null,
        fontColor,
        leftOffsetOfWavePeriod,
        startPoint.y + wavePeriodSymbol.yCorrection
      )
      if (isGrace) {
        scaleElementAroundPoint(
          drawnWavePeriod,
          graceElementsScaleFactor,
          graceElementsScaleFactor,
          {
            x: drawnWavePeriod.left,
            y: (drawnWavePeriod.top + drawnWavePeriod.bottom) / 2
          }
        )
      }
      wavePeriods.push(
        drawnWavePeriod
      )
    }
    numberOfWavePeriods += 1
  }
  return rotateElementAroundPoint(
    group(
      'wave',
      wavePeriods
    ),
    {
      x: startPoint.x,
      y: startPoint.y
    },
    waveAngle,
    {
      top: Math.min(startPoint.y, endPoint.y),
      right: Math.max(startPoint.x, endPoint.x),
      bottom: Math.max(startPoint.y, endPoint.y),
      left: Math.min(startPoint.x, endPoint.x)
    }
  )
}
