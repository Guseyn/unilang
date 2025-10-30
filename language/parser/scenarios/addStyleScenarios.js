'use strict'

const configurableStyles = require('./static-objects/configurableStyles')
const regexps = require('./static-objects/regexps')

const NEW_LINE = '\n'

const styleNameAction = (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
  const match = regexps.styleName.match(tokenValues)
  const styleName = match[0]
  parserState.lastMentionedStyleKey = configurableStyles[styleName]
  if (parserState.applyHighlighting) {
    parserState.highlightsHtmlBuffer.push(
      `<span class="sh">${joinedTokenValuesWithRealDelimiters}</span>`
    )
  }
}
const styleNameActionOnlyForHighlightingWithoutRefIds = (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
  const match = regexps.styleName.match(tokenValues)
  const styleName = match[0]
  parserState.lastMentionedStyleKey = configurableStyles[styleName]
  const lastNewLineIndex = joinedTokenValuesWithRealDelimiters.lastIndexOf(NEW_LINE)
  if (lastNewLineIndex === -1) {
    parserState.highlightsHtmlBuffer.push(
      `<span class="sh">${joinedTokenValuesWithRealDelimiters}</span>`
    )
  } else {
    parserState.highlightsHtmlBuffer.push(
      `${joinedTokenValuesWithRealDelimiters.slice(0, lastNewLineIndex + 1)}<span class="sh">${joinedTokenValuesWithRealDelimiters.slice(lastNewLineIndex + 1)}</span>`
    )
  }
}

const styleNameIsAction = (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
  if (parserState.applyHighlighting) {
    parserState.highlightsHtmlBuffer.push(
      joinedTokenValuesWithRealDelimiters
    )
  }
}
const styleNameIsActionOnlyForHighlightingWithoutRefIds = (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
  parserState.highlightsHtmlBuffer.push(
    joinedTokenValuesWithRealDelimiters
  )
}

const styleValueAction = (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
  parserState.customStyles[parserState.lastMentionedStyleKey] = regexps.styleValue.match(tokenValues)[0]
  if (parserState.applyHighlighting) {
    parserState.highlightsHtmlBuffer.push(
      `<span class="svh">${joinedTokenValuesWithRealDelimiters}</span>`
    )
  }
}
const styleValueActionOnlyForHighlightingWithoutRefIds = (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
  const firstNewLineIndex = joinedTokenValuesWithRealDelimiters.indexOf(NEW_LINE)
  if (firstNewLineIndex === -1) {
    parserState.highlightsHtmlBuffer.push(
      `<span class="svh">${joinedTokenValuesWithRealDelimiters}</span>`
    )
  } else {
    parserState.highlightsHtmlBuffer.push(
      `<span class="svh">${joinedTokenValuesWithRealDelimiters.slice(0, firstNewLineIndex)}</span>${joinedTokenValuesWithRealDelimiters.slice(firstNewLineIndex)}`
    )
  }
}

module.exports = (scenarios) => {
  scenarios['color style name'] = {
    startsOnNewLine: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.styleName.test(tokenValues) && regexps.color.test(tokenValues)
    },
    action: styleNameAction,
    actionOnlyForHighlightingWithoutRefIds: styleNameActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['color style name is'] = {
    onTheSameLineAsPrevScenario: true,
    requiredCommandProgression: 'color style name',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isIs.test(tokenValues)
    },
    action: styleNameIsAction,
    actionOnlyForHighlightingWithoutRefIds: styleNameIsActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['color style value'] = {
    onTheSameLineAsPrevScenario: true,
    requiredCommandProgression: 'color style name is',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.styleValue.test(tokenValues, parserState.lastMentionedStyleKey) && currentToken.lastOnTheLine
    },
    action: styleValueAction,
    actionOnlyForHighlightingWithoutRefIds: styleValueActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 1
  }

  scenarios['music font style name'] = {
    startsOnNewLine: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.musicFont.test(tokenValues)
    },
    action: styleNameAction,
    actionOnlyForHighlightingWithoutRefIds: styleNameActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['music font style name is'] = {
    onTheSameLineAsPrevScenario: true,
    requiredCommandProgression: 'music font style name',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isIs.test(tokenValues)
    },
    action: styleNameIsAction,
    actionOnlyForHighlightingWithoutRefIds: styleNameIsActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['music font style value'] = {
    onTheSameLineAsPrevScenario: true,
    requiredCommandProgression: 'music font style name is',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.styleValue.test(tokenValues, parserState.lastMentionedStyleKey) && currentToken.lastOnTheLine
    },
    action: styleValueAction,
    actionOnlyForHighlightingWithoutRefIds: styleValueActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 1
  }

  scenarios['text font style name'] = {
    startsOnNewLine: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.textFont.test(tokenValues)
    },
    action: styleNameAction,
    actionOnlyForHighlightingWithoutRefIds: styleNameActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['text font style name is'] = {
    onTheSameLineAsPrevScenario: true,
    requiredCommandProgression: 'text font style name',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isIs.test(tokenValues)
    },
    action: styleNameIsAction,
    actionOnlyForHighlightingWithoutRefIds: styleNameIsActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['text font style value'] = {
    onTheSameLineAsPrevScenario: true,
    requiredCommandProgression: 'text font style name is',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.styleValue.test(tokenValues, parserState.lastMentionedStyleKey) && currentToken.lastOnTheLine
    },
    action: styleValueAction,
    actionOnlyForHighlightingWithoutRefIds: styleValueActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 1
  }

  scenarios['chord letters font style name'] = {
    startsOnNewLine: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.chordLettersFont.test(tokenValues)
    },
    action: styleNameAction,
    actionOnlyForHighlightingWithoutRefIds: styleNameActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['chord letters font style name is'] = {
    onTheSameLineAsPrevScenario: true,
    requiredCommandProgression: 'chord letters font style name',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isIs.test(tokenValues)
    },
    action: styleNameIsAction,
    actionOnlyForHighlightingWithoutRefIds: styleNameIsActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['chord letters font style value'] = {
    onTheSameLineAsPrevScenario: true,
    requiredCommandProgression: 'chord letters font style name is',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.styleValue.test(tokenValues, parserState.lastMentionedStyleKey) && currentToken.lastOnTheLine
    },
    action: styleValueAction,
    actionOnlyForHighlightingWithoutRefIds: styleValueActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 1
  }

  scenarios['style name'] = {
    startsOnNewLine: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.styleName.test(tokenValues)
    },
    action: styleNameAction,
    actionOnlyForHighlightingWithoutRefIds: styleNameActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['style name is'] = {
    onTheSameLineAsPrevScenario: true,
    requiredCommandProgression: 'style name',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isIs.test(tokenValues)
    },
    action: styleNameIsAction,
    actionOnlyForHighlightingWithoutRefIds: styleNameIsActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['style value'] = {
    onTheSameLineAsPrevScenario: true,
    requiredCommandProgression: 'style name is',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.styleValue.test(tokenValues, parserState.lastMentionedStyleKey) && currentToken.lastOnTheLine
    },
    action: styleValueAction,
    actionOnlyForHighlightingWithoutRefIds: styleValueActionOnlyForHighlightingWithoutRefIds,
    itIsNewCommandProgressionFromLevel: 1
  }
}
