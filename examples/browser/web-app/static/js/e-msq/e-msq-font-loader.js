import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import scrollToHash from '#ehtml/actions/scrollToHash.js'

import worker from '#e-msq/worker.js'

class EMuSemantiQFontLoader extends HTMLTemplateElement {
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

    if (this.hasAttribute('data-font-config') && this.hasAttribute('data-font-config-src')) {
      throw new Error('e-msq-font-loader cannot have both "data-font-config-src" and "data-font-config" attributes to avoid confusion.')
    }

    if (!this.hasAttribute('data-font-config') && !this.hasAttribute('data-font-config-src')) {
      throw new Error('e-msq-font-loader must have attribute "data-font-config-src" or "data-font-config"')
    }

    const fontConfigSrc = this.getAttribute('data-font-config-src')
    let fontConfig

    if (fontConfigSrc) {
      const fontConfigResponse = await fetch(fontConfigSrc)
      if (!fontConfigResponse.ok) {
        throw new Error(`Font config could not be loaded: ${fontConfigResponse.status}`);
      }
      fontConfig = await fontConfigResponse.json()
    } else {
      fontConfig = JSON.parse(
        this.getAttribute('data-font-config')
      )
    }

    const fontSourcesReference = this.getAttribute('data-font-sources-reference')
    if (!fontSourcesReference) {
      throw new Error(`e-msq-font-loader must have "data-font-sources-reference" attribute, so that other msq elements can use it`);
    }

    worker.postMessage({
      id: this.id,
      name: 'fonts.setup',
      fontConfig,
      fontSourcesReference
    })

    worker.addEventListener('message', (event) => {
      const id = event.data.id
      const status = event.data.status
      const error = event.data.error
      if (status !== 'ok') {
        console.error(error)
      }
      if (status === 'ok' && id !== this.id) {
        return
      }
      const contentNode = document.importNode(this.content, true)
      const parentNode = this.parentNode
      parentNode.replaceChild(contentNode, this)

      if (this.hasAttribute('data-actions-on-progress-end')) {
        evaluateActionsOnProgress(
          this.getAttribute('data-actions-on-progress-end'),
          this,
          progressState
        )
      }

      scrollToHash()
    }, { once: true })
  }
}

customElements.define('e-msq-font-loader', EMuSemantiQFontLoader, { extends: 'template' })
