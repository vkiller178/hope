import React, { useEffect, useState, useRef } from 'react'
import { VirtualScrollProps } from './types'
import { Indicator as DefaultIndicator } from '.'

// 获取数据的间隔
const scrollTake = 400
// 容器触底的阈值
const delta = 10
// 超出可视区域后隐藏的阈值
const outViewDelta = 500

enum ScrollDirection {
  up = 'up, view more',
  down = 'down, view history',
}

export enum LoadState {
  loading = 'loading',
  noMore = 'noMore',
  needMore = 'neewMore',
}

interface ScrollItem {
  dom: {
    offsetTop: number
  }

  [key: string]: any
}

const VirtualScroll: React.FC<VirtualScrollProps> = ({
  children,
  indicator: Indicator,
  scrollBinderEleQuery,
  renderItem,
  key,
  fetchMethod,
  component: Component,
}) => {
  const [scrollItemsStore, setScrollItemsStore] = useState<Array<ScrollItem>>(
    []
  )
  const [dScrollItemsStore, setDScrollItemsStore] = useState<Array<ScrollItem>>(
    []
  )

  const id = useRef<string>('')
  const lastTick = useRef<number>(0)

  const [load, setLoad] = useState<{ loading: LoadState }>({
    loading: LoadState.needMore,
  })
  const wrapperCls = useRef<any>()
  wrapperCls.current = () => `virtual-scroll-wrapper-${id.current}`
  const itemCls = 'scroll-item'

  key = key || 'id'

  const getFeed = useRef<any>()
  getFeed.current = async () => {
    setLoad((_) => ({ ..._, loading: LoadState.loading }))
    const feeds = await fetchMethod(scrollItemsStore)

    lastTick.current = performance.now()

    if (feeds.length > 0) {
      setScrollItemsStore((_) => _.concat(feeds))
      setDScrollItemsStore((_) => _.concat(feeds))
      setLoad((_) => ({ ..._, loading: LoadState.needMore }))
    } else {
      setLoad((_) => ({ ..._, loading: LoadState.noMore }))
    }
  }
  useEffect(() => {
    let lastScrollTop = 0

    const scrollBinderEle = document.querySelector(
      scrollBinderEleQuery || 'body'
    )

    id.current = (Math.random() * Math.pow(10, 18)).toFixed(0)

    function handler(e: any) {
      const curScrollTop = e.currentTarget.scrollTop

      const postsWrapper = document.querySelector<HTMLElement>(
        `.${wrapperCls.current()}`
      )
      const postElements = document.querySelectorAll<HTMLElement>(
        `.${wrapperCls.current()} .${itemCls}`
      )

      postsWrapper.style.position = 'relative'

      let direction: ScrollDirection
      if (curScrollTop - lastScrollTop > 0) {
        direction = ScrollDirection.up
      } else {
        direction = ScrollDirection.down
      }

      console.log(direction, e.currentTarget)

      lastScrollTop = curScrollTop

      const isOutBody = (ele: HTMLElement) => {
        const { top, height } = ele.getBoundingClientRect()
        let scope = [
          0 - height - outViewDelta,
          scrollBinderEle.clientHeight + outViewDelta,
        ]
        return (
          Math.min(...scope, top) === top || Math.max(...scope, top) === top
        )
      }

      Array.from(postElements).forEach((postE, index) => {
        // add scrolTop info, if not yet
        setScrollItemsStore((posts) => {
          const index = posts.findIndex(
            (p) => p.id === +postE.getAttribute('data-item-key')
          )
          posts[index] = {
            ...posts[index],
            dom: {
              offsetTop: postE.offsetTop,
            },
          }
          return posts
        })
        if (direction === ScrollDirection.up) {
          const isBeforeDividE =
            index < postElements.length - 1 &&
            isOutBody(postE) &&
            !isOutBody(postElements[index + 1])
          if (isBeforeDividE) {
            const topIndex = index + 1
            postsWrapper.style.paddingTop =
              postElements[topIndex].offsetTop + 'px'
            setDScrollItemsStore((_) => _.slice(topIndex))
          }
        } else {
          const isLastDividE =
            index > 0 && !isOutBody(postElements[index - 1]) && isOutBody(postE)

          if (isLastDividE) {
            setDScrollItemsStore((_) => _.slice(0, index - 1))
          }
        }
      })

      const isDown = direction === ScrollDirection.down
      let compition = {
        index: isDown ? 0 : postElements.length - 1,
        compare() {
          return isDown
            ? postElements[this.index].offsetTop > lastScrollTop - outViewDelta
            : postElements[this.index].getBoundingClientRect().y <
                scrollBinderEle.clientHeight + outViewDelta
        },
        hasinsertE(posts: Array<ScrollItem>) {
          const _index = posts.findIndex(
            (p) =>
              p.id === +postElements[this.index].getAttribute('data-item-key')
          )

          return (dPosts: Array<ScrollItem>) => {
            if (isDown && _index > 0) {
              postsWrapper.style.paddingTop =
                posts[_index - 1].dom.offsetTop + 'px'

              dPosts.unshift(posts[_index - 1])
            } else if (!isDown && _index < posts.length - 1) {
              dPosts.push(posts[_index + 1])
            }

            return [...dPosts]
          }
        },
      }

      insertBack()

      function insertBack() {
        if (compition.compare) {
          let last: number = 0
          setScrollItemsStore((_) => {
            const now = performance.now()
            if (now - last > 200) {
              last = now
              const dPostInsert = compition.hasinsertE(_)
              setDScrollItemsStore((dp) => dPostInsert(dp))
            }

            return _
          })
        }
      }

      const now = performance.now()
      const { bottom } = postsWrapper.getBoundingClientRect()
      if (
        load.loading !== LoadState.loading &&
        Math.abs(bottom - scrollBinderEle.clientHeight) < delta &&
        now - lastTick.current > scrollTake &&
        direction === ScrollDirection.up
      ) {
        // 触底
        getFeed.current()
      }
    }

    getFeed.current()

    console.log(scrollBinderEle)

    scrollBinderEle.addEventListener('scroll', handler)

    return () => {
      scrollBinderEle.removeEventListener('scroll', handler)
    }
  }, [])

  if (Component) {
    return (
      <Component className={wrapperCls.current()}>
        {dScrollItemsStore.map((item) => (
          <div className={itemCls} key={item[key]} data-item-key={item[key]}>
            {renderItem(item)}
          </div>
        ))}
        {Indicator && <Indicator load={load.loading} />}
      </Component>
    )
  }
  return (
    <div className={wrapperCls.current()}>
      {dScrollItemsStore.map((item) => (
        <div className={itemCls} key={item[key]} data-item-key={item[key]}>
          {renderItem(item)}
        </div>
      ))}
      {Indicator ? (
        <Indicator load={load.loading} />
      ) : (
        <DefaultIndicator load={load.loading} />
      )}
    </div>
  )
}
export default VirtualScroll
