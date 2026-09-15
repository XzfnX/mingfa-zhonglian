import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Sparkles, MessagesSquare, ShieldCheck } from 'lucide-react'
import { ConsultationDemo } from '../components/ConsultationDemo'
import { Disclaimer } from '../components/Disclaimer'
import { CITIZEN_DISCLAIMER } from '../data/citizenServices'

export default function CitizenConsultPage() {
  const location = useLocation()
  const initialQuestion = (location.state as { question?: string } | null)?.question ?? ''
  return (
    <div className="mf-container py-8">
      <nav className="mb-5">
        <Link to="/citizen" className="mf-btn-ghost gap-1.5 px-3 text-[13px]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回服务中心
        </Link>
      </nav>

      <header className="mb-6 rounded-xl2 border border-line bg-white p-6 shadow-card">
        <p className="mf-eyebrow mb-2">核心模块一</p>
        <h1 className="flex items-center gap-2.5 font-serif text-[26px] font-semibold leading-snug text-ink">
          <MessagesSquare className="h-6 w-6 text-brand" aria-hidden="true" />
          智能普法咨询
        </h1>
        <p className="mt-2.5 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          输入你遇到的问题，系统会给出「问题概括 — 一般处理步骤 — 需要准备的材料 — 可以联系的机构 — 风险提醒」的结构化指引。
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          <li className="mf-tag">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            结构与内容来源于本地演示数据
          </li>
          <li className="mf-tag">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            不调用真实 AI 接口
          </li>
        </ul>
      </header>

      <ConsultationDemo initialQuestion={initialQuestion} />

      <div className="mt-8">
        <Disclaimer text={CITIZEN_DISCLAIMER} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/citizen/cases" className="mf-btn-outline">
          浏览生活法律案例
        </Link>
        <Link to="/citizen/documents" className="mf-btn-outline">
          查看法律文书指引
        </Link>
        <Link to="/citizen/aid" className="mf-btn-outline">
          了解法律援助
        </Link>
      </div>
    </div>
  )
}
