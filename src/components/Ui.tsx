import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { cx } from '../lib/utils'

/* ============ 区块标题 ============ */
export function SectionHeading({
  id,
  eyebrow,
  title,
  desc,
  align = 'left',
  className,
  action,
}: {
  id?: string
  eyebrow?: string
  title: string
  desc?: string
  align?: 'left' | 'center'
  className?: string
  action?: ReactNode
}) {
  return (
    <div
      className={cx(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div className={cx('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        {eyebrow && <p className="mf-eyebrow mb-2">{eyebrow}</p>}
        <h2 id={id} className="mf-section-title">
          {title}
        </h2>
        {desc && <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{desc}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/* ============ 服务卡片 ============ */
export function ServiceCard({
  title,
  desc,
  points,
  icon: Icon,
  to,
  cta = '进入',
  tone = 'cream',
}: {
  title: string
  desc: string
  points?: string[]
  icon: LucideIcon
  to: string
  cta?: string
  tone?: 'cream' | 'white'
}) {
  return (
    <div
      className={cx(
        'group flex flex-col rounded-xl2 border border-line p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card',
        tone === 'cream' ? 'bg-white' : 'bg-cream-soft',
      )}
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-cream text-brand">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-serif text-[18px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">{desc}</p>
      {points && points.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {points.map((p) => (
            <li key={p} className="mf-tag">
              {p}
            </li>
          ))}
        </ul>
      )}
      <Link
        to={to}
        className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-medium text-brand hover:underline"
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </div>
  )
}

/* ============ 指标卡 ============ */
export function MetricCard({
  label,
  value,
  sub,
  tone = 'white',
}: {
  label: string
  value: string
  sub?: string
  tone?: 'white' | 'brand'
}) {
  const isBrand = tone === 'brand'
  return (
    <div
      className={cx(
        'rounded-xl2 border p-5',
        isBrand ? 'border-brand-deep bg-brand text-white' : 'border-line bg-white',
      )}
    >
      <p className={cx('text-[13px]', isBrand ? 'text-white/75' : 'text-ink-soft')}>{label}</p>
      <p className={cx('mt-2 font-serif text-[26px] font-semibold leading-none', isBrand && 'text-white')}>
        {value}
      </p>
      {sub && <p className={cx('mt-2 text-[12px] leading-relaxed', isBrand ? 'text-white/70' : 'text-ink-soft')}>{sub}</p>}
    </div>
  )
}

/* ============ 交付物列表 ============ */
export function DeliverableList({
  items,
  activeId,
  onSelect,
}: {
  items: { id: string; name: string; format: string; scene: string; detail: string[]; audience: string }[]
  activeId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {/* 列表 */}
      <ul className="space-y-2 md:col-span-2" aria-label="标准交付物列表">
        {items.map((d) => {
          const active = activeId === d.id
          return (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => onSelect(d.id)}
                aria-pressed={active}
                className={cx(
                  'w-full rounded-xl border px-4 py-3 text-left transition-colors',
                  active
                    ? 'border-brand bg-brand text-white'
                    : 'border-line bg-white text-ink hover:border-brand/40 hover:bg-cream-soft',
                )}
              >
                <span className="block text-[14px] font-semibold">{d.name}</span>
                <span className={cx('mt-1 block text-[12px]', active ? 'text-white/75' : 'text-ink-soft')}>
                  {d.format}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* 详情 */}
      <div className="md:col-span-3">
        {items
          .filter((d) => d.id === activeId)
          .map((d) => (
            <div key={d.id} className="h-full rounded-xl2 border border-line bg-white p-5 animate-fade-in">
              <h4 className="font-serif text-[18px] font-semibold text-ink">{d.name}</h4>
              <p className="mt-1 text-[12px] text-ink-soft">交付格式：{d.format}</p>
              <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">{d.scene}</p>
              <div className="mt-4">
                <p className="mb-2 text-[13px] font-semibold text-ink">包含内容</p>
                <ul className="space-y-1.5">
                  {d.detail.map((t) => (
                    <li key={t} className="flex gap-2 text-[14px] text-ink-soft">
                      <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 rounded-lg border border-line bg-cream-soft px-3 py-2 text-[12px] text-ink-soft">
                适用对象：{d.audience}
              </p>
            </div>
          ))}
        {!activeId && (
          <div className="flex h-full items-center justify-center rounded-xl2 border border-dashed border-line bg-white/60 p-8 text-center text-[14px] text-ink-soft">
            请点击左侧交付物查看详细说明
          </div>
        )}
      </div>
    </div>
  )
}

/* ============ 空状态 ============ */
export function EmptyState({
  icon: Icon,
  title,
  desc,
  action,
}: {
  icon: LucideIcon
  title: string
  desc: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-xl2 border border-dashed border-line bg-white/70 px-6 py-12 text-center">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-cream text-brand">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-4 font-serif text-[17px] font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-soft">{desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/* ============ 徽标 ============ */
export function Pill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'brand' | 'gold' | 'success' | 'warning'
}) {
  const tones: Record<string, string> = {
    neutral: 'border-line bg-cream-soft text-ink-soft',
    brand: 'border-brand/30 bg-brand/5 text-brand',
    gold: 'border-gold-deep/40 bg-gold/40 text-brand-deep',
    success: 'border-success/30 bg-success/5 text-success',
    warning: 'border-warning/30 bg-warning/5 text-warning',
  }
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium', tones[tone])}>
      {children}
    </span>
  )
}
