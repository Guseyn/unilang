'use strict'

import articulationIsAttachedToUnit from '#unilang/drawer/elements/articulation/articulationIsAttachedToUnit.js'

export default function (singleUnit, slurDirection, slurSide, rightPointPlacement, styles) {
  let hasAttributesAbove = false
  let hasAttributesBelow = false
  if (singleUnit.articulationParams) {
    hasAttributesAbove = singleUnit.articulationParams.filter(articulationParam => (articulationParam.direction === 'up') && articulationIsAttachedToUnit(articulationParam)).length > 0
  }
  if (singleUnit.articulationParams) {
    hasAttributesBelow = singleUnit.articulationParams.filter(articulationParam => (articulationParam.direction === 'down') && articulationIsAttachedToUnit(articulationParam)).length > 0
  }
  if (singleUnit.stemDirection === 'up' && !singleUnit.hasConnectedTremolo && singleUnit.numberOfTremoloStrokes > 0 && singleUnit.withFlags) {
    hasAttributesAbove = true
  }
  if (singleUnit.stemDirection === 'down' && !singleUnit.hasConnectedTremolo && singleUnit.numberOfTremoloStrokes > 0 && singleUnit.withFlags) {
    hasAttributesBelow = true
  }
  const singleUnitsWithSlursComeFromThierNoteBodies = (
    (slurDirection === 'up' && singleUnit.stemDirection === 'down') ||
    (slurDirection === 'down' && singleUnit.stemDirection === 'up') ||
    (singleUnit.stemless) ||
    (rightPointPlacement === 'noteBody')
  ) && (rightPointPlacement !== 'middleStem')
  const leftEdge = singleUnit.nonIndentedPartOfSingleUnitWithCoordinates.left
  const rightEdge = singleUnit.nonIndentedPartOfSingleUnitWithCoordinates.right
  const singleUnitIsNotBeamedButWithStem = !singleUnit.beamed && !singleUnit.stemless
  const slurDirectionSign = slurDirection === 'up' ? -1 : +1
  const slurSideSign = slurSide === 'left' ? +1 : -1
  const x = (
    singleUnitsWithSlursComeFromThierNoteBodies
      ? (leftEdge + rightEdge) / 2
      : singleUnit.stemLeft
  ) + (
    ((singleUnitIsNotBeamedButWithStem && !singleUnitsWithSlursComeFromThierNoteBodies) || slurSide === 'middle')
      ? slurSideSign * styles.slurJunctionPointForSingleUnitAtStemXOffset
      : 0
  )
  let slurJunctionPointYOffset = styles.slurJunctionPointForSingleUnitYOffset
  if (singleUnitIsNotBeamedButWithStem) {
    if (
      (hasAttributesAbove && slurDirection === 'up' && rightPointPlacement !== 'noteBody') ||
      (hasAttributesBelow && slurDirection === 'down' && rightPointPlacement !== 'noteBody')
    ) {
      slurJunctionPointYOffset = styles.slurJunctionPointForSingleUnitYOffsetWithAttributesAboveOrBelow
    } else if (!singleUnitsWithSlursComeFromThierNoteBodies) {
      if (singleUnit.withFlags) {
        slurJunctionPointYOffset = styles.slurJunctionPointForSingleUnitAtStemWithFlagsYOffset
      } else {
        slurJunctionPointYOffset = styles.slurJunctionPointForSingleUnitAtStemYOffset
      }
    }
  }
  let slurTop = singleUnit.top
  let slurBottom = singleUnit.bottom
  if (rightPointPlacement === 'noteBody' && slurSide === 'right') {
    slurTop = singleUnit.bodyTop
    slurBottom = singleUnit.bodyBottom
  }
  const y = rightPointPlacement === 'middleStem'
    ? (singleUnit.stemTop + singleUnit.stemBottom) / 2
    : ((slurDirection === 'up' ? slurTop : slurBottom) + slurDirectionSign * slurJunctionPointYOffset)
  return { x, y }
}
