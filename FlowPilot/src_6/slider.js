const minX = 24
const maxX = 473
const tabHalfWidth = 5

const slider_state = {
  dragOrigin: null,
}

function placeSliderTab(loc) {
  const x = loc * (maxX - minX) + minX
  tab().element.style.left = `${x}px`
  curtain().element.style.width = `${x - minX - 2}px`
}

function startDragSliderTab(e) {
  const {pageX, pageY} = e
  slider_state.dragOrigin = {pageX, pageY}
  e.target.setPointerCapture(e.pointerId)
}

function dragSliderTab(e) {
  if (!slider_state.dragOrigin) return

  const {pageX} = e
  const elementX = pageX - sliderBoundingRect().x - tabHalfWidth

  const clampedX = Math.min(Math.max(elementX, minX), maxX)
  tab().element.style.left = `${clampedX}px`
  curtain().element.style.width = `${clampedX - minX - 2}px`

  document.body.dispatchEvent(
    new SliderEvent((clampedX - minX) / (maxX - minX))
  )
}

class SliderEvent extends Event {
  constructor(value) {
    super('slider')
    this.value = value
  }
}

function stopDragSliderTab(e) {
  slider_state.dragOrigin = null
  e.target.releasePointerCapture(e.pointerId)
}

function sliderBackground() {
  return DOMElement.id(`slider-${selectedFlow()}`)
}

function sliderBoundingRect() {
  return sliderBackground().element.getBoundingClientRect()
}

function tab() {
  return sliderBackground().child('tab')
}

function curtain() {
  return sliderBackground().child('curtain')
}

function selectTab(num) {
  for (const slider of DOMElement.className('search-panel')) {
    slider.hide()
  }

  const tabId = `_${num}`
  const bg = sliderBackground()
  const wasSelected = bg.hasClass(tabId)

  bg.display()
  bg.setClass('search-panel')
  bg.addClass(!num || wasSelected ? '_0' : tabId)

  const label = bg.child(`value _${num}`)
  if (label) placeSliderTab(label.element.innerText / 100)
}

setTimeout(() => {
  document.body.addEventListener('slider', ({value}) => {
    const bg = sliderBackground()
    const tabId = bg.element.classList[1]
    const valueLabel = bg.child('value ' + tabId)
    if (!valueLabel) return // No tab selected; what to do??

    const percentage = Math.round(value * 100)
    valueLabel.element.innerText = percentage
  })
}, 10)

function displaySearch() {
  searchSButton().hide()
  searchXButton().display()
  searchMainArea().display()
}

function hideSearch() {
  searchSButton().display()
  searchXButton().hide()
  searchMainArea().hide()
}

function searchSButton() {
  return sliderBackground().child('button s')
}

function searchXButton() {
  return sliderBackground().child('button x')
}

function searchMainArea() {
  return sliderBackground().child('main')
}
