'use strict'

const compressedRange = (range, compressUnitsByNTimes, stretchUnitsByNTimes, styles) => {
  let result
  if (stretchUnitsByNTimes !== undefined) {
    result = range * stretchUnitsByNTimes
  } else if (compressUnitsByNTimes !== undefined) {
    result = range / compressUnitsByNTimes
  } else {
    result = range
  }
  return +result.toFixed(2)
}

export default function (drawnCrossStaveUnit, minUnitDurationOnPageLine, compressUnitsByNTimes, stretchUnitsByNTimes, styles) {
  const { spaceRangesAfterCrossStaveUnitsAccordingMinUnitDurationOnPageLineTheyBelongTo } = styles
  if (minUnitDurationOnPageLine <= 1 / 32) {
    const spaceRangesAfterCrossStaveUnit = spaceRangesAfterCrossStaveUnitsAccordingMinUnitDurationOnPageLineTheyBelongTo['min <= 1 / 32']
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit === 0) {
      return spaceRangesAfterCrossStaveUnit[0]
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 32) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[1], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 16) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[2], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 8) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[3], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[4], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 2) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[5], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[6], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 2) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[7], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[8], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit > 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[9], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
  }
  if (minUnitDurationOnPageLine <= 1 / 16) {
    const spaceRangesAfterCrossStaveUnit = spaceRangesAfterCrossStaveUnitsAccordingMinUnitDurationOnPageLineTheyBelongTo['min <= 1 / 16']
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit === 0) {
      return spaceRangesAfterCrossStaveUnit[0]
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 16) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[1], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 8) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[2], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[3], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 2) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[4], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[5], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 2) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[6], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[7], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit > 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[8], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
  }
  if (minUnitDurationOnPageLine <= 1 / 8) {
    const spaceRangesAfterCrossStaveUnit = spaceRangesAfterCrossStaveUnitsAccordingMinUnitDurationOnPageLineTheyBelongTo['min <= 1 / 8']
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit === 0) {
      return spaceRangesAfterCrossStaveUnit[0]
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 8) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[1], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[2], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 2) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[3], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[4], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 2) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[5], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[6], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit > 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[7], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
  }
  if (minUnitDurationOnPageLine <= 1 / 4) {
    const spaceRangesAfterCrossStaveUnit = spaceRangesAfterCrossStaveUnitsAccordingMinUnitDurationOnPageLineTheyBelongTo['min <= 1 / 4']
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit === 0) {
      return spaceRangesAfterCrossStaveUnit[0]
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[1], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 2) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[2], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[3], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 2) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[4], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[5], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit > 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[6], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
  }
  if (minUnitDurationOnPageLine <= 1 / 2) {
    const spaceRangesAfterCrossStaveUnit = spaceRangesAfterCrossStaveUnitsAccordingMinUnitDurationOnPageLineTheyBelongTo['min <= 1 / 2']
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit === 0) {
      return spaceRangesAfterCrossStaveUnit[0]
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1 / 2) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[1], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[2], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 2) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[3], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[4], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit > 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[5], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
  }
  if (minUnitDurationOnPageLine <= 1) {
    const spaceRangesAfterCrossStaveUnit = spaceRangesAfterCrossStaveUnitsAccordingMinUnitDurationOnPageLineTheyBelongTo['min <= 1']
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit === 0) {
      return spaceRangesAfterCrossStaveUnit[0]
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 1) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[1], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 2) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[2], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[3], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit > 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[4], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
  }
  if (minUnitDurationOnPageLine <= 2) {
    const spaceRangesAfterCrossStaveUnit = spaceRangesAfterCrossStaveUnitsAccordingMinUnitDurationOnPageLineTheyBelongTo['min <= 2']
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit === 0) {
      return spaceRangesAfterCrossStaveUnit[0]
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 2) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[1], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[2], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit > 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[3], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
  }
  if (minUnitDurationOnPageLine <= 4) {
    const spaceRangesAfterCrossStaveUnit = spaceRangesAfterCrossStaveUnitsAccordingMinUnitDurationOnPageLineTheyBelongTo['min <= 4']
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit === 0) {
      return spaceRangesAfterCrossStaveUnit[0]
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit <= 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[1], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
    if (drawnCrossStaveUnit.minDurationAmongAccumulatorsForEachVoiceCondideringCasesWhenItIsGraceCrossStaveUnit > 4) {
      return compressedRange(spaceRangesAfterCrossStaveUnit[2], compressUnitsByNTimes, stretchUnitsByNTimes, styles)
    }
  }
  return 0
}
