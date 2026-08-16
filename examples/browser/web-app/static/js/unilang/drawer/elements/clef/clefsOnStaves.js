'use strict'

import topOffsetForCurrentStave from '#unilang/drawer/elements/stave/topOffsetForCurrentStave.js'
import stavePiece from '#unilang/drawer/elements/stave/stavePiece.js'
import group from '#unilang/drawer/elements/basic/group.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

import treble from '#unilang/drawer/elements/clef/trebleClef.js'
import bass from '#unilang/drawer/elements/clef/bassClef.js'
import alto from '#unilang/drawer/elements/clef/altoClef.js'
import baritone from '#unilang/drawer/elements/clef/baritoneClef.js'
import mezzoSoprano from '#unilang/drawer/elements/clef/mezzoSopranoClef.js'
import octaveEightUp from '#unilang/drawer/elements/clef/octaveEightUpClef.js'
import octaveEightDown from '#unilang/drawer/elements/clef/octaveEightDownClef.js'
import octaveFifteenUp from '#unilang/drawer/elements/clef/octaveFifteenUpClef.js'
import octaveFifteenDown from '#unilang/drawer/elements/clef/octaveFifteenDownClef.js'
import soprano from '#unilang/drawer/elements/clef/sopranoClef.js'
import tenor from '#unilang/drawer/elements/clef/tenorClef.js'

const clefs = {
  treble,
  bass,
  alto,
  baritone,
  mezzoSoprano,
  octaveEightUp,
  octaveEightDown,
  octaveFifteenUp,
  octaveFifteenDown,
  soprano,
  tenor,
}

export default function (numberOfStaves, numberOfStaveLines, clefNames, measureIndexInGeneral) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaves, intervalBetweenStaveLines, stavePieceWidthForClef } = styles
    const clefsOnStaves = []
    const thereIsAtLeastOneClef = clefNames.some(clefName => clefs[clefName])
    for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
      const calculatedTopOffsetForCurrentStave = topOffsetForCurrentStave(topOffset, staveIndex, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
      const clefName = clefNames[staveIndex]
      if (clefs[clefName]) {
        const drawnClef = clefs[clefName]()(styles, leftOffset, calculatedTopOffsetForCurrentStave)
        addPropertiesToElement(
          drawnClef,
          {
            'ref-ids': `clef-${measureIndexInGeneral + 1}-${staveIndex + 1}`
          }
        )
        clefsOnStaves.push(drawnClef)
      } else {
        clefsOnStaves.push(
          stavePiece(numberOfStaveLines, thereIsAtLeastOneClef ? stavePieceWidthForClef : 0)(styles, leftOffset, calculatedTopOffsetForCurrentStave)
        )
      }
    }
    return group(
      'clefsOnStaves',
      clefsOnStaves
    )
  }
}
