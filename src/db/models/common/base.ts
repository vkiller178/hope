import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  BeforeInsert,
} from 'typeorm'

export default class BaseModel extends BaseEntity {
  constructor(props?: any) {
    super()
    this.createTime = new Date()
    // TODO 目前是无效的
    if (props) this.init(props)
  }

  private init(props) {
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        const element = props[key]
        this[key] = element
      }
    }
  }

  async _save() {
    this.updateTime = new Date()
    return await this.save()
  }

  async getData(data, handler = (key, v) => v) {
    for (const key in data) {
      this[key] = await handler(key, data[key])
    }
  }

  @Column()
  createTime: Date
  @Column()
  updateTime: Date
}
