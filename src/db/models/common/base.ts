import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm'

export default class BaseModel extends BaseEntity {
  constructor(props?: any) {
    super()
    this.createTime = new Date()

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
  @Column()
  createTime: Date
  @Column()
  updateTime: Date
}
