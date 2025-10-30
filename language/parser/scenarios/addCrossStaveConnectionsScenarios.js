'use strict'

const regexps = require('./static-objects/regexps')
const initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll = require('./page-schema/initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll')
const lastMeasureParams = require('./page-schema/lastMeasureParams')
const lastCrossStaveConnectionParam = require('./page-schema/lastCrossStaveConnectionParam')
const staveIndexByTokens = require('./token/staveIndexByTokens')
const isStaveIndex = require('./token/isStaveIndex')
const foundNextTokenValueOnTheLine = require('./token/foundNextTokenValueOnTheLine')
const theSameScenarioButWithDifferentRequiredCommandProgression = require('./theSameScenarioButWithDifferentRequiredCommandProgression')

module.exports = (scenarios) => {
  scenarios['bracket or brace'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return currentToken.firstOnTheLine &&
        regexps.crossStaveConnection.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      initNewMeasureParamsIfThereIsAlreadySuchMeasurePropertyOrNoMeasuresAtAll(parserState.pageSchema, 'connectionsParams', parserState)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      lastMeasureParamsValue.connectionsParams = lastMeasureParamsValue.connectionsParams || []
      parserState.lastCrossStaveConnectionsParamsForEachLine = parserState.lastCrossStaveConnectionsParamsForEachLine || []
      const connectionName = currentToken.value
      lastMeasureParamsValue.connectionsParams.push(
        {
          name: connectionName,
          staveStartNumber: 0,
          staveEndNumber: 0
        }
      )
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      const numberOfConnections = lastMeasureParamsValue.connectionsParams.length
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.crossStaveConnectionHighlight, (match) => {
            return `<span class="eh" ref-id="cross-stave-connection-${numberOfMeasures}-${numberOfConnections}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="cross-stave-connection-${numberOfMeasures}-${numberOfConnections}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.crossStaveConnectionHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
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
  scenarios['connection for'] = {
    requiredCommandProgression: 'bracket or brace',
    prohibitedCommandProgressions: [ 'connection for each line', 'connection for lines below' ],
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.for.test(tokenValues) &&
        !regexps.forEach.test(
          [
            currentToken.value,
            foundNextTokenValueOnTheLine(
              unitext,
              currentToken.firstCharIndexOfNextToken
            )
          ]
        ) &&
        !regexps.forLines.test(
          [
            currentToken.value,
            foundNextTokenValueOnTheLine(
              unitext,
              currentToken.firstCharIndexOfNextToken
            )
          ]
        )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="">${joinedTokenValuesWithRealDelimiters}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    itIsNewCommandProgressionFromLevel: 1,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['connection from'] = {
    requiredCommandProgression: 'bracket or brace',
    prohibitedCommandProgressions: [ 'connection for each line', 'connection for lines below' ],
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.from.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="">${joinedTokenValuesWithRealDelimiters}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    itIsNewCommandProgressionFromLevel: 1,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['connection for stave index'] = {
    requiredCommandProgression: 'connection for',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isStaveIndex(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const staveIndex = staveIndexByTokens(tokenValues, true)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastCrossStaveConnectionParamValue = lastCrossStaveConnectionParam(lastMeasureParamsValue)
      const indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastMeasureForThisStaveIndex = lastMeasureParamsValue.connectionsParams.findIndex(param => ((param.staveStartNumber === staveIndex) || (param.staveEndNumber === staveIndex)))
      if (
        (indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastMeasureForThisStaveIndex !== -1) &&
        (indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastMeasureForThisStaveIndex !== (lastMeasureParamsValue.connectionsParams.length - 1))
      ) {
        lastMeasureParamsValue.connectionsParams.splice(indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastMeasureForThisStaveIndex, 1)
      }
      const indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastCrossStaveConnectionsParamsForEachLineForThisStaveIndex = parserState.lastCrossStaveConnectionsParamsForEachLine.findIndex(param => ((param.staveStartNumber === staveIndex) || (param.staveEndNumber === staveIndex)))
      if (indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastCrossStaveConnectionsParamsForEachLineForThisStaveIndex !== -1) {
        parserState.lastCrossStaveConnectionsParamsForEachLine.splice(indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastCrossStaveConnectionsParamsForEachLineForThisStaveIndex, 1)
      }
      lastCrossStaveConnectionParamValue.staveStartNumber = staveIndex
      lastCrossStaveConnectionParamValue.staveEndNumber = staveIndex
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 1] = parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 1].replace(
          'ref-id=""', `ref-id="stave-${numberOfMeasures}-${staveIndex + 1}"`
        )
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.staveIndexHighlight, (match) => {
            return `<span class="csph" ref-id="stave-${numberOfMeasures}-${staveIndex + 1}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="stave-${numberOfMeasures}-${staveIndex + 1}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.staveIndexHighlight, (match) => {
          return `<span class="csph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['connection from stave index'] = theSameScenarioButWithDifferentRequiredCommandProgression(
    scenarios['connection for stave index'],
    'connection from'
  )
  scenarios['connection to'] = {
    requiredCommandProgression: 'bracket or brace',
    prohibitedCommandProgressions: [ 'connection for each line', 'connection for lines below' ],
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.to.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="">${joinedTokenValuesWithRealDelimiters}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimiters
      )
    },
    itIsNewCommandProgressionFromLevel: 1,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['connection to stave index'] = {
    requiredCommandProgression: 'connection to',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isStaveIndex(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const staveIndex = staveIndexByTokens(tokenValues, true)
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastCrossStaveConnectionParamValue = lastCrossStaveConnectionParam(lastMeasureParamsValue)
      const indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastMeasureForThisStaveIndex = lastMeasureParamsValue.connectionsParams.findIndex(param => (param.staveEndNumber === staveIndex))
      if (
        (indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastMeasureForThisStaveIndex !== -1) &&
        (indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastMeasureForThisStaveIndex !== (lastMeasureParamsValue.connectionsParams.length - 1))
      ) {
        lastMeasureParamsValue.connectionsParams.splice(indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastMeasureForThisStaveIndex, 1)
      }
      const indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastCrossStaveConnectionsParamsForEachLineForThisStaveIndex = parserState.lastCrossStaveConnectionsParamsForEachLine.findIndex(param => (param.staveEndNumber === staveIndex))
      if (indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastCrossStaveConnectionsParamsForEachLineForThisStaveIndex !== -1) {
        parserState.lastCrossStaveConnectionsParamsForEachLine.splice(indexOfIfThereIsAlreadyCrossStaveConnectionParamValueInLastCrossStaveConnectionsParamsForEachLineForThisStaveIndex, 1)
      }
      lastCrossStaveConnectionParamValue.staveEndNumber = staveIndex
      const numberOfMeasures = parserState.pageSchema.measuresParams.length
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 1] = parserState.highlightsHtmlBuffer[parserState.highlightsHtmlBuffer.length - 1].replace(
          'ref-id=""', `ref-id="stave-${numberOfMeasures}-${staveIndex + 1}"`
        )
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.staveIndexHighlight, (match) => {
            return `<span class="csph" ref-id="stave-${numberOfMeasures}-${staveIndex + 1}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="stave-${numberOfMeasures}-${staveIndex + 1}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.staveIndexHighlight, (match) => {
          return `<span class="csph">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 2,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['connection for each line'] = {
    requiredCommandProgression: 'bracket or brace',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.forEachLine.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastCrossStaveConnectionsParamValue = lastCrossStaveConnectionParam(lastMeasureParamsValue)
      lastCrossStaveConnectionsParamValue.forEachLineId = parserState.lastCrossStaveConnectionsParamsForEachLineId
      parserState.lastCrossStaveConnectionsParamsForEachLine.push(lastCrossStaveConnectionsParamValue)
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.forEachLineHighlight, (match) => {
            return `<span class="clph" ref-id="cross-stave-connection-for-each-line-${parserState.lastCrossStaveConnectionsParamsForEachLineId}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="cross-stave-connection-for-each-line-${parserState.lastCrossStaveConnectionsParamsForEachLineId}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
      parserState.lastCrossStaveConnectionsParamsForEachLineId += 1
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
  scenarios['connection for lines below'] = {
    requiredCommandProgression: 'bracket or brace',
    onTheSameLineAsPrevScenario: true,
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.forLinesBelow.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const lastMeasureParamsValue = lastMeasureParams(parserState.pageSchema)
      const lastCrossStaveConnectionsParamValue = lastCrossStaveConnectionParam(lastMeasureParamsValue)
      lastCrossStaveConnectionsParamValue.forEachLineId = parserState.lastCrossStaveConnectionsParamsForEachLineId
      parserState.lastCrossStaveConnectionsParamsForEachLine.push(lastCrossStaveConnectionsParamValue)
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.linesHighlight, (match) => {
            return `<span class="clph" ref-id="cross-stave-connection-for-each-line-${parserState.lastCrossStaveConnectionsParamsForEachLineId}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="cross-stave-connection-for-each-line-${parserState.lastCrossStaveConnectionsParamsForEachLineId}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
      parserState.lastCrossStaveConnectionsParamsForEachLineId += 1
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
