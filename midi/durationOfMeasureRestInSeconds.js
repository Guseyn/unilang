'use strict'

const DEFAULT_DURATION_IN_QUARTERS_FOR_MEASURE_REST = 4

const durationInSeconds = require('./durationInSeconds')

module.exports = (timeSignatureDurationInSeconds, tempoAura, fullDurationOfLastMeasure) => {
  return timeSignatureDurationInSeconds
    ? durationInSeconds(timeSignatureDurationInSeconds, tempoAura.quartersPerMinute)
    : fullDurationOfLastMeasure
      ? fullDurationOfLastMeasure
      : durationInSeconds(DEFAULT_DURATION_IN_QUARTERS_FOR_MEASURE_REST, tempoAura.quartersPerMinute)
}
