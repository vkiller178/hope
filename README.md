> 这是一个以希望命名的个人博客系统

## 2020.2.22 正式启动

初衷：2020 给自己一个礼物，更是一个希望。

## TODO

- 2020.2.22

- [x] 集成 nextjs 前端渲染和 koa api 服务
- [x] 引入 TypeORM 数据库管理工具
- [x] 代码编译（估计比使用 ts-node 执行性能更好，而且编译后的代码体积以及执行效率会更高）
- [x] docker 镜像制作（也就是 Dockerfile 的编写，使得部署更简单）

- 2020.2.29

- [x] 构建过程，密码文本私密化（`docker.io`的密码）
- [x] 生产环境数据库配置从镜像中分离
- [ ] 部署文档
- [ ] 优化构建流程以提高速度

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

## 部署

- 启动程序

先从镜像仓库（docker.io）拉取镜像，然后预设一些环境变量就可以运行起来了。

1、拉取镜像

```bash
docker pull rxh1212/hope
```

2、docker run 运行

```bash

docker run -it --rm -e HOPE_DB_HOST=<your-mysql-hostname> HOPE_DB_PASSWORD=<your-mysql-password> -p 3000:3000 --name hope  rxh1212/hope
```

3、docker compose 运行

下面是`docker-compose.yml`

```text
version: "3"
services:
  # 在arm中，mariadb就是mysql的替代品，接口一致，占用资源比较少。
  db:
    image: mariadb
    restart: unless-stopped
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: example
    ports:
      - "3306:3306"
    networks:
      - default
    volumes:
      - ./db/datadir:/var/lib/mysql
  hope:
    image: rxh1212/hope
    restart: unless-stopped
    environment:
      HOPE_DB_HOST: db
      HOPE_DB_PASSWORD: example
    ports:
      - "3000:3000"
```

## 开发相关，本地 docker 镜像构建

由于最近突发奇想，打算让博客跑在树莓派上，去除对于海外 vps 的倒数第二个依赖。因此不得不好好研究了下 docker 多架构构建的方式，于是有了以下步骤。在没有打通 github-action 之前，可能需要手动执行构建的步骤了～～

```
docker buildx build --platform linux/amd64,linux/arm64 -t rxh1212/hope --push .
```

很简单的一条命令，就可以构建出同时支持 amd64 和 arm64 的镜像了。下面两个链接可以作为参考，写得都很不错。

- [macos 系统](https://docs.docker.com/docker-for-mac/multi-arch/)
- [Linux 系统](https://www.infoq.cn/article/V9Qj0fJj6HsGYQ0LpHxg)

## 资料

- [material-ui](https://material-ui.com/zh/guides/server-rendering/)
