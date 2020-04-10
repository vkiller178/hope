import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  FindManyOptions,
} from 'typeorm'
import BaseModel from './common/base'

@Entity({ name: 'user' })
export default class User extends BaseModel {
  constructor() {
    super()
  }
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  userId: string
  @Column()
  username: string
  @Column()
  telephone: string
  @Column()
  province: string
  @Column()
  city: string
  @Column()
  county: string
  @Column()
  address: string
  @Column()
  price: string

  static async findBasicInfo(options: FindManyOptions<User>) {
    return await User.find({ ...options, select: ['username', 'telephone'] })
  }
}
