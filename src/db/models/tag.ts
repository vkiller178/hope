import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
} from 'typeorm'
import { PostModel } from '.'
import BaseModel from './common/base'

@Entity({ name: 'tag' })
export default class Tag extends BaseModel {
  constructor() {
    super()
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  visible: boolean

  @ManyToMany(() => PostModel)
  @JoinColumn({ referencedColumnName: 'id' })
  posts: PostModel[]
}
