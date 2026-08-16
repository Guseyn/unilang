'use strict'

import chordLetterText from '#unilang/drawer/elements/chord-letter/chordLetterText.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (drawnVoicesOnPageLine, drawnMeasuresOnPageLine, voicesBodiesOnPageLine, styles) {
  const { intervalBetweenStaveLines } = styles
  const minTopOfMeasuresOnPageLineForChordLetters = Math.min(...drawnMeasuresOnPageLine.map(measure => measure.top))
  const maxBottomOfMeasuresOnPageLineForChordLetters = Math.max(...drawnMeasuresOnPageLine.map(measure => measure.bottom))
  const drawnChordLetters = []
  for (let measureIndex = 0; measureIndex < drawnVoicesOnPageLine.length; measureIndex++) {
    if (drawnVoicesOnPageLine[measureIndex]) {
      const { measureIndexOnPageLine, drawnCrossStaveUnits, withoutVoices } = drawnVoicesOnPageLine[measureIndex]
      if (!withoutVoices) {
        for (let crossStaveUnitIndex = 0; crossStaveUnitIndex < drawnCrossStaveUnits.length; crossStaveUnitIndex++) {
          const currentCrossStaveUnit = drawnCrossStaveUnits[crossStaveUnitIndex]
          if (currentCrossStaveUnit.chordLetter) {
            const chordLetterDirection = currentCrossStaveUnit.chordLetter.direction || 'up'
            const chordLetterYCorrection = currentCrossStaveUnit.chordLetter.yCorrection || 0
            const drawnChordLetterText = chordLetterDirection === 'up'
              ? chordLetterText(currentCrossStaveUnit.chordLetter.textValue)(styles, currentCrossStaveUnit.left, minTopOfMeasuresOnPageLineForChordLetters - styles.chordLetterUpYOffset + chordLetterYCorrection * intervalBetweenStaveLines)
              : chordLetterText(currentCrossStaveUnit.chordLetter.textValue)(styles, currentCrossStaveUnit.left, maxBottomOfMeasuresOnPageLineForChordLetters + styles.chordLetterDownYOffset + chordLetterYCorrection * intervalBetweenStaveLines)
            addPropertiesToElement(
              drawnChordLetterText,
              {
                'ref-ids': `chord-letter-${currentCrossStaveUnit.chordLetter.measureIndexInGeneral + 1}-${currentCrossStaveUnit.chordLetter.staveIndex + 1}-${currentCrossStaveUnit.chordLetter.voiceIndex + 1}-${currentCrossStaveUnit.chordLetter.singleUnitIndex + 1}`
              }
            )
            drawnChordLetters.push(drawnChordLetterText)
            const staveIndexWhereWeAdjustTopAndBottomOfSingleUnitsInCurrentCrossStaveUnit = chordLetterDirection === 'up'
              ? 0
              : currentCrossStaveUnit.singleUnitsByStaveIndexes.length - 1
            currentCrossStaveUnit.singleUnitsByStaveIndexes[staveIndexWhereWeAdjustTopAndBottomOfSingleUnitsInCurrentCrossStaveUnit].forEach(singleUnit => {
              singleUnit.top = Math.min(drawnChordLetterText.top, singleUnit.top)
              singleUnit.bottom = Math.max(drawnChordLetterText.bottom, singleUnit.bottom)
            })
            voicesBodiesOnPageLine[measureIndexOnPageLine].top = Math.min(drawnChordLetterText.top, voicesBodiesOnPageLine[measureIndexOnPageLine].top)
            voicesBodiesOnPageLine[measureIndexOnPageLine].bottom = Math.max(drawnChordLetterText.bottom, voicesBodiesOnPageLine[measureIndexOnPageLine].bottom)
            drawnMeasuresOnPageLine[measureIndexOnPageLine].top = Math.min(drawnChordLetterText.top, drawnMeasuresOnPageLine[measureIndexOnPageLine].top)
            drawnMeasuresOnPageLine[measureIndexOnPageLine].bottom = Math.max(drawnChordLetterText.bottom, drawnMeasuresOnPageLine[measureIndexOnPageLine].bottom)
          }
        }
      }
    }
  }
  return drawnChordLetters
}
