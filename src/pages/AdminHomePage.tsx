import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, BriefcaseBusiness, Building2, FolderKanban, Landmark, School, UsersRound } from 'lucide-react'
import { institutionSolutions, institutionTypeLabel } from '../data/institutionSolutions'
import { getInstitutionDemo } from '../data/demoUsers'

const icons = { justice: Landmark, street: Building2, school: School, enterprise: BriefcaseBusiness }
const overview = [
  { label: '接入机构类型', value: '4', sub: '司法、街道、学校、企业', icon: Building2 },
  { label: '核心服务模块', value: institutionSolutions.reduce((sum, item) => sum + item.modules.length, 0).toString(), sub: '覆盖四类业务场景', icon: FolderKanban },
  { label: '服务覆盖人次', value: '38,260', sub: '本周期累计触达', icon: UsersRound },
  { label: '在执行项目', value: '18', sub: '6 项本月计划交付', icon: BriefcaseBusiness },
]
const comparison = institutionSolutions.map((item, index) => ({ name: institutionTypeLabel[item.id], 项目数: [6, 5, 4, 3][index], 完成率: [91, 86, 88, 94][index] }))

export default function AdminHomePage() {
  return <div className="mx-auto max-w-[1500px]">
    <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">平台管理中心</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">全局运营总览</h1><p className="mt-1.5 text-sm text-ink-soft">集中查看四类机构的业务进展、服务覆盖与解决方案。</p></div>

    <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="全局核心指标">
      {overview.map((item) => { const Icon = item.icon; return <article key={item.label} className="border border-line bg-white p-5"><div className="flex items-start justify-between"><p className="text-sm text-ink-soft">{item.label}</p><Icon className="h-5 w-5 text-brand" /></div><p className="mt-3 text-[28px] font-bold tracking-tight text-ink">{item.value}</p><p className="mt-1 text-xs text-ink-soft">{item.sub}</p></article> })}
    </section>

    <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)]">
      <article className="border border-line bg-white"><div className="border-b border-line px-5 py-4"><h2 className="font-bold text-ink">机构运营对比</h2><p className="mt-1 text-xs text-ink-soft">各机构在执行项目与计划完成率</p></div><div className="h-[310px] p-5"><ResponsiveContainer width="100%" height="100%"><BarChart data={comparison} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}><CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} /><Tooltip contentStyle={{ border: '1px solid #DCE1E7', borderRadius: 4, fontSize: 12 }} /><Bar dataKey="完成率" fill="#9B1C1C" radius={[2, 2, 0, 0]} /></BarChart></ResponsiveContainer></div></article>
      <article className="border border-line bg-white"><div className="border-b border-line px-5 py-4"><h2 className="font-bold text-ink">机构运行状态</h2><p className="mt-1 text-xs text-ink-soft">四类机构后台当前概况</p></div><ul className="divide-y divide-line">{institutionSolutions.map((solution) => { const Icon = icons[solution.id]; const account = getInstitutionDemo(solution.id); return <li key={solution.id} className="flex items-center gap-3 px-5 py-4"><span className="flex h-9 w-9 items-center justify-center bg-[#FFF7F7] text-brand"><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-ink">{account.orgName}</span><span className="mt-0.5 block text-xs text-ink-soft">{solution.modules.length} 个服务模块 · 运行正常</span></span><span className="text-xs font-semibold text-success">正常</span></li> })}</ul></article>
    </section>

    <section className="mt-5 border border-line bg-white"><div className="border-b border-line px-5 py-4"><h2 className="font-bold text-ink">机构后台</h2><p className="mt-1 text-xs text-ink-soft">选择机构查看完整业务方案、成效指标与交付内容</p></div><div className="grid sm:grid-cols-2 xl:grid-cols-4">{institutionSolutions.map((solution) => { const Icon = icons[solution.id]; const account = getInstitutionDemo(solution.id); return <article key={solution.id} className="border-b border-line p-5 sm:border-r xl:border-b-0"><div className="flex h-10 w-10 items-center justify-center bg-[#FFF7F7] text-brand"><Icon className="h-5 w-5" /></div><p className="mt-4 text-xs font-semibold text-brand">{institutionTypeLabel[solution.id]}</p><h3 className="mt-1 font-bold text-ink">{account.orgName}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-ink-soft">{solution.productName}</p><Link to={`/admin/${solution.id}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">进入机构后台<ArrowRight className="h-4 w-4" /></Link></article> })}</div></section>
  </div>
}
