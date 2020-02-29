import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm'

export default class BaseModel extends BaseEntity {
  constructor() {
    super()
    this.createTime = new Date()
  }

  async _save() {
    this.updateTime = new Date()
    return await this.save()
  }
  @Column()
  createTime: Date
  @Column()
  updateTime: Date
}
