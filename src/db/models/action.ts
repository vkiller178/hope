import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import BaseModel from './common/base'
import { UserModel } from '.'

export enum UserActionType {
  'click' = 'click',
  'like' = 'like',
}

@Entity({ name: 'userAction' })
export default class ActionModel extends BaseModel {
  constructor(props) {
    super(props)
  }
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  type: UserActionType
  /**
   * 操作目标的唯一键，可以是文章id
   */
  @Column()
  target: number

  @ManyToOne(
    type => UserModel,
    user => user.actions
  )
  uid: number
}
