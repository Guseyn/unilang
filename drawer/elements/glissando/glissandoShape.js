'use strict'

const wave = require('./../basic/wave')
const group = require('./../basic/group')
const line = require('./../basic/line')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (markedGlissando, glissandoMarkKey, voicesBody, voicesBodiesOnPageLine, drawnMeasuresOnPageLine, extendedFromLeftSide, extendedToRightSide, numberOfStaveLines, styles) => {
  const glissandoShapeComponents = []
  const { intervalBetweenStaveLines, glissandoWavePeriod, glissandoStrokeWidth, glissandoOffsetFromNoteBody, glissandoOffsetFromNoteBodyOnAdditionalLines, fontColor, graceElementsScaleFactor, leftMarginForConnectionsThatStartBefore, leftMarginForConnectionsThatStartBeforeMeasureWithEmptyVoicesBody, rightMarginForConnectionsThatFinishAfterMeasureWithEmptyVoicesBody } = styles
  const isGrace = (markedGlissando.leftSingleUnit && markedGlissando.leftSingleUnit.isGrace) || (markedGlissando.rightSingleUnit && markedGlissando.rightSingleUnit.isGrace)
  if (markedGlissando.leftSingleUnit && markedGlissando.rightSingleUnit) {
    for (let index = 0; index < markedGlissando.leftSingleUnit.notesWithCoordinates.length; index++) {
      if (markedGlissando.rightSingleUnit.notesWithCoordinates[index]) {
        const centerOfLeftNote = (markedGlissando.leftSingleUnit.notesWithCoordinates[index].top + markedGlissando.leftSingleUnit.notesWithCoordinates[index].bottom) / 2
        const centerOfRightNote = (markedGlissando.rightSingleUnit.notesWithCoordinates[index].top + markedGlissando.rightSingleUnit.notesWithCoordinates[index].bottom) / 2
        const centerOfLeftNoteIsCloseToCenterOfRightNote = Math.abs(centerOfLeftNote - centerOfRightNote) <= intervalBetweenStaveLines
        const glissandoDirectionForCurrentNote = (centerOfLeftNote > centerOfRightNote) ? 'up' : 'down'
        const isLeftNoteOnAdditionalLines = markedGlissando.leftSingleUnit.notesWithCoordinates[index].positionNumber <= -1 || markedGlissando.leftSingleUnit.notesWithCoordinates[index].positionNumber >= numberOfStaveLines
        const isRightNoteOnAdditionalLines = markedGlissando.rightSingleUnit.notesWithCoordinates[index].positionNumber <= -1 || markedGlissando.rightSingleUnit.notesWithCoordinates[index].positionNumber >= numberOfStaveLines
        const glissandoStartPoint = {
          x: (markedGlissando.leftSingleUnit.numberOfDots === 0 ? markedGlissando.leftSingleUnit.bodyRight : markedGlissando.leftSingleUnit.right) + (isLeftNoteOnAdditionalLines ? glissandoOffsetFromNoteBodyOnAdditionalLines : glissandoOffsetFromNoteBody),
          y: centerOfLeftNoteIsCloseToCenterOfRightNote
            ? centerOfLeftNote
            : (glissandoDirectionForCurrentNote === 'up')
              ? markedGlissando.leftSingleUnit.notesWithCoordinates[index].top
              : markedGlissando.leftSingleUnit.notesWithCoordinates[index].bottom
        }
        const glissandoEndPoint = {
          x: markedGlissando.rightSingleUnit.bodyLeft - (isRightNoteOnAdditionalLines ? glissandoOffsetFromNoteBodyOnAdditionalLines : glissandoOffsetFromNoteBody),
          y: centerOfLeftNoteIsCloseToCenterOfRightNote
            ? centerOfRightNote
            : (glissandoDirectionForCurrentNote === 'up')
              ? markedGlissando.rightSingleUnit.notesWithCoordinates[index].bottom
              : markedGlissando.rightSingleUnit.notesWithCoordinates[index].top
        }
        if (glissandoEndPoint.x < glissandoStartPoint.x) {
          glissandoEndPoint.x = glissandoStartPoint.x
        }
        if (markedGlissando.form === 'wave') {
          glissandoShapeComponents.push(
            wave(
              glissandoStartPoint,
              glissandoEndPoint,
              glissandoWavePeriod,
              fontColor,
              graceElementsScaleFactor,
              isGrace
            )
          )
        } else if (markedGlissando.form === 'line') {
          glissandoShapeComponents.push(
            line(
              glissandoStartPoint.x,
              glissandoStartPoint.y,
              glissandoEndPoint.x,
              glissandoEndPoint.y,
              {
                width: glissandoStrokeWidth,
                color: fontColor
              }
            )
          )
        }
      }
    }
  } else if (extendedFromLeftSide && markedGlissando.rightSingleUnit) {
    const glissandoDirectionSign = markedGlissando.glissandoDirection === 'up' ? -1 : +1
    for (let index = 0; index < markedGlissando.rightSingleUnit.notesWithCoordinates.length; index++) {
      const isRightNoteOnAdditionalLines = markedGlissando.rightSingleUnit.notesWithCoordinates[index].positionNumber < 0 || markedGlissando.rightSingleUnit.notesWithCoordinates[index].positionNumber > numberOfStaveLines - 1
      const glissandoStartPoint = {
        x: (
          (
            markedGlissando.startsBeforeCertainMeasure !== undefined &&
            voicesBodiesOnPageLine[markedGlissando.startsBeforeCertainMeasure] &&
            !voicesBodiesOnPageLine[markedGlissando.startsBeforeCertainMeasure].isEmpty
          ) ? (voicesBodiesOnPageLine[markedGlissando.startsBeforeCertainMeasure].left + leftMarginForConnectionsThatStartBefore)
            : (
              markedGlissando.startsBeforeCertainMeasure !== undefined &&
              drawnMeasuresOnPageLine[markedGlissando.startsBeforeCertainMeasure] &&
              !drawnMeasuresOnPageLine[markedGlissando.startsBeforeCertainMeasure].isEmpty
            ) ? drawnMeasuresOnPageLine[markedGlissando.startsBeforeCertainMeasure].right + leftMarginForConnectionsThatStartBeforeMeasureWithEmptyVoicesBody
              : (voicesBody.left + leftMarginForConnectionsThatStartBefore)
        ),
        y: (markedGlissando.rightSingleUnit.notesWithCoordinates[index].top + markedGlissando.rightSingleUnit.notesWithCoordinates[index].bottom) / 2 + glissandoDirectionSign * intervalBetweenStaveLines
      }
      const glissandoEndPoint = {
        x: markedGlissando.rightSingleUnit.bodyLeft - (isRightNoteOnAdditionalLines ? glissandoOffsetFromNoteBodyOnAdditionalLines : glissandoOffsetFromNoteBody),
        y: (markedGlissando.rightSingleUnit.notesWithCoordinates[index].top + markedGlissando.rightSingleUnit.notesWithCoordinates[index].bottom) / 2
      }
      if (markedGlissando.form === 'wave') {
        glissandoShapeComponents.push(
          wave(
            glissandoStartPoint,
            glissandoEndPoint,
            glissandoWavePeriod,
            fontColor,
            graceElementsScaleFactor,
            isGrace
          )
        )
      } else if (markedGlissando.form === 'line') {
        glissandoShapeComponents.push(
          line(
            glissandoStartPoint.x,
            glissandoStartPoint.y,
            glissandoEndPoint.x,
            glissandoEndPoint.y,
            {
              width: glissandoStrokeWidth,
              color: fontColor
            }
          )
        )
      }
    }
  } else if (extendedToRightSide && markedGlissando.leftSingleUnit) {
    const glissandoDirectionSign = markedGlissando.glissandoDirection === 'up' ? -1 : +1
    for (let index = 0; index < markedGlissando.leftSingleUnit.notesWithCoordinates.length; index++) {
      const isLeftNoteOnAdditionalLines = markedGlissando.leftSingleUnit.notesWithCoordinates[index].positionNumber <= -1 || markedGlissando.leftSingleUnit.notesWithCoordinates[index].positionNumber >= numberOfStaveLines
      const glissandoStartPoint = {
        x: (markedGlissando.leftSingleUnit.numberOfDots === 0 ? markedGlissando.leftSingleUnit.bodyRight : markedGlissando.leftSingleUnit.right) + (isLeftNoteOnAdditionalLines ? glissandoOffsetFromNoteBodyOnAdditionalLines : glissandoOffsetFromNoteBody),
        y: (markedGlissando.leftSingleUnit.notesWithCoordinates[index].top + markedGlissando.leftSingleUnit.notesWithCoordinates[index].bottom) / 2
      }
      const glissandoEndPoint = {
        x: (
          (
            markedGlissando.finishesAfterCertainMeasure !== undefined &&
            voicesBodiesOnPageLine[markedGlissando.finishesAfterCertainMeasure] &&
            !voicesBodiesOnPageLine[markedGlissando.finishesAfterCertainMeasure].isEmpty
          ) ? voicesBodiesOnPageLine[markedGlissando.finishesAfterCertainMeasure].right
            : (
              markedGlissando.finishesAfterCertainMeasure !== undefined &&
              drawnMeasuresOnPageLine[markedGlissando.finishesAfterCertainMeasure] &&
              !drawnMeasuresOnPageLine[markedGlissando.finishesAfterCertainMeasure].isEmpty
            ) ? (drawnMeasuresOnPageLine[markedGlissando.finishesAfterCertainMeasure].right - rightMarginForConnectionsThatFinishAfterMeasureWithEmptyVoicesBody)
              : voicesBody.right
        ),
        y: (markedGlissando.leftSingleUnit.notesWithCoordinates[index].top + markedGlissando.leftSingleUnit.notesWithCoordinates[index].bottom) / 2 + glissandoDirectionSign * intervalBetweenStaveLines
      }
      if (markedGlissando.form === 'wave') {
        glissandoShapeComponents.push(
          wave(
            glissandoStartPoint,
            glissandoEndPoint,
            glissandoWavePeriod,
            fontColor,
            graceElementsScaleFactor,
            isGrace
          )
        )
      } else if (markedGlissando.form === 'line') {
        glissandoShapeComponents.push(
          line(
            glissandoStartPoint.x,
            glissandoStartPoint.y,
            glissandoEndPoint.x,
            glissandoEndPoint.y,
            {
              width: glissandoStrokeWidth,
              color: fontColor
            }
          )
        )
      }
    }
  }
  const drawnGlissando = group(
    'glissando',
    glissandoShapeComponents
  )
  addPropertiesToElement(
    drawnGlissando,
    {
      'ref-ids': glissandoMarkKey
    }
  )
  return drawnGlissando
}
