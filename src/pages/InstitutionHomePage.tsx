import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, BarChart3, CalendarCheck, ChevronRight, CircleCheck, FileText, FolderKanban, UsersRound } from 'lucide-react'
import { DemoRequestModal } from '../components/DemoRequestModal'
import { useAuth } from '../context/AuthContext'
import { institutionSolutions, institutionTypeLabel } from '../data/institutionSolutions'

const trendData = [
  { month: '4月', reach: 4100, consult: 1720 },
  { month: '5月', reach: 5200, consult: 2160 },
  { month: '6月', reach: 4800, consult: 2030 },
  { month: '7月', reach: 6600, consult: 2710 },
  { month: '8月', reach: 7300, consult: 3040 },
  { month: '9月', reach: 8100, consult: 3520 },
]

const audienceData = [
  { name: '社区居民', value: 86 },
  { name: '青少年', value: 73 },
  { name: '企业员工', value: 68 },
  { name: '老年人', value: 61 },
  { name: '农民工', value: 54 },
]

const projects = [
  { name: '秋季重点人群普法专项', type: '主题普法', audience: '社区居民 / 老年人', progress: '执行中', reach: '3,260人', date: '2026-09-28' },
  { name: '基层矛盾风险预防内容包', type: '内容交付', audience: '街道与社区', progress: '待验收', reach: '18个点位', date: '2026-09-22' },
  { name: '校园法治教育课程季', type: '课程服务', audience: '七至九年级', progress: '执行中', reach: '1,840人', date: '2026-10-10' },
  { name: '员工合规宣教月', type: '企业培训', audience: '企业员工', progress: '已完成', reach: '960人', date: '2026-08-31' },
]

export default function InstitutionHomePage() {
  const { user } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const currentSolution = useMemo(
    () => institutionSolutions.find((solution) => solution.id === user?.institutionType) ?? institutionSolutions[0],
    [user?.institutionType],
  )
  const metricValues = currentSolution.metrics.slice(0, 4)
  const metricFallback = [
    { label: '累计服务人次', value: '32,680', sub: '较上期 +18.6%' },
    { label: '内容资源总量', value: '486', sub: '本月新增 32 条' },
    { label: '在执行项目', value: '12', sub: '4 个待本周交付' },
    { label: '综合满意度', value: '96.2%', sub: '基于模拟回访数据' },
  ]
  const metrics = metricFallback.map((item, index) => ({ ...item, ...(metricValues[index] ?? {}) }))

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">机构工作台</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">业务总览</h1>
          <p className="mt-1.5 text-sm text-ink-soft">{user?.orgName} · {institutionTypeLabel[user?.institutionType ?? '']}解决方案</p>
        </div>
        <button type="button" onClick={() => setModalOpen(true)} className="mf-btn-primary self-start"><CalendarCheck className="h-4 w-4" />演示咨询</button>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="核心指标">
        {metrics.map((metric, index) => {
          const Icon = [UsersRound, FileText, FolderKanban, BarChart3][index]
          return (
            <article key={metric.label} className="border border-line bg-white p-5">
              <div className="flex items-start justify-between"><p className="text-sm text-ink-soft">{metric.label}</p><Icon className="h-5 w-5 text-brand" /></div>
              <p className="mt-3 text-[28px] font-bold tracking-tight text-ink">{metric.value}</p>
              <p className="mt-1 text-xs text-ink-soft">{metric.sub}</p>
            </article>
          )
        })}
      </section>

      <section id="evaluation" className="mt-5 grid scroll-mt-24 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.85fr)]">
        <article className="border border-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4"><div><h2 className="font-bold text-ink">服务触达趋势</h2><p className="mt-1 text-xs text-ink-soft">最近 6 个月模拟统计 · 单位：人次</p></div><div className="flex gap-4 text-xs text-ink-soft"><span className="flex items-center gap-1.5"><i className="h-2 w-2 bg-brand" />内容触达</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 bg-[#5A738E]" />有效互动</span></div></div>
          <div className="h-[292px] p-4 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} />
                <Tooltip contentStyle={{ border: '1px solid #DCE1E7', borderRadius: 4, fontSize: 12 }} />
                <Area type="monotone" dataKey="reach" stroke="#9B1C1C" fill="#F7DADA" strokeWidth={2} name="内容触达" />
                <Area type="monotone" dataKey="consult" stroke="#5A738E" fill="#DDE5EC" strokeWidth={2} name="有效互动" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="border border-line bg-white">
          <div className="border-b border-line px-5 py-4"><h2 className="font-bold text-ink">重点人群覆盖</h2><p className="mt-1 text-xs text-ink-soft">目标人群计划完成率</p></div>
          <div className="h-[292px] p-4 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audienceData} layout="vertical" margin={{ top: 0, right: 18, left: 16, bottom: 0 }}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#667085' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={66} tick={{ fontSize: 12, fill: '#344054' }} />
                <Tooltip cursor={{ fill: '#F7F8FA' }} contentStyle={{ border: '1px solid #DCE1E7', borderRadius: 4, fontSize: 12 }} />
                <Bar dataKey="value" fill="#9B1C1C" radius={[0, 2, 2, 0]} name="完成率" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section id="projects" className="mt-5 scroll-mt-24 border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-4"><div><h2 className="font-bold text-ink">近期项目</h2><p className="mt-1 text-xs text-ink-soft">项目执行与交付状态一览</p></div><button type="button" className="text-sm font-semibold text-brand">查看全部</button></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#F8F9FA] text-xs font-semibold text-ink-soft"><tr>{['项目名称', '项目类型', '服务对象', '状态', '覆盖规模', '计划完成'].map((label) => <th key={label} className="border-b border-line px-5 py-3">{label}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">
              {projects.map((project) => <tr key={project.name} className="hover:bg-[#FAFAFB]"><td className="px-5 py-4 font-semibold text-ink">{project.name}</td><td className="px-5 py-4 text-ink-soft">{project.type}</td><td className="px-5 py-4 text-ink-soft">{project.audience}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${project.progress === '已完成' ? 'text-success' : project.progress === '待验收' ? 'text-warning' : 'text-brand'}`}><i className="h-1.5 w-1.5 bg-current" />{project.progress}</span></td><td className="px-5 py-4 text-ink">{project.reach}</td><td className="px-5 py-4 text-ink-soft">{project.date}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section id="resources" className="mt-5 grid scroll-mt-24 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
        <article className="border border-line bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold text-brand">当前主解决方案</p><h2 className="mt-1 text-xl font-bold text-ink">{currentSolution.productName}</h2></div><CircleCheck className="h-6 w-6 shrink-0 text-success" /></div>
          <p className="mt-3 text-sm leading-6 text-ink-soft">{currentSolution.tagline}</p>
          <div className="mt-5 grid gap-x-5 gap-y-2 border-y border-line py-4 sm:grid-cols-2">
            {currentSolution.modules.slice(0, 6).map((module) => <p key={module.id} className="flex items-center gap-2 text-sm text-ink"><span className="h-1.5 w-1.5 bg-brand" />{module.name}</p>)}
          </div>
          <Link to={`/institution/${currentSolution.id}`} className="mf-btn-primary mt-5">查看方案详情<ArrowRight className="h-4 w-4" /></Link>
        </article>

        <article className="border border-line bg-white" id="deliverables">
          <div className="border-b border-line px-5 py-4"><h2 className="font-bold text-ink">浏览其他行业方案</h2><p className="mt-1 text-xs text-ink-soft">验证平台跨场景复制与交付能力</p></div>
          <ul className="divide-y divide-line">
            {institutionSolutions.filter((solution) => solution.id !== currentSolution.id).map((solution) => <li key={solution.id}><Link to={`/institution/${solution.id}`} className="group flex items-center gap-3 px-5 py-4 hover:bg-[#FAFAFB]"><span className="flex h-9 w-9 items-center justify-center bg-[#FFF7F7] text-brand"><FileText className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-ink group-hover:text-brand">{solution.productName}</span><span className="mt-0.5 block truncate text-xs text-ink-soft">{institutionTypeLabel[solution.id]} · {solution.modules.length} 个核心模块</span></span><ChevronRight className="h-4 w-4 text-gray-400" /></Link></li>)}
          </ul>
        </article>
      </section>

      <p className="mt-5 border-l-2 border-gray-300 bg-white px-4 py-3 text-xs leading-5 text-ink-soft">本工作台为参赛路演纯前端演示，指标、图表和项目数据均为本地模拟数据；登录状态由 sessionStorage 保存，不构成真实安全鉴权，也不提供真实付费交易。</p>

      <DemoRequestModal open={modalOpen} onClose={() => setModalOpen(false)} defaultOrg={user?.orgName} defaultSolution={currentSolution.productName} />
    </div>
  )
}
