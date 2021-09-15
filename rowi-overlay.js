import RowiElement from './node_modules/@rowi/rowi-element/rowi-element.js'

class RWOverlay extends RowiElement {

  constructor () {
    super()
    this._connected = false
    this.style.display = 'none'
    this._overlay = document.createElement('div')
    this._overlay.style.cssText = `
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 99999;
      background-color: rgba(${this._defaultColor}, 0);
      transition: background-color ${this._defaultTransition}ms;
    `
    this._overlay.addEventListener('click', ev => this.overlayClicked(ev))
  }

  connectedCallback () {
    this._connected = true
  }

  disconnectedCallback () {
    this._connected = false
  }

  static get observedAttributes () {
    return [
      'data-opened',
      'data-opacity',
      'data-color',
      'data-transition',
      'data-no-closable'
    ]
  }

  get props () {
    this._defaultColor = '0,0,0'
    this._defaultTransition = 300
    return {  
      opened: { type: 'boolean', handler () { this.stateChanged() } },
      opacity: { type: 'number', default: 0 },
      color: { type: 'string', default: this._defaultColor },
      transition: {
        type: 'number', default: this._defaultTransition,
        handler () {
          this._overlay.style.transition = `background-color ${this.transition}ms`
        }
      },
      noClosable: { type: 'boolean' }
    }
  }

  overlayClicked (ev) {
    if (ev.target === this._overlay && !this.noClosable) {
      this.opened = false
      ev.stopPropagation()
    }
  }

  stateChanged () {
    if (!this._connected) return
    if (this.opened) {
      if (this.children.length === 0) return
      this._content = this.children[0]
      this._overlay.append(this._content)
      document.body.append(this._overlay)
      setTimeout(() => {
        this._overlay.style.backgroundColor = `rgba(${this.color}, ${this.opacity})`
      });
    } else {
      this._overlay.style.backgroundColor = `rgba(${this.color}, 0)`
      setTimeout(() => {
        this.append(this._content)
        document.body.removeChild(this._overlay)
      }, this.transition)
    }
  }
}

customElements.define("rw-overlay", RWOverlay)