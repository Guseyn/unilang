'use strict'

const slurPoints = require('./slurPoints')
const sShapeSlurPoints = require('./sShapeSlurPoints')
const slurJunctionPointForSingleUnit = require('./slurJunctionPointForSingleUnit')
const path = require('./../basic/path')
const group = require('./../basic/group')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (markedSlur, slurMarkKey, voicesBody, extendedFromLeftSide, extendedToRightSide, styles) => {
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
