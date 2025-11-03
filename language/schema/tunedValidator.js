'use strict'

import jsonschema from 'jsonschema'
const validator = new jsonschema.Validator()

validator.attributes.possibleValues = (instance, schema, options, ctx) => {
  if (!instance) {
    return
  }
  if (!Array.isArray(schema.possibleValues)) {
    throw new jsonschema.SchemaError('possibleValues expects an array', schema)
  }
  if (schema.possibleValues.indexOf(instance) === -1) {
    return `${instance} is not presented in possibleValues [ ${schema.possibleValues.join(', ')} ]`
  }
}

validator.attributes.greaterThan = (instance, schema, options, ctx) => {
  if (!instance) {
    return
  }
  if (typeof schema.greaterThan !== 'number') {
    throw new jsonschema.SchemaError('greaterThan expects a number', schema)
  }
  if (instance <= schema.greaterThan) {
    return `${instance} is less than or equal to ${schema.greaterThan}`
  }
}

validator.attributes.greaterThanOrEqualTo = (instance, schema, options, ctx) => {
  if (!instance) {
    return
  }
  if (typeof schema.greaterThanOrEqualTo !== 'number') {
    throw new jsonschema.SchemaError('greaterThanOrEqualTo expects a number', schema)
  }
  if (instance < schema.greaterThanOrEqualTo) {
    return `${instance} is less than ${schema.greaterThanOrEqualTo}`
  }
}

validator.attributes.lessThan = (instance, schema, options, ctx) => {
  if (!instance) {
    return
  }
  if (typeof schema.lessThan !== 'number') {
    throw new jsonschema.SchemaError('lessThan expects a number', schema)
  }
  if (instance >= schema.lessThan) {
    return `${instance} is greater than or equal to ${schema.greaterThan}`
  }
}

validator.attributes.lessThanOrEqualTo = (instance, schema, options, ctx) => {
  if (!instance) {
    return
  }
  if (typeof schema.lessThanOrEqualTo !== 'number') {
    throw new jsonschema.SchemaError('lessThanOrEqualTo expects a number', schema)
  }
  if (instance > schema.lessThanOrEqualTo) {
    return `${instance} is greater than ${schema.lessThanOrEqualTo}`
  }
}

validator.attributes.isPositiveInteger = (instance, schema, options, ctx) => {
  if (!instance) {
    return
  }
  if (typeof schema.isPositiveInteger !== 'boolean') {
    throw new jsonschema.SchemaError('isPositiveInteger expects a boolean value', schema)
  }
  const instanceAsNumber = instance * 1
  if (schema.isPositiveInteger) {
    if (!Number.isInteger(instanceAsNumber) || instanceAsNumber < 0) {
      return `${instance}(${instanceAsNumber} as number) is not positive integer`
    }
  }
}

validator.attributes.isNullableNumber = (instance, schema, options, ctx) => {
  if (!instance) {
    return
  }
  return !isNaN(instance)
}

validator.attributes.firstNumberIsGreaterThanOrEqualToSecondOne = (instance, schema, options, ctx) => {
  if (!instance) {
    return
  }
  if (!Array.isArray(schema.firstNumberIsGreaterThanOrEqualToSecondOne)) {
    throw new jsonschema.SchemaError('firstNumberIsGreaterThanOrEqualToSecondOne expects an array', schema)
  }
  if (schema.firstNumberIsGreaterThanOrEqualToSecondOne.length !== 2) {
    throw new jsonschema.SchemaError('firstNumberIsGreaterThanOrEqualToSecondOne expects an array with two keys', schema)
  }
  if (instance[schema.firstNumberIsGreaterThanOrEqualToSecondOne[0]] < instance[schema.firstNumberIsGreaterThanOrEqualToSecondOne[1]]) {
    return `first value (${instance[schema.firstNumberIsGreaterThanOrEqualToSecondOne[0]]}) is less than second one (${instance[schema.firstNumberIsGreaterThanOrEqualToSecondOne[1]]})`
  }
}

validator.attributes.isNotEmpty = (instance, schema, options, ctx) => {
  if (!instance) {
    return
  }
  if (typeof schema.isNotEmpty !== 'boolean') {
    throw new jsonschema.SchemaError('isNotEmpty expects a boolean value', schema)
  }
  if (schema.isNotEmpty) {
    if (instance.length === 0) {
      return `${instance} is empty`
    }
  }
}

validator.attributes.isNotePositionNumber = (instance, schema, options, ctx) => {
  if (!instance) {
    return
  }
  if (typeof schema.isNotePositionNumber !== 'boolean') {
    throw new jsonschema.SchemaError('isNotePositionNumber expects a boolean value', schema)
  }
  if (schema.isNotePositionNumber) {
    const diff = instance - Math.floor(instance)
    if (diff !== 0 && diff !== 0.5) {
      return `${instance} is not valid note position number`
    }
  }
}

validator.attributes.matches = (instance, schema, options, ctx) => {
  if (!instance) {
    return
  }
  if (!(schema.matches instanceof RegExp)) {
    throw new jsonschema.SchemaError('matches expects a RegExp', schema)
  }
  if (!schema.matches.test(instance)) {
    return `${instance} does not match ${schema.matches}`
  }
}

export default validator
