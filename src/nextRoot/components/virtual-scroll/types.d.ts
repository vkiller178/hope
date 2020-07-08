import { Ref } from 'react'

export interface VirtualScrollProps {
  indicator?: React.ComponentType<{ load: LoadState }>
  scrollBinderEleQuery?: string
  renderItem: (item: ScrollItem, props: any) => any
  key?: string
  fetchMethod: (items: Array<ScrollItem>) => Promise<Array<ScrollItem>>
  component?: string | any
}

export interface ScrollItem {
  dom: {
    offsetTop?: number
    /**
     * 计算得到的值，非标准api
     */
    offsetBottom?: number
    show?: boolean
  }
  [key: string]: any
}

export interface ScrollHandlerOpts {
  wrapperCls: React.MutableRefObject
  itemCls: string
  scrollBinderEle: HTMLElement
  fetchMethod: React.MutableRefObject
}
