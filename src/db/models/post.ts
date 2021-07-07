import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  AfterLoad,
  ManyToMany,
  JoinTable,
  In,
  getManager,
  JoinColumn,
} from 'typeorm'
import { UserModel, ActionModel, TagModal, PostModel } from '.'
import BaseModel from './common/base'
import { UserActionType } from './action'
import converter from '../../utils/markdownConvert'

const breifBreak = '<!-- more -->'

@Entity({ name: 'post' })
export default class Post extends BaseModel {
  protected like: number
  protected click: number
  protected brief: string

  constructor() {
    super()
    this.visible = true
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @ManyToMany(() => TagModal)
  @JoinTable()
  @JoinColumn({ referencedColumnName: 'id' })
  tags: TagModal[]

  @Column()
  visible: boolean

  @Column('longtext')
  content: string

  @ManyToOne((type) => UserModel, (user) => user.posts)
  uid: number

  @AfterLoad()
  getBrief() {
    if (this.content) {
      let breakIndex = this.content.indexOf(breifBreak)
      this.brief = converter.makeHtml(
        this.content.slice(0, ~breakIndex ? breakIndex : 100)
      )
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

  static async getFeed({ tags = '', visible = true, ...props }) {
    let query = getManager().createQueryBuilder(Post, 'post')

    if (tags) {
      // post 按 tag 过滤 https://github.com/typeorm/typeorm/issues/3369
      query = query.innerJoin(
        'post.tags',
        'postTag',
        'postTag.id IN (:...tagIds) AND postTag.visible=1',
        {
          tagIds: tags.split(',').map((v) => +v),
        }
      )
    }

    query
      .where('post.visible = :visible', {
        visible,
      })
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.uid', 'uid')
      .take(props.take)
      .skip(props.skip)
      .orderBy('post.createTime', 'DESC')
    // 可以打印出 sql 查询语句
    // console.log(query.getQueryAndParameters())

    return await query.getManyAndCount()
  }
}
