'use strict'

module.exports = (timeSignatureParams) => {
  if (timeSignatureParams) {
    const numerator = timeSignatureParams.numerator * 1 || 4
    const denominator = timeSignatureParams.denominator * 1 || 4
    return (numerator / denominator) * 4
  }
}
