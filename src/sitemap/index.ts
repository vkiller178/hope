import { readFile, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { PostModel } from '../db/models'

const host = 'https://vkiller.club'

const sitemapPath = resolve(__dirname, '../nextRoot/public/sitemap.txt')

function addMline(cur, add) {
  return `${cur}
          ${add}`.replace(/^\s+/gm, '')
}

const writeSitemap = (str) =>
  writeFileSync(resolve(__dirname, sitemapPath), str)

const sitemap = async () => {
  let posts,
    str = host,
    skip = 0

  while (
    (posts = await PostModel.find({ take: 10, skip: skip * 10 })).length > 0
  ) {
    for (const post of posts) {
      str = addMline(str, `${host}/p/${post.id}`)
    }

    skip = skip + 1
  }

  writeSitemap(str)
}

/**
 *
 * @param uri eg: /p/27
 */
export const updateLine = async (uri: string) => {
  let fileContent = readFileSync(sitemapPath, { encoding: 'utf-8' })
  const add = `${host}${uri}`
  if (fileContent.match(new RegExp(add))) {
    return
  }
  fileContent = addMline(fileContent, add)

  writeSitemap(fileContent)
}

export default sitemap
