'use strict'

import calculatedNumberOfBeamLinesByDuration from '#unilang/drawer/elements/beam/calculatedNumberOfBeamLinesByDuration.js'
import stemForSingleUnitInBeamedPartOfVoiceByStemPlaceholderCoordinates from '#unilang/drawer/elements/unit/stemForSingleUnitInBeamedPartOfVoiceByStemPlaceholderCoordinates.js'
import beams from '#unilang/drawer/elements/beam/beams.js'
import calculatedBeamLineCoefficients from '#unilang/drawer/elements/beam/calculatedBeamLineCoefficients.js'
import calculatedStemExtremePositionForDrawnBeamedSingleUnit from '#unilang/drawer/elements/beam/calculatedStemExtremePositionForDrawnBeamedSingleUnit.js'
import areAnyStemDirectionChangesInBeamedSingleUnits from '#unilang/drawer/elements/beam/areAnyStemDirectionChangesInBeamedSingleUnits.js'
import firstAndLastBeamedSingleUnitStemsEnds from '#unilang/drawer/elements/beam/firstAndLastBeamedSingleUnitStemsEnds.js'
import path from '#unilang/drawer/elements/basic/path.js'
import elementWithAdditionalInformation from '#unilang/drawer/elements/basic/elementWithAdditionalInformation.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (drawnSingleUnitsInVoice, styles) {
  const drawnBeamsWithStems = []
  const { beamBackgroundStrokeOptions, noteSquareStemStrokeOptions, beamWidth, heightOfBeamColumn, noteBeamStrokeOptions, graceElementsScaleFactor } = styles
  const stemWidth = noteSquareStemStrokeOptions.width

  let currentBeamedSingleUnits = []
  let minTopInCurrentBeamedSingleUnits
  let maxBottomInCurrentBeamedSingleUnits
  let lastBeamedSingleUnit
  drawnSingleUnitsInVoice.forEach((drawnSingleUnit, index) => {
    const isGrace = drawnSingleUnit.isGrace
    let tunedStemWidth = stemWidth
    let tunedBeamWidth = beamWidth
    let tunedHeightOfBeamColumn = heightOfBeamColumn
    const tunedNoteBeamStrokeOptions = Object.assign({}, noteBeamStrokeOptions)
    if (isGrace) {
      tunedStemWidth *= graceElementsScaleFactor
      tunedBeamWidth *= graceElementsScaleFactor
      tunedHeightOfBeamColumn *= graceElementsScaleFactor
      tunedNoteBeamStrokeOptions.width *= graceElementsScaleFactor
    }

    if ((currentBeamedSingleUnits.length === 0) && lastBeamedSingleUnit) {
      addPropertiesToElement(
        drawnSingleUnit,
        {
          'ref-ids': `next-to-unit-not-connected-with-beam-${lastBeamedSingleUnit.measureIndexInGeneral + 1}-${lastBeamedSingleUnit.staveIndex + 1}-${lastBeamedSingleUnit.voiceIndex + 1}-${lastBeamedSingleUnit.singleUnitIndex + 1}`
        }
      )
    }

    const isDrawnSingleUnitBeamed = drawnSingleUnit.beamed && !drawnSingleUnit.stemless

    if (isDrawnSingleUnitBeamed) {
      if (minTopInCurrentBeamedSingleUnits === undefined || minTopInCurrentBeamedSingleUnits > drawnSingleUnit.stemTop) {
        minTopInCurrentBeamedSingleUnits = drawnSingleUnit.stemTop
      }
      if (maxBottomInCurrentBeamedSingleUnits === undefined || maxBottomInCurrentBeamedSingleUnits < drawnSingleUnit.stemBottom) {
        maxBottomInCurrentBeamedSingleUnits = drawnSingleUnit.stemBottom
      }
      currentBeamedSingleUnits.push(drawnSingleUnit)
    }

    const weAreReadyToDrawnNextBeamsOnPageLine = (currentBeamedSingleUnits.length > 1) &&
      (
        !drawnSingleUnit.beamedWithNext ||
        drawnSingleUnit.withFlags ||
        drawnSingleUnit.isGraceUnitAndNextUnitIsNotGrace ||
        (index === drawnSingleUnitsInVoice.length - 1)
      )
    if (weAreReadyToDrawnNextBeamsOnPageLine) {
      const firstDrawnBeamedSingleUnit = currentBeamedSingleUnits[0]
      const lastDrawnBeamedSingleUnit = currentBeamedSingleUnits[currentBeamedSingleUnits.length - 1]
      lastDrawnBeamedSingleUnit.beamedWithNext = false
      lastBeamedSingleUnit = lastDrawnBeamedSingleUnit
      const anyStemDirectionChangesInBeamedSingleUnits = areAnyStemDirectionChangesInBeamedSingleUnits(currentBeamedSingleUnits)

      const durationsOfCurrentBeamedSingleUnits = currentBeamedSingleUnits.map(chord => chord.unitDuration)
      const minDurationAmongCurrentBeamedSingleUnits = Math.min(...durationsOfCurrentBeamedSingleUnits)
      const maxDurationAmongCurrentBeamedSingleUnits = Math.max(...durationsOfCurrentBeamedSingleUnits)
      const maxNumberOfBeamLinesForCurrentBeamedSingleUnits = calculatedNumberOfBeamLinesByDuration(minDurationAmongCurrentBeamedSingleUnits)
      const minNumberOfBeamLinesForCurrentBeamedSingleUnits = calculatedNumberOfBeamLinesByDuration(maxDurationAmongCurrentBeamedSingleUnits)
      const beamLineHeightNormal = Math.sqrt(Math.pow(tunedBeamWidth, 2) - Math.pow(tunedStemWidth, 2))
      const numberOfBeamLinesThatCanBeIntersectedInStemVertical = 1
      const numberOfCommonBeamLines = (
        maxNumberOfBeamLinesForCurrentBeamedSingleUnits === numberOfBeamLinesThatCanBeIntersectedInStemVertical
          ? maxNumberOfBeamLinesForCurrentBeamedSingleUnits - (numberOfBeamLinesThatCanBeIntersectedInStemVertical - 1)
          : (
            maxNumberOfBeamLinesForCurrentBeamedSingleUnits > numberOfBeamLinesThatCanBeIntersectedInStemVertical
              ? maxNumberOfBeamLinesForCurrentBeamedSingleUnits - numberOfBeamLinesThatCanBeIntersectedInStemVertical
              : maxNumberOfBeamLinesForCurrentBeamedSingleUnits
          )
      )
      const allBeamsHeightNormalWhereAllStemsWithSameDirection = (beamLineHeightNormal + tunedHeightOfBeamColumn) * numberOfCommonBeamLines

      const { firstDrawnBeamedSingleUnitStemEnd, lastDrawnBeamedSingleUnitStemEnd } = firstAndLastBeamedSingleUnitStemsEnds(currentBeamedSingleUnits, anyStemDirectionChangesInBeamedSingleUnits, minTopInCurrentBeamedSingleUnits, maxBottomInCurrentBeamedSingleUnits, beamLineHeightNormal, allBeamsHeightNormalWhereAllStemsWithSameDirection, styles)

      const drawnStems = []

      const stemForFirstDrawnSingleUnit = elementWithAdditionalInformation(
        stemForSingleUnitInBeamedPartOfVoiceByStemPlaceholderCoordinates(
          styles,
          firstDrawnBeamedSingleUnit.stemLeft,
          firstDrawnBeamedSingleUnitStemEnd,
          firstDrawnBeamedSingleUnit.stemDirection === 'up'
            ? firstDrawnBeamedSingleUnit.stemTop
            : firstDrawnBeamedSingleUnit.stemBottom,
          firstDrawnBeamedSingleUnit.isGrace
        ),
        {
          measureIndexInGeneral: firstDrawnBeamedSingleUnit.measureIndexInGeneral,
          staveIndex: firstDrawnBeamedSingleUnit.staveIndex,
          voiceIndex: firstDrawnBeamedSingleUnit.voiceIndex,
          singleUnitIndex: firstDrawnBeamedSingleUnit.singleUnitIndex,
          direction: firstDrawnBeamedSingleUnit.stemDirection,
          unitDuration: firstDrawnBeamedSingleUnit.unitDuration,
          beamedWithNext: firstDrawnBeamedSingleUnit.beamedWithNext,
          beamedWithNextWithJustOneBeam: firstDrawnBeamedSingleUnit.beamedWithNextWithJustOneBeam,
          numberOfTremoloStrokesInUnit: firstDrawnBeamedSingleUnit.numberOfTremoloStrokes,
          hasConnectedTremolo: firstDrawnBeamedSingleUnit.hasConnectedTremolo,
          nonIndentedPartOfUnitWidth: firstDrawnBeamedSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.right - firstDrawnBeamedSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.left,
          isGrace: firstDrawnBeamedSingleUnit.isGrace,
          isRest: firstDrawnBeamedSingleUnit.isRest
        }
      )
      const stemForLastDrawnSingleUnit = elementWithAdditionalInformation(
        stemForSingleUnitInBeamedPartOfVoiceByStemPlaceholderCoordinates(
          styles,
          lastDrawnBeamedSingleUnit.stemLeft,
          lastDrawnBeamedSingleUnitStemEnd,
          lastDrawnBeamedSingleUnit.stemDirection === 'up'
            ? lastDrawnBeamedSingleUnit.stemTop
            : lastDrawnBeamedSingleUnit.stemBottom,
          lastDrawnBeamedSingleUnit.isGrace
        ),
        {
          measureIndexInGeneral: lastDrawnBeamedSingleUnit.measureIndexInGeneral,
          staveIndex: lastDrawnBeamedSingleUnit.staveIndex,
          voiceIndex: lastDrawnBeamedSingleUnit.voiceIndex,
          singleUnitIndex: lastDrawnBeamedSingleUnit.singleUnitIndex,
          direction: lastDrawnBeamedSingleUnit.stemDirection,
          unitDuration: lastDrawnBeamedSingleUnit.unitDuration,
          beamedWithNext: lastDrawnBeamedSingleUnit.beamedWithNext,
          beamedWithNextWithJustOneBeam: lastDrawnBeamedSingleUnit.beamedWithNextWithJustOneBeam,
          numberOfTremoloStrokesInUnit: lastDrawnBeamedSingleUnit.numberOfTremoloStrokes,
          hasConnectedTremolo: lastDrawnBeamedSingleUnit.hasConnectedTremolo,
          nonIndentedPartOfUnitWidth: lastDrawnBeamedSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.right - lastDrawnBeamedSingleUnit.nonIndentedPartOfSingleUnitWithCoordinates.left,
          isGrace: lastDrawnBeamedSingleUnit.isGrace,
          isRest: lastDrawnBeamedSingleUnit.isRest
        }
      )

      const beamLineCoefficients = calculatedBeamLineCoefficients(
        stemForFirstDrawnSingleUnit.left,
        firstDrawnBeamedSingleUnit.stemDirection === 'up'
          ? stemForFirstDrawnSingleUnit.top
          : stemForFirstDrawnSingleUnit.bottom,
        stemForLastDrawnSingleUnit.left,
        lastDrawnBeamedSingleUnit.stemDirection === 'up'
          ? stemForLastDrawnSingleUnit.top
          : stemForLastDrawnSingleUnit.bottom
      )

      drawnStems.push(
        stemForFirstDrawnSingleUnit
      )

      for (let index = 1; index < currentBeamedSingleUnits.length - 1; index++) {
        drawnStems.push(
          elementWithAdditionalInformation(
            stemForSingleUnitInBeamedPartOfVoiceByStemPlaceholderCoordinates(
              styles,
              currentBeamedSingleUnits[index].stemLeft,
              calculatedStemExtremePositionForDrawnBeamedSingleUnit(
                currentBeamedSingleUnits[index],
                beamLineCoefficients
              ),
              currentBeamedSingleUnits[index].stemDirection === 'up'
                ? currentBeamedSingleUnits[index].stemTop
                : currentBeamedSingleUnits[index].stemBottom,
              currentBeamedSingleUnits[index].isGrace
            ),
            {
              measureIndexInGeneral: currentBeamedSingleUnits[index].measureIndexInGeneral,
              staveIndex: currentBeamedSingleUnits[index].staveIndex,
              voiceIndex: currentBeamedSingleUnits[index].voiceIndex,
              singleUnitIndex: currentBeamedSingleUnits[index].singleUnitIndex,
              direction: currentBeamedSingleUnits[index].stemDirection,
              unitDuration: currentBeamedSingleUnits[index].unitDuration,
              beamedWithNext: currentBeamedSingleUnits[index].beamedWithNext,
              beamedWithNextWithJustOneBeam: currentBeamedSingleUnits[index].beamedWithNextWithJustOneBeam,
              numberOfTremoloStrokesInUnit: currentBeamedSingleUnits[index].numberOfTremoloStrokes,
              hasConnectedTremolo: currentBeamedSingleUnits[index].hasConnectedTremolo,
              nonIndentedPartOfUnitWidth: currentBeamedSingleUnits[index].nonIndentedPartOfSingleUnitWithCoordinates.right - currentBeamedSingleUnits[index].nonIndentedPartOfSingleUnitWithCoordinates.left,
              isGrace: currentBeamedSingleUnits[index].isGrace,
              isRest: currentBeamedSingleUnits[index].isRest
            }
          )
        )
      }

      drawnStems.push(
        stemForLastDrawnSingleUnit
      )

      const { beamColumns, beamLinesPieces } = beams(styles, drawnStems, minNumberOfBeamLinesForCurrentBeamedSingleUnits, beamLineHeightNormal, allBeamsHeightNormalWhereAllStemsWithSameDirection, beamLineCoefficients, anyStemDirectionChangesInBeamedSingleUnits)
      for (let index = 0; index < currentBeamedSingleUnits.length; index++) {
        const currentBeamedSingleUnit = currentBeamedSingleUnits[index]
        if (index > 0) {
          addPropertiesToElement(
            currentBeamedSingleUnit,
            {
              'ref-ids': `next-to-unit-connected-with-beam-${currentBeamedSingleUnits[index - 1].measureIndexInGeneral + 1}-${currentBeamedSingleUnits[index - 1].staveIndex + 1}-${currentBeamedSingleUnits[index - 1].voiceIndex + 1}-${currentBeamedSingleUnits[index - 1].singleUnitIndex + 1}`
            }
          )
        }
        if (currentBeamedSingleUnit.stemDirection === 'up') {
          const calculatedMinTopForBeamedSingleUnitConsideringCorrectedStemAndBeamColumn = Math.min(currentBeamedSingleUnit.top, currentBeamedSingleUnit.stemTop, drawnStems[index].top, beamColumns[index].top - tunedNoteBeamStrokeOptions.width * 2)
          currentBeamedSingleUnit.top = calculatedMinTopForBeamedSingleUnitConsideringCorrectedStemAndBeamColumn
          currentBeamedSingleUnit.stemTop = calculatedMinTopForBeamedSingleUnitConsideringCorrectedStemAndBeamColumn
        } else if (currentBeamedSingleUnit.stemDirection === 'down') {
          const calculatedMaxBottomForBeamedSingleUnitConsideringCorrectedStemAndBeamColumn = Math.max(currentBeamedSingleUnit.bottom, currentBeamedSingleUnit.stemBottom, drawnStems[index].bottom, beamColumns[index].bottom + tunedNoteBeamStrokeOptions.width * 2)
          currentBeamedSingleUnit.bottom = calculatedMaxBottomForBeamedSingleUnitConsideringCorrectedStemAndBeamColumn
          currentBeamedSingleUnit.stemBottom = calculatedMaxBottomForBeamedSingleUnitConsideringCorrectedStemAndBeamColumn
        }
      }
      const drawnOnlyStemsForNonRestUnits = drawnStems.filter(stem => !stem.isRest)
      drawnOnlyStemsForNonRestUnits.forEach(stem => {
        addPropertiesToElement(
          stem,
          {
            'ref-ids': `stem-${stem.measureIndexInGeneral + 1}-${stem.staveIndex + 1}-${stem.voiceIndex + 1}-${stem.singleUnitIndex + 1}`
          }
        )
      })

      const backgroundForBeamLinesPieces = []
      for (let index = 0; index < beamLinesPieces.length; index++) {
        const beamLinesPiece = beamLinesPieces[index]
        if (
          (beamLinesPiece.perimeterCoordinates[0] && beamLinesPiece.perimeterCoordinates[0].x) &&
          (beamLinesPiece.perimeterCoordinates[0] && beamLinesPiece.perimeterCoordinates[0].y) &&
          (beamLinesPiece.perimeterCoordinates[1] && beamLinesPiece.perimeterCoordinates[1].x) &&
          (beamLinesPiece.perimeterCoordinates[1] && beamLinesPiece.perimeterCoordinates[1].y) &&
          (beamLinesPiece.perimeterCoordinates[2] && beamLinesPiece.perimeterCoordinates[2].x) &&
          (beamLinesPiece.perimeterCoordinates[2] && beamLinesPiece.perimeterCoordinates[2].y) &&
          (beamLinesPiece.perimeterCoordinates[3] && beamLinesPiece.perimeterCoordinates[3].x) &&
          (beamLinesPiece.perimeterCoordinates[3] && beamLinesPiece.perimeterCoordinates[3].y)
        ) {
          backgroundForBeamLinesPieces.push(
            path(
              [
                'M',
                beamLinesPiece.perimeterCoordinates[0].x, beamLinesPiece.perimeterCoordinates[0].y,
                'L',
                beamLinesPiece.perimeterCoordinates[1].x, beamLinesPiece.perimeterCoordinates[1].y,
                'L',
                beamLinesPiece.perimeterCoordinates[2].x, beamLinesPiece.perimeterCoordinates[2].y,
                'L',
                beamLinesPiece.perimeterCoordinates[3].x, beamLinesPiece.perimeterCoordinates[3].y,
                'Z'
              ],
              beamBackgroundStrokeOptions,
              true
            )
          )
        }
      }

      drawnBeamsWithStems.push(
        ...backgroundForBeamLinesPieces,
        ...drawnOnlyStemsForNonRestUnits,
        ...beamColumns,
        ...beamLinesPieces
      )

      currentBeamedSingleUnits = []
      minTopInCurrentBeamedSingleUnits = undefined
      maxBottomInCurrentBeamedSingleUnits = undefined
    }
  })
  return drawnBeamsWithStems
}
