import worker from '#msq/worker.js'

class MuSemantiQFontLoader extends HTMLTemplateElement {
  constructor() {
    super()
    this.id = crypto.randomUUID()
    this.isRendered = false
  }

  connectedCallback() {
    if (this.isRendered === true) {
      return
    }
    this.isRendered = true
    this.#render()
  }

  async #render() {
    if (this.hasAttribute('data-font-config') && this.hasAttribute('data-font-config-src')) {
      throw new Error('msq-font-loader cannot have both "data-font-config-src" and "data-font-config" attributes to avoid confusion.')
    }

    if (!this.hasAttribute('data-font-config') && !this.hasAttribute('data-font-config-src')) {
      throw new Error('msq-font-loader must have attribute "data-font-config-src" or "data-font-config"')
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
      throw new Error(`msq-font-loader must have "data-font-sources-reference" attribute, so that other msq elements can use it`);
    }

    worker.postMessage({
      id: this.id,
      name: 'fonts.setup',
      fontConfig,
      fontSourcesReference
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
      const contentNode = document.importNode(this.content, true)
      const parentNode = this.parentNode
      parentNode.replaceChild(contentNode, this)
      worker.removeEventListener('message', messageHandler)
    }

    worker.addEventListener('message', messageHandler)
  }
}

customElements.define('msq-font-loader', MuSemantiQFontLoader, { extends: 'template' })
