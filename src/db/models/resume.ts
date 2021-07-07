import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { UserModel } from '.'
import BaseModel from './common/base'

@Entity({ name: 'resume' })
export default class Resume extends BaseModel {
  constructor() {
    super()
  }
  @PrimaryGeneratedColumn()
  id: number
  @Column({ comment: '昵称' })
  nickname: string
  @Column({ comment: '一句话介绍' })
  intro: string
  @Column('longtext', { comment: '详细自我介绍' })
  detail: string

  @Column('longtext', { comment: '技能' })
  skills: Array<string>

  @Column('longtext', { comment: '工作经历' })
  experience: Array<Resume.Exp>

  @Column('longtext', { comment: '项目经历' })
  projects: Array<Resume.Project>

  @Column('longtext', { comment: '教育经历' })
  education: Array<Resume.Edu>

  @Column('longtext', { comment: '联系方式' })
  contact: Array<Resume.Contact>

  @OneToOne((type) => UserModel, (user) => user.resume)
  @JoinColumn()
  user: UserModel
}
