'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'
import scaleElementAroundPoint from './../basic/scaleElementAroundPoint.js'
import moveElementAbovePointWithInterval from './../basic/moveElementAbovePointWithInterval.js'
import moveElementBelowPointWithInterval from './../basic/moveElementBelowPointWithInterval.js'
import moveElementInTheCenterBetweenPoints from './../basic/moveElementInTheCenterBetweenPoints.js'
import addPropertiesToElement from './../basic/addPropertiesToElement.js'

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

export default function (drawnSingleUnit, articulationIndex, keyName, articulation, position, styles) {
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
