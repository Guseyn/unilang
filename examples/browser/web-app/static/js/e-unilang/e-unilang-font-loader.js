import {
  setupFonts
} from '#unilang/api.js'

class EUnilangFontLoader extends HTMLTemplateElement {
  constructor() {
    super()
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

  #run() {
    const 
  }
}

customElements.define('e-unilang-font-loader', EUnilangFontLoader, { extends: 'template' })
