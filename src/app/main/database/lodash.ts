import Lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import LodashID from 'lodash-id'
import { app, remote } from 'electron'

const isRenderer = process.type === 'renderer'
// Render process use remote app
const APP = isRenderer ? remote.app : app
const STORE_PATH = APP.getPath('userData')

// In production mode, during the first open application
// APP.getPath('userData') gets the path nested and the datastore.js is loaded.
// if it doesn't exist, create it.
if (!isRenderer) {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

class DB {
  db: Lowdb = {};
  constructor () {
    const adapter = new FileSync(path.join(__dirname, '/db.json'))
    // console.log(path.join(STORE_PATH, '/db.json'))
    this.db = Lowdb(adapter)
    // Use lodash-id must use insert methods
    this.db._.mixin(LodashID)
  }

  // read() is to keep the data of the main process and the rendering process up to date.
  read () {
    return this.db.read()
  }

  get (key: string) {
    return this.read()
      .get(key)
      .value()
  }

  find (key: string, id: number) {
    const data = this.read().get(key)
    if (typeof id !== 'object') {
      return data.find({ id }).value()
    } else {
      return data.find(id).value()
    }
  }

  set (key: string, value: any) {
    return this.read()
      .set(key, value)
      .write()
  }

  insert (key: string, value: any) {
    const data = this.read().get(key)
    return data.insert(value).write()
  }

  update (key: string, id: number, value: any) {
    const data = this.read().get(key)
    return data
      .find({ id })
      .assign(value)
      .write()
  }

  remove (key: string, id: number) {
    const data = this.read().get(key)
    return data.removeById(id).write()
  }

  filter (key: string, query: any) {
    const data = this.read().get(key)
    return data.filter(query).value()
  }

  has (key: string) {
    return this.read()
      .has(key)
      .value()
  }
}

export default new DB()
