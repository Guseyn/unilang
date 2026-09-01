export function copyText({ event, text, onCopyInnerHTML }) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  const target = event.currentTarget
  const initialText = target.innerHTML
  target.innerHTML = onCopyInnerHTML || 'Copied &#10003;'
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

export function downloadContent({ fileName, dataSrc, extenstion }) {
  // const fileURL = window.URL.createObjectURL(content)
  const anchor = document.createElement('a')
  anchor.href = dataSrc
  anchor.download = `${fileName}.${extenstion}`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export async function openContent({ dataSrc }) {
  try {
    const response = await fetch(dataSrc);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  } catch (error) {
    console.error('Error opening SVG:', error);
  }
}
