'use strict'

import pageSchema from '/js/e-unilang/unilang-worker/language/schema/pageSchema.js'
import tunedValidator from '/js/e-unilang/unilang-worker/language/schema/tunedValidator.js'

export default function (schemaOnInput) {
  return tunedValidator.validate(schemaOnInput, pageSchema, { allowUnknownAttributes: false })
  // TODO:// USER READABLE MESSAGE IN JSON FORMAT
}
