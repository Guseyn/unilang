'use strict'

module.exports = (duration, numberOfDots, tremoloDurationFactor) => {
  return (duration * (2 - Math.pow(2, -numberOfDots))) * tremoloDurationFactor
}
