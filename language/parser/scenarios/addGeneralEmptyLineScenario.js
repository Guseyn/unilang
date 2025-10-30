'use strict'

module.exports = (scenarios) => {
  scenarios['empty line in general'] = {
    prohibitedCommandProgressions: [
      'comment starts and ends with text',
      'comment starts with text',
      'comment text (comment starts with text)',
      'comment text starts',
      'comment text (comment text starts)',
      'note'
    ],
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    type: 'on empty line',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return true
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    },
    itIsNewCommandProgressionFromLevel: 0
  }
}
