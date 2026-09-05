import createdElementWithStylesAndAttributes from '#msq/editor/createdElementWithStylesAndAttributes.js'

export default (textarea) => {
  // create view here and hide it
  const autocompleteListView = createdElementWithStylesAndAttributes(
    'div',
    {
      'display': 'none',
      'position': 'absolute'
    },
    {
      'data-autocomplete': ''
    }
  )
  textarea.parentNode.appendChild(autocompleteListView)
  return autocompleteListView
}
