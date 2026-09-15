/**
 * 后端接口访问层（点击量统计）。
 *
 * 部署方式与接口地址：
 * - Docker / Nginx 同源部署：由 Nginx 把 /api 反向代理到后端容器，VITE_API_BASE 留空即可。
 * - 本地开发：Vite 已配置 /api 代理，VITE_API_BASE 同样留空即可。
 * - 前端单独部署（如 GitHub Pages）：构建时设置 VITE_API_BASE 指向后端地址。
 */
const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/+$/, '')

export type ClickStats = {
  /** 网站累计点击量，以后端返回为准 */
  total: number
  /** 后端最后一次统计时间（ISO 字符串） */
  updatedAt: string
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
    ...init,
  })
  if (!response.ok) {
    throw new Error(`请求 ${path} 失败：HTTP ${response.status}`)
  }
  return (await response.json()) as T
}

/** 读取后端累计点击量 */
export function fetchClickStats(): Promise<ClickStats> {
  return requestJson<ClickStats>('/api/clicks')
}

/** 上报一次有效点击，返回后端 +1 后的最新累计值 */
export function reportClick(): Promise<ClickStats> {
  return requestJson<ClickStats>('/api/clicks', { method: 'POST' })
}
