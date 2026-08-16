'use strict'

import simile from '/js/unilang-in-worker-environment/drawer/elements/simile/simile.js'
import text from '/js/unilang-in-worker-environment/drawer/elements/basic/text.js'
import topOffsetForCurrentStave from '/js/unilang-in-worker-environment/drawer/elements/stave/topOffsetForCurrentStave.js'
import stavesPiece from '/js/unilang-in-worker-environment/drawer/elements/stave/stavesPiece.js'
import group from '/js/unilang-in-worker-environment/drawer/elements/basic/group.js'
import moveElement from '/js/unilang-in-worker-environment/drawer/elements/basic/moveElement.js'
import addPropertiesToElement from '/js/unilang-in-worker-environment/drawer/elements/basic/addPropertiesToElement.js'

export default function (numberOfStaves, numberOfStaveLines, simileYCorrection, numberOfMeasures, stavesPieceWidthOfLastMeasureToCompletePageLine, measureIndexInGeneral, previousMeasure) {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaves, intervalBetweenStaveLines, simileCountNumberFontOptions, similePreviousMeasureTextTopMarginOffset, similePreviousMeasureStaveWidth } = styles
    const components = []
    const stavesPieceWidth = Math.max(stavesPieceWidthOfLastMeasureToCompletePageLine, similePreviousMeasureStaveWidth)
    const refParams = {
      measureIndexInGeneral
    }
    components.push(
      stavesPiece(
        numberOfStaves,
        numberOfStaveLines,
        stavesPieceWidth,
        numberOfStaves,
        refParams
      )(styles, leftOffset, topOffset)
    )
    for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
      const calculatedTopOffsetForCurrentStave = topOffsetForCurrentStave(topOffset, staveIndex, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
      const drawnSimile = simile('single-mixed', simileYCorrection)(styles, leftOffset, calculatedTopOffsetForCurrentStave)
      addPropertiesToElement(
        drawnSimile,
        {
          'ref-ids': `simile-${measureIndexInGeneral + 1}`
        }
      )
      moveElement(
        drawnSimile,
        (stavesPieceWidth - (drawnSimile.right - drawnSimile.left)) / 2
      )
      components.push(drawnSimile)
      if (numberOfMeasures > 1) {
        const numberOfMeasuresText = text(
          numberOfMeasures + '',
          simileCountNumberFontOptions
        )(
          styles,
          leftOffset,
          Math.min(drawnSimile.top, calculatedTopOffsetForCurrentStave) + similePreviousMeasureTextTopMarginOffset
        )
        addPropertiesToElement(
          numberOfMeasuresText,
          {
            'ref-ids': `simile-count-${measureIndexInGeneral + 1}`
          }
        )
        moveElement(
          numberOfMeasuresText,
          (stavesPieceWidth - (numberOfMeasuresText.right - numberOfMeasuresText.left)) / 2
        )
        components.push(numberOfMeasuresText)
      }
    }
    if (previousMeasure) {
      addPropertiesToElement(
        previousMeasure,
        {
          'ref-ids': `simile-prev-measure-${measureIndexInGeneral + 1}`
        }
      )
    }
    return group(
      'simile', components
    )
  }
}
