class DOMElement {
  /** @type {Element} */ element

  constructor(element) {
    if (!element) throw new Error('element is null')
    this.element = element
    Object.freeze(this)
  }

  static id(id) {
    return new DOMElement(document.getElementById(id))
  }

  static tagName(tagName) {
    return [...document.getElementsByTagName(tagName)]
      .map(el => new DOMElement(el))
  }

  static className(className) {
    return [...document.getElementsByClassName(className)]
      .map(el => new DOMElement(el))
  }

  hasClass(className) {
    return [...this.element.classList].includes(className)
  }

  addClass(className) {
    this.element.classList.add(className)
  }

  removeClass(className) {
    this.element.classList.remove(className)
  }

  setClass(className) {
    return this.element.className = className
  }

  child(className) {
    const children = this.element.getElementsByClassName(className)
    return (children.length || null) && new DOMElement(children[0])
  }

  children(className) {
    return [...this.element.getElementsByClassName(className)]
      .map(el => new DOMElement(el))
  }

  display(b = true) {
    if (this.isForcedHidden()) return;
    this.element.style.display = b ? 'block' : 'none'
  }

  hide() {
    this.display(false)
  }

  isDisplayed() {
    return getComputedStyle(this.element).display !== 'none'
  }

  isForcedHidden() {
    const isMobile = screen.width <= 480
    if (!isMobile) return false
    if (this.hasClass('avatar')) return true
    if (this.element.tagName.toLowerCase() == 'video') return true
    return false
  }
}

class DOMMediaElement extends DOMElement {
  static id(id) {
    return new DOMMediaElement(document.getElementById(id))
  }

  playFromBeginning() {
    this.element.currentTime = 0
    this.element.play()
  }
}
