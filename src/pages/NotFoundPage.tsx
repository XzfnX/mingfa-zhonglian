import { Link } from 'react-router-dom'
import { Home, Search, Compass, ArrowLeft, Users, Building2 } from 'lucide-react'
import { BrandMark } from '../components/BrandMark'

/** 404 页面 */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <div className="border-b border-line bg-cream-soft">
        <div className="mf-container flex h-16 items-center">
          <Link to="/" className="rounded-lg" aria-label="返回明法众联首页">
            <BrandMark />
          </Link>
        </div>
      </div>

      <main id="main" className="mf-container flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-xl text-center">
          <p className="font-serif text-[64px] font-semibold leading-none text-brand/15 sm:text-[88px]">404</p>
          <h1 className="mt-4 font-serif text-[26px] font-semibold leading-snug text-ink sm:text-[30px]">
            页面没有找到
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            你访问的页面可能已被移动、重命名，或者链接输入有误。可以从下面的入口重新开始。
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="mf-btn-primary gap-1.5">
              <Home className="h-4 w-4" aria-hidden="true" />
              返回首页
            </Link>
            <Link to="/login/citizen" className="mf-btn-outline gap-1.5">
              <Users className="h-4 w-4" aria-hidden="true" />
              群众服务中心
            </Link>
            <Link to="/login/institution" className="mf-btn-outline gap-1.5">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              机构方案中心
            </Link>
          </div>

          <div className="mt-10 rounded-xl2 border border-line bg-white p-5 text-left">
            <p className="flex items-center gap-2 text-[14px] font-semibold text-ink">
              <Compass className="h-4 w-4 text-brand" aria-hidden="true" />
              可能你想找的页面
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                { label: '智能普法咨询', to: '/citizen/consult', icon: Search },
                { label: '生活法律案例', to: '/citizen/cases', icon: Search },
                { label: '法律文书指引', to: '/citizen/documents', icon: Search },
                { label: '法律援助指引', to: '/citizen/aid', icon: Search },
                { label: '项目成果', to: '/results', icon: ArrowLeft },
                { label: '关于明法众联', to: '/about', icon: ArrowLeft },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-cream-soft px-3.5 text-[13px] text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mf-container py-6">
          <p className="text-xs leading-relaxed text-ink-soft">
            明法众联 · 参赛路演演示版本。本网站不提供真实支付、真实法律咨询与真实用户注册功能。
          </p>
        </div>
      </footer>
    </div>
  )
}
