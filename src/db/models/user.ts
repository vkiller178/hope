import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'user' })
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  username: string
  @Column()
  password: string
}
