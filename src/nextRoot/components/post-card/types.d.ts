export interface Post {
  id: number
  title: string
  tags: string
  content: string
  uid: {
    username: string
  }
  like: number
  click: number
  brief: string
  dom: {
    offsetTop: number
  }
}
