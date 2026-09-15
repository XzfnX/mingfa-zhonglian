import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronRight, LogOut } from 'lucide-react'
import { BrandMark } from './BrandMark'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { cx } from '../lib/utils'

interface NavItem {
  label: string
  to: string
}

const infoNav: NavItem[] = [
  { label: '项目成果', to: '/results' },
  { label: '关于我们', to: '/about' },
]

/** 公共页头：首页、成果、关于等公开页面使用 */
export function PublicHeader() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { push } = useToast()
  const home = user?.userType === 'institution' ? '/institution' : '/citizen'
  const publicNav = [{ label: user?.userType === 'institution' ? '机构工作台' : '群众服务中心', to: home }, ...infoNav]

  function handleLogout() {
    logout()
    push('已退出登录。', 'info')
    navigate('/', { replace: true })
  }

  // 路由变化时收起移动端菜单
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      <div className="mf-container flex h-16 items-center justify-between gap-4">
        <Link to={home} aria-label="返回当前系统首页" className="shrink-0 rounded-lg">
          <BrandMark />
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="主导航">
          {publicNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cx(
                  'inline-flex min-h-[44px] items-center rounded-lg px-3.5 text-[15px] font-medium transition-colors',
                  isActive ? 'bg-white text-brand shadow-card' : 'text-ink-soft hover:bg-white/70 hover:text-brand',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <span className="text-sm text-ink-soft">{user?.displayName}</span>
          <button type="button" onClick={handleLogout} className="mf-btn-outline px-3.5 text-[14px]"><LogOut className="h-4 w-4" />退出</button>
        </div>

        {/* 移动端菜单按钮 */}
        <button
          type="button"
          className="mf-btn-outline min-h-[44px] w-[44px] px-0 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? '关闭导航菜单' : '打开导航菜单'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {/* 移动端导航面板 */}
      {open && (
        <div id="mobile-nav" className="border-t border-line bg-white lg:hidden">
          <nav className="mf-container flex flex-col py-3" aria-label="移动端导航">
            {publicNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cx(
                    'flex min-h-[48px] items-center justify-between rounded-lg px-3 text-[15px] font-medium',
                    isActive ? 'bg-cream text-brand' : 'text-ink-soft',
                  )
                }
              >
                {item.label}
                <ChevronRight className="h-4 w-4 opacity-50" aria-hidden="true" />
              </NavLink>
            ))}
            <div className="mt-3 border-t border-line pt-4"><button type="button" onClick={handleLogout} className="mf-btn-primary w-full"><LogOut className="h-4 w-4" />退出登录</button></div>
          </nav>
        </div>
      )}
    </header>
  )
}
