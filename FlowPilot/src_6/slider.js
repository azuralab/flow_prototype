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
  if (label) {
    placeSliderTab(label.element.innerText / 100)
    mess().element.innerText = label.element.innerText
  }
}

document.body.addEventListener('slider', ({value}) => {
  const bg = sliderBackground()
  const tabId = bg.element.classList[1]

  const percentage = Math.round(value * 100)
  mess().element.innerText = percentage

  const valueLabel = bg.child('value ' + tabId)
  if (valueLabel) valueLabel.element.innerText = percentage
})

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

function mess() {
  return sliderBackground().child('mess')
}

const html = `
<img class="slider toggle _0">
<img class="slider toggle _1">
<img class="slider toggle _2">
<img class="slider toggle _3">
<div class="tab" onpointerdown="startDragSliderTab(event)" onpointerup="stopDragSliderTab(event)" onpointermove="dragSliderTab(event)">
  <div class="value mess">50</div>
</div>
<div class="curtain"></div>

<div class="value _1">50</div>
<div class="value _2">50</div>
<div class="value _3">50</div>

<button onclick="selectTab(1)" class="_1"></button>
<button onclick="selectTab(2)" class="_2"></button>
<button onclick="selectTab(3)" class="_3"></button>

<img class="search button s" onclick="displaySearch()">
<img class="search button x" onclick="hideSearch()">
<img class="search main">

<input>
`

injectSlider(DOMElement.id('slider-A'), sliders.A)
injectSlider(DOMElement.id('slider-B'), sliders.B)
injectSlider(DOMElement.id('slider-C'), sliders.C)

function injectSlider(parent, config) {
  parent.element.innerHTML = html

  for (i = 0; i < 4; i++)
    parent.child(`toggle _${i}`).element.src = config.sliders[i]
  parent.child('search s').element.src = config.s
  parent.child('search x').element.src = config.x
  parent.child('search main').element.src = config.main
}
