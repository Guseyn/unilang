'use strict'

const NEW_LINE = '\n'

export default function (scenarios) {
  scenarios['command is not recognizable'] = {
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return currentToken.lastOnTheLine && (tokenValues.length > 0)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.errors.push(`command '${joinedTokenValuesWithRealDelimiters}' is not recognizable or applicable on the line ${lineNumber}`)
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="nrch">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersSplittedInLines = joinedTokenValuesWithRealDelimiters.split(NEW_LINE)
      joinedTokenValuesWithRealDelimitersSplittedInLines.forEach((value, index) => {
        parserState.highlightsHtmlBuffer.push(
          `<span class="nrch">${value}</span>`
        )
        if (index < joinedTokenValuesWithRealDelimitersSplittedInLines.length - 1) {
          parserState.highlightsHtmlBuffer.push(NEW_LINE)
        }
      })
    },
    itIsNewCommandProgressionFromLevel: 'last level'
  }
}
