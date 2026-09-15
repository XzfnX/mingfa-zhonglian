import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Scale,
  Network,
  GraduationCap,
  Users,
  Building2,
  HeartHandshake,
  CalendarCheck,
  ArrowRight,
  ShieldCheck,
  Info,
  Compass,
} from 'lucide-react'
import { SectionHeading, MetricCard, Pill } from '../components/Ui'
import { DemoRequestModal } from '../components/DemoRequestModal'
import { Disclaimer } from '../components/Disclaimer'
import { brandIconLegend, BrandGlyph } from '../components/BrandMark'
import { brandValues, standardDeliverables, cooperationModes } from '../data/projectResults'
import type { LucideIcon } from 'lucide-react'

const valueIcons: Record<string, LucideIcon> = {
  HeartHandshake: HeartHandshake,
  Scale: Scale,
  Cpu: Compass,
  RefreshCw: Network,
}

export default function AboutPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {/* 头部 */}
      <section className="border-b border-line bg-white py-12">
        <div className="mf-container">
          <div className="flex flex-wrap items-center gap-6">
            <BrandGlyph size={64} />
            <div className="max-w-2xl">
              <p className="mf-eyebrow mb-2">关于明法众联</p>
              <h1 className="font-serif text-[28px] font-semibold leading-snug text-ink sm:text-[34px]">
                高校智力赋能基层治理的数智化法治实践平台
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
                明法众联以高校法学专业力量为支撑，把普法内容生产、线下实践活动与线上数智服务结合起来，
                既面向群众提供普惠、便捷、低门槛的普法服务，也面向机构提供可复制、可定制、可评估的数智普法解决方案。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 项目定位 */}
      <section className="border-b border-line bg-cream py-12">
        <div className="mf-container">
          <SectionHeading
            eyebrow="项目定位"
            title="一个平台，两条战线，两类价值"
            desc="我们希望解决一个现实问题：普法内容不缺，缺的是「群众听得懂、机构用得上、效果说得清」的落地方式。"
            className="mb-8"
          />
          <div className="grid gap-5 lg:grid-cols-3">
            <PositionCard
              icon={Users}
              badge="C 端公益价值"
              title="群众端的普惠普法"
              desc="面向普通群众提供免费、普惠、低门槛的普法服务，帮助群众了解法律常识与维权路径。"
              points={['全部群众模块免费体验', '内容通俗、结构清晰', '适老友好与无障碍支持']}
              to="/login/citizen"
              cta="进入群众服务"
            />
            <PositionCard
              icon={Building2}
              badge="B 端商业价值"
              title="机构端的标准产品"
              desc="面向司法局、街道政府、学校和企业提供标准化、可定制、可交付的数智普法产品。"
              points={['四类行业解决方案', '八步合作流程', '八类标准交付成果']}
              to="/login/institution"
              cta="查看机构产品"
            />
            <PositionCard
              icon={Network}
              badge="可持续机制"
              title="机构合作反哺公益"
              desc="机构合作收入用于支撑内容生产与平台建设，从而持续扩大群众端的免费服务范围。"
              points={['核心群众服务保持免费', '收入投入内容与平台', '形成正向循环']}
              to="/results"
              cta="查看反哺模式"
            />
          </div>
        </div>
      </section>

      {/* 品牌视觉 */}
      <section className="border-b border-line bg-white py-12">
        <div className="mf-container">
          <SectionHeading
            eyebrow="品牌标识"
            title="三元素构成的品牌符号"
            desc="标识由「天平、书页、连接节点」三个元素抽象组合而成，不使用任何机关徽标或律师事务所 Logo 元素。"
            className="mb-8"
          />
          <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl2 border border-line bg-cream p-8">
              <BrandGlyph size={96} />
              <div className="text-center">
                <p className="font-serif text-[22px] font-semibold tracking-[0.12em] text-ink">明法众联</p>
                <p className="mt-1.5 text-[13px] text-ink-soft">数智化法治实践平台</p>
              </div>
              <ul className="mt-2 flex flex-wrap justify-center gap-2">
                <li className="mf-tag">深红 #780406</li>
                <li className="mf-tag">品牌红 #9B1C1C</li>
                <li className="mf-tag">冷灰 #EEF0F3</li>
                <li className="mf-tag">米白 #FBF0DD</li>
              </ul>
            </div>

            <ul className="grid gap-4 sm:grid-cols-3">
              {brandIconLegend.map((b) => {
                const Icon = b.icon
                return (
                  <li key={b.name} className="rounded-xl2 border border-line bg-cream-soft p-5">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-brand">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-serif text-[16px] font-semibold text-ink">{b.name}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{b.desc}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* 团队与支撑 */}
      <section className="border-b border-line bg-cream-soft py-12">
        <div className="mf-container">
          <SectionHeading
            eyebrow="项目团队"
            title="高校智力支撑与跨专业协作"
            desc="项目由高校学生团队发起，由法学专业师生参与内容审核，由数据与信息技术方向成员负责平台与数据能力建设。"
            className="mb-8"
          />
          <div className="grid gap-5 lg:grid-cols-3">
            <TeamCard
              icon={GraduationCap}
              title="法学专业内容团队"
              desc="负责普法内容的选题、撰写与专业审核，确保表述符合现行法律框架，不越界给出确定性法律结论。"
              duties={['内容选题与撰写', '法律表述复核', '案例改编与脱敏处理']}
            />
            <TeamCard
              icon={Compass}
              title="数据与产品团队"
              desc="负责需求数据采集口径、成效评估指标设计以及平台功能的产品化落地。"
              duties={['需求采集与分析', '评估指标设计', '平台功能迭代']}
            />
            <TeamCard
              icon={HeartHandshake}
              title="实践与志愿团队"
              desc="负责走进社区、乡村、校园与企业开展线下活动，并在活动中收集群众真实需求。"
              duties={['线下活动组织', '群众需求收集', '志愿者培训与协同']}
            />
          </div>

          <div className="mt-6">
            <Disclaimer
              title="团队信息说明"
              text="本页面不展示指导老师姓名、成员真实姓名与个人联系方式，也不展示虚构的荣誉、获奖记录、合作单位与媒体报道。所有成果数据均以项目阶段性记录为准。"
            />
          </div>
        </div>
      </section>

      {/* 价值观 */}
      <section className="border-b border-line bg-white py-12">
        <div className="mf-container">
          <SectionHeading eyebrow="价值取向" title="我们坚持的四条原则" className="mb-8" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brandValues.map((v) => {
              const Icon = valueIcons[v.icon] ?? Scale
              return (
                <li key={v.title} className="rounded-xl2 border border-line bg-cream-soft p-5">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-serif text-[16px] font-semibold text-ink">{v.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{v.desc}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* 合作方式 */}
      <section className="border-b border-line bg-cream py-12">
        <div className="mf-container">
          <SectionHeading
            eyebrow="合作方式"
            title="六类合作路径与标准交付"
            desc="我们不做价格竞争，而是以内容专业度、交付完整度与成效可评估性形成差异。本页不展示价格信息。"
            className="mb-8"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cooperationModes.map((m) => (
              <li key={m.id} className="flex flex-col rounded-xl2 border border-line bg-white p-5">
                <h3 className="font-serif text-[16px] font-semibold leading-snug text-ink">{m.name}</h3>
                <p className="mt-2 text-[12px] text-ink-soft">面向对象：{m.target}</p>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-soft">{m.desc}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {m.outputs.map((o) => (
                    <li key={o} className="mf-tag">
                      {o}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl2 border border-line bg-white p-6">
            <h3 className="flex items-center gap-2 font-serif text-[17px] font-semibold text-ink">
              <ShieldCheck className="h-4.5 w-4.5 text-brand" aria-hidden="true" />
              八类标准交付成果
            </h3>
            <ul className="mt-3.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {standardDeliverables.map((d) => (
                <li key={d} className="rounded-lg border border-line bg-cream-soft px-3 py-2.5 text-[13px] text-ink">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 页面规范说明 */}
      <section className="border-b border-line bg-white py-12">
        <div className="mf-container">
          <SectionHeading
            eyebrow="项目说明"
            title="本演示网站的能力边界"
            desc="作为参赛路演 Demo，网站刻意保留了一些边界，以确保展示的是产品能力而不是虚假业务数据。"
            className="mb-8"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <BoundaryCard
              title="不提供的功能"
              items={[
                '真实支付与真实购买',
                '真实短信验证码与用户注册',
                '真实法律咨询与法律结论',
                '真实文件上传与信息采集',
              ]}
            />
            <BoundaryCard
              title="前端模拟的部分"
              items={[
                '登录与身份区分（sessionStorage）',
                '智能咨询回答（本地静态数据）',
                '语音输入与播报（模拟状态流转）',
                '预约演示提交（仅前端状态）',
              ]}
            />
            <BoundaryCard
              title="技术实现说明"
              items={[
                '纯前端项目，无后端服务器与数据库',
                '不调用任何外部业务接口或 API',
                '图表与指标均为演示用模拟数据',
                '路由保护仅用于演示身份区分',
              ]}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <MetricCard label="解决方案" value="4 类" sub="司法行政、街道、学校、企业" />
            <MetricCard label="合作方式" value="6 类" sub="政府购买、专项合作、共建等" />
            <MetricCard label="标准交付物" value="8 类" sub="从平台演示到年度总结" tone="brand" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-12">
        <div className="mf-container">
          <div className="rounded-xl2 border border-line bg-white p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-xl">
              <h2 className="font-serif text-[24px] font-semibold leading-snug text-ink">从这里开始了解明法众联</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                作为普通群众，你可以免费使用全部群众普法服务；作为机构客户，你可以查看四类解决方案的完整能力与交付物。
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
              <Link to="/login/citizen" className="mf-btn-primary gap-1.5">
                <Users className="h-4 w-4" aria-hidden="true" />
                进入群众服务
              </Link>
              <Link to="/login/institution" className="mf-btn-outline gap-1.5">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                查看机构产品
              </Link>
              <button type="button" onClick={() => setModalOpen(true)} className="mf-btn-ghost gap-1.5 px-3">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                预约演示
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <p className="flex flex-wrap items-center justify-center gap-2 text-center text-[13px] text-ink-soft">
              <Info className="h-4 w-4 text-brand" aria-hidden="true" />
              本网站为大学生创新创业比赛参赛 Demo，仅用于公益普法宣传与产品能力演示。
              <Link to="/" className="mf-link">
                返回首页
              </Link>
            </p>
          </div>
        </div>
      </section>

      <DemoRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

function PositionCard({
  icon: Icon,
  badge,
  title,
  desc,
  points,
  to,
  cta,
}: {
  icon: LucideIcon
  badge: string
  title: string
  desc: string
  points: string[]
  to: string
  cta: string
}) {
  return (
    <div className="flex flex-col rounded-xl2 border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <Pill tone="brand">{badge}</Pill>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-cream text-brand">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <h3 className="mt-4 font-serif text-[18px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">{desc}</p>
      <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
        {points.map((p) => (
          <li key={p} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
            <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
      <Link to={to} className="mf-btn-outline mt-4 gap-1.5 text-[14px]">
        {cta}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  )
}

function TeamCard({
  icon: Icon,
  title,
  desc,
  duties,
}: {
  icon: LucideIcon
  title: string
  desc: string
  duties: string[]
}) {
  return (
    <div className="rounded-xl2 border border-line bg-white p-5">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-cream text-brand">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-serif text-[17px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{desc}</p>
      <ul className="mt-3 space-y-1.5">
        {duties.map((d) => (
          <li key={d} className="flex gap-2 text-[13px] text-ink-soft">
            <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
            {d}
          </li>
        ))}
      </ul>
    </div>
  )
}

function BoundaryCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl2 border border-line bg-cream-soft p-5">
      <h3 className="font-serif text-[16px] font-semibold text-ink">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
            <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" aria-hidden="true" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  )
}
