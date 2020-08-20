import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm'
import { PostModel, ActionModel, ResumeModel } from '.'
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
  /**
   * 可以在查询之后隐藏这个属性
   */
  @Column({ select: false })
  password: string

  @Column()
  avatar: string

  @OneToMany((type) => PostModel, (post) => post.uid)
  posts: Array<PostModel>

  @OneToMany((type) => ActionModel, (action) => action.uid)
  actions: Array<ActionModel>

  @OneToOne((type) => ResumeModel, (resume) => resume.user)
  resume: ResumeModel
}
