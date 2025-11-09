'use strict'

import regexps from '#unilang/language/parser/scenarios/static-objects/regexps.js'
import isVerticalCorrection from '#unilang/language/parser/scenarios/token/isVerticalCorrection.js'
import verticalCorrection from '#unilang/language/parser/scenarios/token/verticalCorrection.js'
import withNumbersInsteadOfWords from '#unilang/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import foundNextTokenValueOnTheLine from '#unilang/language/parser/scenarios/token/foundNextTokenValueOnTheLine.js'
import foundNextTokenValuesOnTheLine from '#unilang/language/parser/scenarios/token/foundNextTokenValuesOnTheLine.js'
import chordParamsByLastMentionedUnitPositions from '#unilang/language/parser/scenarios/page-schema/chordParamsByLastMentionedUnitPositions.js'
import undefineAllMentionedPositions from '#unilang/language/parser/scenarios/page-schema/undefineAllMentionedPositions.js'
import undefineOnlyLastMentionedUnitPosition from '#unilang/language/parser/scenarios/page-schema/undefineOnlyLastMentionedUnitPosition.js'
import fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded from '#unilang/language/parser/scenarios/highlights-html-buffer/fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded.js'
import addUnitPositionScenarios from '#unilang/language/parser/scenarios/addUnitPositionScenarios.js'
import addLineMeasureStaveVoicePositionScenarios from '#unilang/language/parser/scenarios/addLineMeasureStaveVoicePositionScenarios.js'

const updateNoteAndRestRefIdsInHighlightsHtmlBufferThatFollowAfterSimileUnit = (parserState, measureIndex, staveIndex, voiceIndex, singleChordIndex, simileCount) => {
  parserState.highlightsHtmlBuffer.forEach((html, index) => {
    parserState.highlightsHtmlBuffer[index] = html.replaceAll(
      /rest-(\d+)-(\d+)-(\d+)-(\d+)/g, (match, g1, g2, g3, g4) => {
        g1 *= 1
        g2 *= 1
        g3 *= 1
        g4 *= 1
        if (
          (g1 === measureIndex + 1) &&
          (g2 === staveIndex + 1) &&
          (g3 === voiceIndex + 1) &&
          g4 > singleChordIndex + 1
        ) {
          return `rest-${g1}-${g2}-${g3}-${g4 + simileCount}`
        }
        return match
      }
    ).replaceAll(
      /unit-(\d+)-(\d+)-(\d+)-(\d+)/g, (match, g1, g2, g3, g4) => {
        g1 *= 1
        g2 *= 1
        g3 *= 1
        g4 *= 1
        if (
          (g1 === measureIndex + 1) &&
          (g2 === staveIndex + 1) &&
          (g3 === voiceIndex + 1) &&
          g4 > singleChordIndex + 1
        ) {
          return `unit-${g1}-${g2}-${g3}-${g4 + simileCount}`
        }
        return match
      }
    ).replaceAll(
      /note-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)/g, (match, g1, g2, g3, g4, g5) => {
        g1 *= 1
        g2 *= 1
        g3 *= 1
        g4 *= 1
        if (
          (g1 === measureIndex + 1) &&
          (g2 === staveIndex + 1) &&
          (g3 === voiceIndex + 1) &&
          g4 > singleChordIndex + 1
        ) {
          return `note-${g1}-${g2}-${g3}-${g4 + simileCount}-${g5}`
        }
        return match
      }
    )
  })
}

const addSimileUnitsToPageSchema = (parserState) => {
  if (
    parserState.calculatedUnitMeasureIndexByLastMentionedPositions !== undefined &&
    parserState.calculatedUnitStaveIndexByLastMentionedPositions !== undefined &&
    parserState.calculatedUnitVoiceIndexByLastMentionedPositions !== undefined &&
    parserState[`lastSimileMarkUnitIndex-${parserState.numberOfSimileMarks}`] !== undefined
  ) {
    const measureIndex = parserState.calculatedUnitMeasureIndexByLastMentionedPositions
    const staveIndex = parserState.calculatedUnitStaveIndexByLastMentionedPositions
    const voiceIndex = parserState.calculatedUnitVoiceIndexByLastMentionedPositions
    const singleChordIndex = parserState[`lastSimileMarkUnitIndex-${parserState.numberOfSimileMarks}`]
    const simileCount = parserState[`lastStartSimileMark-${parserState.numberOfSimileMarks}`].count
    const simileYCorrection = parserState[`lastStartSimileMark-${parserState.numberOfSimileMarks}`].yCorrection
    if (
      !parserState.pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex][singleChordIndex].isSimile &&
      (
        !parserState.pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex][singleChordIndex + 1] ||
        (
          parserState.pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex][singleChordIndex + 1] &&
          !parserState.pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex][singleChordIndex + 1].isSimile
        ) 
      )
    ) {
      for (let simileIndex = 0; simileIndex < simileCount; simileIndex++) {      
        parserState.pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex].splice(
          singleChordIndex + simileIndex + 1, 0,
          { notes: [{ positionNumber: (simileYCorrection || 0) + 2.0 }], isSimile: true, simileRefId: `simile-mark-${parserState.numberOfSimileMarks}`, simileCountDown: (simileCount - simileIndex), simileYCorrection }
        )
      }
    }
    updateNoteAndRestRefIdsInHighlightsHtmlBufferThatFollowAfterSimileUnit(parserState, measureIndex, staveIndex, voiceIndex, singleChordIndex, simileCount)
  }
}

export default function (scenarios) {
  scenarios['repeat simile'] = {
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    startsOnNewLine: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const nextTokenValueOnTheLine = foundNextTokenValueOnTheLine(
        unitext,
        currentToken.firstCharIndexOfNextToken
      )
      const nextThreeTokensOnTheLine = foundNextTokenValuesOnTheLine(
        unitext,
        currentToken.firstCharIndexOfNextToken,
        3
      )
      const nextFourTokensOnTheLine = foundNextTokenValuesOnTheLine(
        unitext,
        currentToken.firstCharIndexOfNextToken,
        4
      )
      return regexps.repeatSimile.test(tokenValues) &&
        !regexps.sign.test(
          [
            nextTokenValueOnTheLine
          ]
        ) &&
        !regexps.simileOfPreviousMeasure.test(
          [
            currentToken.value,
            ...nextThreeTokensOnTheLine
          ]
        ) &&
        !regexps.simileOfTwoPreviousMeasures.test(
          [
            currentToken.value,
            ...nextFourTokensOnTheLine
          ]
        )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState.numberOfSimileMarks += 1
      parserState[`lastStartSimileMark-${parserState.numberOfSimileMarks}`] = {
        refId: `simile-mark-${parserState.numberOfSimileMarks}`,
        count: 1,
        numberOfBeats: 1,
        yCorrection: 0,
        finish: true
      }
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.repeatSimileHighlight, (match) => {
            return `<span class="eh" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.repeatSimileHighlight, (match) => {
          return `<span class="eh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 0,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      addSimileUnitsToPageSchema(parserState)
      if (parserState.applyHighlighting) {
        fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded(parserState, true)
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
      undefineAllMentionedPositions(parserState)
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  scenarios['repeat simile previous beat'] = {
    requiredCommandProgression: 'repeat simile',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.ofPreviousBeat.test(
        withNumbersInsteadOfWords(tokenValues)
      )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState[`lastStartSimileMark-${parserState.numberOfSimileMarks}`].numberOfBeats = 1
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${joinedTokenValuesWithRealDelimiters}</span>`
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
  scenarios['repeat simile previous beats'] = {
    requiredCommandProgression: 'repeat simile',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.ofPreviousBeats.test(
        withNumbersInsteadOfWords(tokenValues)
      )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState[`lastStartSimileMark-${parserState.numberOfSimileMarks}`].numberOfBeats = 2
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${joinedTokenValuesWithRealDelimiters}</span>`
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
  scenarios['repeat simile count'] = {
    requiredCommandProgression: 'repeat simile',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.simileCount.test(
        withNumbersInsteadOfWords(tokenValues)
      )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const simileCount = regexps.simileCount.match(
        withNumbersInsteadOfWords(tokenValues)
      )[0] * 1
      parserState[`lastStartSimileMark-${parserState.numberOfSimileMarks}`].count = simileCount
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
          regexps.simileCountHighlight, (match) => {
            return `<span class="cnh" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedNumber}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedNumber = joinedTokenValuesWithRealDelimiters.replace(
        regexps.simileCountHighlight, (match) => {
          return `<span class="cnh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedNumber
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  scenarios['repeat simile starts'] = {
    requiredCommandProgression: 'repeat simile',
    prohibitedCommandProgressions: [ 'repeat simile starts', 'repeat simile finishes' ],
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return (
        regexps.starts.test(tokenValues) &&
        !regexps.from.test(
          [
            foundNextTokenValueOnTheLine(
              unitext, currentToken.firstCharIndexOfNextToken
            )
          ]
        )
      ) ||
      regexps.from.test(tokenValues) ||
      regexps.startsFrom.test(tokenValues) ||
      (
        regexps.for.test(tokenValues) &&
        !regexps.forEach.test(
          [
            currentToken.value,
            foundNextTokenValueOnTheLine(
              unitext,
              currentToken.firstCharIndexOfNextToken
            )
          ]
        )
      )
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="">${joinedTokenValuesWithRealDelimiters}`
        )
        parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
          parserState.highlightsHtmlBuffer.length - 1
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
      if (parserState.lastMentionedUnitPosition === undefined) {
        parserState.errors.push(`unit position after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not specified on the line number ${argumentsFromMainAction.lineNumber}`)
      } else {
        const chordParamsValue = chordParamsByLastMentionedUnitPositions(parserState)
        if (!chordParamsValue) {
          parserState.errors.push(`unit after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not found on the line ${argumentsFromMainAction.lineNumber}`)
        } else {
          if (!chordParamsValue.simileMark) {
            chordParamsValue.simileMark = parserState[`lastStartSimileMark-${parserState.numberOfSimileMarks}`]
          }
          parserState[`lastSimileMarkUnitIndex-${parserState.numberOfSimileMarks}`] = parserState.calculatedUnitIndexByLastMentionedPositions
        }
      }
      if (parserState.applyHighlighting) {
        fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded(parserState)
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
      undefineOnlyLastMentionedUnitPosition(parserState)
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  addUnitPositionScenarios(scenarios, 'repeat simile starts', 2, {})
  scenarios['repeat simile finishes'] = {
    requiredCommandProgression: 'repeat simile',
    prohibitedCommandProgressions: [ 'repeat simile finishes' ],
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.finishes.test(tokenValues) ||
        regexps.till.test(tokenValues) ||
        regexps.to.test(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="">${joinedTokenValuesWithRealDelimiters}`
        )
        parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.push(
          parserState.highlightsHtmlBuffer.length - 1
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      parserState.highlightsHtmlBuffer.push(
        `<span class="th">${joinedTokenValuesWithRealDelimiters}</span>`
      )
    },
    itIsNewCommandProgressionFromLevel: 1,
    actionWhenProgressionOfCommandsChanges: (parserState, scenarioNameThatChangedCommandsProgression, lineNumber, argumentsFromMainAction) => {
      if (parserState.lastMentionedUnitPosition === undefined) {
        parserState.errors.push(`unit position after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not specified on the line number ${argumentsFromMainAction.lineNumber}`)
      } else {
        const chordParamsValue = chordParamsByLastMentionedUnitPositions(parserState)
        if (!chordParamsValue) {
          parserState.errors.push(`unit after command '${argumentsFromMainAction.joinedTokenValuesWithRealDelimiters}' is not found on the line ${argumentsFromMainAction.lineNumber}`)
        } else {
          if (!chordParamsValue.simileMark) {
            chordParamsValue.simileMark = {
              refId: `simile-mark-${parserState.numberOfSimileMarks}`,
              finish: true
            }
          }
          parserState[`lastSimileMarkUnitIndex-${parserState.numberOfSimileMarks}`] = parserState.calculatedUnitIndexByLastMentionedPositions
        }
      }
      if (parserState.applyHighlighting) {
        fillAllPlaceholdersInHighlightsHtmlBufferWithMentionedPositionsWhereItsNeeded(parserState)
        parserState.highlightsHtmlBuffer.push(
          '</span>'
        )
      }
      undefineOnlyLastMentionedUnitPosition(parserState)
    },
    activateActionWhenProgressionOfCommandsChangesIfItIsLastTokenAndActionDidntHappenBefore: true
  }
  addUnitPositionScenarios(scenarios, 'repeat simile finishes', 2, {})
  scenarios['repeat simile vertical correction'] = {
    requiredCommandProgression: 'repeat simile',
    considerJoinedTokenAccumulatorWithoutCommandDelimitersAsPartOfTokensAndConjunctionsBetweenThem: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return isVerticalCorrection(tokenValues)
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      parserState[`lastStartSimileMark-${parserState.numberOfSimileMarks}`].yCorrection = verticalCorrection(tokenValues)
      if (parserState.applyHighlighting) {
        const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
          regexps.verticalCorrectionHighlight, (match) => {
            return `<span class="cnh" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${match}</span>`
          }
        )
        parserState.highlightsHtmlBuffer.push(
          `<span class="th" ref-id="simile-mark-${parserState.numberOfSimileMarks}">${joinedTokenValuesWithRealDelimitersWithHighlightedElement}</span>`
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const joinedTokenValuesWithRealDelimitersWithHighlightedElement = joinedTokenValuesWithRealDelimiters.replace(
        regexps.verticalCorrectionHighlight, (match) => {
          return `<span class="cnh">${match}</span>`
        }
      )
      parserState.highlightsHtmlBuffer.push(
        joinedTokenValuesWithRealDelimitersWithHighlightedElement
      )
    },
    itIsNewCommandProgressionFromLevel: 1
  }
  addLineMeasureStaveVoicePositionScenarios(
    scenarios,
    'repeat simile',
    [
      'repeat simile starts',
      'repeat simile finishes'
    ],
    1,
    true,
    { line: true, measure: true, stave: true, voice: true }
  )
}
