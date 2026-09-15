/** 小工具函数集合 */

/** 合并 className */
export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

/** 关键词高亮切片：把文本按关键词切成片段 */
export function highlightParts(text: string, keyword: string): { text: string; hit: boolean }[] {
  if (!keyword.trim()) return [{ text, hit: false }]
  const k = keyword.trim()
  const parts: { text: string; hit: boolean }[] = []
  let rest = text
  let guard = 0
  while (rest.length > 0 && guard < 200) {
    guard += 1
    const idx = rest.toLowerCase().indexOf(k.toLowerCase())
    if (idx === -1) {
      parts.push({ text: rest, hit: false })
      break
    }
    if (idx > 0) parts.push({ text: rest.slice(0, idx), hit: false })
    parts.push({ text: rest.slice(idx, idx + k.length), hit: true })
    rest = rest.slice(idx + k.length)
  }
  return parts
}

/** 数字千分位 */
export function formatNumber(n: number) {
  return n.toLocaleString('zh-CN')
}

/** 生成稳定的演示 ID（不含真实个人信息） */
export function demoRefId(prefix: string) {
  const t = Date.now().toString().slice(-6)
  const r = Math.floor(Math.random() * 900 + 100)
  return `${prefix}-${t}${r}`
}

/** 滚动到锚点（配合 hash 路由使用） */
export function scrollToAnchor(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
