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

  @Column('json', { comment: '技能', nullable: true })
  skills: Array<string>

  @Column('json', { comment: '工作经历', nullable: true })
  experience: Array<Resume.Exp>

  @Column('json', { comment: '项目经历', nullable: true })
  projects: Array<Resume.Project>

  @Column('json', { comment: '教育经历', nullable: true })
  education: Array<Resume.Edu>

  @Column('json', { comment: '联系方式', nullable: true })
  contact: Array<Resume.Contact>

  @OneToOne((type) => UserModel)
  @JoinColumn()
  user: UserModel
}
