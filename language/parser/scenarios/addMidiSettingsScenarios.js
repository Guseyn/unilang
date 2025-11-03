'use strict'

import midiSettings from './static-objects/midiSettings.js'
import regexps from './static-objects/regexps.js'

const NEW_LINE = '\n'

export default function (scenarios) {
  scenarios['midi setting name'] = {
    startsOnNewLine: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.midiSettingName.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const match = regexps.midiSettingName.match(tokenValues)
      const midiSettingName = match[0]
      parserState.lastMentionedMidiSettingKey = midiSettings[midiSettingName]
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="msh">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const match = regexps.midiSettingName.match(tokenValues)
      const midiSettingName = match[0]
      parserState.lastMentionedMidiSettingKey = midiSettings[midiSettingName]
      const lastNewLineIndex = joinedTokenValuesWithRealDelimiters.lastIndexOf(NEW_LINE)
      if (lastNewLineIndex === -1) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="msh">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      } else {
        parserState.highlightsHtmlBuffer.push(
          `${joinedTokenValuesWithRealDelimiters.slice(0, lastNewLineIndex + 1)}<span class="msh">${joinedTokenValuesWithRealDelimiters.slice(lastNewLineIndex + 1)}</span>`
        )
      }
    },
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['midi setting name is'] = {
    onTheSameLineAsPrevScenario: true,
    requiredCommandProgression: 'midi setting name',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.isIs.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          joinedTokenValuesWithRealDelimiters
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['midi setting value'] = {
    onTheSameLineAsPrevScenario: true,
    requiredCommandProgression: 'midi setting name is',
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.midiSettingValue.test(tokenValues, parserState.lastMentionedMidiSettingKey) && currentToken.lastOnTheLine
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.midiSettings[parserState.lastMentionedMidiSettingKey] = regexps.midiSettingValue.match(tokenValues)[0]
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="msvh">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const firstNewLineIndex = joinedTokenValuesWithRealDelimiters.indexOf(NEW_LINE)
      if (firstNewLineIndex === -1) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="msvh">${joinedTokenValuesWithRealDelimiters}</span>`
        )
      } else {
        parserState.highlightsHtmlBuffer.push(
          `<span class="msvh">${joinedTokenValuesWithRealDelimiters.slice(0, firstNewLineIndex)}</span>${joinedTokenValuesWithRealDelimiters.slice(firstNewLineIndex)}`
        )
      }
    },
    itIsNewCommandProgressionFromLevel: 1
  }
}
