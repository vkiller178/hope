import { ScrollHandlerOpts, ScrollItem } from './types'
import { throttle } from 'lodash'

enum ScrollDirection {
  up = '加载更多',
  down = '查看历史记录',
}

// 获取数据的间隔
const scrollTake = 300
// 容器触底的阈值
const delta = 10
// 超出可视区域后隐藏的阈值
const outViewDelta = 2000

export const dataKeyProp = 'data-item-key'

export default class ScrollHandler {
  lastScrollTop = 0
  opts: ScrollHandlerOpts

  postsWrapper: HTMLElement
  postElements: NodeListOf<HTMLElement>
  direction: ScrollDirection
  lastDataFetchTime: number
  eventHandler: any

  private loading: boolean = false

  private get compareIndex() {
    return this.postElements
      ? this.isDown
        ? 0
        : this.postElements.length - 1
      : 0
  }

  public get isDown(): boolean {
    return this.direction === ScrollDirection.down
  }

  constructor(opts: ScrollHandlerOpts) {
    this.opts = opts

    // 初始化时候调用获取数据的接口
    this.fetchData()

    this.eventHandler = throttle(
      (steps) => {
        this._eventHandler.call(this, steps)
      },
      10,
      {
        leading: false,
        trailing: true,
      }
    )
  }

  fetchData() {
    this.loading = true
    this.opts.fetchMethod.current().then(() => {
      this.loading = false
      this.lastDataFetchTime = performance.now()
    })
  }

  /**
   *
   * @param e event对象
   * @param steps handler处理完之后，依次调用steps中的处理函数
   */
  private _eventHandler(steps: Array<React.MutableRefObject<any>> = []) {
    const curScrollTop = this.opts.scrollBinderEle.scrollTop
    this.postsWrapper = document.querySelector<HTMLElement>(
      `.${this.opts.wrapperCls.current()}`
    )
    this.postElements = document.querySelectorAll<HTMLElement>(
      `.${this.opts.wrapperCls.current()} .${this.opts.itemCls}`
    )

    this.postsWrapper.style.position = 'relative'

    this.direction =
      curScrollTop - this.lastScrollTop > 0
        ? ScrollDirection.up
        : ScrollDirection.down

    this.lastScrollTop = curScrollTop
    this.needMore()

    steps.map((s) => {
      s.current(this)
    })
  }
  /**
   * 返回 true 则表示节点需要隐藏
   * @param post
   */
  compare(post: ScrollItem): boolean {
    if (this.lastScrollTop >= post.dom.offsetTop) {
      // 表示在上部的元素
      return this.lastScrollTop > post.dom.offsetTop + outViewDelta
    } else {
      return (
        post.dom.offsetTop >
        this.opts.scrollBinderEle.clientHeight +
          outViewDelta +
          this.lastScrollTop
      )
    }
  }
  /**
   * 返回当前状态下上下的边界元素
   * @param posts
   */
  getBoundingIndex(posts: Array<ScrollItem>): Array<ScrollItem | null> {
    const show = (i: number) => !!posts[i]?.dom.show
    const result: Array<ScrollItem | null> = [null, null]
    posts.map((p, index) => {
      if (!show(index - 1) && show(index)) result[0] = p
      if (show(index - 1) && !show(index)) result[1] = p
    })

    return result
  }

  private needMore() {
    const now = performance.now()
    const { bottom } = this.postsWrapper.getBoundingClientRect()
    if (
      !this.loading &&
      Math.abs(bottom - this.opts.scrollBinderEle.clientHeight) < delta &&
      now - this.lastDataFetchTime > scrollTake &&
      this.direction === ScrollDirection.up
    ) {
      this.fetchData()
    }
  }
}
