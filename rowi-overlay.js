import RowiElement from '@rowi/rowi-element'
export default class RowiOverlay extends RowiElement {

  getOverlayStyle () {
    return /*css*/`
    :host {
      display: block;
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 2147483647;
    }
    `
  }

  constructor () {
    super()
    this._setup()
    this.$buildShadow([
      ['style', this.getOverlayStyle()],
      ['slot', {name: 'content', attrs: {style: 'pointer-events: auto'}}]
    ])
  }

  _setup() {
    this._opened = false
    this._overlayReady = false
    this._overlayClicked = this._overlayClicked.bind(this)
    this._intangibleChanged = this._intangibleChanged.bind(this)
    this._transitionTimeChanged = this._transitionTimeChanged.bind(this)
  }

  connectedCallback () {
    super.connectedCallback()
    this._opened = true
    if (!this._overlayReady) {
      this._overlayReady = true
      this._intangibleChanged()
      this._transitionTimeChanged()
    }
  }

  disconnectedCallback () { this._opened = false }

  static get observedAttributes () {
    return [
      'data-opacity',
      'data-color',
      'data-transition-time',
      'data-persistent',
      'data-intangible',
    ]
  }

  get props () {
    return {
      opacity: { type: 'number', default: 0 },
      color: { type: 'string', default: '0,0,0' },
      transitionTime: {
        type: 'number', default: 300,
        handler ({}) {
          this._transitionTimeChanged()
        }
      },
      persistent: { type: 'boolean' },
      intangible: {
        type: 'boolean',
        handler ({}) {
          this._intangibleChanged()
        }
      },
    }
  }

  _overlayClicked (event) {
    if (event.target === this || !this.contains(event.target)) {
      this.close()
      event.stopPropagation()
    }
  }

  _intangibleChanged () {
    this.style.pointerEvents = this.intangible ? 'none' : 'auto'
  }

  _transitionTimeChanged () {
    this.style.transition = `background-color ${this.transitionTime}ms`
  }

  open() {
    if (this._opened) return
    if (!this.persistent) {
      document.addEventListener('click', this._overlayClicked)
    }
    document.body.append(this)
    setTimeout(() => {
      this.style.backgroundColor = `rgba(${this.color}, ${this.opacity})`
    })
  }
  close() {
    if (!this._opened) return
    if (!this.persistent) {
      document.removeEventListener('click', this._overlayClicked)
    }
    this.style.backgroundColor = `rgba(${this.color}, 0)`
    setTimeout(() => this.remove(), this.transitionTime)
  }
}

customElements.define("rw-overlay", RowiOverlay)
