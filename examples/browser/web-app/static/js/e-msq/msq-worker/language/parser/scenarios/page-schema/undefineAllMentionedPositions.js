'use strict'

export default function (parserState) {
  parserState.lastMentionedPageLinePosition = undefined
  parserState.lastMentionedMeasurePosition = undefined
  parserState.lastMentionedStavePosition = undefined
  parserState.lastMentionedVoicePosition = undefined
  parserState.lastMentionedUnitPosition = undefined
  parserState.calculatedUnitMeasureIndexByLastMentionedPositions = undefined
  parserState.calculatedUnitStaveIndexByLastMentionedPositions = undefined
  parserState.calculatedUnitVoiceIndexByLastMentionedPositions = undefined
  parserState.calculatedUnitIndexByLastMentionedPositions = undefined
  parserState.lastMentionedConnectionPageLinePosition = undefined
  parserState.lastMentionedConnectionMeasurePosition = undefined
  parserState.lastMentionedConnectionStavePosition = undefined
  parserState.lastMentionedConnectionVoicePosition = undefined
}
