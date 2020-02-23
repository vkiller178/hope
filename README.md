> 这是一个以希望命名的个人博客系统

## 2020.2.22 正式启动

初衷：2020 给自己一个礼物，更是一个希望。

## roadMap

- [x] 集成 nextjs 前端渲染和 koa api 服务
- [ ] 引入 TypeORM 数据库管理工具
- [ ] 代码编译（估计比使用 ts-node 执行性能更好，而且编译后的代码体积以及执行效率会更高）
- [ ] docker 镜像制作（也就是 Dockerfile 的编写，使得部署更简单）

## 开发

### 配置文件

在 template 文件夹中包含项目所需要使用到的配置文件（默认不会在 git 中提交这些文件），代码克隆到本地自行开发的时候，需要将这些配置文件拷贝到项目根目录下。

### 数据库

> 数据库默认使用 mysql，采用 typeORM 进行管理

> typeORM[文档](https://typeorm.io/#/using-cli/installing-cli)

- 创建一个 migration

> '--' 后的参数是传到`npm scripts`执行的命令中的
> -n 后的参数表示的此次 migration 的 name

```bash
yarn typeorm  migration:generate -- -n add_user_table
```

- 同步代码到生产环境之后，如有必要，执行一次数据库同步

```bash
yarn typeorm migration:run
```

> typeorm 使用技巧可以参见[这个文档](./src/db/README.md)

- 数据库回滚

```bash
yarn typeorm migration:revert
```

## 资料

- [material-ui](https://material-ui.com/zh/guides/server-rendering/)
