import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Filter, BarChart3 } from 'lucide-react'
import type { ChartSpec } from '../types'
import { axisStyle, gridStyle, piePalette, seriesPalette, tooltipStyle, chartColors } from '../data/chartTheme'
import { cx } from '../lib/utils'

/**
 * 通用演示图表组件
 * - 支持 line / bar / area / pie / radar / hbar
 * - 支持维度筛选（例如「近 6 个月 / 近 12 个月」）
 * - 全部使用本地静态数据，不请求任何接口
 */
export function DemoChart({ spec, height = 280 }: { spec: ChartSpec; height?: number }) {
  const [filterId, setFilterId] = useState<string>(spec.filters?.[0]?.id ?? '')

  const data = useMemo(() => {
    if (spec.filters && spec.filters.length > 0) {
      return spec.filters.find((f) => f.id === filterId)?.data ?? spec.filters[0].data
    }
    return spec.data ?? []
  }, [spec, filterId])

  const labelOf = (key: string) => spec.seriesNames?.[key] ?? key

  return (
    <figure className="rounded-xl2 border border-line bg-white p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <figcaption className="min-w-0">
          <p className="flex items-center gap-2 font-serif text-[16px] font-semibold text-ink">
            <BarChart3 className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            {spec.title}
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{spec.desc}</p>
        </figcaption>

        {/* 维度筛选 */}
        {spec.filters && spec.filters.length > 0 && (
          <div className="flex shrink-0 items-center gap-1 rounded-lg border border-line bg-cream-soft p-1" role="group">
            <span className="pl-1.5 pr-0.5 text-ink-soft" aria-hidden="true">
              <Filter className="h-3.5 w-3.5" />
            </span>
            {spec.filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterId(f.id)}
                aria-pressed={filterId === f.id}
                className={cx(
                  'min-h-[32px] rounded-md px-2.5 text-[12px] font-medium transition-colors',
                  filterId === f.id ? 'bg-brand text-white' : 'text-ink-soft hover:text-brand',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: '100%', height }} role="img" aria-label={`${spec.title}：${spec.desc}`}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart(spec, data, labelOf)}
        </ResponsiveContainer>
      </div>

      {spec.unit && <p className="mt-2 text-right text-[11px] text-ink-soft">单位：{spec.unit}</p>}
    </figure>
  )
}

function renderChart(
  spec: ChartSpec,
  data: Record<string, any>[],
  labelOf: (k: string) => string,
): React.ReactElement {
  const palette = spec.colors ?? seriesPalette
  const catKey = spec.categoryKey
  const vKeys = spec.valueKeys

  switch (spec.kind) {
    case 'line':
      return (
        <LineChart data={data} margin={{ top: 6, right: 12, bottom: 0, left: -14 }}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={catKey ?? 'month'} {...axisStyle} />
          <YAxis {...axisStyle} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12, color: chartColors.inkSoft }} />
          {vKeys.map((k, i) => (
            <Line
              key={k}
              type="monotone"
              dataKey={k}
              name={labelOf(k)}
              stroke={palette[i % palette.length]}
              strokeWidth={2.4}
              dot={{ r: 3, strokeWidth: 0, fill: palette[i % palette.length] }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      )

    case 'area':
      return (
        <AreaChart data={data} margin={{ top: 6, right: 12, bottom: 0, left: -14 }}>
          <defs>
            {vKeys.map((k, i) => (
              <linearGradient key={k} id={`mfArea-${spec.title}-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={palette[i % palette.length]} stopOpacity={0.35} />
                <stop offset="95%" stopColor={palette[i % palette.length]} stopOpacity={0.04} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={catKey ?? 'month'} {...axisStyle} />
          <YAxis {...axisStyle} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12, color: chartColors.inkSoft }} />
          {vKeys.map((k, i) => (
            <Area
              key={k}
              type="monotone"
              dataKey={k}
              name={labelOf(k)}
              stroke={palette[i % palette.length]}
              strokeWidth={2.2}
              fill={`url(#mfArea-${spec.title}-${i})`}
            />
          ))}
        </AreaChart>
      )

    case 'bar':
      return (
        <BarChart data={data} margin={{ top: 6, right: 12, bottom: 0, left: -14 }}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={catKey ?? 'name'} {...axisStyle} interval={0} tick={{ ...axisStyle.tick, fontSize: 11 }} />
          <YAxis {...axisStyle} />
          <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(231,213,197,0.35)' }} />
          <Legend wrapperStyle={{ fontSize: 12, color: chartColors.inkSoft }} />
          {vKeys.map((k, i) => (
            <Bar
              key={k}
              dataKey={k}
              name={labelOf(k)}
              fill={palette[i % palette.length]}
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
          ))}
        </BarChart>
      )

    case 'hbar':
      return (
        <BarChart data={data} layout="vertical" margin={{ top: 6, right: 20, bottom: 0, left: 12 }}>
          <CartesianGrid {...gridStyle} vertical horizontal={false} />
          <XAxis type="number" {...axisStyle} />
          <YAxis
            type="category"
            dataKey={catKey ?? 'name'}
            width={92}
            {...axisStyle}
            tick={{ ...axisStyle.tick, fontSize: 12 }}
          />
          <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(231,213,197,0.35)' }} />
          {vKeys.map((k, i) => (
            <Bar
              key={k}
              dataKey={k}
              name={labelOf(k)}
              fill={palette[i % palette.length]}
              radius={[0, 6, 6, 0]}
              maxBarSize={22}
            />
          ))}
        </BarChart>
      )

    case 'pie': {
      const vk = vKeys[0]
      return (
        <PieChart>
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12, color: chartColors.inkSoft }} />
          <Pie
            data={data}
            dataKey={vk}
            nameKey={catKey ?? 'name'}
            cx="50%"
            cy="50%"
            innerRadius="46%"
            outerRadius="74%"
            paddingAngle={2}
            label={({ percent }) => `${Math.round((percent ?? 0) * 100)}%`}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={piePalette[i % piePalette.length]} />
            ))}
          </Pie>
        </PieChart>
      )
    }

    case 'radar':
      return (
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke={chartColors.line} />
          <PolarAngleAxis dataKey={catKey ?? 'name'} tick={{ fill: chartColors.inkSoft, fontSize: 12 }} />
          <PolarRadiusAxis tick={{ fill: chartColors.inkSoft, fontSize: 10 }} angle={90} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12, color: chartColors.inkSoft }} />
          {vKeys.map((k, i) => (
            <Radar
              key={k}
              dataKey={k}
              name={labelOf(k)}
              stroke={palette[i % palette.length]}
              fill={palette[i % palette.length]}
              fillOpacity={0.22}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      )

    default:
      return <LineChart data={data} />
  }
}
