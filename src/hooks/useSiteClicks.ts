import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchClickStats, reportClick } from '../lib/api'

export type ClickStatsState = 'loading' | 'ready' | 'offline'

/** 同一标签页内只把首次进入计为一次访问，避免刷新页面重复累加 */
const VISIT_FLAG = 'mf-click-visit-counted'

/**
 * 网站点击量统计。
 *
 * 数据来源唯一：后端 /api/clicks。
 * 前端只做两件事：读取累计值、在有效点击后请求 +1；
 * sessionStorage 只用于标记“本次访问已计数”，不保存任何累计数据。
 */
export function useSiteClicks() {
  const [total, setTotal] = useState<number | null>(null)
  const [state, setState] = useState<ClickStatsState>('loading')
  const reporting = useRef(false)

  useEffect(() => {
    let active = true

    fetchClickStats()
      .then((stats) => {
        if (!active) return
        setTotal(stats.total)
        setState('ready')
      })
      .catch(() => {
        if (active) setState('offline')
      })

    // 首次进入站点记一次访问点击；先落标记再请求，避免开发模式重复挂载导致重复计数。
    if (!window.sessionStorage.getItem(VISIT_FLAG)) {
      window.sessionStorage.setItem(VISIT_FLAG, '1')
      reportClick()
        .then((stats) => {
          if (!active) return
          setTotal(stats.total)
          setState('ready')
        })
        .catch(() => {
          window.sessionStorage.removeItem(VISIT_FLAG)
          if (active) setState((prev) => (prev === 'ready' ? prev : 'offline'))
        })
    }

    return () => {
      active = false
    }
  }, [])

  /** 有效点击发生后调用（例如点击登录按钮）；累计值始终以后端返回为准 */
  const trackClick = useCallback(async () => {
    if (reporting.current) return
    reporting.current = true
    try {
      const stats = await reportClick()
      setTotal(stats.total)
      setState('ready')
    } catch {
      // 上报失败时不清空已有数值，只是不再显示为实时可用
      setState((prev) => (prev === 'ready' ? prev : 'offline'))
    } finally {
      reporting.current = false
    }
  }, [])

  return { total, state, trackClick }
}
