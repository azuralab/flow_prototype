import { domExport } from './dom.js'
import { SearchChanged, searchPercentage, searchValue, setSearchValue, tabId } from './search.js'
import { AvatarChanged } from './selected-avatar.js'

const minX = 24
const maxX = 473
const tabHalfWidth = 5

const slider_state = {
  dragOrigin: null,
}

let currentConfig

document.addEventListener(AvatarChanged, e => {
  currentConfig = e.config.sliderImages
  injectSlider(document.querySelector('#slider'))
  selectTab(0)
})

document.addEventListener('DOMContentLoaded', () => {
  hideSearch()
})

document.addEventListener(SearchChanged, ({ state, value, percentage }) => {
  const valueLabel = document.querySelector(`#slider .value.${tabId(state)}`)
  if (valueLabel) valueLabel.innerText = value
  document.querySelector('#slider .mess').innerText = value
  placeSliderTab(percentage)
})

function placeSliderTab(loc) {
  const x = loc * (maxX - minX) + minX
  document.querySelector('#slider .tab').style.left = `${x}px`
  document.querySelector('#slider .curtain').style.width = `${Math.max(0, x - minX - 2)}px`
}

domExport(e => {
  const {pageX, pageY} = e
  slider_state.dragOrigin = {pageX, pageY}
  e.target.setPointerCapture(e.pointerId)
}, 'startDragSliderTab')

domExport(e => {
  if (!slider_state.dragOrigin) return

  const {pageX} = e
  const elementX = pageX - document.querySelector('#slider').getBoundingClientRect().x - tabHalfWidth

  const clampedX = Math.min(Math.max(elementX, minX), maxX)
  const value = (clampedX - minX) / (maxX - minX)
  setSearchValue(value, document.querySelector('#slider').classList[1])
}, 'dragSliderTab')

domExport(e => {
  slider_state.dragOrigin = null
  e.target.releasePointerCapture(e.pointerId)
}, 'stopDragSliderTab')

function selectTab(num) {
  const clickedTabId = `_${num}`
  const bg = document.querySelector('#slider')
  const wasSelected = bg.classList.contains(clickedTabId)

  bg.style.display = ''

  const tabId = !num || wasSelected ? '_0' : clickedTabId
  bg.className = `search-panel ${tabId}`

  placeSliderTab(searchPercentage(tabId))
  document.querySelector('#slider .mess').innerText = searchValue(tabId)
}
domExport(selectTab, 'selectTab')

domExport(() => {
  document.querySelector('#slider .button.s').style.display = 'none'
  document.querySelector('#slider .button.x').style.display = ''
  document.querySelector('#slider .main').style.display = ''
}, 'displaySearch')

domExport(() => {
  document.querySelector('#slider .button.s').style.display = ''
  document.querySelector('#slider .button.x').style.display = 'none'
  document.querySelector('#slider .main').style.display = 'none'
}, 'hideSearch')

const html = `
<img class="slider toggle _0">
<img class="slider toggle _1">
<img class="slider toggle _2">
<img class="slider toggle _3">
<div class="tab" onpointerdown="startDragSliderTab(event)" onpointerup="stopDragSliderTab(event)" onpointermove="dragSliderTab(event)">
  <div class="value mess">50%</div>
</div>
<div class="curtain"></div>

<div class="value _1">100km</div>
<div class="value _2">50%</div>
<div class="value _3">50%</div>

<button onclick="selectTab(1)" class="_1"></button>
<button onclick="selectTab(2)" class="_2"></button>
<button onclick="selectTab(3)" class="_3"></button>

<img class="search button s" onclick="displaySearch()">
<img class="search button x" onclick="hideSearch()">
<img class="search main">

<form onsubmit="addSearchTerm(this.querySelector('input').value); return false">
  <input>
</form>
<div class="pill-container"></div>
`

function injectSlider(container) {
  container.innerHTML = html

  for (let i = 0; i < 4; i++)
    container.querySelector(`.toggle._${i}`).src = currentConfig.sliders[i]
  container.querySelector('.search.s').src = currentConfig.s
  container.querySelector('.search.x').src = currentConfig.x
  container.querySelector('.search.main').src = currentConfig.main
}

domExport(term => {
  const element = document.createElement('div')
  element.innerText = term
  element.className = 'search-term'
  element.onclick = () => {
    element.onclick = null
    element.remove()
  }
  document.querySelector('#slider .pill-container').appendChild(element)
}, 'addSearchTerm')
