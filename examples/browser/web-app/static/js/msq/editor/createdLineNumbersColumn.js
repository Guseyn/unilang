import createdElementWithStylesAndAttributes from '#msq/editor/createdElementWithStylesAndAttributes.js'
import insertElementBeforeSpecifiedOne from '#msq/editor/insertElementBeforeSpecifiedOne.js'

export default (divUnderneathTextarea) => {
  const createdLineNumbersColumn = createdElementWithStylesAndAttributes(
    'div',
    {
    },
    {
      'data-line-numbers': ''
    }
  )
  insertElementBeforeSpecifiedOne(createdLineNumbersColumn, divUnderneathTextarea)
  return createdLineNumbersColumn
}
