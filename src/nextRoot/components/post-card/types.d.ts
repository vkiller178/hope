export interface Post {
  id: number
  /**
   * 标题
   */
  title: string
  tags: string
  content: string
  uid: {
    username: string
  }
  like: number
  click: number
  /**
   * 裁剪的文章内容
   */
  brief: string
  dom: {
    offsetTop: number
  }
}

export interface CardProps {
  p: Post
  [key: string]: any
}
