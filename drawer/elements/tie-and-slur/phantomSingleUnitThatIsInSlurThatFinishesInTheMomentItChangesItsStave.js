'use strict'

const moveSingleUnit = require('./../unit/moveSingleUnit')

module.exports = (singleUnit, slurMarkKey, fromStaveIndex, toStaveIndex, styles) => {
  const singleUnitClone = JSON.parse(JSON.stringify(singleUnit))
  singleUnitClone.phantom = true
  const isSlurGoesStaveUp = toStaveIndex < fromStaveIndex
  singleUnitClone.slurMarks.find(slurMark => slurMark.key === slurMarkKey).finish = false
  moveSingleUnit(
    singleUnitClone,
    (singleUnitClone.right - singleUnitClone.left) + styles.xDistanceToMoveForPhantomSingleUnitThatIsInSlurThatFinishesInTheMomentItChangesItsStave,
    (isSlurGoesStaveUp ? +1 : -1) * styles.yDistanceToMoveForPhantomSingleUnitThatIsInSlurThatFinishesInTheMomentItChangesItsStave
  )
  return singleUnitClone
}
