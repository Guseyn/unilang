'use strict'

const regexps = require('./static-objects/regexps')

module.exports = (scenarios) => {
  scenarios['punctuation'] = {
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return currentToken.lastOnTheLine && regexps.punctuation.test(tokenValues) && joinedTokenValuesWithRealDelimiters.length > 0
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(joinedTokenValuesWithRealDelimiters)
    }
  }
}
