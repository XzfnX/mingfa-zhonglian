import { useState } from 'react'
import { ChevronDown, Workflow, PackageCheck, RefreshCw, ArrowRight } from 'lucide-react'
import { cooperationFlow, standardDeliverables, reinvestLoop, reinvestStatement, cooperationModes } from '../data/projectResults'
import { SectionHeading } from './Ui'
import { cx } from '../lib/utils'

/** 标准合作流程：可逐步展开 */
export function CooperationFlow() {
  const [openId, setOpenId] = useState<string | null>(cooperationFlow[0]?.id ?? null)

  return (
    <section aria-labelledby="coop-flow-title" className="scroll-mt-24">
      <SectionHeading
        eyebrow="合作方式与标准交付"
        title="从需求诊断到持续优化的八步合作流程"
        desc="每一次合作都按同一套标准流程推进，确保内容专业、过程可追溯、成果可评估。"
        className="mb-8"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 左侧：流程步骤 */}
        <div>
          <h3 id="coop-flow-title" className="mb-3 flex items-center gap-2 font-serif text-[17px] font-semibold text-ink">
            <Workflow className="h-4.5 w-4.5 text-brand" aria-hidden="true" />
            标准合作流程
          </h3>
          <ol className="space-y-2">
            {cooperationFlow.map((f, i) => {
              const open = openId === f.id
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : f.id)}
                    aria-expanded={open}
                    className={cx(
                      'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors',
                      open ? 'border-brand bg-white' : 'border-line bg-white hover:border-brand/40',
                    )}
                  >
                    <span
                      className={cx(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-semibold',
                        open ? 'bg-brand text-white' : 'bg-cream text-brand',
                      )}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-semibold text-ink">{f.title}</span>
                      <span className={cx('mt-0.5 block text-[12px] leading-relaxed text-ink-soft', !open && 'line-clamp-1')}>
                        {f.desc}
                      </span>
                    </span>
                    <ChevronDown
                      className={cx('h-4 w-4 shrink-0 text-ink-soft transition-transform', open && 'rotate-180')}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        {/* 右侧：交付成果 + 合作方式 */}
        <div className="space-y-6">
          <div className="rounded-xl2 border border-line bg-white p-5">
            <h3 className="mb-3 flex items-center gap-2 font-serif text-[17px] font-semibold text-ink">
              <PackageCheck className="h-4.5 w-4.5 text-brand" aria-hidden="true" />
              标准交付成果
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {standardDeliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-center gap-2 rounded-lg border border-line bg-cream-soft px-3 py-2.5 text-[13px] text-ink"
                >
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] leading-relaxed text-ink-soft">
              具体交付内容与范围以双方沟通确认的方案与书面协议为准，本页不展示价格信息。
            </p>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-5">
            <h3 className="mb-3 font-serif text-[17px] font-semibold text-ink">六类合作方式</h3>
            <ul className="divide-y divide-line">
              {cooperationModes.map((m) => (
                <li key={m.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-[14px] font-semibold text-ink">{m.name}</p>
                  <p className="mt-0.5 text-[12px] text-ink-soft">面向对象：{m.target}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{m.desc}</p>
                  <p className="mt-1.5 flex flex-wrap gap-1.5">
                    {m.outputs.map((o) => (
                      <span key={o} className="mf-tag">
                        {o}
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/** 公益反哺闭环 */
export function ReinvestLoop() {
  return (
    <section aria-labelledby="reinvest-title" className="scroll-mt-24">
      <SectionHeading
        eyebrow="商业合作与公益反哺"
        title="机构合作如何反哺群众公益服务"
        desc={reinvestStatement}
        className="mb-8"
      />

      <div className="rounded-xl2 border border-line bg-white p-5 sm:p-6">
        <h3 id="reinvest-title" className="mb-5 flex items-center gap-2 font-serif text-[17px] font-semibold text-ink">
          <RefreshCw className="h-4.5 w-4.5 text-brand" aria-hidden="true" />
          可持续闭环
        </h3>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reinvestLoop.map((s, i) => (
            <li key={s.step} className="relative rounded-xl border border-line bg-cream-soft p-4">
              <p className="font-serif text-[22px] font-semibold leading-none text-gold-deep" aria-hidden="true">
                {s.step}
              </p>
              <p className="mt-2.5 text-[15px] font-semibold text-ink">{s.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{s.desc}</p>
              {/* 箭头（仅桌面端显示，避免移动端视觉噪音） */}
              {i < reinvestLoop.length - 1 && (
                <ArrowRight
                  className="absolute -right-2.5 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-gold-deep lg:block"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-xl border-l-4 border-l-brand border border-line bg-cream px-4 py-3.5">
          <p className="text-[14px] leading-relaxed text-ink">
            <span className="font-semibold text-brand">公益承诺：</span>
            核心群众服务保持免费。机构合作收入主要用于平台维护、专业内容生产、志愿者培训和公益普法服务扩展。
          </p>
        </div>
      </div>
    </section>
  )
}
