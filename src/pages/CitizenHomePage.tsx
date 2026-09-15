import { FormEvent, useState } from 'react'
import { ArrowRight, BookOpenText, ChevronRight, FileText, LifeBuoy, MessageSquareText, Search, ShieldCheck, UsersRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AccessibilityControls } from '../components/AccessibilityControls'
import { Disclaimer } from '../components/Disclaimer'
import { CITIZEN_DISCLAIMER, citizenServices, focusGroups } from '../data/citizenServices'

const serviceMeta = {
  consult: { icon: MessageSquareText, label: '法律咨询', note: '说清问题，获得分步骤的一般法律指引' },
  cases: { icon: BookOpenText, label: '案例查询', note: '从真实生活场景理解常见法律问题' },
  documents: { icon: FileText, label: '文书指引', note: '查看材料清单与常用文书填写要点' },
  aid: { icon: LifeBuoy, label: '法律援助', note: '了解申请条件、办理流程与求助渠道' },
} as const

const hotQuestions = [
  '公司拖欠工资，我应该先准备哪些材料？',
  '遭遇网络诈骗后，第一时间该怎么处理？',
  '租房押金迟迟不退，可以通过哪些途径解决？',
  '邻居噪声影响休息，怎样依法沟通和维权？',
  '校园欺凌发生后，学生和家长应该如何求助？',
]

export default function CitizenHomePage() {
  const [question, setQuestion] = useState('')
  const navigate = useNavigate()
  const primaryServices = citizenServices.filter((item) => item.id in serviceMeta)

  function submit(event: FormEvent) {
    event.preventDefault()
    navigate('/citizen/consult', { state: { question: question.trim() } })
  }

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mf-container py-8 sm:py-11">
          <p className="text-sm font-semibold text-brand">普惠免费服务</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-[32px]">遇到法律问题，从这里开始</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">用生活化语言描述你的情况，我们会提供一般处理步骤、材料提醒和可联系的公共服务渠道。</p>
          <form onSubmit={submit} className="mt-6 flex max-w-4xl flex-col gap-2 sm:flex-row">
            <label htmlFor="citizen-question" className="sr-only">输入你遇到的法律问题</label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input id="citizen-question" value={question} onChange={(event) => setQuestion(event.target.value)} className="mf-input min-h-[52px] border-gray-300 bg-white pl-12 text-base" placeholder="例如：公司拖欠工资，我该怎么办？" />
            </div>
            <button type="submit" className="mf-btn-primary min-h-[52px] px-7">开始咨询<ArrowRight className="h-4 w-4" /></button>
          </form>
          <p className="mt-2 text-xs text-ink-soft">无需付费 · 不采集真实个人信息 · 回答仅供普法参考</p>
        </div>
      </section>

      <div className="mf-container py-8 sm:py-10">
        <section aria-labelledby="service-directory-title">
          <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
            <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">服务目录</p><h2 id="service-directory-title" className="mt-1 text-xl font-bold text-ink">常用法律服务</h2></div>
            <span className="hidden text-sm text-ink-soft sm:block">全部服务均为免费演示模块</span>
          </div>
          <ul className="grid border-x border-b border-line bg-white md:grid-cols-2">
            {primaryServices.map((item, index) => {
              const meta = serviceMeta[item.id as keyof typeof serviceMeta]
              const Icon = meta.icon
              return (
                <li key={item.id} className={`border-line ${index % 2 === 0 ? 'md:border-r' : ''} ${index < 2 ? 'border-b' : index === 2 ? 'border-b md:border-b-0' : ''}`}>
                  <Link to={item.to} className="group flex min-h-[112px] items-center gap-4 p-5 hover:bg-[#FAFAFB] sm:p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#E7CACA] bg-[#FFF7F7] text-brand"><Icon className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-base font-bold text-ink">{meta.label}</span><span className="mt-1 block text-sm leading-5 text-ink-soft">{meta.note}</span></span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-brand" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        <section id="groups" className="mt-10 scroll-mt-32" aria-labelledby="focus-groups-title">
          <div className="border-b border-line pb-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">分类服务</p><h2 id="focus-groups-title" className="mt-1 text-xl font-bold text-ink">重点人群服务入口</h2><p className="mt-2 text-sm text-ink-soft">按人群整理高频问题，减少理解和查找成本。</p></div>
          <div className="grid border-x border-b border-line bg-white sm:grid-cols-2 lg:grid-cols-4">
            {focusGroups.map((group, index) => (
              <article key={group.id} className={`p-5 ${index < 3 ? 'lg:border-r' : ''} ${index < 2 ? 'border-b sm:border-b-0 sm:border-r' : index === 2 ? 'border-b sm:border-b-0' : ''} border-line`}>
                <div className="flex items-center gap-2"><UsersRound className="h-5 w-5 text-brand" /><h3 className="font-bold text-ink">{group.name}</h3></div>
                <p className="mt-2 min-h-[60px] text-sm leading-5 text-ink-soft">{group.desc}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-ink">{group.topics.slice(0, 3).map((topic) => <li key={topic.title} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 bg-brand" />{topic.title}</li>)}</ul>
                <Link to="/citizen/cases" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">查看专题<ChevronRight className="h-4 w-4" /></Link>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
          <section aria-labelledby="hot-questions-title" className="border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-5 py-4"><h2 id="hot-questions-title" className="text-lg font-bold text-ink">热门法律问题</h2><Link to="/citizen/consult" className="text-sm font-semibold text-brand">更多问题</Link></div>
            <ol className="divide-y divide-line">
              {hotQuestions.map((item, index) => <li key={item}><button type="button" onClick={() => navigate('/citizen/consult', { state: { question: item } })} className="group flex w-full items-center gap-4 px-5 py-3.5 text-left hover:bg-[#FAFAFB]"><span className="w-5 text-sm font-semibold text-gray-400">{String(index + 1).padStart(2, '0')}</span><span className="flex-1 text-sm text-ink group-hover:text-brand">{item}</span><ChevronRight className="h-4 w-4 text-gray-400" /></button></li>)}
            </ol>
          </section>
          <aside className="border border-line bg-[#F9FAFB] p-5">
            <ShieldCheck className="h-6 w-6 text-brand" />
            <h2 className="mt-3 text-lg font-bold text-ink">需要人工帮助？</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">可查看法律援助申请条件、办理材料及 12348 公共法律服务热线等求助渠道。</p>
            <Link to="/citizen/aid" className="mf-btn-outline mt-5 w-full">查看援助指引<ArrowRight className="h-4 w-4" /></Link>
          </aside>
        </div>

        <div className="mt-10"><AccessibilityControls /></div>
        <div className="mt-6"><Disclaimer text={CITIZEN_DISCLAIMER} /></div>
      </div>
    </>
  )
}
