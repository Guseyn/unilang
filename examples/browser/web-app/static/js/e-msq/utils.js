export function copyText(event, text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  const target = event.target
  const initialText = target.innerHTML
  target.innerHTML = 'Copied &#10003;'
  setTimeout(() => {
    target.innerHTML = initialText
  }, 1500)
}

export function trimMultilineText(text) {
  return text.trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
}
