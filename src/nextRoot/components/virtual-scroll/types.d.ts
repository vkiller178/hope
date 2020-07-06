export interface VirtualScrollProps {
  indicator?: React.ComponentType<{ load: LoadState }>
  scrollBinderEleQuery?: string
  renderItem: (item: ScrollItem) => any
  key?: string
  fetchMethod: (items: Array<ScrollItem>) => Promise<Array<ScrollItem>>
  component?: string | any
}
