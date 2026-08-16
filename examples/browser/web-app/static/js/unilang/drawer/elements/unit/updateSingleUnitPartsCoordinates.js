'use strict'

export default function (drawnSingleUnit, xDistanceToMove = 0, yDistanceToMove = 0) {
  drawnSingleUnit.bodyLeft += xDistanceToMove
  drawnSingleUnit.bodyRight += xDistanceToMove
  drawnSingleUnit.bodyTop += yDistanceToMove
  drawnSingleUnit.bodyBottom += yDistanceToMove

  drawnSingleUnit.stemLeft += xDistanceToMove
  drawnSingleUnit.stemRight += xDistanceToMove
  drawnSingleUnit.stemTop += yDistanceToMove
  drawnSingleUnit.stemBottom += yDistanceToMove

  if (drawnSingleUnit.flagsLeft && drawnSingleUnit.flagsRight && drawnSingleUnit.flagsTop && drawnSingleUnit.flagsBottom) {
    drawnSingleUnit.flagsLeft += xDistanceToMove
    drawnSingleUnit.flagsRight += xDistanceToMove
    drawnSingleUnit.flagsTop += yDistanceToMove
    drawnSingleUnit.flagsBottom += yDistanceToMove
  }

  if (drawnSingleUnit.dotsLeft && drawnSingleUnit.dotsRight && drawnSingleUnit.dotsTop && drawnSingleUnit.dotsBottom) {
    drawnSingleUnit.dotsLeft += xDistanceToMove
    drawnSingleUnit.dotsRight += xDistanceToMove
    drawnSingleUnit.dotsTop += yDistanceToMove
    drawnSingleUnit.dotsBottom += yDistanceToMove
  }

  if (drawnSingleUnit.parenthesesLeft && drawnSingleUnit.parenthesesRight) {
    drawnSingleUnit.parenthesesLeft += xDistanceToMove
    drawnSingleUnit.parenthesesRight += xDistanceToMove
  }
}
