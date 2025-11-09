'use strict'

import line from '#unilang/drawer/elements/basic/line.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (drawnVoicesOnPageLine, styles) {
  const { crushGraceLineXPaddingForUnitwithFlagsAndStemUp, crushGraceLineXPaddingForUnitwithFlagsAndStemDown, crushGraceLineXPaddingForUnitWithoutWaves, crushGraceLineXPaddingForBeamedUnit, crushGraceLineStemUpHeightForUnitWithFlags, crushGraceLineStemUpHeightForUnitWithoutWaves, crushGraceLineStemUpHeightForBeamedUnit, crushGraceLineStemDownHeightForUnitWithFlags, crushGraceLineStemDownHeightForUnitWithoutWaves, crushGraceLineStemDownHeightForBeamedUnit, crushGraceYMarginForStemUp, crushGraceYMarginForStemUpWithoutFlags, crushGraceYMarginForStemDown, crushGraceYMarginForStemDownWithoutFlags, crushGraceYMarginForBeamedStemUp, crushGraceYMarginForBeamedStemDown, crushGraceLineStrokeOptions } = styles
  const drawnGraceCrashLines = []
  for (let measureIndex = 0; measureIndex < drawnVoicesOnPageLine.length; measureIndex++) {
    if (drawnVoicesOnPageLine[measureIndex]) {
      const { drawnSingleUnitsInAllCrossStaveUnits, withoutVoices } = drawnVoicesOnPageLine[measureIndex]
      if (!withoutVoices) {
        for (let crossStaveUnitIndex = 0; crossStaveUnitIndex < drawnSingleUnitsInAllCrossStaveUnits.length; crossStaveUnitIndex++) {
          const currentCrossStaveUnit = drawnSingleUnitsInAllCrossStaveUnits[crossStaveUnitIndex]
          for (let crossVoiceUnitIndex = 0; crossVoiceUnitIndex < currentCrossStaveUnit.length; crossVoiceUnitIndex++) {
            const currentCrossVoiceUnitInCurrentCrossStaveUnit = currentCrossStaveUnit[crossVoiceUnitIndex]
            for (let singleUnitIndex = 0; singleUnitIndex < currentCrossVoiceUnitInCurrentCrossStaveUnit.length; singleUnitIndex++) {
              const currentSingleUnit = currentCrossVoiceUnitInCurrentCrossStaveUnit[singleUnitIndex]
              const xCenterForCrashLine = currentSingleUnit.withFlags
                ? (currentSingleUnit.stemLeft + currentSingleUnit.flagsRight) / 2
                : (currentSingleUnit.stemLeft + currentSingleUnit.stemRight) / 2
              const crashLinePoints = []
              const crushGraceLineXPadding = currentSingleUnit.withFlags
                ? (currentSingleUnit.stemDirection === 'up')
                  ? crushGraceLineXPaddingForUnitwithFlagsAndStemUp
                  : crushGraceLineXPaddingForUnitwithFlagsAndStemDown
                : currentSingleUnit.beamed
                  ? crushGraceLineXPaddingForBeamedUnit
                  : crushGraceLineXPaddingForUnitWithoutWaves
              const crushGraceLineStemUpHeight = currentSingleUnit.withFlags
                ? crushGraceLineStemUpHeightForUnitWithFlags
                : currentSingleUnit.beamed
                  ? crushGraceLineStemUpHeightForBeamedUnit
                  : crushGraceLineStemUpHeightForUnitWithoutWaves
              const crushGraceLineStemDownHeight = currentSingleUnit.withFlags
                ? crushGraceLineStemDownHeightForUnitWithFlags
                : currentSingleUnit.beamed
                  ? crushGraceLineStemDownHeightForBeamedUnit
                  : crushGraceLineStemDownHeightForUnitWithoutWaves
              const crushGraceYMargin = currentSingleUnit.stemDirection === 'up'
                ? currentSingleUnit.beamed
                  ? crushGraceYMarginForBeamedStemUp
                  : currentSingleUnit.withFlags
                    ? crushGraceYMarginForStemUp
                    : crushGraceYMarginForStemUpWithoutFlags
                : currentSingleUnit.beamed
                  ? crushGraceYMarginForBeamedStemDown
                  : currentSingleUnit.withFlags
                    ? crushGraceYMarginForStemDown
                    : crushGraceYMarginForStemDownWithoutFlags
              if (currentSingleUnit.isGrace && !currentCrossStaveUnit.stemless && currentSingleUnit.hasGraceCrushLine) {
                if (currentSingleUnit.stemDirection === 'up') {
                  crashLinePoints.push(
                    xCenterForCrashLine - crushGraceLineXPadding,
                    currentSingleUnit.top + crushGraceYMargin + crushGraceLineStemUpHeight,
                    xCenterForCrashLine + crushGraceLineXPadding,
                    currentSingleUnit.top + crushGraceYMargin
                  )
                } else {
                  crashLinePoints.push(
                    xCenterForCrashLine - crushGraceLineXPadding,
                    currentSingleUnit.bottom - crushGraceYMargin - crushGraceLineStemDownHeight,
                    xCenterForCrashLine + crushGraceLineXPadding,
                    currentSingleUnit.bottom - crushGraceYMargin
                  )
                }
                const drawnGraceCrashLine = line(
                  ...crashLinePoints,
                  crushGraceLineStrokeOptions
                )
                addPropertiesToElement(
                  drawnGraceCrashLine,
                  {
                    'ref-ids': `grace-crush-line-${currentSingleUnit.measureIndexInGeneral + 1}-${currentSingleUnit.staveIndex + 1}-${currentSingleUnit.voiceIndex + 1}-${currentSingleUnit.singleUnitIndex + 1}`
                  }
                )
                drawnGraceCrashLines.push(drawnGraceCrashLine)
              }
            }
          }
        }
      }
    }
  }
  return drawnGraceCrashLines
}
