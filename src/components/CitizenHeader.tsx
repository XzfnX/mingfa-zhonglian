import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Accessibility, ChevronRight, LogOut, Menu, Type, UserRound, X } from 'lucide-react'
import { BrandMark } from './BrandMark'
import { useAuth } from '../context/AuthContext'
import { useA11y } from '../context/AccessibilityContext'
import { useToast } from '../context/ToastContext'
import { cx } from '../lib/utils'

const citizenNav = [
  { label: '首页', to: '/citizen', end: true },
  { label: '法律咨询', to: '/citizen/consult' },
  { label: '案例查询', to: '/citizen/cases' },
  { label: '文书指引', to: '/citizen/documents' },
  { label: '法律援助', to: '/citizen/aid' },
]

export function CitizenHeader() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const { fontSize, setFontSize, highContrast, toggleContrast } = useA11y()
  const { push } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  function handleLogout() {
    logout()
    push('已退出群众端登录。', 'info')
    navigate('/?role=citizen', { replace: true })
  }

  function toggleFont() {
    setFontSize(fontSize === 'normal' ? 'large' : 'normal')
  }

  return (
    <header className="sticky top-0 z-50 shadow-[0_1px_5px_rgba(17,24,39,0.16)]">
      <div className="bg-brand text-white">
        <div className="mf-container flex min-h-[72px] items-center justify-between gap-4">
          <Link to="/citizen" className="shrink-0 focus:outline-none focus:ring-2 focus:ring-white" aria-label="返回群众服务中心">
            <BrandMark tone="light" size={38} subtitle="群众普法服务中心" />
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            <button type="button" onClick={toggleFont} className="flex min-h-[40px] items-center gap-1.5 border border-white/40 px-3 text-sm hover:bg-white/10" aria-pressed={fontSize !== 'normal'}>
              <Type className="h-4 w-4" aria-hidden="true" />大字号
            </button>
            <button type="button" onClick={toggleContrast} className="flex min-h-[40px] items-center gap-1.5 border border-white/40 px-3 text-sm hover:bg-white/10" aria-pressed={highContrast}>
              <Accessibility className="h-4 w-4" aria-hidden="true" />高对比度
            </button>
            <span className="ml-2 flex items-center gap-1.5 text-sm text-white/85"><UserRound className="h-4 w-4" aria-hidden="true" />{user?.displayName ?? '群众用户'}</span>
            <button type="button" onClick={handleLogout} className="ml-1 flex min-h-[40px] items-center gap-1.5 px-3 text-sm hover:bg-white/10"><LogOut className="h-4 w-4" aria-hidden="true" />退出</button>
          </div>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="citizen-mobile-nav" className="flex h-11 w-11 items-center justify-center border border-white/50 lg:hidden" aria-label={open ? '关闭菜单' : '打开菜单'}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className="border-b border-line bg-white">
        <nav className="mf-container hidden min-h-[50px] items-stretch lg:flex" aria-label="群众服务导航">
          {citizenNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cx('flex items-center border-b-2 px-5 text-sm font-semibold transition-colors', isActive ? 'border-brand text-brand' : 'border-transparent text-ink-soft hover:text-ink')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        {open && (
          <div id="citizen-mobile-nav" className="bg-white lg:hidden">
            <nav className="mf-container py-2" aria-label="群众服务移动端导航">
              {citizenNav.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cx('flex min-h-[48px] items-center justify-between border-b border-line px-1 text-sm font-medium', isActive ? 'text-brand' : 'text-ink')}>
                  {item.label}<ChevronRight className="h-4 w-4 text-gray-400" />
                </NavLink>
              ))}
              <div className="grid grid-cols-2 gap-2 py-3">
                <button type="button" onClick={toggleFont} className="mf-btn-outline"><Type className="h-4 w-4" />大字号</button>
                <button type="button" onClick={toggleContrast} className="mf-btn-outline"><Accessibility className="h-4 w-4" />高对比度</button>
                <button type="button" onClick={handleLogout} className="mf-btn-primary col-span-2"><LogOut className="h-4 w-4" />退出登录</button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
