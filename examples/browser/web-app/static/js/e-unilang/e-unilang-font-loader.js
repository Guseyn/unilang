import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import unwrappedChildrenOfParent from '#ehtml/unwrappedChildrenOfParent.js'
import scrollToHash from '#ehtml/actions/scrollToHash.js'

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

  async #run() {
    window['__UNILANG_STORAGE__'] = window['__UNILANG_STORAGE__'] || {}

    const progressState = {}

    if (this.hasAttribute('data-actions-on-progress-start')) {
      evaluateActionsOnProgress(
        this.getAttribute('data-actions-on-progress-start'),
        this,
        progressState
      )
    }

    const fontConfigSrc = this.getAttribute('data-font-config-src')
    let fontConfig
    if (this.hasAttribute('data-font-config')) {
      if (fontConfigSrc) {
        throw new Error('e-unilang-font-loader cannot have both "data-font-config-src" and "data-font-config" attributes to avoid confusion.')
      }
      fontConfig = JSON.parse(
        this.getAttribute('data-font-config')
      )
    } else if (!fontConfigSrc) {
      throw new Error('e-unilang-font-loader must have attribute "data-font-config-src" or "data-font-config"')
    }

    if (!fontConfig) {
      const fontConfigResponse = await fetch(fontConfigSrc)
      if (!fontConfigResponse.ok) {
        throw new Error(`Font config could not be loaded: ${fontConfigResponse.status}`);
      }
      fontConfig = await fontConfigResponse.json()
    }

    const fontSourcesReference = this.getAttribute('data-font-sources-reference')
    if (!fontSourcesReference) {
      throw new Error(`e-unilang-font-loader must have "data-font-sources-reference" attribute, so that other unilang elements can use it`);
    }

    const workerForLoadingAndSettingFonts = new Worker('/js/unilang-in-worker-environment/workerForLoadingAndSettingFonts.js', { type: 'module' })

    workerForLoadingAndSettingFonts.postMessage({ fontConfig })

    workerForLoadingAndSettingFonts.addEventListener('message', (event) => {
      if (event.data.error) {
        throw new Error(`Font loading failed: ${event.data.error}`)
      }

      const supportedFontSources = event.data.supportedFontSources
      window['__UNILANG_STORAGE__'][fontSourcesReference] = supportedFontSources

      unwrappedChildrenOfParent(this)

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

customElements.define('e-unilang-font-loader', EUnilangFontLoader, { extends: 'template' })
