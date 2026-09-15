import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Users,
  Building2,
  CheckCircle2,
  Scale,
  Landmark,
  School,
  Briefcase,
  Accessibility,
  Footprints,
  MonitorSmartphone,
  GraduationCap,
  BarChart3,
  SprayCan,
  CircleDollarSign,
  Network,
  CalendarCheck,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading, MetricCard, Pill } from '../components/Ui'
import { CooperationFlow, ReinvestLoop } from '../components/CooperationFlow'
import { DemoRequestModal } from '../components/DemoRequestModal'
import { Disclaimer } from '../components/Disclaimer'
import { resultMetrics, PROJECT_RESULT_LABEL, activities, projectHighlights, standardDeliverables } from '../data/projectResults'
import { dualTrack, solutionOverview, heroStats } from '../data/chartData'
import { citizenServices } from '../data/citizenServices'
import { formatNumber } from '../lib/utils'

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Trees: Footprints,
  CalendarCheck,
  Users,
  ThumbsUp: CheckCircle2,
}

const highlightIcons: Record<string, LucideIcon> = {
  GraduationCap,
  Footprints,
  MonitorSmartphone,
  BarChart3,
}

const solutionIcons: Record<string, LucideIcon> = {
  Landmark,
  Building2,
  School,
  Briefcase,
}

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {/* ============ 首屏：身份分区 ============ */}
      <section className="relative overflow-hidden border-b border-line bg-cream">
        {/* 装饰网格（低对比，不使用发光与玻璃拟态） */}
        <div className="pointer-events-none absolute inset-0 mf-grid-lines opacity-40" aria-hidden="true" />

        <div className="mf-container relative py-12 lg:py-16">
          {/* 品牌与主张 */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[12px] font-medium text-brand">
              <Scale className="h-3.5 w-3.5" aria-hidden="true" />
              大学生创新创业项目 · 参赛路演演示
            </span>
            <h1 className="mt-5 font-serif text-[32px] font-semibold leading-[1.25] text-ink sm:text-[40px] lg:text-[46px]">
              高校智力赋能基层治理的
              <br className="hidden sm:block" />
              <span className="text-brand">数智化法治实践平台</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
              面向群众提供普惠、便捷的普法服务，面向机构提供可复制、可定制、可评估的数智普法解决方案。
            </p>
          </div>

          {/* 双入口 */}
          <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-6">
            {/* C 端入口 */}
            <IdentityCard
              side="C 端公益价值"
              title="我是普通群众"
              desc="免费获取法律知识、维权指引和法律援助信息。"
              tags={['普惠免费', '通俗易懂', '适老友好']}
              cta="进入群众服务"
              to="/login/citizen"
              icon={Users}
              tone="citizen"
              bullets={[
                '智能普法咨询：一般处理步骤与所需材料',
                '生活案例解读：反诈、劳动、校园、家庭等主题',
                '法律文书与法律援助指引',
                '大字号、高对比度与语音辅助',
              ]}
            />

            {/* B 端入口 */}
            <IdentityCard
              side="B 端商业价值"
              title="我是机构客户"
              desc="面向司法行政、街道、学校和企业的数智普法解决方案。"
              tags={['标准化产品', '定制化交付', '数据化评估']}
              cta="查看机构产品"
              to="/login/institution"
              icon={Building2}
              tone="institution"
              bullets={[
                '四类行业解决方案与核心功能模块',
                '普法活动管理与服务成效评估看板',
                '课程包、模拟法庭方案等标准交付物',
                '可复制到不同区域与机构的落地流程',
              ]}
            />
          </div>

          {/* 首屏数据条 */}
          <dl className="mt-8 grid grid-cols-2 gap-3 rounded-xl2 border border-line bg-white p-5 sm:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="order-2 mt-1 text-[13px] text-ink-soft">{s.label}</dt>
                <dd className="order-1 font-serif text-[24px] font-semibold leading-none text-brand sm:text-[28px]">
                  {s.value}
                </dd>
              </div>
            ))}
            <p className="col-span-2 mt-3 text-center text-[11px] text-ink-soft sm:col-span-4">
              以上为{PROJECT_RESULT_LABEL}，数据来源于项目实践记录，非实时后台数据。
            </p>
          </dl>
        </div>
      </section>

      {/* ============ 1. 项目阶段性成果 ============ */}
      <section className="border-b border-line bg-white py-14">
        <div className="mf-container">
          <SectionHeading
            eyebrow={PROJECT_RESULT_LABEL}
            title="线下实践与线上服务同步推进"
            desc="项目以社区、乡村、校园、企业四类场景为载体开展普法实践，并把服务能力沉淀到线上平台。以下数据为阶段性统计。"
            className="mb-8"
            action={
              <Link to="/results" className="mf-btn-outline gap-1.5">
                查看完整成果
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {resultMetrics.map((m) => {
              const Icon = iconMap[m.icon] ?? CheckCircle2
              return (
                <li key={m.id} className="rounded-xl2 border border-line bg-cream-soft p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-3.5 font-serif text-[26px] font-semibold leading-none text-ink">
                    {m.id === 'online' ? formatNumber(m.value) : m.value}
                    <span className="ml-0.5 text-[15px] font-medium text-ink-soft">{m.suffix}</span>
                  </p>
                  <p className="mt-2 text-[14px] font-semibold text-ink">{m.label}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{m.desc}</p>
                </li>
              )
            })}
          </ul>

          {/* 项目亮点 */}
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projectHighlights.map((h) => {
              const Icon = highlightIcons[h.icon] ?? Sparkles
              return (
                <li key={h.title} className="flex gap-3 rounded-xl2 border border-line bg-white p-4">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream text-brand">
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[14px] font-semibold text-ink">{h.title}</span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-ink-soft">{h.desc}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ============ 2. C 端免费服务介绍 ============ */}
      <section className="border-b border-line bg-cream-soft py-14">
        <div className="mf-container">
          <SectionHeading
            eyebrow="C 端公益服务"
            title="普通群众可以免费获得什么"
            desc="全部群众普法模块免费开放，不需要付费、不需要注册会员。以下六类服务构成群众端的核心使用路径。"
            className="mb-8"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {citizenServices.map((s) => (
              <li key={s.id} className="flex flex-col rounded-xl2 border border-line bg-white p-5 transition-shadow hover:shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-cream text-brand">
                    <ServiceIcon name={s.icon} />
                  </span>
                  <Pill tone="success">免费体验</Pill>
                </div>
                <h3 className="mt-4 font-serif text-[18px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">{s.desc}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {s.points.map((p) => (
                    <li key={p} className="mf-tag">
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login/citizen"
                  className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-medium text-brand hover:underline"
                >
                  登录后体验
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Disclaimer
              title="法律声明"
              text="本页面内容仅用于公益普法和项目演示，不构成针对具体案件的正式法律意见。遇到紧急、复杂或正在诉讼中的事项，请咨询专业律师或当地法律援助机构。"
            />
          </div>
        </div>
      </section>

      {/* ============ 3. B 端四类解决方案 ============ */}
      <section className="border-b border-line bg-white py-14">
        <div className="mf-container">
          <SectionHeading
            eyebrow="B 端解决方案"
            title="政府、学校和企业可以采购或合作什么产品"
            desc="四类标准化解决方案覆盖司法行政、街道治理、学校法治教育与企业合规宣教场景，每一类都配套明确的模块、看板与交付物。"
            className="mb-8"
            action={
              <button type="button" onClick={() => setModalOpen(true)} className="mf-btn-primary gap-1.5">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                预约方案演示
              </button>
            }
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {solutionOverview.map((s) => {
              const Icon = solutionIcons[s.icon] ?? Landmark
              return (
                <li key={s.id} className="flex flex-col rounded-xl2 border border-line bg-cream-soft p-5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-brand">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[12px] font-medium text-ink-soft">{s.name}</p>
                      <h3 className="font-serif text-[17px] font-semibold leading-snug text-ink">{s.product}</h3>
                    </div>
                  </div>
                  <p className="mt-3.5 flex-1 text-[14px] leading-relaxed text-ink-soft">{s.desc}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {s.points.map((p) => (
                      <li key={p} className="mf-tag">
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={s.to}
                    className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-medium text-brand hover:underline"
                  >
                    查看方案详情
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ============ 4. 线上与线下双轨服务模式 ============ */}
      <section className="border-b border-line bg-brand py-14 text-white">
        <div className="mf-container">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">双轨服务模式</p>
            <h2 className="mt-2 font-serif text-[26px] font-semibold leading-snug sm:text-[30px]">
              线下沉浸式实践 + 线上数智化服务
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">
              线下解决「听得进、记得住」，线上解决「随时可及、处处可用」。两条轨道互为补充，共同构成完整的普法服务体系。
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {dualTrack.map((t) => (
              <div key={t.id} className="rounded-xl2 border border-white/15 bg-white/[0.07] p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-[12px] font-semibold text-gold">
                    {t.track}
                  </span>
                  <h3 className="font-serif text-[18px] font-semibold">{t.title}</h3>
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-white/70">{t.desc}</p>
                <ul className="mt-4 space-y-2.5">
                  {t.items.map((it) => (
                    <li key={it.title} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                      <span>
                        <span className="block text-[14px] font-medium">{it.title}</span>
                        <span className="mt-0.5 block text-[12px] leading-relaxed text-white/65">{it.desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5. 产品交付流程 ============ */}
      <section className="border-b border-line bg-cream py-14">
        <div className="mf-container">
          <CooperationFlow />
        </div>
      </section>

      {/* ============ 6. 项目活动与成果展示 ============ */}
      <section className="border-b border-line bg-white py-14">
        <div className="mf-container">
          <SectionHeading
            eyebrow="实践活动"
            title="项目活动与成果展示"
            desc="以下为项目实践中的典型活动形式。页面使用统一的抽象视觉表达，不使用虚构的现场照片或领导人合影。"
            className="mb-8"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((a) => (
              <li key={a.id} className="overflow-hidden rounded-xl2 border border-line bg-white">
                <ActivityVisual kind={a.visual} />
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
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 7. 商业合作与公益反哺模式 ============ */}
      <section className="border-b border-line bg-cream-soft py-14">
        <div className="mf-container space-y-12">
          {/* 收入来源说明 */}
          <div>
            <SectionHeading
              eyebrow="商业收入从哪里产生"
              title="三条清晰的收入路径"
              desc="项目不以价格竞争，而以「内容专业度 + 交付完整度 + 成效可评估」形成差异。本页不展示具体价格，合作方式与范围以双方沟通确认为准。"
              className="mb-8"
            />
            <ul className="grid gap-4 sm:grid-cols-3">
              <RevenueCard
                icon={CircleDollarSign}
                title="机构服务与项目合作"
                desc="面向司法行政、街道、学校与企业提供标准化服务包与定制化项目交付。"
                points={['年度服务合作', '专项项目合作', '培训与活动执行']}
              />
              <RevenueCard
                icon={SprayCan}
                title="内容与课程授权"
                desc="将沉淀的普法内容、课程体系与活动方案以资源包形式交付给合作机构使用。"
                points={['课程包交付', '内容资源包', '活动方案授权']}
              />
              <RevenueCard
                icon={Network}
                title="共建与联合项目"
                desc="与公益组织、高校院系、社区联合申报或共建法治实践项目。"
                points={['联合实践项目', '志愿服务共建', '课题与调研合作']}
              />
            </ul>
          </div>

          <ReinvestLoop />
        </div>
      </section>

      {/* ============ 8. 合作咨询入口 ============ */}
      <section className="border-b border-line bg-white py-14">
        <div className="mf-container">
          <div className="rounded-xl2 border border-line bg-cream p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-xl">
              <p className="mf-eyebrow mb-2">合作咨询</p>
              <h2 className="font-serif text-[24px] font-semibold leading-snug text-ink sm:text-[28px]">
                希望为你的机构定制一套数智普法方案？
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                告诉我们机构类型、服务人群与关注重点，我们会提供方案讲解、交付物演示与实施路径建议。
                演示环境不会发送或保存任何信息。
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {standardDeliverables.slice(0, 5).map((d) => (
                  <li key={d} className="mf-tag">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
              <button type="button" onClick={() => setModalOpen(true)} className="mf-btn-primary gap-1.5">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                预约方案演示
              </button>
              <Link to="/institution" className="mf-btn-outline gap-1.5">
                查看四类解决方案
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* 公益反哺一句话结论 */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <MetricCard label="群众侧" value="全部免费" sub="核心普法服务不设付费门槛，持续免费开放。" />
            <MetricCard label="机构侧" value="标准交付" sub="八步流程 + 八类标准交付物，过程与成果可追溯。" />
            <MetricCard label="可持续性" value="自我循环" sub="机构合作收入反哺内容生产与公益服务扩展。" tone="brand" />
          </div>
        </div>
      </section>

      {/* 无障碍提示条 */}
      <section className="bg-cream-soft py-6">
        <div className="mf-container">
          <p className="flex flex-wrap items-center justify-center gap-2 text-center text-[13px] text-ink-soft">
            <Accessibility className="h-4 w-4 text-brand" aria-hidden="true" />
            群众端提供大字号、高对比度与模拟语音辅助，全部页面支持键盘操作。
            <Link to="/login/citizen" className="mf-link">
              前往群众端体验
            </Link>
          </p>
        </div>
      </section>

      <DemoRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

/* ---------- 首页内嵌组件 ---------- */

function IdentityCard({
  side,
  title,
  desc,
  tags,
  cta,
  to,
  icon: Icon,
  tone,
  bullets,
}: {
  side: string
  title: string
  desc: string
  tags: string[]
  cta: string
  to: string
  icon: LucideIcon
  tone: 'citizen' | 'institution'
  bullets: string[]
}) {
  const isCitizen = tone === 'citizen'
  return (
    <div
      className={
        isCitizen
          ? 'flex flex-col rounded-xl2 border border-line bg-white p-6 shadow-card'
          : 'flex flex-col rounded-xl2 border border-brand-deep/25 bg-white p-6 shadow-card'
      }
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-soft">{side}</span>
        <span
          className={
            isCitizen
              ? 'inline-flex h-12 w-12 items-center justify-center rounded-xl2 border border-line bg-cream text-success'
              : 'inline-flex h-12 w-12 items-center justify-center rounded-xl2 bg-brand text-white'
          }
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>

      <h2 className="mt-4 font-serif text-[24px] font-semibold text-ink sm:text-[27px]">{title}</h2>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{desc}</p>

      <ul className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((t) => (
          <li
            key={t}
            className={
              isCitizen
                ? 'inline-flex items-center rounded-full border border-success/25 bg-success/5 px-3 py-1 text-[12px] font-medium text-success'
                : 'inline-flex items-center rounded-full border border-gold-deep/40 bg-gold/35 px-3 py-1 text-[12px] font-medium text-brand-deep'
            }
          >
            {t}
          </li>
        ))}
      </ul>

      <ul className="mt-5 flex-1 space-y-2.5 border-t border-line pt-4">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2.5 text-[14px] leading-relaxed text-ink-soft">
            <CheckCircle2
              className={isCitizen ? 'mt-0.5 h-4 w-4 shrink-0 text-success' : 'mt-0.5 h-4 w-4 shrink-0 text-brand'}
              aria-hidden="true"
            />
            {b}
          </li>
        ))}
      </ul>

      <Link to={to} className={isCitizen ? 'mf-btn-primary mt-6 w-full' : 'mf-btn-accent mt-6 w-full'}>
        {cta}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  )
}

function ServiceIcon({ name }: { name: string }) {
  // 按名称映射 Lucide 图标
  const map: Record<string, LucideIcon> = {
    MessagesSquare: Users,
    BookOpenText: GraduationCap,
    FileText: CheckCircle2,
    LifeBuoy: CheckCircle2,
    UsersRound: Users,
    Accessibility,
  }
  const Icon = map[name] ?? CheckCircle2
  return <Icon className="h-5 w-5" aria-hidden="true" />
}

function RevenueCard({
  icon: Icon,
  title,
  desc,
  points,
}: {
  icon: LucideIcon
  title: string
  desc: string
  points: string[]
}) {
  return (
    <li className="rounded-xl2 border border-line bg-white p-5">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-cream text-brand">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-serif text-[17px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{desc}</p>
      <ul className="mt-3 space-y-1.5">
        {points.map((p) => (
          <li key={p} className="flex gap-2 text-[13px] text-ink-soft">
            <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
    </li>
  )
}

/** 活动抽象视觉：不使用虚构现场照片，用中性几何 + 主题图标表达 */
function ActivityVisual({ kind }: { kind: 'community' | 'campus' | 'enterprise' | 'village' | 'institution' }) {
  const config: Record<string, { from: string; to: string; icon: LucideIcon; label: string }> = {
    community: { from: '#FBF0DD', to: '#F8E3A3', icon: Users, label: '社区普法场景' },
    campus: { from: '#FBF0DD', to: '#E7D5C5', icon: School, label: '校园法治场景' },
    enterprise: { from: '#FBF0DD', to: '#EDE0D0', icon: Briefcase, label: '企业培训场景' },
    village: { from: '#FBF0DD', to: '#F2E6C9', icon: Footprints, label: '乡村普法场景' },
    institution: { from: '#FBF0DD', to: '#F8E3A3', icon: Landmark, label: '机构服务场景' },
  }
  const c = config[kind]
  const Icon = c.icon
  return (
    <div
      className="relative flex h-32 items-center justify-center overflow-hidden border-b border-line"
      style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
      role="img"
      aria-label={`${c.label}抽象示意插画`}
    >
      {/* 几何装饰 */}
      <svg className="absolute inset-0 h-full w-full opacity-50" aria-hidden="true">
        <circle cx="86%" cy="22%" r="46" fill="#FFFFFF" fillOpacity="0.45" />
        <circle cx="12%" cy="82%" r="58" fill="#FFFFFF" fillOpacity="0.3" />
        <path d="M0 100 L180 40 L360 100 L540 30 L720 96" stroke="#C9A227" strokeOpacity="0.28" strokeWidth="2" fill="none" />
      </svg>
      <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-xl2 border border-white/60 bg-white/70 text-brand shadow-sm">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
    </div>
  )
}
