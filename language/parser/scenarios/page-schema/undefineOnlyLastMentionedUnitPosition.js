'use strict'

module.exports = (parserState) => {
  parserState.lastMentionedUnitPosition = undefined
  parserState.calculatedUnitIndexByLastMentionedPositions = undefined
}
