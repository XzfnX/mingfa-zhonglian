import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Building2,
  GraduationCap,
  HeartHandshake,
  BarChart3,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  Footprints,
  School,
  Briefcase,
  Landmark,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading, MetricCard, Pill } from '../components/Ui'
import { DemoChart } from '../components/DemoChart'
import { CooperationFlow, ReinvestLoop } from '../components/CooperationFlow'
import { DemoRequestModal } from '../components/DemoRequestModal'
import {
  resultMetrics,
  PROJECT_RESULT_LABEL,
  activities,
  brandValues,
  projectHighlights,
} from '../data/projectResults'
import { formatNumber, cx } from '../lib/utils'
import type { ActivityItem } from '../types'

const activityIcons: Record<ActivityItem['visual'], LucideIcon> = {
  community: Users,
  campus: School,
  enterprise: Briefcase,
  village: Footprints,
  institution: Landmark,
}

const highlightIcons: Record<string, LucideIcon> = {
  GraduationCap,
  Footprints,
  MonitorSmartphone: BarChart3,
  BarChart3,
}

/** 项目成果页用图表（本地模拟数据） */
const resultCharts = [
  {
    kind: 'line' as const,
    title: '服务人次月度趋势',
    desc: '线上服务人次与线下活动参与人次的月度变化，用于说明双轨模式的推进节奏。',
    unit: '人次',
    filters: [
      {
        id: 'r6',
        label: '近 6 个月',
        data: [
          { month: '4 月', 线上: 980, 线下: 320 },
          { month: '5 月', 线上: 1240, 线下: 460 },
          { month: '6 月', 线上: 1520, 线下: 520 },
          { month: '7 月', 线上: 1380, 线下: 610 },
          { month: '8 月', 线上: 1720, 线下: 580 },
          { month: '9 月', 线上: 1960, 线下: 640 },
        ],
      },
      {
        id: 'r12',
        label: '近 12 个月',
        data: [
          { month: '10 月', 线上: 620, 线下: 210 },
          { month: '11 月', 线上: 700, 线下: 260 },
          { month: '12 月', 线上: 880, 线下: 340 },
          { month: '1 月', 线上: 760, 线下: 240 },
          { month: '2 月', 线上: 690, 线下: 180 },
          { month: '3 月', 线上: 910, 线下: 380 },
          { month: '4 月', 线上: 980, 线下: 320 },
          { month: '5 月', 线上: 1240, 线下: 460 },
          { month: '6 月', 线上: 1520, 线下: 520 },
          { month: '7 月', 线上: 1380, 线下: 610 },
          { month: '8 月', 线上: 1720, 线下: 580 },
          { month: '9 月', 线上: 1960, 线下: 640 },
        ],
      },
    ],
    valueKeys: ['线上', '线下'],
  },
  {
    kind: 'pie' as const,
    title: '普法主题构成',
    desc: '项目开展的普法内容与活动在各主题上的分布比例。',
    categoryKey: 'name',
    valueKeys: ['value'],
    data: [
      { name: '反诈防骗', value: 26 },
      { name: '劳动权益', value: 19 },
      { name: '未成年人保护', value: 17 },
      { name: '婚姻家庭', value: 14 },
      { name: '物业与邻里', value: 13 },
      { name: '老年人权益', value: 11 },
    ],
  },
  {
    kind: 'bar' as const,
    title: '活动覆盖规模',
    desc: '各类活动累计覆盖的参与人次对比。',
    unit: '人次',
    categoryKey: 'name',
    valueKeys: ['人次'],
    data: [
      { name: '社区法治集市', 人次: 2860 },
      { name: '校园模拟法庭', 人次: 1940 },
      { name: '乡村普法下乡', 人次: 1480 },
      { name: '企业合规课堂', 人次: 1260 },
      { name: '老年人专题', 人次: 980 },
      { name: '法治议事角', 人次: 640 },
    ],
  },
  {
    kind: 'radar' as const,
    title: '四类场景能力评估',
    desc: '项目在四类实践场景上的能力成熟度自评（满分 100，用于说明可复制能力分布）。',
    categoryKey: 'name',
    valueKeys: ['成熟度'],
    data: [
      { name: '社区场景', 成熟度: 88 },
      { name: '校园场景', 成熟度: 82 },
      { name: '乡村场景', 成熟度: 74 },
      { name: '企业场景', 成熟度: 70 },
      { name: '机构协同', 成熟度: 78 },
    ],
  },
]

const typeFilters: ('全部' | ActivityItem['type'])[] = ['全部', '线下普法', '校园法治', '社区服务', '企业培训', '乡村普法']

export default function ResultsPage() {
  const [typeFilter, setTypeFilter] = useState<'全部' | ActivityItem['type']>('全部')
  const [modalOpen, setModalOpen] = useState(false)

  const filteredActivities = activities.filter((a) => typeFilter === '全部' || a.type === typeFilter)

  return (
    <>
      {/* 头部 */}
      <section className="border-b border-line bg-white py-12">
        <div className="mf-container">
          <div className="max-w-3xl">
            <p className="mf-eyebrow mb-2.5">项目成果</p>
            <h1 className="font-serif text-[30px] font-semibold leading-snug text-ink sm:text-[36px]">
              线下实践 + 线上服务，形成了可复用的普法能力
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
              项目以社区、乡村、校园、企业四类场景为载体开展沉浸式普法实践，同时把内容与服务能力沉淀到线上平台，
              形成「线下实践沉淀方法论、线上服务扩大覆盖面」的双轨模式。以下数据均为
              <span className="font-semibold text-ink">{PROJECT_RESULT_LABEL}</span>。
            </p>
          </div>
        </div>
      </section>

      {/* 核心指标 */}
      <section className="border-b border-line bg-cream py-12">
        <div className="mf-container">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {resultMetrics.map((m) => (
              <li key={m.id} className="rounded-xl2 border border-line bg-white p-5">
                <p className="font-serif text-[30px] font-semibold leading-none text-brand">
                  {m.id === 'online' ? formatNumber(m.value) : m.value}
                  <span className="ml-0.5 text-[15px] font-medium text-ink-soft">{m.suffix}</span>
                </p>
                <p className="mt-2.5 text-[14px] font-semibold text-ink">{m.label}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{m.desc}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-[12px] text-ink-soft">
            数据口径说明：线上服务人次包含普法内容阅读与咨询指引使用；活动场次含线上与线下各类普法活动。以上为阶段性统计，非实时后台数据。
          </p>
        </div>
      </section>

      {/* 图表 */}
      <section className="border-b border-line bg-white py-12">
        <div className="mf-container">
          <SectionHeading
            eyebrow="数据呈现"
            title="用数据说明服务的规模与结构"
            desc="以下图表为演示用模拟数据，用于展示项目的数据化表达能力。图表支持维度筛选与数值查看。"
            className="mb-8"
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {resultCharts.map((c) => (
              <DemoChart key={c.title} spec={c} />
            ))}
          </div>
        </div>
      </section>

      {/* 活动与成果展示 */}
      <section className="border-b border-line bg-cream-soft py-12">
        <div className="mf-container">
          <SectionHeading
            eyebrow="实践活动"
            title="四类场景的典型活动"
            desc="页面使用统一的抽象视觉表达活动场景，不使用虚构的现场照片、领导合影或媒体报道。"
            className="mb-6"
          />

          {/* 类型筛选 */}
          <ul className="mb-6 flex flex-wrap gap-2" role="group" aria-label="活动类型筛选">
            {typeFilters.map((t) => {
              const active = typeFilter === t
              const count = t === '全部' ? activities.length : activities.filter((a) => a.type === t).length
              return (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => setTypeFilter(t)}
                    aria-pressed={active}
                    className={cx(
                      'min-h-[40px] rounded-full border px-4 text-[13px] font-medium transition-colors',
                      active
                        ? 'border-brand bg-brand text-white'
                        : 'border-line bg-white text-ink-soft hover:border-brand/40 hover:text-brand',
                    )}
                  >
                    {t}
                    <span className={cx('ml-1.5 text-[12px]', active ? 'text-white/70' : 'text-ink-soft')}>{count}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredActivities.map((a) => {
              const Icon = activityIcons[a.visual]
              return (
                <li key={a.id} className="overflow-hidden rounded-xl2 border border-line bg-white">
                  <div
                    className="relative flex h-28 items-center justify-center overflow-hidden border-b border-line"
                    style={{ background: '#EEF0F3' }}
                    role="img"
                    aria-label={`${a.type}抽象示意插画`}
                  >
                    <svg className="absolute inset-0 h-full w-full opacity-45" aria-hidden="true">
                      <circle cx="88%" cy="18%" r="40" fill="#FFFFFF" fillOpacity="0.5" />
                      <circle cx="8%" cy="88%" r="52" fill="#FFFFFF" fillOpacity="0.32" />
                      <path d="M0 90 L140 34 L300 92 L470 28 L640 88" stroke="#9B1C1C" strokeOpacity="0.18" strokeWidth="2" fill="none" />
                    </svg>
                    <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl2 border border-white/60 bg-white/75 text-brand">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone="brand">{a.type}</Pill>
                      <span className="text-[12px] text-ink-soft">{a.date}</span>
                    </div>
                    <h3 className="mt-3 font-serif text-[16px] font-semibold leading-snug text-ink">{a.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{a.desc}</p>
                    <dl className="mt-3.5 space-y-1 border-t border-line pt-3 text-[12px]">
                      <div className="flex justify-between gap-3">
                        <dt className="text-ink-soft">开展地点</dt>
                        <dd className="text-right font-medium text-ink">{a.place}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-ink-soft">覆盖规模</dt>
                        <dd className="text-right font-medium text-ink">{a.scale}</dd>
                      </div>
                    </dl>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* 项目亮点 */}
      <section className="border-b border-line bg-white py-12">
        <div className="mf-container">
          <SectionHeading
            eyebrow="能力沉淀"
            title="项目沉淀下来的四类能力"
            className="mb-6"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projectHighlights.map((h) => {
              const Icon = highlightIcons[h.icon] ?? Sparkles
              return (
                <li key={h.title} className="rounded-xl2 border border-line bg-cream-soft p-5">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-serif text-[16px] font-semibold text-ink">{h.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{h.desc}</p>
                </li>
              )
            })}
          </ul>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <MetricCard label="群众侧成果" value="全部免费" sub="核心普法服务持续免费开放，不设付费门槛。" />
            <MetricCard label="机构侧成果" value="4 类方案" sub="覆盖司法行政、街道、学校与企业四类场景。" />
            <MetricCard label="可持续性" value="自我循环" sub="机构合作收入反哺内容生产与公益服务扩展。" tone="brand" />
          </div>
        </div>
      </section>

      {/* 合作流程与反哺 */}
      <section className="border-b border-line bg-cream py-12">
        <div className="mf-container">
          <CooperationFlow />
        </div>
      </section>

      <section className="border-b border-line bg-cream-soft py-12">
        <div className="mf-container">
          <ReinvestLoop />
        </div>
      </section>

      {/* 项目价值观 */}
      <section className="border-b border-line bg-white py-12">
        <div className="mf-container">
          <SectionHeading eyebrow="价值取向" title="我们坚持的四条原则" className="mb-6" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brandValues.map((v) => (
              <li key={v.title} className="rounded-xl2 border border-line bg-cream-soft p-5">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-brand">
                  <ValueIcon name={v.icon} />
                </span>
                <h3 className="mt-4 font-serif text-[16px] font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{v.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-12">
        <div className="mf-container">
          <div className="rounded-xl2 border border-line bg-white p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-xl">
              <h2 className="font-serif text-[24px] font-semibold leading-snug text-ink">想进一步了解项目与方案？</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                可以查看四类机构解决方案的详细能力，或预约一次方案演示沟通。
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
              <Link to="/institution" className="mf-btn-primary gap-1.5">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                查看机构方案
              </Link>
              <button type="button" onClick={() => setModalOpen(true)} className="mf-btn-outline gap-1.5">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                预约方案演示
              </button>
              <Link to="/about" className="mf-btn-ghost gap-1.5 px-3">
                关于项目
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DemoRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

function ValueIcon({ name }: { name: string }) {
  const map: Record<string, LucideIcon> = {
    HeartHandshake,
    Scale: BarChart3,
    Cpu: Sparkles,
    RefreshCw: ArrowRight,
  }
  const Icon = map[name] ?? Sparkles
  return <Icon className="h-5 w-5" aria-hidden="true" />
}
