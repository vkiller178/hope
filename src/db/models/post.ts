import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { UserModel } from '.'
import BaseModel from './common/base'

export enum postHide {
  'hide' = '1',
  'show' = '0',
}

//TODO: 增加各种时间戳

@Entity({ name: 'post' })
export default class Post extends BaseModel {
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
}
