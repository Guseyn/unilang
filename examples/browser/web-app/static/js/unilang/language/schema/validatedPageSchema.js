'use strict'

import pageSchema from '#unilang/language/schema/pageSchema.js'
import tunedValidator from '#unilang/language/schema/tunedValidator.js'

export default function (schemaOnInput) {
  return tunedValidator.validate(schemaOnInput, pageSchema, { allowUnknownAttributes: false })
  // TODO:// USER READABLE MESSAGE IN JSON FORMAT
}
