/**
 * @description code-highlight select lang
 * @author wangfupeng
 */

import { Node, Transforms, Element } from 'slate'
import { ISelectMenu, IDomEditor, IOption, DomEditor } from '@wangeditor/core'
import { JS_SVG } from '../../constants/svg'
import { CodeElement } from '../../custom-types'

class SelectLangMenu implements ISelectMenu {
  title = '选择语言'
  iconSvg = JS_SVG
  tag = 'select'
  width = 95

  getOptions(editor: IDomEditor): IOption[] {
    const options: IOption[] = []

    // 获取配置，参考 './config.ts'
    const { codeLangs = [] } = editor.getMenuConfig('codeSelectLang') // 第二个参数 menu key

    options.push({
      text: 'plain text',
      value: '', // getValue 默认会返回 ''
    })
    codeLangs.forEach((lang: { text: string; value: string }) => {
      const { text, value } = lang
      options.push({ text, value })
    })

    // 设置 selected
    const curValue = this.getValue(editor)
    options.forEach(opt => {
      if (opt.value === curValue) {
        opt.selected = true
      } else {
        delete opt.selected
      }
    })

    return options
  }

  isActive(editor: IDomEditor): boolean {
    // select menu 会显示 selected value ，用不到 active
    return false
  }

  /**
   * 获取语言类型
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    const elem = this.getSelectCodeElem(editor)
    if (elem == null) return ''
    if (!Element.isElement(elem)) return ''

    return elem.language || ''
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true
    const elem = this.getSelectCodeElem(editor)
    if (elem) return false
    return true
  }

  exec(editor: IDomEditor, value: string | boolean) {
    const elem = this.getSelectCodeElem(editor)
    if (elem == null) return

    // 设置语言
    const props: Partial<CodeElement> = { language: value.toString() }
    Transforms.setNodes(editor, props, {
      match: n => DomEditor.checkNodeType(n, 'code'),
    })
  }

  private getSelectCodeElem(editor: IDomEditor): CodeElement | null {
    const codeNode = DomEditor.getSelectedNodeByType(editor, 'code')
    if (codeNode == null) return null
    const preNode = DomEditor.getParentNode(editor, codeNode)
    if (!Element.isElement(preNode)) return null
    if (preNode.type !== 'pre') return null

    return codeNode as CodeElement
  }
}

export default SelectLangMenu