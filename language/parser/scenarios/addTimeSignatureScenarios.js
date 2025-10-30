'use strict'

const regexps = require('./static-objects/regexps')
const initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll = require('./page-schema/initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll')
const lastMeasureParams = require('./page-schema/lastMeasureParams')

module.exports = (scenarios) => {
  scenarios['time signature'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.timeSignature.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll(parserState.pageSchema, 'timeSignatureParams', parserState)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      if (parserState.lastTimeSignatureParams) {
        lastMeasureParamsValue.lastTimeSignatureParams = undefined
        parserState.lastTimeSignatureParams = undefined
      }
      lastMeasureParamsValue.timeSignatureParams = {}
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.timeSignatureHighlight, (match) => {
            return `<span class="eh" ref-id="time-signature-${numberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="eh" ref-id="time-signature-${numberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.timeSignatureHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 0
  }
  scenarios['time signature value'] = {
    requiredCommandProgression: 'time signature',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.timeSignatureValue.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const timeSignature = regexps.timeSignatureValue.match(tokenValues)
      if (timeSignature[0] === 'c') {
        lastMeasureParamsValue.timeSignatureParams.numerator = '4'
        lastMeasureParamsValue.timeSignatureParams.denominator = '4'
        lastMeasureParamsValue.timeSignatureParams.cMode = true
      } else if (timeSignature[0] === 'crossed c') {
        lastMeasureParamsValue.timeSignatureParams.numerator = '2'
        lastMeasureParamsValue.timeSignatureParams.denominator = '2'
        lastMeasureParamsValue.timeSignatureParams.cMode = true
      } else {
        const numerator = timeSignature[0]
        const denominator = timeSignature[1]
        lastMeasureParamsValue.timeSignatureParams.numerator = numerator
        lastMeasureParamsValue.timeSignatureParams.denominator = denominator
      }
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.timeSignatureValueHighlight, (match) => {
            return `<span class="cnh" ref-id="time-signature-${numberOfMeasures}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="time-signature-${numberOfMeasures}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.timeSignatureValueHighlight, (match) => {
          return `<span class="cnh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['time signature for each line'] = {
    requiredCommandProgression: 'time signature',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.forEachLine.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastTimeSignatureParamsValue = lastMeasureParams(parserState.pageSchema).timeSignatureParams
      lastTimeSignatureParamsValue.forEachLineId = parserState.lastTimeSignatureValueForEachLineId
      parserState.lastTimeSignatureParams = lastTimeSignatureParamsValue
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.forEachLineHighlight, (match) => {
            return `<span class="clph" ref-id="time-signature-for-each-line-${parserState.lastTimeSignatureValueForEachLineId}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="time-signature-for-each-line-${parserState.lastTimeSignatureValueForEachLineId}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
      parserState.lastTimeSignatureValueForEachLineId += 1
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.forEachLineHighlight, (match) => {
          return `<span class="clph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['time signature for lines below'] = {
    requiredCommandProgression: 'time signature',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.forLinesBelow.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastTimeSignatureParamsValue = lastMeasureParams(parserState.pageSchema).timeSignatureParams
      lastTimeSignatureParamsValue.forEachLineId = parserState.lastTimeSignatureValueForEachLineId
      parserState.lastTimeSignatureParams = lastTimeSignatureParamsValue
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.linesHighlight, (match) => {
            return `<span class="clph" ref-id="time-signature-for-each-line-${parserState.lastTimeSignatureValueForEachLineId}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="time-signature-for-each-line-${parserState.lastTimeSignatureValueForEachLineId}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
      parserState.lastTimeSignatureValueForEachLineId += 1
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.linesHighlight, (match) => {
          return `<span class="clph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
}
