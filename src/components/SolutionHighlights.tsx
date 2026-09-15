import { ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react'
import type { InstitutionSolution } from '../types'
import { heatColor } from '../data/chartTheme'
import { cx } from '../lib/utils'

/**
 * 方案特色展示块
 * 支持 heatmap / ranking / progress / feedback / awareness / timeline 六种形态
 * 数据全部为本地静态模拟数据。
 */
export function SolutionHighlights({ solution }: { solution: InstitutionSolution }) {
  if (!solution.highlights || solution.highlights.length === 0) return null

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {solution.highlights.map((h) => (
        <section
          key={h.title}
          className={cx(
            'rounded-xl2 border border-line bg-white p-5',
            // 热力图与排行榜需要更宽的空间
            (h.kind === 'heatmap' || h.kind === 'ranking') && 'lg:col-span-2',
          )}
          aria-labelledby={`hl-${h.title}`}
        >
          <h3 id={`hl-${h.title}`} className="font-serif text-[16px] font-semibold text-ink">
            {h.title}
          </h3>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{h.desc}</p>
          <div className="mt-4">
            {h.kind === 'heatmap' && <Heatmap payload={h.payload} />}
            {h.kind === 'ranking' && <Ranking payload={h.payload} />}
            {h.kind === 'progress' && <Progress payload={h.payload} />}
            {h.kind === 'feedback' && <Feedback payload={h.payload} />}
            {h.kind === 'awareness' && <Awareness payload={h.payload} />}
            {h.kind === 'timeline' && <Timeline payload={h.payload} />}
          </div>
        </section>
      ))}
    </div>
  )
}

/* ---------- 热力图 ---------- */
function Heatmap({ payload }: { payload: { rows: string[]; cols: string[]; values: number[][] } }) {
  const max = Math.max(...payload.values.flat())
  return (
    <div className="mf-scrollbar overflow-x-auto">
      <table className="w-full min-w-[560px] border-separate border-spacing-1 text-[12px]">
        <caption className="sr-only">各社区在不同法律需求类型上的需求密度分布</caption>
        <thead>
          <tr>
            <th scope="col" className="w-24 text-left font-medium text-ink-soft">
              社区 \ 需求
            </th>
            {payload.cols.map((c) => (
              <th key={c} scope="col" className="px-1 py-1 text-center font-medium text-ink-soft">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payload.rows.map((r, ri) => (
            <tr key={r}>
              <th scope="row" className="pr-2 text-left font-medium text-ink">
                {r}
              </th>
              {payload.values[ri].map((v, ci) => {
                const dark = v / max > 0.6
                return (
                  <td key={ci} className="p-0">
                    <div
                      className={cx(
                        'flex h-9 items-center justify-center rounded-md text-[11px] font-semibold',
                        dark ? 'text-white' : 'text-ink',
                      )}
                      style={{ background: heatColor(v, max) }}
                      title={`${r} · ${payload.cols[ci]}：需求指数 ${v}`}
                    >
                      {v}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[11px] text-ink-soft">颜色越深表示该类型需求越集中（数值为演示用需求指数）。</p>
    </div>
  )
}

/* ---------- 排行榜 ---------- */
function Ranking({
  payload,
}: {
  payload: { name: string; count: number; trend: 'up' | 'down' | 'flat'; note: string }[]
}) {
  const sorted = [...payload].sort((a, b) => b.count - a.count)
  const max = sorted[0]?.count ?? 1
  return (
    <ol className="space-y-2.5">
      {sorted.map((item, i) => {
        const TrendIcon = item.trend === 'up' ? ArrowUp : item.trend === 'down' ? ArrowDown : Minus
        const trendTone =
          item.trend === 'up' ? 'text-brand-accent' : item.trend === 'down' ? 'text-success' : 'text-ink-soft'
        return (
          <li key={item.name} className="flex items-center gap-3">
            <span
              className={cx(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold',
                i < 3 ? 'bg-brand text-white' : 'border border-line bg-cream-soft text-ink-soft',
              )}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-[13px] font-medium text-ink">{item.name}</p>
                <p className="flex shrink-0 items-center gap-1 text-[12px] text-ink-soft">
                  <TrendIcon className={cx('h-3.5 w-3.5', trendTone)} aria-hidden="true" />
                  {item.count} 次
                </p>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-cream">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${Math.max(6, (item.count / max) * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-ink-soft">{item.note}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/* ---------- 进度 ---------- */
function Progress({ payload }: { payload: { name: string; plan: number; done: number }[] }) {
  return (
    <ul className="space-y-3.5">
      {payload.map((p) => {
        const rate = p.plan === 0 ? 0 : Math.round((p.done / p.plan) * 100)
        return (
          <li key={p.name}>
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-ink">{p.name}</span>
              <span className="text-ink-soft">
                {p.done} / {p.plan} 场 · {rate}%
              </span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-cream">
              <div
                className={cx('h-full rounded-full', rate >= 90 ? 'bg-success' : rate >= 70 ? 'bg-brand' : 'bg-warning')}
                style={{ width: `${rate}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- 群众反馈 ---------- */
function Feedback({ payload }: { payload: { type: string; count: number; sample: string }[] }) {
  const total = payload.reduce((s, x) => s + x.count, 0)
  return (
    <ul className="space-y-3">
      {payload.map((f) => (
        <li key={f.type} className="rounded-xl border border-line bg-cream-soft p-3.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-semibold text-ink">{f.type}</p>
            <p className="shrink-0 text-[12px] text-ink-soft">
              {f.count} 条 · {Math.round((f.count / total) * 100)}%
            </p>
          </div>
          <p className="mt-2 border-l-2 border-gold-deep pl-3 text-[12px] leading-relaxed text-ink-soft">{f.sample}</p>
        </li>
      ))}
    </ul>
  )
}

/* ---------- 认知变化 ---------- */
function Awareness({ payload }: { payload: { name: string; before: number; after: number }[] }) {
  return (
    <ul className="space-y-4">
      {payload.map((a) => {
        const gain = a.after - a.before
        return (
          <li key={a.name}>
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-ink">{a.name}</span>
              <span className="flex items-center gap-1 text-[12px] font-medium text-success">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />+{gain} 个百分点
              </span>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-10 shrink-0 text-[11px] text-ink-soft">活动前</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream">
                  <div className="h-full rounded-full bg-line" style={{ width: `${a.before}%` }} />
                </div>
                <span className="w-10 shrink-0 text-right text-[11px] text-ink-soft">{a.before}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-10 shrink-0 text-[11px] text-ink-soft">活动后</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${a.after}%` }} />
                </div>
                <span className="w-10 shrink-0 text-right text-[11px] font-semibold text-brand">{a.after}%</span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- 时间线 ---------- */
function Timeline({ payload }: { payload: { phase: string; title: string; desc: string }[] }) {
  return (
    <ol className="relative space-y-4 border-l border-line pl-5">
      {payload.map((t) => (
        <li key={t.title} className="relative">
          <span
            className="absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-white bg-brand"
            aria-hidden="true"
          />
          <p className="text-[11px] font-semibold tracking-wide text-brand">{t.phase}</p>
          <p className="mt-0.5 text-[14px] font-semibold text-ink">{t.title}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{t.desc}</p>
        </li>
      ))}
    </ol>
  )
}
