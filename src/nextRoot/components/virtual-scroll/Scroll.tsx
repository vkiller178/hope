import React, { useEffect, useState, useRef } from 'react'
import { VirtualScrollProps, ScrollItem } from './types'
import { Indicator as DefaultIndicator } from '.'
import ScrollHandler, { dataKeyProp } from './handler'

export enum LoadState {
  loading = 'loading',
  noMore = 'noMore',
  needMore = 'neewMore',
}

const itemCls = 'scroll-item'

const VirtualScroll: React.FC<VirtualScrollProps> = ({
  indicator: Indicator,
  scrollBinderEleQuery,
  renderItem,
  key,
  fetchMethod,
  component: Component,
}) => {
  let [scrollItemsStore, setScrollItemsStore] = useState<Array<ScrollItem>>([])

  const id = useRef<string>('')
  const myHandler = useRef<Function>()
  myHandler.current = (handler: ScrollHandler) => {
    const { postElements, postsWrapper } = handler

    Array.from(postElements).forEach((postE, index) => {
      const _index = scrollItemsStore.findIndex(
        (p) => p.id === +postE.getAttribute(dataKeyProp)
      )
      if (scrollItemsStore[_index].dom.offsetTop === undefined) {
        // 更新store中每个节点的位置
        scrollItemsStore[_index].dom.offsetTop = postE.offsetTop
        scrollItemsStore[_index].dom.offsetBottom =
          postsWrapper.clientHeight - postE.offsetTop
      }
    })
    // 更新节点是否可以展示的信息
    scrollItemsStore.map((item) => {
      item.dom.show = !handler.compare(item)
    })

    // 根据每次滑动最终的结果，确定wrapper需要的padding
    const [top, bottom] = handler.getBoundingIndex(scrollItemsStore)
    postsWrapper.style.paddingTop = top ? top.dom.offsetTop + 'px' : '0px'
    postsWrapper.style.paddingBottom = bottom
      ? bottom.dom.offsetBottom + 'px'
      : '0px'

    setScrollItemsStore([...scrollItemsStore])
  }

  const [load, setLoad] = useState<{ loading: LoadState }>({
    loading: LoadState.needMore,
  })
  const wrapperCls = useRef<any>()
  wrapperCls.current = () => `virtual-scroll-wrapper-${id.current}`

  key = key || 'id'

  const getFeed = useRef<() => Promise<any>>()
  getFeed.current = async () => {
    setLoad((_) => ({ ..._, loading: LoadState.loading }))

    const feeds = await fetchMethod(scrollItemsStore)
    if (feeds.length > 0) {
      setScrollItemsStore((_) =>
        _.concat(
          feeds.map((feed) => {
            feed.dom = {
              show: true,
            }
            return feed
          })
        )
      )
      setLoad((_) => ({ ..._, loading: LoadState.needMore }))
    } else {
      setLoad((_) => ({ ..._, loading: LoadState.noMore }))
    }
  }
  useEffect(() => {
    const scrollBinderEle = document.querySelector<HTMLElement>(
      scrollBinderEleQuery || 'body'
    )

    const handler = new ScrollHandler({
      wrapperCls,
      itemCls,
      scrollBinderEle,
      fetchMethod: getFeed,
    })

    id.current = (Math.random() * Math.pow(10, 18)).toFixed(0)

    const scrollHandler = () => {
      handler.eventHandler([myHandler])
    }

    scrollBinderEle.addEventListener('scroll', scrollHandler)

    return () => {
      scrollBinderEle.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  const scrollItemProps = (item) => ({
    className: itemCls,
    key: item[key],
    [dataKeyProp]: item[key],
  })

  const showItems = scrollItemsStore.filter((item) => !!item.dom.show)

  if (Component) {
    return (
      <Component className={wrapperCls.current()}>
        {showItems.map((item) => renderItem(item, scrollItemProps(item)))}
        {Indicator && <Indicator load={load.loading} />}
      </Component>
    )
  }

  return (
    <div className={wrapperCls.current()}>
      {showItems.map((item) => renderItem(item, scrollItemProps(item)))}
      {Indicator ? (
        <Indicator load={load.loading} />
      ) : (
        <DefaultIndicator load={load.loading} />
      )}
    </div>
  )
}
export default VirtualScroll
