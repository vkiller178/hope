import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { PostModel, ActionModel } from '.'
import BaseModel from './common/base'

@Entity({ name: 'user' })
export default class User extends BaseModel {
  constructor() {
    super()
  }
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  username: string
  @Column()
  password: string

  @OneToMany(
    type => PostModel,
    post => post.uid
  )
  posts: Array<PostModel>

  @OneToMany(
    type => ActionModel,
    action => action.uid
  )
  actions: Array<ActionModel>
}
