'use strict'

const moveElement = require('./../basic/moveElement')
const scaleElementAroundPoint = require('./../basic/scaleElementAroundPoint')
const group = require('./../basic/group')
const elementWithAdditionalInformation = require('./../basic/elementWithAdditionalInformation')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')
const sortedKeysForSingleUnitConsideringStaves = require('./../unit/sortedKeysForSingleUnitConsideringStaves')
const doubleFlatKeyShape = require('./../key/doubleFlatKeyShape')
const doubleSharpKeyShape = require('./../key/doubleSharpKeyShape')
const flatKeyShape = require('./../key/flatKeyShape')
const naturalKeyShape = require('./../key/naturalKeyShape')
const sharpKeyShape = require('./../key/sharpKeyShape')
const demiflatKeyShape = require('./../key/demiflatKeyShape')
const sesquiflatKeyShape = require('./../key/sesquiflatKeyShape')
const demisharpKeyShape = require('./../key/demisharpKeyShape')
const sesquisharpKeyShape = require('./../key/sesquisharpKeyShape')
const noteLetterShape = require('./../key/noteLetterShape')
const parenthesesSpline = require('./../bracket/parenthesesSpline')
const keysTypes = {
  'doubleFlatKey': doubleFlatKeyShape,
  'doubleSharpKey': doubleSharpKeyShape,
  'flatKey': flatKeyShape,
  'naturalKey': naturalKeyShape,
  'sharpKey': sharpKeyShape,
  'demiflatKey': demiflatKeyShape,
  'sesquiflatKey': sesquiflatKeyShape,
  'demisharpKey': demisharpKeyShape,
  'sesquisharpKey': sesquisharpKeyShape,
  'noteLetter': noteLetterShape
}

module.exports = (selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit, measureIndexInGeneral, countersForEachVoice, numberOfStaveLines, drawnArpeggiatedWavesForCrossStaveUnits, drawnBreathMarksBeforeCrossStaveUnits, styles, leftOffset, topOffsetsForEachStave, relativePositionToArpeggiatedWave = 'after', containsDrawnCrossStaveElementsBesideCrossStaveUnits) => {
  const { spaceAfterBreathMark, distanceBetweenKeysForSingleUnit, distanceBetweenKeysAsNoteLettersForSingleUnit, offsetForKeyParenthesesFromBothSides, keyParenthesesYPadding, spaceAfterArpeggiatedWaveAndBeforeKeysForCrossStaveUnit, graceElementsScaleFactor, graceKeyOnStaveLineCenterYCorrections, graceKeyBetweenStaveLinesCenterYCorrections } = styles
  const drawnKeysForCurrentCrossStaveUnit = []
  const allKeysParams = []
  let isThereArpeggiatedWavesInCurrentCrossStaveUnit = selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit.findIndex(singleUnitParams => singleUnitParams.arpeggiated) !== -1
  let isCurrentCrossStaveUnitGrace = false
  for (let singleUnitParamIndex = 0; singleUnitParamIndex < selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit.length; singleUnitParamIndex++) {
    const currentSingleUnitParams = selectedSingleUnitsParamsToBeIncludedInNextCrossStaveUnit[singleUnitParamIndex]
    let currentKeysParams
    if (isThereArpeggiatedWavesInCurrentCrossStaveUnit) {
      if (relativePositionToArpeggiatedWave === 'after') {
        currentKeysParams = currentSingleUnitParams.keysParams.filter(keyParam => keyParam.keyType !== 'noteLetter')
      } else if (relativePositionToArpeggiatedWave === 'before') {
        currentKeysParams = currentSingleUnitParams.keysParams.filter(keyParam => keyParam.keyType === 'noteLetter')
      }
    } else if (relativePositionToArpeggiatedWave === 'after') {
      currentKeysParams = currentSingleUnitParams.keysParams
    }
    if (currentKeysParams) {
      allKeysParams.push(...currentKeysParams)
    }
    if (currentSingleUnitParams.isGrace) {
      isCurrentCrossStaveUnitGrace = true
    }
  }
  const sortedKeysParams = sortedKeysForSingleUnitConsideringStaves(allKeysParams)

  const keysColumnsByStaves = {}
  let startXPositionOfKeys
  if (relativePositionToArpeggiatedWave === 'after') {
    startXPositionOfKeys = drawnArpeggiatedWavesForCrossStaveUnits[drawnArpeggiatedWavesForCrossStaveUnits.length - 1].right + (
      (
        drawnArpeggiatedWavesForCrossStaveUnits[drawnArpeggiatedWavesForCrossStaveUnits.length - 1].numberOfWaves > 0 &&
        sortedKeysParams.length > 0
      )
        ? spaceAfterArpeggiatedWaveAndBeforeKeysForCrossStaveUnit
        : 0
    )
  } else if (relativePositionToArpeggiatedWave === 'before') {
    startXPositionOfKeys = drawnBreathMarksBeforeCrossStaveUnits[drawnBreathMarksBeforeCrossStaveUnits.length - 1].right + (
      drawnBreathMarksBeforeCrossStaveUnits[drawnBreathMarksBeforeCrossStaveUnits.length - 1].isEmpty
        ? 0
        : spaceAfterBreathMark * (isCurrentCrossStaveUnitGrace ? graceElementsScaleFactor : 1)
    )
  }

  for (let keyIndex = 0; keyIndex < sortedKeysParams.length; keyIndex++) {
    const keyParams = sortedKeysParams[keyIndex]
    const isGrace = keyParams.isGrace
    let staveIndexThatActuallyRelatesToTheKeyPosition = keyParams.staveIndexConsideringStavePosition ?? keyParams.staveIndex
    const topOffsetOfStaveForTheKeyConsideringItsStave = topOffsetsForEachStave[keyParams.staveIndexConsideringStavePosition] ?? topOffsetsForEachStave[keyParams.staveIndex]
    const keyFunction = keyParams.keyType === 'noteLetter'
      ? keysTypes['noteLetter'](keyParams.positionNumber, keyParams.textValue)
      : (keysTypes[keyParams.keyType] || keysTypes['sharpKey'])(keyParams.positionNumber)
    const additionalInformation = {
      keyType: keyParams.keyType,
      measureIndexInGeneral,
      staveIndex: keyParams.staveIndex,
      voiceIndex: keyParams.voiceIndex,
      id: keyParams.id,
      singleUnitIndex: countersForEachVoice[keyParams.staveIndex][keyParams.voiceIndex],
      positionNumber: keyParams.positionNumber,
      isGrace: keyParams.isGrace
    }
    const drawnKeyElements = []
    const drawnKeyShape = keyFunction(
      styles,
      startXPositionOfKeys,
      topOffsetOfStaveForTheKeyConsideringItsStave
    )
    drawnKeyElements.push(drawnKeyShape)
    addPropertiesToElement(
      drawnKeyShape,
      {
        'ref-ids': `note-key-${additionalInformation.measureIndexInGeneral + 1}-${additionalInformation.staveIndex + 1}-${additionalInformation.voiceIndex + 1}-${additionalInformation.singleUnitIndex + 1}-${additionalInformation.id + 1}`
      }
    )
    if (keyParams.withParentheses) {
      const offsetForKeyParenthesesFromBothSidesForCertainType = offsetForKeyParenthesesFromBothSides[keyParams.keyType] || offsetForKeyParenthesesFromBothSides['default']
      const openBracket = parenthesesSpline(
        {
          x: drawnKeyShape.left,
          y: drawnKeyShape.top - keyParenthesesYPadding
        },
        {
          x: drawnKeyShape.left,
          y: drawnKeyShape.bottom + keyParenthesesYPadding
        },
        'left',
        styles
      )
      moveElement(
        drawnKeyShape,
        offsetForKeyParenthesesFromBothSidesForCertainType.left
      )
      addPropertiesToElement(
        openBracket,
        {
          'ref-ids': `note-key-parentheses-${additionalInformation.measureIndexInGeneral + 1}-${additionalInformation.staveIndex + 1}-${additionalInformation.voiceIndex + 1}-${additionalInformation.singleUnitIndex + 1}-${additionalInformation.id + 1}`
        }
      )
      const closedBracket = parenthesesSpline(
        {
          x: drawnKeyShape.right + offsetForKeyParenthesesFromBothSidesForCertainType.right,
          y: drawnKeyShape.top - keyParenthesesYPadding
        },
        {
          x: drawnKeyShape.right + offsetForKeyParenthesesFromBothSidesForCertainType.right,
          y: drawnKeyShape.bottom + keyParenthesesYPadding
        },
        'right',
        styles
      )
      addPropertiesToElement(
        closedBracket,
        {
          'ref-ids': `note-key-parentheses-${additionalInformation.measureIndexInGeneral + 1}-${additionalInformation.staveIndex + 1}-${additionalInformation.voiceIndex + 1}-${additionalInformation.singleUnitIndex + 1}-${additionalInformation.id + 1}`
        }
      )
      drawnKeyElements.push(
        openBracket,
        closedBracket
      )
    }
    const drawnKey = elementWithAdditionalInformation(
      group(
        'key',
        drawnKeyElements
      ),
      additionalInformation
    )
    if (isGrace) {
      const isKeyOnStave = Math.abs(keyParams.positionNumber * 10 % 2) === 0
      scaleElementAroundPoint(
        drawnKey,
        graceElementsScaleFactor,
        graceElementsScaleFactor,
        {
          x: drawnKey.right,
          y: (drawnKey.top + drawnKey.bottom) / 2 +
            (
              isKeyOnStave
                ? (graceKeyOnStaveLineCenterYCorrections[keyParams.keyType] || graceKeyOnStaveLineCenterYCorrections['sharpKey'])
                : (graceKeyBetweenStaveLinesCenterYCorrections[keyParams.keyType] || graceKeyBetweenStaveLinesCenterYCorrections['sharpKey'])
            )
        }
      )
    }
    let keysColumnsAreJustCreatedForNewStave = false
    if (!keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`]) {
      keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`] = [
        {
          drawnShapes: [ drawnKey ],
          keysParams: [ keyParams ],
          minLeft: drawnKey.left,
          maxRight: drawnKey.right,
          minTop: drawnKey.top,
          maxBottom: drawnKey.bottom,
          columnIndex: 0
        }
      ]
      keysColumnsAreJustCreatedForNewStave = true
    }
    if (!keysColumnsAreJustCreatedForNewStave) {
      const keysColumnsLength = keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`].length
      for (let keyColumnIndex = 0; keyColumnIndex < keysColumnsLength; keyColumnIndex++) {
        const xDistanceForKeysToMove = (drawnKey.right - drawnKey.left) +
          (drawnKey.keyType === 'noteLetter' ? distanceBetweenKeysAsNoteLettersForSingleUnit : distanceBetweenKeysForSingleUnit) * (isGrace ? graceElementsScaleFactor : 1)
        const drawnKeyShouldBePutInNewColumn = (drawnKey.top <= keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].maxBottom)
        if (drawnKeyShouldBePutInNewColumn) {
          if (!keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex + 1]) {
            keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`].push({
              drawnShapes: [ drawnKey ],
              keysParams: [ keyParams ],
              minLeft: drawnKey.left,
              maxRight: drawnKey.right,
              minTop: drawnKey.top,
              maxBottom: drawnKey.bottom,
              columnIndex: keyColumnIndex + 1
            })
            const keysColumnsLastIndex = keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`].length - 1
            moveElement(
              drawnKey,
              -(startXPositionOfKeys - keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].minLeft + xDistanceForKeysToMove),
              0
            )
            const minLeftBefore = keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keysColumnsLastIndex].minLeft
            keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keysColumnsLastIndex].minLeft = Math.min(keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keysColumnsLastIndex].minLeft, drawnKey.left)
            keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keysColumnsLastIndex].maxRight = keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keysColumnsLastIndex].maxRight - (minLeftBefore - keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keysColumnsLastIndex].minLeft)
          }
        } else {
          if (keyColumnIndex > 0) {
            moveElement(
              drawnKey,
              -(startXPositionOfKeys - keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex - 1].minLeft + xDistanceForKeysToMove),
              0
            )
          }
          const minLeftBefore = keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].minLeft
          keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].minLeft = Math.min(keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].minLeft, drawnKey.left)
          keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].maxRight = keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].maxRight - (minLeftBefore - keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].minLeft)
          keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].minTop = Math.min(keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].minTop, drawnKey.top)
          keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].maxBottom = Math.max(keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].maxBottom, drawnKey.bottom)
          keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].drawnShapes.push(drawnKey)
          keysColumnsByStaves[`${staveIndexThatActuallyRelatesToTheKeyPosition}`][keyColumnIndex].keysParams.push(keyParams)
          break
        }
      }
    }
    drawnKeysForCurrentCrossStaveUnit.push(
      drawnKey
    )
  }

  const groupsOfKeysOnAllStaves = []
  let maxRightOfGroupsOfKeysOnEachStave
  const areasWithKeysInTheFirstColumn = []
  for (const [ staveIndexThatActuallyRelatesToTheKeyPosition, keysColumnsOnStave ] of Object.entries(keysColumnsByStaves)) {
    const allDrawnKeysOnStave = [...keysColumnsOnStave.flatMap(keyColumn => keyColumn.drawnShapes)]
    for (let keyColumnIndex = 0; keyColumnIndex < keysColumnsOnStave.length; keyColumnIndex++) {
      for (let keyIndex = 0; keyIndex < keysColumnsOnStave[keyColumnIndex].drawnShapes.length; keyIndex++) {
        if (keysColumnsOnStave[keyColumnIndex].drawnShapes[keyIndex].right < keysColumnsOnStave[keyColumnIndex].maxRight) {
          const xDistanceToMove = keysColumnsOnStave[keyColumnIndex].maxRight - keysColumnsOnStave[keyColumnIndex].drawnShapes[keyIndex].right
          moveElement(
            keysColumnsOnStave[keyColumnIndex].drawnShapes[keyIndex],
            xDistanceToMove
          )
        }
        if (keyColumnIndex === 0) {
          areasWithKeysInTheFirstColumn.push({
            actualStaveIndex: staveIndexThatActuallyRelatesToTheKeyPosition * 1,
            minY: keysColumnsOnStave[keyColumnIndex].drawnShapes[keyIndex].top,
            maxY: keysColumnsOnStave[keyColumnIndex].drawnShapes[keyIndex].bottom
          })
        }
      }
    }
    const groupOfKeysOnStave = elementWithAdditionalInformation(
      group(
        'keysOnStave',
        allDrawnKeysOnStave
      ),
      {
        staveIndex: staveIndexThatActuallyRelatesToTheKeyPosition * 1
      }
    )
    groupsOfKeysOnAllStaves.push(groupOfKeysOnStave)
    if (maxRightOfGroupsOfKeysOnEachStave === undefined || maxRightOfGroupsOfKeysOnEachStave < groupOfKeysOnStave.right) {
      maxRightOfGroupsOfKeysOnEachStave = groupOfKeysOnStave.right
    }
  }
  groupsOfKeysOnAllStaves.forEach(groupOfKeysOnStave => {
    moveElement(
      groupOfKeysOnStave,
      maxRightOfGroupsOfKeysOnEachStave - groupOfKeysOnStave.right
    )
  })

  const groupName = relativePositionToArpeggiatedWave === 'after' ? 'keysForCrossStaveUnit' : 'onlyNoteLettersBeforeArpeggiatedWaves'
  if (groupsOfKeysOnAllStaves.length === 0) {
    return {
      isEmpty: true,
      name: 'g',
      properties: {
        'data-name': groupName
      },
      transformations: [],
      top: topOffsetsForEachStave[0],
      right: startXPositionOfKeys,
      bottom: topOffsetsForEachStave[topOffsetsForEachStave.length - 1],
      left: startXPositionOfKeys,
      numberOfKeys: 0,
      areasWithKeysInTheFirstColumn
    }
  }
  containsDrawnCrossStaveElementsBesideCrossStaveUnits.value = true
  const groupedDrawnKeysForCrossStaveUnit = group(
    groupName,
    groupsOfKeysOnAllStaves
  )
  const currentLeftOffset = startXPositionOfKeys - groupedDrawnKeysForCrossStaveUnit.left
  moveElement(
    groupedDrawnKeysForCrossStaveUnit,
    currentLeftOffset
  )
  return elementWithAdditionalInformation(
    groupedDrawnKeysForCrossStaveUnit,
    {
      numberOfKeys: drawnKeysForCurrentCrossStaveUnit.length,
      crossStaveUnitRightAfterTheseKeysIsGrace: isCurrentCrossStaveUnitGrace,
      groupsOfKeysOnAllStaves,
      areasWithKeysInTheFirstColumn
    }
  )
}
