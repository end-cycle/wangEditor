/**
 * @description SelectList class
 * @author wangfupeng
 */

import { debounce } from 'lodash-es'
import $, { Dom7Array } from '../../../utils/dom'
import { IOption } from '../../index'

// 存储所有的 selectList 实例
const ALL_SELECT_LIST = new Set<SelectList>()

// 统一 hide
$('body').on(
  'click',
  debounce(() => {
    ALL_SELECT_LIST.forEach(selectList => selectList.hide())
  }, 100)
)

// “对号”icon
function gen$SelectedIcon() {
  return $(
    `<svg viewBox="0 0 1446 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M574.116299 786.736392 1238.811249 48.517862C1272.390222 11.224635 1329.414799 7.827718 1366.75664 41.450462 1403.840015 74.840484 1406.731043 132.084741 1373.10189 169.433699L655.118888 966.834607C653.072421 969.716875 650.835807 972.514337 648.407938 975.210759 615.017957 1012.29409 558.292155 1015.652019 521.195664 982.250188L72.778218 578.493306C35.910826 545.297758 32.859041 488.584019 66.481825 451.242134 99.871807 414.158803 156.597563 410.800834 193.694055 444.202665L574.116299 786.736392Z"></path></svg>`
  )
}

class SelectList {
  $elem: Dom7Array = $(`<div class="w-e-select-list"></div>`)
  isShow: boolean = false

  constructor() {
    ALL_SELECT_LIST.add(this)
  }

  /**
   * 渲染 list
   * @param options select options
   * @param type 'list'/ 'grid'
   */
  renderList(options: IOption[], type: string = 'list') {
    const $elem = this.$elem
    $elem.html('') // 先清空内容，再重新渲染

    const $list = $(`<ul class="${type === 'list' ? 'list' : 'grid'}"></ul>`)
    options.forEach(opt => {
      const { value, text, selected, styleForRenderMenuList } = opt
      const $li = $(`<li data-value="${value}"></li>`) // 【注意】必须用 <li> 必须用 data-value！！！

      if (styleForRenderMenuList) {
        $li.css(styleForRenderMenuList)
      }

      if (selected) {
        const $selectedIcon = gen$SelectedIcon()
        $li.append($selectedIcon)
        $li.addClass('selected')
      }

      $li.append($(`<span>${text}</span>`))
      $list.append($li)
    })
    $elem.append($list)
  }

  appendTo($menuItem: Dom7Array) {
    const $elem = this.$elem
    $menuItem.append($elem)
  }

  show() {
    if (this.isShow) return

    const $elem = this.$elem
    $elem.show()
    this.isShow = true
  }

  hide() {
    if (!this.isShow) return

    const $elem = this.$elem
    $elem.hide()
    this.isShow = false
  }
}

export default SelectList