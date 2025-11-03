'use strict'

import slurPoints from './slurPoints.js'
import sShapeSlurPoints from './sShapeSlurPoints.js'
import slurJunctionPointForSingleUnit from './slurJunctionPointForSingleUnit.js'
import path from './../basic/path.js'
import group from './../basic/group.js'
import addPropertiesToElement from './../basic/addPropertiesToElement.js'

export default function (markedSlur, slurMarkKey, voicesBody, extendedFromLeftSide, extendedToRightSide, styles) {
  const defaultSlurDirection = markedSlur.defaultSlurDirection
  const customSlurDirection = markedSlur.customSlurDirection
  const slurDirection = customSlurDirection || defaultSlurDirection

  markedSlur.isGrace = markedSlur.allSingleUnitsOnTheWay.some(singleUnit => singleUnit.isGrace)
  const slurLeftPoint = slurJunctionPointForSingleUnit(markedSlur.allSingleUnitsOnTheWay[0], slurDirection, 'left', null, styles)
  const slurRightPoint = slurJunctionPointForSingleUnit(markedSlur.allSingleUnitsOnTheWay[markedSlur.allSingleUnitsOnTheWay.length - 1], slurDirection, 'right', markedSlur.rightPlacement, styles)

  if (!markedSlur.withSShape) {
    const calculatedSlurPoints = slurPoints(
      markedSlur,
      slurLeftPoint,
      slurRightPoint,
      slurDirection,
      voicesBody,
      extendedFromLeftSide,
      extendedToRightSide,
      styles
    )
    const drawnSlur = group(
      'slur',
      [
        path(
          calculatedSlurPoints,
          styles.slurStrokeOptions,
          true,
          0,
          0
        )
      ]
    )
    addPropertiesToElement(
      drawnSlur,
      {
        'ref-ids': slurMarkKey
      }
    )
    return drawnSlur
  }

  const calculatedSShapeSlurPoins = sShapeSlurPoints(
    markedSlur,
    slurLeftPoint,
    slurRightPoint,
    slurDirection,
    voicesBody,
    extendedFromLeftSide,
    extendedToRightSide,
    styles
  )

  const tunedSShapeSlurStrokeOptions = Object.assign({}, styles.sShapeSlurStrokeOptions)
  if (markedSlur.isGrace) {
    tunedSShapeSlurStrokeOptions.width *= styles.graceElementsScaleFactor
  }
  const drawnSlur = group(
    'slur',
    [
      path(
        calculatedSShapeSlurPoins,
        tunedSShapeSlurStrokeOptions,
        false,
        0,
        0
      )
    ]
  )
  addPropertiesToElement(
    drawnSlur,
    {
      'ref-ids': slurMarkKey
    }
  )
  return drawnSlur
}
