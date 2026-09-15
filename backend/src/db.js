import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

/**
 * 点击量数据层：SQLite（使用 Node 内置 node:sqlite，无原生编译依赖）。
 *
 * 数据库文件路径由 DB_PATH 指定，容器中指向挂载卷 /data/clicks.db，
 * 因此容器重建、重新部署与服务器重启都不会丢失数据。
 */
export const databaseFile = resolve(process.env.DB_PATH ?? './data/clicks.db')

mkdirSync(dirname(databaseFile), { recursive: true })

const db = new DatabaseSync(databaseFile)

// WAL 提升写入安全性与并发表现；busy_timeout 避免短时锁竞争直接报错。
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA busy_timeout = 5000')

// 单行计数表：id 固定为 1，累计值只允许通过 total = total + 1 变化。
db.exec(`
  CREATE TABLE IF NOT EXISTS site_clicks (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    total INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0),
    updated_at TEXT NOT NULL
  )
`)

db.prepare('INSERT OR IGNORE INTO site_clicks (id, total, updated_at) VALUES (1, 0, ?)').run(
  new Date().toISOString(),
)

const selectStatement = db.prepare('SELECT total, updated_at FROM site_clicks WHERE id = 1')
const increaseStatement = db.prepare(
  'UPDATE site_clicks SET total = total + 1, updated_at = ? WHERE id = 1 RETURNING total, updated_at',
)

/** 读取当前累计点击量 */
export function readClicks() {
  const row = selectStatement.get()
  return { total: Number(row.total), updatedAt: String(row.updated_at) }
}

/** 累计 +1 并返回最新值：单条 UPDATE 语句，原子性由 SQLite 保证 */
export function addClick() {
  const row = increaseStatement.get(new Date().toISOString())
  return { total: Number(row.total), updatedAt: String(row.updated_at) }
}

export function closeDatabase() {
  db.close()
}
