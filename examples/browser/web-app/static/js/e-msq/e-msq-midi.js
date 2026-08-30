import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import scrollToHash from '#ehtml/actions/scrollToHash.js'

import worker from '#e-msq/worker.js'
import { copyText, downloadContent, trimMultilineText } from '#e-msq/utils.js'
import '#e-msq/lib/html-midi-player/player.js'

import downloadIcon from '#e-msq/icons/downloadIcon.js'
import copyIcon from '#e-msq/icons/copyIcon.js'
import doneIcon from '#e-msq/icons/doneIcon.js'

class EMuSemantiQMIDI extends HTMLTemplateElement {
  constructor() {
    super()
    this.id = crypto.randomUUID()
    this.ehtmlActivated = false
  }

  connectedCallback() {
    this.addEventListener(
      'ehtml:activated',
      () => this.#onEHTMLActivated(),
      { once: true }
    )
  }

  #onEHTMLActivated() {
    if (this.ehtmlActivated === true) {
      return
    }
    this.ehtmlActivated = true
    this.#run()
  }

  async #run() {
    const progressState = {}

    if (this.hasAttribute('data-actions-on-progress-start')) {
      evaluateActionsOnProgress(
        this.getAttribute('data-actions-on-progress-start'),
        this,
        progressState
      )
    }

    const contentNode = document.importNode(this.content, true)
    const inputText = trimMultilineText(this.innerState || contentNode.textContent)

    worker.postMessage({
      id: this.id,
      name: 'midi.generate',
      inputText
    })

    const messageHandler = (event) => {
      const id = event.data.id
      const status = event.data.status
      const error = event.data.error
      if (status !== 'ok') {
        console.error(error)
      }
      if (status === 'ok' && id !== this.id) {
        return
      }

      const midiDataSrc = event.data.midiDataSrc
      this.#render(midiDataSrc, inputText)

      if (this.hasAttribute('data-actions-on-progress-end')) {
        evaluateActionsOnProgress(
          this.getAttribute('data-actions-on-progress-end'),
          this,
          progressState
        )
      }

      scrollToHash()

      worker.removeEventListener('message', messageHandler)
    }

    worker.addEventListener('message', messageHandler)
  }

  #render(midiDataSrc, inputText) {
    const elm = document.createElement('div')
    elm.attachShadow({ mode: 'open' })
    elm.setAttribute('title', inputText)
    elm.setAttribute('data-rendered-by', 'template[is="e-msq-midi"]')
    const soundFont = this.getAttribute('data-sound-font')

    elm.shadowRoot.innerHTML = /*html*/`
      <style>
        :host {
          font-size: 16px;
          --border-color: #c0c0c0;
          --border-radius: 1em;
          --surface-bg: #fff;
          --surface-bg-hovered: #f9fafc;
        }
        div[data-inner-wrapper] {
          position: relative;
          display: block;
          margin-left: auto;
          margin-right: auto;
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
          width: max-content;
          height: max-content;
          padding: 0;
          box-sizing: border-box;
          max-width: 100%;
          overflow: hidden;
        }
        div[data-scroll] {
          border-radius: var(--border-radius);
          overflow: auto;
          scrollbar-width: none;
        }
        div[data-scroll]::-webkit-scrollbar {
          display: none;
        }
      </style>
      <div data-inner-wrapper>
        <div data-scroll>
          <midi-player
            data-sound-font="${soundFont || ''}"
            data-src="${midiDataSrc}"
          ></midi-player>
        </div>
      </div>
    `
    const midiPlayer = elm.shadowRoot.querySelector('midi-player')
    const midiPlayerOverrideStyle = document.createElement('style')
    midiPlayerOverrideStyle.textContent = /*css*/`
      [data-control-panel] {
        border-radius: 1em;
        box-sizing: border-box;
      }
    `
    midiPlayer.shadowRoot.appendChild(midiPlayerOverrideStyle)
    const controlPanel = midiPlayer.shadowRoot.querySelector('[data-control-panel]')
    const downloadContentButton = document.createElement('button')
    downloadContentButton.innerHTML = downloadIcon
    downloadContentButton.addEventListener('click', () => {
      downloadContent({
        fileName: this.getAttribute('data-file-name') || this.id,
        dataSrc: midiDataSrc,
        extenstion: 'midi'
      })
    })    
    controlPanel.appendChild(downloadContentButton)
    const copyMSQButton = document.createElement('button')
    copyMSQButton.innerHTML = copyIcon
    copyMSQButton.addEventListener('click', (event) => {
      copyText(event, inputText, doneIcon)
    })
    controlPanel.appendChild(copyMSQButton)
    this.parentElement.replaceChild(
      elm,
      this
    )
  }
}

customElements.define('e-msq-midi', EMuSemantiQMIDI, { extends: 'template' })
