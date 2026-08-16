'use strict'

import pageSchema from '/js/unilang-in-worker-environment/language/schema/pageSchema.js'
import tunedValidator from '/js/unilang-in-worker-environment/language/schema/tunedValidator.js'

export default function (schemaOnInput) {
  return tunedValidator.validate(schemaOnInput, pageSchema, { allowUnknownAttributes: false })
  // TODO:// USER READABLE MESSAGE IN JSON FORMAT
}
