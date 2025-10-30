'use strict'

const currentPageLineIndex = require('./../page-schema/currentPageLineIndex')

module.exports = (parserState, forConnection) => {
  const indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders = forConnection
    ? parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholdersForConnection
    : parserState.indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders
  if (
    (parserState.calculatedUnitPageLineIndexByLastMentionedPositions !== undefined) &&
    (parserState.calculatedUnitMeasureIndexByLastMentionedPositions !== undefined) &&
    (parserState.calculatedUnitStaveIndexByLastMentionedPositions !== undefined) &&
    (parserState.calculatedUnitVoiceIndexByLastMentionedPositions !== undefined) &&
    (parserState.calculatedUnitIndexByLastMentionedPositions !== undefined) &&
    !forConnection
  ) {
    for (let index = 0; index < indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.length; index++) {
      parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
        'class="clph" ref-id=""',
        `class="clph" ref-id="line-${parserState.calculatedUnitPageLineIndexByLastMentionedPositions + 1}"`
      )
      parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
        'class="clpph" ref-id=""',
        `class="clpph" ref-id="line-${parserState.calculatedUnitPageLineIndexByLastMentionedPositions + 1}"`
      )
      parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
        'class="cmph" ref-id=""',
        `class="cmph" ref-id="measure-${parserState.calculatedUnitMeasureIndexByLastMentionedPositions + 1}"`
      )
      parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
        'class="cmpph" ref-id=""',
        `class="cmpph" ref-id="measure-${parserState.calculatedUnitMeasureIndexByLastMentionedPositions + 1}"`
      )
      parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
        'class="csph" ref-id=""',
        `class="csph" ref-id="stave-${parserState.calculatedUnitMeasureIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitStaveIndexByLastMentionedPositions + 1}"`
      )
      parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
        'class="cspph" ref-id=""',
        `class="cspph" ref-id="stave-${parserState.calculatedUnitMeasureIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitStaveIndexByLastMentionedPositions + 1}"`
      )
      parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
        'class="cvph" ref-id=""',
        `class="cvph" ref-id="voice-${parserState.calculatedUnitMeasureIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitStaveIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitVoiceIndexByLastMentionedPositions + 1}"`
      )
      parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
        'class="cvpph" ref-id=""',
        `class="cvpph" ref-id="voice-${parserState.calculatedUnitMeasureIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitStaveIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitVoiceIndexByLastMentionedPositions + 1}"`
      )
      parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
        'class="cuph" ref-id=""',
        `class="cuph" ref-id="unit-${parserState.calculatedUnitMeasureIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitStaveIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitVoiceIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitIndexByLastMentionedPositions + 1}"`
      )
      parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
        'class="cupph" ref-id=""',
        `class="cupph" ref-id="unit-${parserState.calculatedUnitMeasureIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitStaveIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitVoiceIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitIndexByLastMentionedPositions + 1}"`
      )
      parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
        'class="th" ref-id=""',
        `class="th" ref-id="unit-${parserState.calculatedUnitMeasureIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitStaveIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitVoiceIndexByLastMentionedPositions + 1}-${parserState.calculatedUnitIndexByLastMentionedPositions + 1}"`
      )
    }
  } else {
    let pageLinePosition = forConnection ? parserState.lastMentionedConnectionPageLinePosition : parserState.lastMentionedPageLinePosition
    const measurePosition = forConnection ? parserState.lastMentionedConnectionMeasurePosition : parserState.lastMentionedMeasurePosition
    const stavePosition = forConnection ? parserState.lastMentionedConnectionStavePosition : parserState.lastMentionedStavePosition
    const voicePosition = forConnection ? parserState.lastMentionedConnectionVoicePosition : parserState.lastMentionedVoicePosition
    let pageLinePositionIsNotSpecified = pageLinePosition === undefined
    const measurePositionIsSpecified = measurePosition !== undefined
    const stavePositionIsSpecified = stavePosition !== undefined
    const voicePositionIsSpecified = voicePosition !== undefined
    if (pageLinePositionIsNotSpecified) {
      pageLinePosition = currentPageLineIndex(parserState)
      pageLinePositionIsNotSpecified = pageLinePosition === undefined
    }
    if (!pageLinePositionIsNotSpecified) {
      for (let index = 0; index < indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.length; index++) {
        parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
          'class="clph" ref-id=""',
          `class="clph" ref-id="line-${pageLinePosition + 1}"`
        )
        parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
          'class="clpph" ref-id=""',
          `class="clpph" ref-id="line-${pageLinePosition + 1}"`
        )
        if (measurePositionIsSpecified) {
          parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
            'class="cmph" ref-id=""',
            `class="cmph" ref-id="measure-${pageLinePosition + 1}-${measurePosition + 1}"`
          )
          parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
            'class="cmpph" ref-id=""',
            `class="cmpph" ref-id="measure-${pageLinePosition + 1}-${measurePosition + 1}"`
          )
          if (stavePositionIsSpecified) {
            parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
              'class="csph" ref-id=""',
              `class="csph" ref-id="stave-${pageLinePosition + 1}-${measurePosition + 1}-${stavePosition + 1}"`
            )
            parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
              'class="cspph" ref-id=""',
              `class="cspph" ref-id="stave-${pageLinePosition + 1}-${measurePosition + 1}-${stavePosition + 1}"`
            )
            if (voicePositionIsSpecified) {
              parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
                'class="cvph" ref-id=""',
                `class="cvph" ref-id="voice-${pageLinePosition + 1}-${measurePosition + 1}-${stavePosition + 1}-${voicePosition + 1}"`
              )
              parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
                'class="cvpph" ref-id=""',
                `class="cvpph" ref-id="voice-${pageLinePosition + 1}-${measurePosition + 1}-${stavePosition + 1}-${voicePosition + 1}"`
              )
            }
          } else {
            if (voicePositionIsSpecified) {
              parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
                'class="cvph" ref-id=""',
                `class="cvph" ref-id="voice-in-measure-on-all-staves-${pageLinePosition + 1}-${measurePosition + 1}-${voicePosition + 1}"`
              )
              parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
                'class="cvpph" ref-id=""',
                `class="cvpph" ref-id="voice-in-measure-on-all-staves-${pageLinePosition + 1}-${measurePosition + 1}-${voicePosition + 1}"`
              )
            }
          }
        } else {
          if (stavePositionIsSpecified) {
            parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
              'class="csph" ref-id=""',
              `class="csph" ref-id="stave-in-all-measures-on-line-${pageLinePosition + 1}-${stavePosition + 1}"`
            )
            parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
              'class="cspph" ref-id=""',
              `class="cspph" ref-id="stave-in-all-measures-on-line-${pageLinePosition + 1}-${stavePosition + 1}"`
            )
            if (voicePositionIsSpecified) {
              parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
                'class="cvph" ref-id=""',
                `class="cvph" ref-id="voice-${stavePosition + 1}-${voicePosition + 1}"`
              )
              parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
                'class="cvpph" ref-id=""',
                `class="cvpph" ref-id="voice-${stavePosition + 1}-${voicePosition + 1}"`
              )
            }
          } else {
            if (voicePositionIsSpecified) {
              parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
                'class="cvph" ref-id=""',
                `class="cvph" ref-id="voice-in-all-measures-and-on-all-staves-on-line-${pageLinePosition + 1}-${voicePosition + 1}"`
              )
              parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]] = parserState.highlightsHtmlBuffer[indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders[index]].replace(
                'class="cvpph" ref-id=""',
                `class="cvpph" ref-id="voice-in-all-measures-and-on-all-staves-on-line-${pageLinePosition + 1}-${voicePosition + 1}"`
              )
            }
          }
        }
      }
    }
  }
  indexesInHighlightsHtmlBufferWhereWeShouldFillPositionPlaceholders.length = 0
}
