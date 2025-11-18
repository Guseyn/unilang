'use strict'

import stavePiece from '#unilang/drawer/elements/stave/stavePiece.js'
import group from '#unilang/drawer/elements/basic/group.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (numberOfStaves, numberOfStaveLines, stavePieceWidth, numberOfStavesWithWidthIsNotZero, refParams) {
  return (styles, leftOffset, topOffsetOfFirstStaveLine) => {
    const { intervalBetweenStaves, staveLineHeight } = styles
    const stavesPieceWithCoordinates = []
    let topOffsetOfNextStave = topOffsetOfFirstStaveLine
    const maxNumberOfStaves = Math.max(numberOfStaves, numberOfStavesWithWidthIsNotZero)
    for (let staveIndex = 0; staveIndex < maxNumberOfStaves; staveIndex++) {
      const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, staveIndex < numberOfStavesWithWidthIsNotZero ? stavePieceWidth : 0)(styles, leftOffset, topOffsetOfNextStave)
      if (refParams) {
        addPropertiesToElement(
          stavePieceWithCoordinates,
          {
            'ref-ids': `stave-lines-${refParams.measureIndexInGeneral + 1}-${staveIndex + 1},stave-${staveIndex + 1},stave-${refParams.measureIndexInGeneral + 1}-${staveIndex + 1},stave-${refParams.pageLineNumber + 1}-${refParams.measureIndexOnPageLine + 1}-${staveIndex + 1},stave-in-all-measures-on-line-${refParams.pageLineNumber + 1}-${staveIndex + 1},all-staves-in-measure-${refParams.measureIndexInGeneral + 1}`
          }
        )
      }
      topOffsetOfNextStave = stavePieceWithCoordinates.bottom + intervalBetweenStaves - staveLineHeight / 2
      stavesPieceWithCoordinates.push(stavePieceWithCoordinates)
    }
    return group(
      'stavesPiece',
      stavesPieceWithCoordinates
    )
  }
}
