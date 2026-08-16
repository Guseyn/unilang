import { Validator } from '/js/unilang-in-worker-environment/language/lib/validator.js'
import {
  ValidatorResult,
  ValidatorResultError,
  ValidationError,
  SchemaError
} from '/js/unilang-in-worker-environment/language/lib/helpers.js'

import { SchemaScanResult, scan } from '/js/unilang-in-worker-environment/language/lib/scan.js'

export default {
  Validator,
  ValidatorResult,
  ValidatorResultError,
  ValidationError,
  SchemaError,
  SchemaScanResult,
  scan
}

export function validate(instance, schema, options) {
  const v = new Validator()
  return v.validate(instance, schema, options)
}
