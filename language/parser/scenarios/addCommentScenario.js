'use strict'

import regexps from './static-objects/regexps.js'
import theSameScenarioButWithDifferentRequiredCommandProgression from './theSameScenarioButWithDifferentRequiredCommandProgression.js'

const lastComment = parserState => parserState.comments[parserState.comments.length - 1]
const NEW_LINE = '\n'

export default function (scenarios) {
  scenarios['comment starts and ends with text'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.commentStartsAndEndsWithText.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const match = regexps.commentStartsAndEndsWithText.match(tokenValues)
      const startQuote = match[0]
      const text = match[1]
      parserState.comments.push({
        text,
        startLineNumber: lineNumber,
        endLineNumber: lineNumber,
        currentLineNumber: lineNumber,
        startQuote
      })
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersSplittedInLines = joinedTokenValuesWithRealDelimiters.split(NEW_LINE)
      joinedTokenValuesWithRealDelimitersSplittedInLines.forEach((value, index) => {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${value}</span>`
        )
        if (index < joinedTokenValuesWithRealDelimitersSplittedInLines.length - 1) {
          parserState.highlightsHtmlBuffer.push(NEW_LINE)
        }
      })
    },
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['comment starts with text'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimiters: true,
    prohibitedCommandProgressions: [ 'comment starts with text', 'comment text starts', 'comment text' ],
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.commentStartsWithText.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const match = regexps.commentStartsWithText.match(tokenValues)
      const startQuote = match[0]
      const text = match[1]
      parserState.comments.push({
        text,
        startLineNumber: lineNumber,
        currentLineNumber: lineNumber,
        startQuote
      })
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersSplittedInLines = joinedTokenValuesWithRealDelimiters.split(NEW_LINE)
      joinedTokenValuesWithRealDelimitersSplittedInLines.forEach((value, index) => {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${value}</span>`
        )
        if (index < joinedTokenValuesWithRealDelimitersSplittedInLines.length - 1) {
          parserState.highlightsHtmlBuffer.push(NEW_LINE)
        }
      })
    },
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['comment text ends (comment starts with text)'] = {
    requiredCommandProgression: 'comment starts with text',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.commentTextEnds.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const text = regexps.commentTextEnds.match(tokenValues)[0]
      const lastCommentValue = lastComment(parserState)
      if (lastCommentValue.currentLineNumber !== lineNumber) {
        lastCommentValue.text += `\n${text}`
      } else {
        lastCommentValue.text += ` ${text}`
      }
      lastCommentValue.endLineNumber = lineNumber
      lastCommentValue.currentLineNumber = lineNumber
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersSplittedInLines = joinedTokenValuesWithRealDelimiters.split(NEW_LINE)
      joinedTokenValuesWithRealDelimitersSplittedInLines.forEach((value, index) => {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${value}</span>`
        )
        if (index < joinedTokenValuesWithRealDelimitersSplittedInLines.length - 1) {
          parserState.highlightsHtmlBuffer.push(NEW_LINE)
        }
      })
    },
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['quote ends comment (comment starts with text)'] = {
    requiredCommandProgression: 'comment starts with text',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.commentQuote.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastCommentValue = lastComment(parserState)
      lastCommentValue.endLineNumber = lineNumber
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersSplittedInLines = joinedTokenValuesWithRealDelimiters.split(NEW_LINE)
      joinedTokenValuesWithRealDelimitersSplittedInLines.forEach((value, index) => {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${value}</span>`
        )
        if (index < joinedTokenValuesWithRealDelimitersSplittedInLines.length - 1) {
          parserState.highlightsHtmlBuffer.push(NEW_LINE)
        }
      })
    },
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['comment text (comment starts with text)'] = {
    requiredCommandProgression: 'comment starts with text',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.anything.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const text = regexps.anything.match(tokenValues)[0]
      const lastCommentValue = lastComment(parserState)
      if (lastCommentValue.currentLineNumber !== lineNumber) {
        lastCommentValue.text += `\n${text}`
      } else {
        lastCommentValue.text += ` ${text}`
      }
      lastCommentValue.currentLineNumber = lineNumber
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersSplittedInLines = joinedTokenValuesWithRealDelimiters.split(NEW_LINE)
      joinedTokenValuesWithRealDelimitersSplittedInLines.forEach((value, index) => {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${value}</span>`
        )
        if (index < joinedTokenValuesWithRealDelimitersSplittedInLines.length - 1) {
          parserState.highlightsHtmlBuffer.push(NEW_LINE)
        }
      })
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['comment'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimiters: true,
    prohibitedCommandProgressions: [ 'comment starts with text', 'comment text starts', 'comment text' ],
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.comment.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersSplittedInLines = joinedTokenValuesWithRealDelimiters.split(NEW_LINE)
      joinedTokenValuesWithRealDelimitersSplittedInLines.forEach((value, index) => {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${value}</span>`
        )
        if (index < joinedTokenValuesWithRealDelimitersSplittedInLines.length - 1) {
          parserState.highlightsHtmlBuffer.push(NEW_LINE)
        }
      })
    },
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['comment followed by column or is'] = {
    requiredCommandProgression: 'comment',
    onTheSameLineAsPrevScenario: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.column.test(tokenValues) ||
        regexps.is.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersSplittedInLines = joinedTokenValuesWithRealDelimiters.split(NEW_LINE)
      joinedTokenValuesWithRealDelimitersSplittedInLines.forEach((value, index) => {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${value}</span>`
        )
        if (index < joinedTokenValuesWithRealDelimitersSplittedInLines.length - 1) {
          parserState.highlightsHtmlBuffer.push(NEW_LINE)
        }
      })
    }
  }
  scenarios['comment text starts and ends'] = {
    requiredCommandProgression: 'comment',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.commentTextStartsAndEnds.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const match = regexps.commentTextStartsAndEnds.match(tokenValues)
      const startQuote = match[0]
      const text = match[1]
      parserState.comments.push({
        text,
        startLineNumber: lineNumber,
        endLineNumber: lineNumber,
        currentLineNumber: lineNumber,
        startQuote
      })
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersSplittedInLines = joinedTokenValuesWithRealDelimiters.split(NEW_LINE)
      joinedTokenValuesWithRealDelimitersSplittedInLines.forEach((value, index) => {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${value}</span>`
        )
        if (index < joinedTokenValuesWithRealDelimitersSplittedInLines.length - 1) {
          parserState.highlightsHtmlBuffer.push(NEW_LINE)
        }
      })
    },
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['comment text starts'] = {
    requiredCommandProgression: 'comment',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.commentTextStarts.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const match = regexps.commentTextStarts.match(tokenValues)
      const startQuote = match[0]
      const text = match[1]
      parserState.comments.push({
        text,
        startLineNumber: lineNumber,
        currentLineNumber: lineNumber,
        startQuote
      })
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersSplittedInLines = joinedTokenValuesWithRealDelimiters.split(NEW_LINE)
      joinedTokenValuesWithRealDelimitersSplittedInLines.forEach((value, index) => {
        parserState.highlightsHtmlBuffer.push(
          `<span class="ch">${value}</span>`
        )
        if (index < joinedTokenValuesWithRealDelimitersSplittedInLines.length - 1) {
          parserState.highlightsHtmlBuffer.push(NEW_LINE)
        }
      })
    },
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['comment text ends (comment text starts)'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['comment text ends (comment starts with text)'],
    'comment text starts'
  )
  scenarios['quote ends comment (comment text starts)'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['quote ends comment (comment starts with text)'],
    'comment text starts'
  )
  scenarios['comment text (comment text starts)'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['comment text (comment starts with text)'],
    'comment text starts'
  )
}
