'use strict'

const NEW_LINE = '\n'

module.exports = (textareaValue) => {
  if (textareaValue[textareaValue.length - 1] === NEW_LINE) {
    textareaValue += NEW_LINE
  }
  return textareaValue
}
