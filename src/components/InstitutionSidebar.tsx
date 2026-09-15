import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, Bell, BookOpenText, BriefcaseBusiness, Building2, ChevronDown, FileCheck2, GraduationCap, Landmark, LayoutDashboard, LogOut, Menu, School, Search, UsersRound, X } from 'lucide-react'
import { BrandMark } from './BrandMark'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { institutionTypeLabel } from '../data/institutionSolutions'
import { cx } from '../lib/utils'

const solutions = [
  { id: 'justice', label: '司法行政', to: '/institution/justice', icon: Landmark },
  { id: 'street', label: '街道治理', to: '/institution/street', icon: Building2 },
  { id: 'school', label: '学校教育', to: '/institution/school', icon: School },
  { id: 'enterprise', label: '企业合规', to: '/institution/enterprise', icon: BriefcaseBusiness },
] as const

const sectionLinks = [
  { label: '普法项目', to: '/institution#projects', icon: UsersRound },
  { label: '内容资源', to: '/institution#resources', icon: BookOpenText },
  { label: '成效评估', to: '/institution#evaluation', icon: BarChart3 },
  { label: '交付成果', to: '/institution#deliverables', icon: FileCheck2 },
]

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth()
  return (
    <nav className="mt-6 flex-1 overflow-y-auto px-3 pb-5 mf-scrollbar" aria-label="机构工作台导航">
      <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">工作区</p>
      <NavLink to="/institution" end onClick={onNavigate} className={({ isActive }) => cx('mt-2 flex min-h-[42px] items-center gap-3 border-l-2 px-3 text-sm font-medium', isActive ? 'border-white bg-white/10 text-white' : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white')}>
        <LayoutDashboard className="h-4 w-4" />工作台
      </NavLink>

      <p className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">解决方案</p>
      {solutions.map((item) => {
        const Icon = item.icon
        const current = user?.institutionType === item.id
        return (
          <NavLink key={item.id} to={item.to} onClick={onNavigate} className={({ isActive }) => cx('flex min-h-[42px] items-center gap-3 border-l-2 px-3 text-sm', isActive ? 'border-white bg-white/10 text-white' : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white')}>
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {current && <span className="text-[10px] text-red-200">当前</span>}
          </NavLink>
        )
      })}

      <p className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">运营管理</p>
      {sectionLinks.map((item) => {
        const Icon = item.icon
        return <Link key={item.label} to={item.to} onClick={onNavigate} className="flex min-h-[42px] items-center gap-3 border-l-2 border-transparent px-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white"><Icon className="h-4 w-4" />{item.label}</Link>
      })}
    </nav>
  )
}

export function InstitutionSidebar() {
  const [drawer, setDrawer] = useState(false)
  const location = useLocation()
  useEffect(() => setDrawer(false), [location.pathname])

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[232px] flex-col bg-[#182231] text-white lg:flex">
        <Link to="/institution" className="flex h-[72px] items-center border-b border-white/10 px-5" aria-label="返回机构工作台">
          <BrandMark tone="light" size={36} subtitle="机构服务平台" />
        </Link>
        <Navigation />
        <div className="border-t border-white/10 px-5 py-4 text-[11px] leading-5 text-slate-400">路演演示环境<br />数据均为本地模拟内容</div>
      </aside>

      <button type="button" onClick={() => setDrawer(true)} className="fixed left-3 top-[14px] z-[61] flex h-10 w-10 items-center justify-center border border-line bg-white text-ink lg:hidden" aria-label="打开机构导航"><Menu className="h-5 w-5" /></button>
      {drawer && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/45" onClick={() => setDrawer(false)} aria-label="关闭导航遮罩" />
          <aside className="relative flex h-full w-[280px] flex-col bg-[#182231] text-white">
            <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5"><BrandMark tone="light" size={34} subtitle="机构服务平台" /><button type="button" onClick={() => setDrawer(false)} aria-label="关闭机构导航"><X className="h-5 w-5" /></button></div>
            <Navigation onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}
    </>
  )
}

export function InstitutionTopBar() {
  const { user, logout } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    push('已退出机构端登录。', 'info')
    navigate('/?role=institution', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-line bg-white pl-16 pr-4 sm:pr-6 lg:pl-8 lg:pr-8">
      <div className="hidden min-w-0 sm:block">
        <p className="truncate text-sm font-semibold text-ink">{user?.orgName ?? '演示机构'}</p>
        <p className="mt-0.5 text-xs text-ink-soft">{user?.orgRole ?? institutionTypeLabel[user?.institutionType ?? ''] ?? '机构管理员'}</p>
      </div>
      <div className="relative hidden w-full max-w-[320px] md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input className="mf-input h-9 min-h-0 bg-[#F7F8FA] pl-9 text-sm" placeholder="搜索项目、内容或方案" aria-label="搜索工作台内容" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button type="button" className="flex h-9 w-9 items-center justify-center text-ink-soft hover:bg-gray-100" aria-label="查看通知"><Bell className="h-4 w-4" /></button>
        <button type="button" className="hidden items-center gap-2 border-l border-line pl-3 text-left sm:flex" aria-label="当前机构账号">
          <span className="flex h-8 w-8 items-center justify-center bg-[#FCE8E8] text-sm font-bold text-brand"><GraduationCap className="h-4 w-4" /></span>
          <span><span className="block max-w-[120px] truncate text-xs font-semibold text-ink">{user?.displayName}</span><span className="block text-[11px] text-ink-soft">{institutionTypeLabel[user?.institutionType ?? '']}</span></span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
        <button type="button" onClick={handleLogout} className="flex h-9 items-center gap-1.5 px-2 text-xs text-ink-soft hover:bg-gray-100 hover:text-brand"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">退出</span></button>
      </div>
    </header>
  )
}
