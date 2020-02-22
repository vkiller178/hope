# typeorm 使用技巧

## 创建表

```ts
// 以用户表为例，以下代码同时展示了定义基础表字段的方式
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'user' })
export default class User extends BaseEntity {
  // 必须要定义一个主键
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  username: string
  @Column()
  password: string
}
```
