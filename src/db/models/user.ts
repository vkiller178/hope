import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm'
import { PostModel } from '.'

@Entity({ name: 'user' })
export default class User extends BaseEntity {
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
}
