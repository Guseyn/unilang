'use strict'

import pageSchema from '#msq/language/schema/pageSchema.js'
import tunedValidator from '#msq/language/schema/tunedValidator.js'

export default function (schemaOnInput) {
  return tunedValidator.validate(schemaOnInput, pageSchema, { allowUnknownAttributes: false })
  // TODO:// USER READABLE MESSAGE IN JSON FORMAT
}
