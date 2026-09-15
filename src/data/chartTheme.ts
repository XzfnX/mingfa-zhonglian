/**
 * 图表统一配置（Recharts）
 * 使用品牌色系：深红 / 品牌红 / 冷灰蓝 / 成功色 / 警示色
 */
export const chartColors = {
  brandDeep: '#741313',
  brand: '#9B1C1C',
  accent: '#B42323',
  gold: '#DDE5EC',
  goldDeep: '#5A738E',
  success: '#16815D',
  warning: '#B26A00',
  ink: '#172033',
  inkSoft: '#667085',
  line: '#DCE1E7',
}

/** 多系列调色板（避免过多高饱和红） */
export const seriesPalette = [
  '#9B1C1C',
  '#5A738E',
  '#16815D',
  '#B26A00',
  '#667085',
  '#741313',
]

export const piePalette = [
  '#9B1C1C',
  '#B26A00',
  '#5A738E',
  '#16815D',
  '#758195',
  '#B8C1CD',
]

/** 统一坐标轴样式 */
export const axisStyle = {
  tick: { fill: chartColors.inkSoft, fontSize: 12 },
  axisLine: { stroke: chartColors.line },
  tickLine: false as const,
}

export const gridStyle = {
  stroke: chartColors.line,
  strokeDasharray: '4 4',
  vertical: false as const,
}

export const tooltipStyle = {
  contentStyle: {
    borderRadius: 4,
    border: `1px solid ${chartColors.line}`,
    boxShadow: '0 6px 18px -12px rgba(17,24,39,0.24)',
    fontSize: 13,
  },
  labelStyle: { color: chartColors.ink, fontWeight: 600 },
}

/** 热力图色阶（浅灰红 → 品牌红） */
export function heatColor(value: number, max: number) {
  const ratio = max <= 0 ? 0 : Math.min(1, value / max)
  const from = [248, 238, 238]
  const to = [155, 28, 28]
  const rgb = from.map((c, i) => Math.round(c + (to[i] - c) * (0.15 + ratio * 0.85)))
  return `rgb(${rgb.join(',')})`
}
