'use strict'

import path from './../basic/path.js'
import group from './../basic/group.js'
import addPropertiesToElement from './../basic/addPropertiesToElement.js'
import elementWithAdditionalInformation from './../basic/elementWithAdditionalInformation.js'

const correctStemEndCoordinates = (stem, newStemEndCoordinate) => {
  if (stem.direction === 'up' && (stem.topCorrectedByBeamLines === undefined || newStemEndCoordinate < stem.topCorrectedByBeamLines)) {
    stem.topCorrectedByBeamLines = newStemEndCoordinate
  } else if (stem.direction === 'down' && (stem.bottomCorrectedByBeamLines === undefined || newStemEndCoordinate > stem.bottomCorrectedByBeamLines)) {
    stem.bottomCorrectedByBeamLines = newStemEndCoordinate
  }
}

const updateBeamLinesPerimeterCoordinates = (beamLinesPerimeterCoordinates, arrayOfXsForStem, arrayOfXsForNextStem, arrayOfYsForStem, arrayOfYsForNextStem) => {
  beamLinesPerimeterCoordinates[0] = beamLinesPerimeterCoordinates[0] || {}
  beamLinesPerimeterCoordinates[1] = beamLinesPerimeterCoordinates[1] || {}
  beamLinesPerimeterCoordinates[2] = beamLinesPerimeterCoordinates[2] || {}
  beamLinesPerimeterCoordinates[3] = beamLinesPerimeterCoordinates[3] || {}
  const minXForStem = Math.min(...arrayOfXsForStem)
  const maxXForNextStem = Math.max(...arrayOfXsForNextStem)
  const minYForStem = Math.min(...arrayOfYsForStem)
  const maxYForStem = Math.max(...arrayOfYsForStem)
  const minYForNextStem = Math.min(...arrayOfYsForNextStem)
  const maxYForNextStem = Math.max(...arrayOfYsForNextStem)
  beamLinesPerimeterCoordinates[0].x = beamLinesPerimeterCoordinates[0].x ? Math.min(beamLinesPerimeterCoordinates[0].x, minXForStem) : minXForStem
  beamLinesPerimeterCoordinates[0].y = beamLinesPerimeterCoordinates[0].y ? Math.min(beamLinesPerimeterCoordinates[0].y, minYForStem) : minYForStem
  beamLinesPerimeterCoordinates[1].x = beamLinesPerimeterCoordinates[1].x ? Math.max(beamLinesPerimeterCoordinates[1].x, maxXForNextStem) : maxXForNextStem
  beamLinesPerimeterCoordinates[1].y = beamLinesPerimeterCoordinates[1].y ? Math.min(beamLinesPerimeterCoordinates[1].y, minYForNextStem) : minYForNextStem
  beamLinesPerimeterCoordinates[2].x = beamLinesPerimeterCoordinates[2].x ? Math.max(beamLinesPerimeterCoordinates[2].x, maxXForNextStem) : maxXForNextStem
  beamLinesPerimeterCoordinates[2].y = beamLinesPerimeterCoordinates[2].y ? Math.max(beamLinesPerimeterCoordinates[2].y, maxYForNextStem) : maxYForNextStem
  beamLinesPerimeterCoordinates[3].x = beamLinesPerimeterCoordinates[3].x ? Math.min(beamLinesPerimeterCoordinates[3].x, minXForStem) : minXForStem
  beamLinesPerimeterCoordinates[3].y = beamLinesPerimeterCoordinates[3].y ? Math.max(beamLinesPerimeterCoordinates[3].y, maxYForStem) : maxYForStem
}

export default function (styles, stem, nextStem, beamLineHeightNormal, allBeamsHeightNormalWhereAllStemsWithSameDirection, isFirstBeam, isLastBeam, numberOfBeamLinesForStem, numberOfBeamLinesForNextStem, beamLineCoefficients, anyStemDirectionChangesInBeamedSingleUnits, firstStemDirection) {
  const { noteBeamStrokeOptions, noteSquareStemStrokeOptions, heightOfBeamColumn, cutBeamLength, negativeXOffsetOfTremoloBeams, graceElementsScaleFactor } = styles

  const tunedNoteBeamStrokeOptions = Object.assign({}, noteBeamStrokeOptions)
  const tunedNoteSquareStemStrokeOptions = Object.assign({}, noteSquareStemStrokeOptions)
  let tunedHeightOfBeamColumn = heightOfBeamColumn
  let tunedCutBeamLength = cutBeamLength
  let tunedNegativeXOffsetOfTremoloBeams = negativeXOffsetOfTremoloBeams
  if (stem.isGrace || nextStem.isGrace) {
    tunedNoteBeamStrokeOptions.width *= graceElementsScaleFactor
    tunedNoteSquareStemStrokeOptions.width *= graceElementsScaleFactor
    tunedHeightOfBeamColumn *= graceElementsScaleFactor
    tunedCutBeamLength *= graceElementsScaleFactor
    tunedNegativeXOffsetOfTremoloBeams *= graceElementsScaleFactor
  }

  const xStemCorrection = noteSquareStemStrokeOptions.width / 2
  const beamStrokeXCorrection = noteBeamStrokeOptions.width / 2
  const stemX = stem.left
  const nextStemX = nextStem.left
  const beamLinesPiece = []
  const tremoloBeamLinesPiece = []
  const beamLinesPerimeterCoordinates = []

  const middlePointXFromStem = stemX + tunedCutBeamLength
  const middlePointYFromStem = middlePointXFromStem * beamLineCoefficients.gradient + beamLineCoefficients.topIntercept

  const middlePointXFromNextStem = nextStemX - tunedCutBeamLength
  const middlePointYFromNextStem = middlePointXFromNextStem * beamLineCoefficients.gradient + beamLineCoefficients.topIntercept

  const maxNumberOfBeamLinesWithoutConsideringSingleBeamedConnections = Math.max(numberOfBeamLinesForStem, numberOfBeamLinesForNextStem)
  const maxNumberOfBeamLines = stem.beamedWithNextWithJustOneBeam ? 1 : maxNumberOfBeamLinesWithoutConsideringSingleBeamedConnections

  // maybe we need use maxNumberOfBeamLinesWithoutConsideringSingleBeamedConnections instead of maxNumberOfBeamLines in the next line, we'll see
  const startIndexOfTremoloStrokesForBothStems = maxNumberOfBeamLines - Math.max(stem.numberOfTremoloStrokesInUnit, nextStem.numberOfTremoloStrokesInUnit) - 1

  if (!anyStemDirectionChangesInBeamedSingleUnits) {
    for (let index = 0; index < maxNumberOfBeamLines; index++) {
      const endPointCorrectionOfCurrentBeamLine = allBeamsHeightNormalWhereAllStemsWithSameDirection - index * beamLineHeightNormal - index * tunedHeightOfBeamColumn
      const startPointCorrectionOfCurrentBeamLine = endPointCorrectionOfCurrentBeamLine - beamLineHeightNormal

      const currentTopBeamDownLineForStem = stem.top - endPointCorrectionOfCurrentBeamLine
      const currentBottomBeamUpLineForStem = stem.bottom + endPointCorrectionOfCurrentBeamLine
      const currentTopBeamUpLineForStem = stem.top - startPointCorrectionOfCurrentBeamLine
      const currentBottomBeamDownLineForStem = stem.bottom + startPointCorrectionOfCurrentBeamLine

      const currentTopBeamDownLineForNextStem = nextStem.top - endPointCorrectionOfCurrentBeamLine
      const currentBottomBeamUpLineForNextStem = nextStem.bottom + endPointCorrectionOfCurrentBeamLine
      const currentTopBeamUpLineForNextStem = nextStem.top - startPointCorrectionOfCurrentBeamLine
      const currentBottomBeamDownLineForNextStem = nextStem.bottom + startPointCorrectionOfCurrentBeamLine

      const currentTopBeamDownLineForMiddlePointFromStem = middlePointYFromStem - endPointCorrectionOfCurrentBeamLine
      const currentBottomBeamUpLineForMiddlePointFromStem = middlePointYFromStem + endPointCorrectionOfCurrentBeamLine
      const currentTopBeamUpLineForMiddlePointFromStem = middlePointYFromStem - startPointCorrectionOfCurrentBeamLine
      const currentBottomBeamDownLineForMiddlePointFromStem = middlePointYFromStem + startPointCorrectionOfCurrentBeamLine

      const currentTopBeamDownLineForMiddlePointFromNextStem = middlePointYFromNextStem - endPointCorrectionOfCurrentBeamLine
      const currentBottomBeamUpLineForMiddlePointFromNextStem = middlePointYFromNextStem + endPointCorrectionOfCurrentBeamLine
      const currentTopBeamUpLineForMiddlePointFromNextStem = middlePointYFromNextStem - startPointCorrectionOfCurrentBeamLine
      const currentBottomBeamDownLineForMiddlePointFromNextStem = middlePointYFromNextStem + startPointCorrectionOfCurrentBeamLine

      if (index < numberOfBeamLinesForStem) {
        if (index < numberOfBeamLinesForNextStem) {
          let negativeXOffsetOfBeamInCaseIfItIsTremoloBeam = 0
          let itIsTremoloBeamLine = false
          if (stem.hasConnectedTremolo && stem.unitDuration < 1 / 2 && index > startIndexOfTremoloStrokesForBothStems) {
            negativeXOffsetOfBeamInCaseIfItIsTremoloBeam = tunedNegativeXOffsetOfTremoloBeams
            itIsTremoloBeamLine = true
          }
          const points = [
            'M',
            (isFirstBeam ? stemX - xStemCorrection + beamStrokeXCorrection : stemX) + negativeXOffsetOfBeamInCaseIfItIsTremoloBeam, (stem.direction === 'up' ? currentTopBeamUpLineForStem : currentBottomBeamDownLineForStem) + negativeXOffsetOfBeamInCaseIfItIsTremoloBeam * beamLineCoefficients.gradient,
            'L',
            (isLastBeam ? nextStemX + xStemCorrection - beamStrokeXCorrection : nextStemX) - negativeXOffsetOfBeamInCaseIfItIsTremoloBeam, (stem.direction === 'up' ? currentTopBeamUpLineForNextStem : currentBottomBeamDownLineForNextStem) - negativeXOffsetOfBeamInCaseIfItIsTremoloBeam * beamLineCoefficients.gradient,
            'L',
            (isLastBeam ? nextStemX + xStemCorrection - beamStrokeXCorrection : nextStemX) - negativeXOffsetOfBeamInCaseIfItIsTremoloBeam, (stem.direction === 'up' ? currentTopBeamDownLineForNextStem : currentBottomBeamUpLineForNextStem) - negativeXOffsetOfBeamInCaseIfItIsTremoloBeam * beamLineCoefficients.gradient,
            'L',
            (isFirstBeam ? stemX - xStemCorrection + beamStrokeXCorrection : stemX) + negativeXOffsetOfBeamInCaseIfItIsTremoloBeam, (stem.direction === 'up' ? currentTopBeamDownLineForStem : currentBottomBeamUpLineForStem) + negativeXOffsetOfBeamInCaseIfItIsTremoloBeam * beamLineCoefficients.gradient,
            'Z'
          ]
          const drawnBeamLine = path(
            points,
            tunedNoteBeamStrokeOptions,
            true,
            0,
            0
          )
          if (itIsTremoloBeamLine) {
            tremoloBeamLinesPiece.push(drawnBeamLine)
          } else {
            beamLinesPiece.push(drawnBeamLine)
          }
          updateBeamLinesPerimeterCoordinates(
            beamLinesPerimeterCoordinates,
            [ points[1], points[10] ],
            [ points[4], points[7] ],
            [ points[2], points[11] ],
            [ points[5], points[8] ]
          )
        } else {
          const points = [
            'M',
            isFirstBeam ? stemX - xStemCorrection + beamStrokeXCorrection : stemX, stem.direction === 'up' ? currentTopBeamUpLineForStem : currentBottomBeamDownLineForStem,
            'L',
            middlePointXFromStem, stem.direction === 'up' ? currentTopBeamUpLineForMiddlePointFromStem : currentBottomBeamDownLineForMiddlePointFromStem,
            'L',
            middlePointXFromStem, stem.direction === 'up' ? currentTopBeamDownLineForMiddlePointFromStem : currentBottomBeamUpLineForMiddlePointFromStem,
            'L',
            isFirstBeam ? stemX - xStemCorrection + beamStrokeXCorrection : stemX, stem.direction === 'up' ? currentTopBeamDownLineForStem : currentBottomBeamUpLineForStem,
            'Z'
          ]
          beamLinesPiece.push(
            path(
              points,
              tunedNoteBeamStrokeOptions,
              true,
              0,
              0
            )
          )
        }
      } else {
        const points = [
          'M',
          middlePointXFromNextStem, nextStem.direction === 'up' ? currentTopBeamUpLineForMiddlePointFromNextStem : currentBottomBeamDownLineForMiddlePointFromNextStem,
          'L',
          isLastBeam ? nextStemX + xStemCorrection - beamStrokeXCorrection : nextStemX, nextStem.direction === 'up' ? currentTopBeamUpLineForNextStem : currentBottomBeamDownLineForNextStem,
          'L',
          isLastBeam ? nextStemX + xStemCorrection - beamStrokeXCorrection : nextStemX, nextStem.direction === 'up' ? currentTopBeamDownLineForNextStem : currentBottomBeamUpLineForNextStem,
          'L',
          middlePointXFromNextStem, nextStem.direction === 'up' ? currentTopBeamDownLineForMiddlePointFromNextStem : currentBottomBeamUpLineForMiddlePointFromNextStem,
          'Z'
        ]
        beamLinesPiece.push(
          path(
            points,
            tunedNoteBeamStrokeOptions,
            true,
            0,
            0
          )
        )
      }
    }
  } else {
    const pilingDirectionSignOfBeamLines = firstStemDirection === 'up' ? -1 : 1
    const stemEndCoordinate = stem[stem.direction === 'up' ? 'top' : 'bottom']
    const nextStemEndCoordinate = nextStem[nextStem.direction === 'up' ? 'top' : 'bottom']
    for (let index = 0; index < maxNumberOfBeamLines; index++) {
      if (index < numberOfBeamLinesForStem) {
        if (index < numberOfBeamLinesForNextStem) {
          let negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem = 0
          let negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForNextStem = 0
          let itIsTremoloBeamLine = false
          if (stem.hasConnectedTremolo && stem.unitDuration < 1 / 2 && index > startIndexOfTremoloStrokesForBothStems) {
            if (stem.direction === 'down') {
              negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem = stem.nonIndentedPartOfUnitWidth + tunedNegativeXOffsetOfTremoloBeams
            } else {
              negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem = tunedNegativeXOffsetOfTremoloBeams
            }
            if (nextStem.direction === 'up') {
              negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForNextStem = nextStem.nonIndentedPartOfUnitWidth + tunedNegativeXOffsetOfTremoloBeams
            } else {
              negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForNextStem = tunedNegativeXOffsetOfTremoloBeams
            }
            itIsTremoloBeamLine = true
          }
          const points = [
            'M',
            (stemX - xStemCorrection + beamStrokeXCorrection) + negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem, stemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + (negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem * beamLineCoefficients.gradient),
            'L',
            (stemX + xStemCorrection - beamStrokeXCorrection) + negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem, stemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + (negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem * beamLineCoefficients.gradient),
            'L',
            (nextStemX - xStemCorrection + beamStrokeXCorrection) - negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForNextStem, nextStemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) - (negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForNextStem * beamLineCoefficients.gradient),
            'L',
            (nextStemX + xStemCorrection - beamStrokeXCorrection) - negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForNextStem, nextStemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) - (negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForNextStem * beamLineCoefficients.gradient),
            'L',
            (nextStemX + xStemCorrection - beamStrokeXCorrection) - negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForNextStem, nextStemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + pilingDirectionSignOfBeamLines * beamLineHeightNormal - (negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForNextStem * beamLineCoefficients.gradient),
            'L',
            (nextStemX - xStemCorrection + beamStrokeXCorrection) - negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForNextStem, nextStemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + pilingDirectionSignOfBeamLines * beamLineHeightNormal - (negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForNextStem * beamLineCoefficients.gradient),
            'L',
            (stemX + xStemCorrection - beamStrokeXCorrection) + negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem, stemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + pilingDirectionSignOfBeamLines * beamLineHeightNormal + (negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem * beamLineCoefficients.gradient),
            'L',
            (stemX - xStemCorrection + beamStrokeXCorrection) + negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem, stemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + pilingDirectionSignOfBeamLines * beamLineHeightNormal + (negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem * beamLineCoefficients.gradient),
            'L',
            (stemX - xStemCorrection + beamStrokeXCorrection) + negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem, stemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + (negativeXOffsetOfBeamInCaseIfItIsTremoloBeamForStem * beamLineCoefficients.gradient),
            'Z'
          ]
          const drawnBeamLine = path(
            points,
            tunedNoteBeamStrokeOptions,
            true,
            0,
            0
          )
          updateBeamLinesPerimeterCoordinates(
            beamLinesPerimeterCoordinates,
            [ points[1], points[4], points[19], points[22], points[25] ],
            [ points[7], points[10], points[13], points[16] ],
            [ points[2], points[5], points[20], points[23], points[26] ],
            [ points[8], points[11], points[14], points[17] ]
          )
          if (itIsTremoloBeamLine) {
            tremoloBeamLinesPiece.push(drawnBeamLine)
          } else {
            beamLinesPiece.push(drawnBeamLine)
          }
        } else {
          const points = [
            'M',
            stemX - xStemCorrection + beamStrokeXCorrection, stemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn),
            'L',
            stemX + xStemCorrection - beamStrokeXCorrection, stemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn),
            'L',
            middlePointXFromStem - xStemCorrection + beamStrokeXCorrection, middlePointYFromStem + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn),
            'L',
            middlePointXFromStem - xStemCorrection + beamStrokeXCorrection, middlePointYFromStem + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + pilingDirectionSignOfBeamLines * beamLineHeightNormal,
            'L',
            stemX - xStemCorrection + beamStrokeXCorrection, stemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + pilingDirectionSignOfBeamLines * beamLineHeightNormal,
            'L',
            stemX + xStemCorrection - beamStrokeXCorrection, stemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + pilingDirectionSignOfBeamLines * beamLineHeightNormal,
            'L',
            stemX + xStemCorrection - beamStrokeXCorrection, stemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn),
            'Z'
          ]
          beamLinesPiece.push(
            path(
              points,
              tunedNoteBeamStrokeOptions,
              true,
              0,
              0
            )
          )
        }
      } else {
        const points = [
          'M',
          middlePointXFromNextStem - xStemCorrection + beamStrokeXCorrection, middlePointYFromNextStem + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn),
          'L',
          nextStemX - xStemCorrection + beamStrokeXCorrection, nextStemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn),
          'L',
          nextStemX + xStemCorrection - beamStrokeXCorrection, nextStemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn),
          'L',
          nextStemX + xStemCorrection - beamStrokeXCorrection, nextStemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + pilingDirectionSignOfBeamLines * beamLineHeightNormal,
          'L',
          nextStemX - xStemCorrection + beamStrokeXCorrection, nextStemEndCoordinate + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + pilingDirectionSignOfBeamLines * beamLineHeightNormal,
          'L',
          middlePointXFromNextStem - xStemCorrection + beamStrokeXCorrection, middlePointYFromNextStem + pilingDirectionSignOfBeamLines * index * (beamLineHeightNormal + tunedHeightOfBeamColumn) + pilingDirectionSignOfBeamLines * beamLineHeightNormal,
          'Z'
        ]
        beamLinesPiece.push(
          path(
            points,
            tunedNoteBeamStrokeOptions,
            true,
            0,
            0
          )
        )
      }
      if (index === numberOfBeamLinesForStem - 1) {
        const indexToWhichBeamColumnNeedsToBeExtended = (stem.hasConnectedTremolo && (stem.unitDuration <= 1 / 4)) ? startIndexOfTremoloStrokesForBothStems : index
        correctStemEndCoordinates(stem, stemEndCoordinate + pilingDirectionSignOfBeamLines * indexToWhichBeamColumnNeedsToBeExtended * (beamLineHeightNormal + tunedHeightOfBeamColumn) + pilingDirectionSignOfBeamLines * beamLineHeightNormal)
      }
      if (index === numberOfBeamLinesForNextStem - 1) {
        const indexToWhichBeamColumnNeedsToBeExtended = (stem.hasConnectedTremolo && (stem.unitDuration <= 1 / 4)) ? startIndexOfTremoloStrokesForBothStems : index
        correctStemEndCoordinates(nextStem, nextStemEndCoordinate + pilingDirectionSignOfBeamLines * indexToWhichBeamColumnNeedsToBeExtended * (beamLineHeightNormal + tunedHeightOfBeamColumn) + pilingDirectionSignOfBeamLines * beamLineHeightNormal)
      }
    }
  }
  const groupedBeamLinesPiece = group(
    'beamLines',
    beamLinesPiece
  )
  const groupedTremoloBeamLinesPiece = group(
    'tremoloBeamLines',
    tremoloBeamLinesPiece
  )
  addPropertiesToElement(
    groupedBeamLinesPiece,
    {
      'ref-ids': `beam-${stem.measureIndexInGeneral + 1}-${stem.staveIndex + 1}-${stem.voiceIndex + 1}-${stem.singleUnitIndex + 1}`
    }
  )
  addPropertiesToElement(
    groupedTremoloBeamLinesPiece,
    {
      'ref-ids': `tremolo-${stem.measureIndexInGeneral + 1}-${stem.staveIndex + 1}-${stem.voiceIndex + 1}-${stem.singleUnitIndex + 1}`
    }
  )
  return elementWithAdditionalInformation(
    group(
      'beamLinesIncludingTremolo',
      [
        groupedBeamLinesPiece,
        groupedTremoloBeamLinesPiece
      ]
    ),
    {
      perimeterCoordinates: beamLinesPerimeterCoordinates
    }
  )
}
