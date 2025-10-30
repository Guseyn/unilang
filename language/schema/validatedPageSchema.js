'use strict'

const pageSchema = require('./pageSchema')
const tunedValidator = require('./tunedValidator')

module.exports = (schemaOnInput) => {
  return tunedValidator.validate(schemaOnInput, pageSchema, { allowUnknownAttributes: false })
  // TODO:// USER READABLE MESSAGE IN JSON FORMAT
}
