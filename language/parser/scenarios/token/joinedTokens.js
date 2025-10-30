'use strict'

const tokenValuesFromTokens = require('./tokenValuesFromTokens')

module.exports = (tokens) => {
  return tokenValuesFromTokens(tokens).join(' ')
}
