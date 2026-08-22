import { Validator } from '/js/e-unilang/unilang-worker/language/lib/validator.js'
import {
  ValidatorResult,
  ValidatorResultError,
  ValidationError,
  SchemaError
} from '/js/e-unilang/unilang-worker/language/lib/helpers.js'

import { SchemaScanResult, scan } from '/js/e-unilang/unilang-worker/language/lib/scan.js'

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
