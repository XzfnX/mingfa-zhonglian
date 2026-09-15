import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarCheck,
  Layers,
  BarChart3,
  PackageCheck,
  Target,
  TrendingUp,
  ChevronDown,
  ListChecks,
} from 'lucide-react'
import { MetricCard, Pill, SectionHeading } from '../components/Ui'
import { DemoChart } from '../components/DemoChart'
import { SolutionHighlights } from '../components/SolutionHighlights'
import { DeliverableList } from '../components/Ui'
import { DemoRequestModal } from '../components/DemoRequestModal'
import { Disclaimer } from '../components/Disclaimer'
import { institutionSolutions, institutionTypeLabel } from '../data/institutionSolutions'
import { cooperationFlow } from '../data/projectResults'
import { useAuth } from '../context/AuthContext'
import { cx } from '../lib/utils'
import NotFoundPage from './NotFoundPage'

/** B 端方案详情页（通过路由参数加载对应行业方案） */
export default function InstitutionSolutionPage({ solutionId, adminView = false }: { solutionId: string; adminView?: boolean }) {
  const solution = institutionSolutions.find((s) => s.id === solutionId)
  const { user } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeDeliverable, setActiveDeliverable] = useState<string | null>(null)
  const [openModule, setOpenModule] = useState<string | null>(null)

  if (!solution) return <NotFoundPage />

  const homePath = adminView ? '/admin' : '/institution'

  return (
    <div className="space-y-8">
      {/* 返回 */}
      <nav>
        <Link to={homePath} className="mf-btn-ghost gap-1.5 px-3 text-[13px]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回方案总览
        </Link>
      </nav>

      {/* 方案头部 */}
      <header className="rounded-xl2 border border-line bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="brand">{institutionTypeLabel[solution.id]}解决方案</Pill>
              <Pill tone="gold">{adminView ? '管理员查看' : '本机构方案'}</Pill>
            </div>
            <h1 className="mt-3 font-serif text-[24px] font-semibold leading-snug text-ink sm:text-[28px]">
              {solution.productName}
            </h1>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{solution.tagline}</p>
            <p className="mt-3 text-[13px] text-ink-soft">
              <span className="font-medium text-ink">适用对象：</span>
              {solution.audience}
            </p>
          </div>
          <button type="button" onClick={() => setModalOpen(true)} className="mf-btn-primary gap-1.5">
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            方案咨询
          </button>
        </div>

        {/* 关键指标 */}
        <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {solution.metrics.map((m, i) => (
            <div key={m.label}>
              <MetricCard label={m.label} value={m.value} sub={m.sub} tone={i === 0 ? 'brand' : 'white'} />
            </div>
          ))}
        </dl>
      </header>

      {/* 需求痛点 */}
      <section aria-labelledby="pain-title" className="rounded-xl2 border border-line bg-white p-6">
        <h2 id="pain-title" className="flex items-center gap-2 font-serif text-[19px] font-semibold text-ink">
          <Target className="h-5 w-5 text-brand" aria-hidden="true" />
          我们解决的核心问题
        </h2>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {solution.painPoints.map((p) => (
            <li
              key={p}
              className="flex gap-2.5 rounded-lg border border-line bg-cream-soft px-3.5 py-3 text-[13px] leading-relaxed text-ink-soft"
            >
              <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* 核心功能模块 */}
      <section aria-labelledby="modules-title">
        <SectionHeading
          id="modules-title"
          eyebrow="核心功能模块"
          title={`${solution.modules.length} 个核心模块构成完整产品能力`}
          desc="点击任意模块可展开查看具体功能要点。"
          className="mb-6"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solution.modules.map((m, i) => {
            const open = openModule === m.id
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setOpenModule(open ? null : m.id)}
                  aria-expanded={open}
                  className={cx(
                    'flex h-full w-full flex-col rounded-xl2 border p-5 text-left transition-colors',
                    open ? 'border-brand bg-white shadow-card' : 'border-line bg-white hover:border-brand/40',
                  )}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-cream text-[13px] font-semibold text-brand">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <ChevronDown
                      className={cx('h-4 w-4 shrink-0 text-ink-soft transition-transform', open && 'rotate-180')}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-3.5 block font-serif text-[16px] font-semibold leading-snug text-ink">
                    {m.name}
                  </span>
                  <span className="mt-2 block text-[13px] leading-relaxed text-ink-soft">{m.desc}</span>
                  {open && (
                    <ul className="mt-3.5 w-full space-y-1.5 border-t border-line pt-3.5 animate-fade-in">
                      {m.points.map((p) => (
                        <li key={p} className="flex gap-2 text-[12px] leading-relaxed text-ink-soft">
                          <ListChecks className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* 演示图表 */}
      <section aria-labelledby="charts-title">
        <SectionHeading
          id="charts-title"
          eyebrow="成效评估看板"
          title="数据化展示普法工作开展情况"
          desc="图表支持维度筛选与悬停查看具体数值。"
          className="mb-6"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {solution.charts.map((c) => (
            <DemoChart key={c.title} spec={c} />
          ))}
        </div>
      </section>

      {/* 特色分析看板 */}
      {solution.highlights && solution.highlights.length > 0 && (
        <section aria-labelledby="highlights-title">
          <SectionHeading
            id="highlights-title"
            eyebrow="特色分析看板"
            title="从数据到行动的分析视角"
            desc="这些看板帮助机构把零散的普法工作数据转化为可用于决策和汇报的材料。"
            className="mb-6"
          />
          <SolutionHighlights solution={solution} />
        </section>
      )}

      {/* 标准交付物 */}
      <section aria-labelledby="deliverables-title">
        <SectionHeading
          id="deliverables-title"
          eyebrow="标准交付物"
          title="合作后可以获得哪些成果"
          desc="点击左侧交付物查看具体包含内容与适用对象。交付范围以双方正式沟通确认为准，本页不展示价格信息。"
          className="mb-6"
        />
        <DeliverableList
          items={solution.deliverables}
          activeId={activeDeliverable}
          onSelect={(id) => setActiveDeliverable(activeDeliverable === id ? null : id)}
        />
      </section>

      {/* 交付流程 */}
      <section aria-labelledby="flow-title" className="rounded-xl2 border border-line bg-white p-6">
        <h2 id="flow-title" className="flex items-center gap-2 font-serif text-[19px] font-semibold text-ink">
          <TrendingUp className="h-5 w-5 text-brand" aria-hidden="true" />
          项目推进流程
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          本方案按统一的八步流程推进，确保需求、内容、执行与评估各环节可追溯。
        </p>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cooperationFlow.map((f) => (
            <li key={f.id} className="rounded-xl border border-line bg-cream-soft p-3.5">
              <p className="text-[11px] font-semibold tracking-wide text-brand">{f.phase}</p>
              <p className="mt-1 text-[14px] font-semibold text-ink">{f.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{f.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 方案说明与声明 */}
      {solution.statement && (
        <Disclaimer title="产品边界说明" text={solution.statement} />
      )}

      <div className="rounded-xl2 border border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-cream text-brand">
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-serif text-[18px] font-semibold text-ink">想进一步了解这套方案？</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                我们可以结合你所在机构的人群结构、场地条件与考核重点，给出定制化的实施建议。
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setModalOpen(true)} className="mf-btn-primary gap-1.5">
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              方案咨询
            </button>
            <Link to={homePath} className="mf-btn-outline gap-1.5">
              <Layers className="h-4 w-4" aria-hidden="true" />
              {adminView ? '返回管理总览' : '返回工作台'}
            </Link>
          </div>
        </div>
      </div>

      {adminView && <section aria-labelledby="switch-title">
        <h2 id="switch-title" className="mb-4 flex items-center gap-2 font-serif text-[18px] font-semibold text-ink">
          <PackageCheck className="h-4.5 w-4.5 text-brand" aria-hidden="true" />
          切换查看其他行业方案
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {institutionSolutions.map((s) => {
            const current = s.id === solution.id
            return (
              <li key={s.id}>
                <Link
                  to={`/admin/${s.id}`}
                  aria-current={current ? 'page' : undefined}
                  className={cx(
                    'block h-full rounded-xl2 border p-4 transition-colors',
                    current ? 'border-brand bg-brand/5' : 'border-line bg-white hover:border-brand/40',
                  )}
                >
                  <p className="text-[12px] text-ink-soft">{institutionTypeLabel[s.id]}</p>
                  <p className="mt-1 text-[14px] font-semibold leading-snug text-ink">{s.productName}</p>
                  {current && <p className="mt-2 text-[12px] font-medium text-brand">当前正在浏览</p>}
                </Link>
              </li>
            )
          })}
        </ul>
      </section>}

      <DemoRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultOrg={user?.orgName}
        defaultSolution={solution.productName}
      />
    </div>
  )
}
