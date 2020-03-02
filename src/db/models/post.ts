import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  FindManyOptions,
} from 'typeorm'
import { UserModel, ActionModel, PostModel } from '.'
import BaseModel from './common/base'
import { UserActionType } from './action'

export enum postHide {
  'hide' = '1',
  'show' = '0',
}

//TODO: 增加各种时间戳

@Entity({ name: 'post' })
export default class Post extends BaseModel {
  like: number
  click: number
  constructor() {
    super()
  }
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  title: string
  @Column()
  tags: string
  @Column()
  hide: postHide
  @Column('longtext')
  content: string

  @ManyToOne(
    type => UserModel,
    user => user.posts
  )
  uid: number

  static async findPostWithUserActions(options?: FindManyOptions) {
    const posts = await this.find<PostModel>(options)
    for (const post of posts) {
      post.like = post.click = await ActionModel.count({
        where: { type: UserActionType.like, target: post.id },
      })
      post.click = post.click = await ActionModel.count({
        where: { type: UserActionType.click, target: post.id },
      })
    }

    return posts
  }
}
