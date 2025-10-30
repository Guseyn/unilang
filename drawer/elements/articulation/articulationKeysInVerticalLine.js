'use strict'

const path = require('./../basic/path')
const group = require('./../basic/group')
const scaleElementAroundPoint = require('./../basic/scaleElementAroundPoint')
const moveElementAbovePointWithInterval = require('./../basic/moveElementAbovePointWithInterval')
const moveElementBelowPointWithInterval = require('./../basic/moveElementBelowPointWithInterval')
const moveElementInTheCenterBetweenPoints = require('./../basic/moveElementInTheCenterBetweenPoints')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

const sharpKeyShape = () => {
  return (styles, leftOffset, topOffset) => {
    const { articulationSharpKey, fontColor } = styles
    return group(
      'sharpKeyShape',
      [
        path(
          articulationSharpKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset
        )
      ]
    )
  }
}

const flatKeyShape = () => {
  return (styles, leftOffset, topOffset) => {
    const { articulationFlatKey, fontColor } = styles
    return group(
      'flatKeyShape',
      [
        path(
          articulationFlatKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset
        )
      ]
    )
  }
}

const naturalKeyShape = () => {
  return (styles, leftOffset, topOffset) => {
    const { articulationNaturalKey, fontColor } = styles
    return group(
      'naturalKeyShape',
      [
        path(
          articulationNaturalKey.points,
          null,
          fontColor,
          leftOffset,
          topOffset
        )
      ]
    )
  }
}

const keys = { 'sharp': sharpKeyShape, 'flat': flatKeyShape, 'natural': naturalKeyShape }

module.exports = (drawnSingleUnit, articulationIndex, keyName, articulation, position, styles) => {
  const { yDistanceBetweenArticulationKeysInVerticalLine, scaleFactorForArticulationKeys } = styles
  const drawnKeys = []
  const key = keys[keyName]
  if (key) {
    const drawnKey = key()(styles, 0, 0)
    scaleElementAroundPoint(
      drawnKey,
      scaleFactorForArticulationKeys,
      scaleFactorForArticulationKeys,
      {
        x: (drawnKey.left + drawnKey.right) / 2,
        y: (drawnKey.top + drawnKey.bottom) / 2
      }
    )
    moveElementInTheCenterBetweenPoints(
      drawnKey,
      articulation.left,
      articulation.right
    )
    if (position === 'above') {
      moveElementAbovePointWithInterval(
        drawnKey,
        articulation.top,
        yDistanceBetweenArticulationKeysInVerticalLine
      )
    } else {
      moveElementBelowPointWithInterval(
        drawnKey,
        articulation.bottom,
        yDistanceBetweenArticulationKeysInVerticalLine
      )
    }
    addPropertiesToElement(
      drawnKey,
      {
        'ref-ids': `articulation-key-${position}-${drawnSingleUnit.measureIndexInGeneral + 1}-${drawnSingleUnit.staveIndex + 1}-${drawnSingleUnit.voiceIndex + 1}-${drawnSingleUnit.singleUnitIndex + 1}-${articulationIndex + 1}`
      }
    )
    drawnKeys.push(drawnKey)
  }
  return group(
    'keysInVerticalLine',
    drawnKeys
  )
}
