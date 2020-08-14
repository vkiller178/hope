import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  AfterLoad,
} from 'typeorm'
import { UserModel, ActionModel } from '.'
import BaseModel from './common/base'
import { UserActionType } from './action'
import converter from '../../utils/markdownConvert'

export enum postHide {
  'hide' = '1',
  'show' = '0',
}

@Entity({ name: 'post' })
export default class Post extends BaseModel {
  protected like: number
  protected click: number
  protected brief: string

  constructor() {
    super()
    //TODO: 完善tags逻辑
    this.tags = ''
    this.hide = postHide.show
  }
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  title: string
  @Column()
  tags: string
  @Column()
  hide: postHide
  @Column('longtext')
  content: string

  @ManyToOne((type) => UserModel, (user) => user.posts)
  uid: number

  @AfterLoad()
  getBrief() {
    if (this.content) {
      this.brief = converter.makeHtml(this.content.slice(0, 100))
    }
  }

  @AfterLoad()
  async getLike() {
    this.like = await ActionModel.count({
      where: { type: UserActionType.like, target: this.id },
    })
  }

  @AfterLoad()
  async getClick() {
    this.click = await ActionModel.count({
      where: { type: UserActionType.click, target: this.id },
    })
  }

  static async getFeed(props) {
    return await this.find({
      where: { hide: postHide.show },
      relations: ['uid'],
      ...props,
    }).then((posts) =>
      posts.map((p) => {
        delete p.content
        return p
      })
    )
  }
}
