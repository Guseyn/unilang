'use strict'

const DEFAULT_DURATION_IN_QUARTERS_FOR_MEASURE_REST = 4

import durationInSeconds from '#unilang/midi/durationInSeconds.js'

export default function (timeSignatureDurationInSeconds, tempoAura, fullDurationOfLastMeasure) {
  return timeSignatureDurationInSeconds
    ? durationInSeconds(timeSignatureDurationInSeconds, tempoAura.quartersPerMinute)
    : fullDurationOfLastMeasure
      ? fullDurationOfLastMeasure
      : durationInSeconds(DEFAULT_DURATION_IN_QUARTERS_FOR_MEASURE_REST, tempoAura.quartersPerMinute)
}
