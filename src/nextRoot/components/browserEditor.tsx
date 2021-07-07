// 引入编辑器样式
import 'braft-editor/dist/index.css'
import dynamic from 'next/dynamic'
import React, { useRef } from 'react'
import converter from '../../utils/markdownConvert'

export const BrowserEditor = dynamic<{ value; onChange }>(
  async () => {
    const { default: Editor } = await import('braft-editor')
    const { default: Markdown } = await import('braft-extensions/dist/markdown')
    Editor.use(Markdown({}))
    return ({ value, onChange }) => {
      const editorStateRef = useRef(
        Editor.createEditorState(converter.makeHtml(value ?? ''))
      )
      return (
        <Editor
          value={editorStateRef.current}
          onChange={(state) => {
            const md = converter.makeMarkdown(state.toHTML() ?? '')
            editorStateRef.current = state
            if (md !== value) {
              onChange(md)
            }
          }}
        />
      )
    }
  },
  { ssr: false }
)
