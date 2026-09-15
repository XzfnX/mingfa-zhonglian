import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  LifeBuoy,
  CheckCircle2,
  ClipboardList,
  Phone,
  Workflow,
  ChevronDown,
  MessageCircleQuestion,
} from 'lucide-react'
import { aidConditions, aidMaterials, aidSteps, aidFaq, aidChannels, CITIZEN_DISCLAIMER } from '../data/citizenServices'
import { Disclaimer } from '../components/Disclaimer'
import { cx } from '../lib/utils'

export default function CitizenAidPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(aidFaq[0]?.q ?? null)

  return (
    <div className="mf-container py-8">
      <nav className="mb-5">
        <Link to="/citizen" className="mf-btn-ghost gap-1.5 px-3 text-[13px]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回服务中心
        </Link>
      </nav>

      <header className="mb-6 rounded-xl2 border border-line bg-white p-6 shadow-card">
        <p className="mf-eyebrow mb-2">核心模块四</p>
        <h1 className="flex items-center gap-2.5 font-serif text-[26px] font-semibold leading-snug text-ink">
          <LifeBuoy className="h-6 w-6 text-brand" aria-hidden="true" />
          法律援助指引
        </h1>
        <p className="mt-2.5 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          了解法律援助的申请条件、办理流程、需要准备的材料以及常见问题。是否符合条件由法律援助机构依法审查决定。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="mf-tag">申请条件</span>
          <span className="mf-tag">办理流程</span>
          <span className="mf-tag">材料清单</span>
          <span className="mf-tag">常见问题</span>
          <span className="mf-tag">求助渠道</span>
        </div>
      </header>

      {/* 申请条件 */}
      <section className="rounded-xl2 border border-line bg-white p-6" aria-labelledby="aid-conditions">
        <h2 id="aid-conditions" className="flex items-center gap-2 font-serif text-[19px] font-semibold text-ink">
          <CheckCircle2 className="h-5 w-5 text-brand" aria-hidden="true" />
          申请条件（一般情形参考）
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          各地具体条件可能有所差异，以下为常见情形的一般性参考，最终以当地法律援助机构审查结论为准。
        </p>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {aidConditions.map((c) => (
            <li key={c} className="flex gap-2.5 rounded-lg border border-line bg-cream-soft px-3.5 py-3 text-[13px] leading-relaxed text-ink-soft">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* 办理流程时间线 */}
        <section className="rounded-xl2 border border-line bg-white p-6" aria-labelledby="aid-flow">
          <h2 id="aid-flow" className="flex items-center gap-2 font-serif text-[19px] font-semibold text-ink">
            <Workflow className="h-5 w-5 text-brand" aria-hidden="true" />
            办理步骤时间线
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
            从咨询了解到结案反馈，一般会经历以下六个环节。
          </p>

          <ol className="relative mt-6 space-y-5 border-l border-line pl-6">
            {aidSteps.map((s, i) => (
              <li key={s.title} className="relative">
                <span
                  className="absolute -left-[31px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand text-[11px] font-semibold text-white"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <p className="text-[15px] font-semibold text-ink">{s.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 材料与渠道 */}
        <div className="space-y-6">
          <section className="rounded-xl2 border border-line bg-white p-6" aria-labelledby="aid-materials">
            <h2 id="aid-materials" className="flex items-center gap-2 font-serif text-[18px] font-semibold text-ink">
              <ClipboardList className="h-5 w-5 text-brand" aria-hidden="true" />
              材料清单
            </h2>
            <ul className="mt-3.5 space-y-2">
              {aidMaterials.map((m) => (
                <li key={m} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
                  <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" aria-hidden="true" />
                  {m}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl2 border border-line bg-white p-6" aria-labelledby="aid-channels">
            <h2 id="aid-channels" className="flex items-center gap-2 font-serif text-[18px] font-semibold text-ink">
              <Phone className="h-5 w-5 text-brand" aria-hidden="true" />
              求助渠道
            </h2>
            <ul className="mt-3.5 space-y-2">
              {aidChannels.map((c) => (
                <li key={c.name} className="rounded-lg border border-line bg-cream-soft px-3.5 py-2.5">
                  <p className="text-[13px] font-medium text-ink">{c.name}</p>
                  <p className="mt-0.5 text-[12px] text-ink-soft">{c.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] leading-relaxed text-ink-soft">
              演示环境不提供真实电话拨打与在线申请功能，具体联系方式请以当地公布的信息为准。
            </p>
          </section>
        </div>
      </div>

      {/* 常见问题 */}
      <section className="mt-6 rounded-xl2 border border-line bg-white p-6" aria-labelledby="aid-faq">
        <h2 id="aid-faq" className="flex items-center gap-2 font-serif text-[19px] font-semibold text-ink">
          <MessageCircleQuestion className="h-5 w-5 text-brand" aria-hidden="true" />
          常见问题
        </h2>
        <ul className="mt-4 divide-y divide-line">
          {aidFaq.map((f) => {
            const open = openFaq === f.q
            return (
              <li key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : f.q)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-[15px] font-medium text-ink">{f.q}</span>
                  <ChevronDown
                    className={cx('h-4 w-4 shrink-0 text-ink-soft transition-transform', open && 'rotate-180')}
                    aria-hidden="true"
                  />
                </button>
                {open && (
                  <p className="pb-4 text-[14px] leading-relaxed text-ink-soft animate-fade-in">{f.a}</p>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <div className="mt-8">
        <Disclaimer text={CITIZEN_DISCLAIMER} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/citizen/consult" className="mf-btn-primary gap-1.5">
          智能普法咨询
        </Link>
        <Link to="/citizen/documents" className="mf-btn-outline">
          法律文书指引
        </Link>
        <Link to="/citizen/cases" className="mf-btn-outline">
          生活法律案例
        </Link>
      </div>
    </div>
  )
}
