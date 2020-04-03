import { createConnection } from 'typeorm'
import * as entities from './models'

export default async function connection() {
  return createConnection({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'fake',
    synchronize: false,
    entities: Object.values(entities),
  })
}
