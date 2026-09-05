/**
 * Adds our own buttons into the player's control panel, next to its transport
 * controls, so they read as one bar.
 *
 * @param {Array<{ innerHTML: string, onClick: (event: Event) => void }>} buttons
 */
export default function addUtilsToMidiPlayerControlPanel(midiPlayer, buttons) {
  const controlPanel = midiPlayer.shadowRoot.querySelector('[data-control-panel]')
  const utilsPanel = document.createElement('div')
  utilsPanel.setAttribute('data-utils', '')
  buttons.forEach(({ innerHTML, onClick }) => {
    const button = document.createElement('button')
    button.innerHTML = innerHTML
    button.addEventListener('click', onClick)
    utilsPanel.appendChild(button)
  })
  controlPanel.appendChild(utilsPanel)
  return utilsPanel
}
