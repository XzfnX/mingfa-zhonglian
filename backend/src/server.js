import express from 'express'
import { addClick, closeDatabase, databaseFile, readClicks } from './db.js'

const app = express()
const port = Number(process.env.PORT ?? 4000)

app.disable('x-powered-by')
app.set('trust proxy', true)
app.use(express.json({ limit: '16kb' }))

/**
 * 可选跨域白名单：同源部署（Nginx 反向代理 / Vite 代理）时无需配置。
 * 仅当前端独立部署在其它域名（例如 GitHub Pages）时才需要设置 ALLOWED_ORIGIN。
 */
const allowedOrigin = process.env.ALLOWED_ORIGIN?.trim()
if (allowedOrigin) {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') {
      res.sendStatus(204)
      return
    }
    next()
  })
}

/** 健康检查：供 Docker healthcheck 与运维探活使用 */
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ...readClicks() })
})

/** 获取当前网站累计点击量 */
app.get('/api/clicks', (req, res) => {
  res.json(readClicks())
})

/** 有效点击上报：累计 +1，返回最新点击量 */
app.post('/api/clicks', (req, res) => {
  res.json(addClick())
})

app.use('/api', (req, res) => {
  res.status(404).json({ error: '接口不存在' })
})

app.use((error, _req, res, _next) => {
  console.error('[api] 处理请求失败：', error)
  res.status(500).json({ error: '服务器内部错误' })
})

const server = app.listen(port, () => {
  console.log(`[api] 已启动：http://0.0.0.0:${port}（数据库：${databaseFile}）`)
})

function shutdown(signal) {
  console.log(`[api] 收到 ${signal}，正在关闭服务`)
  server.close(() => {
    closeDatabase()
    process.exit(0)
  })
  // 兜底：连接迟迟不释放时强制退出，避免容器停滞
  setTimeout(() => process.exit(1), 5000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
