const { readFileSync, writeFile } = require('fs')
const { resolve } = require('path')

/**
 * 替换配置文件中关于数据👖的设置
 * 依赖环境变量中的HOPE_DB_HOST以及HOPE_DB_PASSWORD
 * 如果没有这两个值，则使用默认配置
 */
function dbConfigReplace() {
  const { HOPE_DB_HOST, HOPE_DB_PASSWORD } = process.env

  const envFile = resolve(__dirname, '../.env')
  const ormConfigFile = resolve(__dirname, '../ormconfig.json')

  function replaceAndWrite(path, replaceMethod) {
    const source = readFileSync(path, 'utf8')
    let replaced = ''
    ;(replaceMethod() || []).map(args => {
      replaced = (replaced || source).replace(...args)
    })

    if(!replaced) return Promise.resolve('nothing to change')

    return new Promise((resolve, reject) => {
      writeFile(path, replaced, err => {
        if (err) {
          reject()
        } else {
          resolve()
        }
      })
    })
  }

  function envFileReplace() {
    const replace = []
    if (HOPE_DB_HOST) replace.push([/DB_HOST\=.*/, `DB_HOST=${HOPE_DB_HOST}`])
    if (HOPE_DB_PASSWORD)
      replace.push([/DB_PASSWORD\=.*/, `DB_PASSWORD=${HOPE_DB_PASSWORD}`])
    return replace
  }

  function ormConfigReplace() {
    const replace = []
    if (HOPE_DB_HOST) replace.push([/"host".*"/, `"host": "${HOPE_DB_HOST}"`])
    if (HOPE_DB_PASSWORD)
      replace.push([/"password".*"/, `"password": "${HOPE_DB_PASSWORD}"`])
    return replace
  }

  try {
    Promise.all([
      replaceAndWrite(envFile, envFileReplace),
      replaceAndWrite(ormConfigFile, ormConfigReplace),
    ])
  } catch (error) {
    console.log('server.js exec with some error, exit')
    process.exit(1)
  }
}

;(() => {
  dbConfigReplace()
})()
