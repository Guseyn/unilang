'use strict'

export default function (parserState) {
  parserState.lastMentionedUnitPosition = undefined
  parserState.calculatedUnitIndexByLastMentionedPositions = undefined
}
