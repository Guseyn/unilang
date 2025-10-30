'use strict'

const regexps = require('./static-objects/regexps')
const initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll = require('./page-schema/initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll')
const lastMeasureParams = require('./page-schema/lastMeasureParams')
const isVerticalCorrection = require('./token/isVerticalCorrection')
const verticalCorrection = require('./token/verticalCorrection')

module.exports = (scenarios) => {
  scenarios['repetition note'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.repetitionNote.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll(parserState.pageSchema, 'repetitionNote', parserState)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const repetitionNoteValue = regexps.repetitionNote.match(tokenValues)[0]
      lastMeasureParamsValue.repetitionNote = {
        value: repetitionNoteValue,
        measurePosition: 'start'
      }
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedStringAndElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.stringHighlight, (match) => {
            return `<span class="sth" ref-id="repetition-note-${numberOfMeasures}">${match}</span>`
          }
        ).replace(
          regexps.repetitionNoteHighlight, (match) => {
            return `<span class="eh" ref-id="repetition-note-${numberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="repetition-note-${numberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedStringAndElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedStringAndElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.stringHighlight, (match) => {
          return `<span class="sth">${match}</span>`
        }
      ).replace(
        regexps.repetitionNoteHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedStringAndElement
      )
    },
    itIsNewCommandProgressionFromLevel: 0,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['repetition note at the start of the measure'] = {
    requiredCommandProgression: 'repetition note',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.atTheStartOfTheMeasure.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      lastMeasureParamsValue.repetitionNote.measurePosition = 'start'
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedMeasure = joinedTokenValuesWithRealDelimiters.replace(
          regexps.measureHighlight, (match) => {
            return `<span class="cmph" ref-id="measure-${numberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="repetition-note-${numberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedMeasure}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedMeasure = joinedTokenValuesWithRealDelimiters.replace(
        regexps.measureHighlight, (match) => {
          return `<span class="cmph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedMeasure
      )
    }
  }
  scenarios['repetition note at the end of the measure'] = {
    requiredCommandProgression: 'repetition note',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.atTheEndOfTheMeasure.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      lastMeasureParamsValue.repetitionNote.measurePosition = 'end'
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedMeasure = joinedTokenValuesWithRealDelimiters.replace(
          regexps.measureHighlight, (match) => {
            return `<span class="cmph" ref-id="measure-${numberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="repetition-note-${numberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedMeasure}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedMeasure = joinedTokenValuesWithRealDelimiters.replace(
        regexps.measureHighlight, (match) => {
          return `<span class="cmph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedMeasure
      )
    }
  }
  scenarios['repetition note vertical correction'] = {
    requiredCommandProgression: 'repetition note',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      lastMeasureParamsValue.repetitionNote.yCorrection = verticalCorrection(tokenValues)
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="th" ref-id="repetition-note-${numberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="repetition-note-${numberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.verticalCorrectionHighlight, (match) => {
          return `<span class="th">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    }
  }
}
