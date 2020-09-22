import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { PostModel } from '../db/models'

const host = 'https://vkiller.club'

const sitemapPath = resolve(__dirname, '../nextRoot/public/sitemap.txt')

const sitemap = async () => {
  let posts,
    str = host,
    skip = 0

  while (
    (posts = await PostModel.find({ take: 10, skip: skip * 10 })).length > 0
  ) {
    for (const post of posts) {
      str = `${str}
            ${host}/p/${post.id}`.replace(/^\s+/gm, '')
    }

    skip = skip + 1
  }

  writeFileSync(resolve(__dirname, sitemapPath), str)
}

export default sitemap
