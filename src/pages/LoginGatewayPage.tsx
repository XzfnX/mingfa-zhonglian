import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Building2, CheckCircle2, Eye, EyeOff, Landmark, Loader2, LockKeyhole, School, ShieldCheck, Smartphone, UserCog, UsersRound } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { useAuth, verifyDemoLogin } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ADMIN_DEMO, CITIZEN_DEMO, getInstitutionDemo } from '../data/demoUsers'
import type { InstitutionType, UserType } from '../types'
import { cx } from '../lib/utils'

const institutionTypes: { id: InstitutionType; label: string; icon: typeof Landmark }[] = [
  { id: 'justice', label: '司法局', icon: Landmark },
  { id: 'street', label: '街道政府', icon: Building2 },
  { id: 'school', label: '学校', icon: School },
  { id: 'enterprise', label: '企业', icon: ShieldCheck },
]

const homeFor = (role: UserType) => role === 'citizen' ? '/citizen' : role === 'admin' ? '/admin' : '/institution'

function safeTarget(from: string | null, role: UserType) {
  if (!from?.startsWith('/')) return homeFor(role)
  if (from.startsWith('/results') || from.startsWith('/about')) return from
  if (role === 'citizen' && from.startsWith('/citizen')) return from
  if (role === 'institution' && from.startsWith('/institution')) return from
  if (role === 'admin' && from.startsWith('/admin')) return from
  return homeFor(role)
}

const roleMeta = {
  citizen: { label: '个人端', icon: UsersRound, accountLabel: '手机号', desc: '面向普通群众，提供普惠、免费、易理解的法律服务路径。' },
  institution: { label: '机构端', icon: Building2, accountLabel: '机构账号', desc: '机构账号仅进入所属机构的独立工作台与业务方案。' },
  admin: { label: '管理员', icon: UserCog, accountLabel: '管理员账号', desc: '统一查看四类机构的运营总览，并进入各机构后台。' },
} satisfies Record<UserType, { label: string; icon: typeof UsersRound; accountLabel: string; desc: string }>

export default function LoginGatewayPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedRole = searchParams.get('role')
  const initialRole: UserType = requestedRole === 'institution' || requestedRole === 'admin' ? requestedRole : 'citizen'
  const [role, setRole] = useState<UserType>(initialRole)
  const [institutionType, setInstitutionType] = useState<InstitutionType>('justice')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, login } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()

  const currentAccount = useMemo(() => role === 'citizen' ? CITIZEN_DEMO : role === 'admin' ? ADMIN_DEMO : getInstitutionDemo(institutionType), [role, institutionType])

  useEffect(() => {
    if (user) navigate(homeFor(user.userType), { replace: true })
  }, [user, navigate])

  function changeRole(next: UserType) {
    setRole(next)
    setError('')
    setUsername('')
    setPassword('')
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('role', next)
    setSearchParams(nextParams, { replace: true })
  }

  function fillAccount() {
    setUsername(currentAccount.username)
    setPassword(currentAccount.password)
    setError('')
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    verifyDemoLogin(username, password, currentAccount.username, currentAccount.password, {
      userType: currentAccount.userType,
      institutionType: currentAccount.institutionType,
      displayName: currentAccount.displayName,
      orgName: currentAccount.orgName,
      orgRole: currentAccount.orgRole,
    }, login, setLoading, setError, () => {
      const destination = role === 'citizen' ? '个人服务中心' : role === 'admin' ? '管理中心' : '机构工作台'
      push(`已进入${destination}。`, 'success')
      navigate(safeTarget(searchParams.get('from'), role), { replace: true })
    })
  }

  const CurrentRoleIcon = roleMeta[role].icon

  return (
    <main className="min-h-screen bg-[#F3F5F7]">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex min-h-[76px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <BrandMark size={38} subtitle="智慧普法服务平台" />
          <p className="hidden text-sm text-ink-soft sm:block">统一身份入口</p>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,650px)_minmax(300px,1fr)] lg:py-14">
        <section className="border border-line bg-white p-6 shadow-card sm:p-9" aria-labelledby="login-title">
          <p className="text-sm font-semibold text-brand">明法众联服务入口</p>
          <h1 id="login-title" className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-[30px]">登录后进入对应服务系统</h1>
          <p className="mt-3 text-sm leading-6 text-ink-soft">个人服务、机构业务与平台管理采用独立入口和权限范围。</p>

          <div className="mt-7 grid grid-cols-3 border-b border-line" role="tablist" aria-label="选择登录身份">
            {(Object.keys(roleMeta) as UserType[]).map((item) => {
              const Icon = roleMeta[item].icon
              return <button key={item} type="button" role="tab" aria-selected={role === item} onClick={() => changeRole(item)} className={cx('flex min-h-[52px] items-center justify-center gap-2 border-b-2 px-2 text-sm font-semibold', role === item ? 'border-brand text-brand' : 'border-transparent text-ink-soft hover:text-ink')}><Icon className="h-4 w-4" />{roleMeta[item].label}</button>
            })}
          </div>

          {role === 'institution' && (
            <fieldset className="mt-6">
              <legend className="mb-3 text-sm font-semibold text-ink">选择所属机构</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {institutionTypes.map((item) => {
                  const Icon = item.icon
                  const active = institutionType === item.id
                  return <button key={item.id} type="button" onClick={() => { setInstitutionType(item.id); setUsername(''); setPassword(''); setError('') }} className={cx('flex min-h-[62px] flex-col items-center justify-center gap-1 border px-2 text-xs font-medium', active ? 'border-brand bg-[#FFF7F7] text-brand' : 'border-line bg-white text-ink-soft hover:border-gray-400')}><Icon className="h-5 w-5" />{item.label}</button>
                })}
              </div>
            </fieldset>
          )}

          <form className="mt-6" onSubmit={submit} noValidate>
            <label htmlFor="gateway-account" className="mf-label">{roleMeta[role].accountLabel}</label>
            <div className="relative">
              {role === 'citizen' ? <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /> : <CurrentRoleIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />}
              <input id="gateway-account" autoComplete="username" className="mf-input pl-10" value={username} onChange={(event) => setUsername(event.target.value)} placeholder={`请输入${roleMeta[role].accountLabel}`} aria-invalid={Boolean(error)} />
            </div>
            <div className="mt-4">
              <label htmlFor="gateway-password" className="mf-label">密码</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input id="gateway-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" className="mf-input px-10" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="请输入密码" aria-invalid={Boolean(error)} />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-ink-soft hover:text-ink" aria-label={showPassword ? '隐藏密码' : '显示密码'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>
            {error && <p className="mt-3 border-l-2 border-brand bg-[#FFF7F7] px-3 py-2 text-sm text-brand" role="alert">{error}</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={loading} className="mf-btn-primary min-h-[46px] flex-1">{loading ? <><Loader2 className="h-4 w-4 animate-spin" />正在验证</> : '登录并进入系统'}</button>
              <button type="button" onClick={fillAccount} className="mf-btn-outline min-h-[46px] flex-1">快捷填入账号</button>
            </div>
          </form>
        </section>

        <aside className="border border-line bg-[#F9FAFB] p-6 sm:p-8" aria-label="身份说明">
          <div className="flex h-11 w-11 items-center justify-center bg-brand text-white"><CurrentRoleIcon className="h-5 w-5" /></div>
          <h2 className="mt-5 text-lg font-bold text-ink">当前登录身份</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{roleMeta[role].desc}</p>
          <dl className="mt-6 border-y border-line py-4 text-sm">
            <div className="flex items-center justify-between gap-4 py-1.5"><dt className="text-ink-soft">账号</dt><dd className="font-mono font-semibold text-ink">{currentAccount.username}</dd></div>
            <div className="flex items-center justify-between gap-4 py-1.5"><dt className="text-ink-soft">密码</dt><dd className="font-mono font-semibold text-ink">{currentAccount.password}</dd></div>
          </dl>
          <ul className="mt-6 space-y-3 text-sm text-ink-soft">
            {(role === 'admin' ? ['查看四类机构运营概况', '进入各机构后台查看业务数据', '个人端与机构端权限相互隔离'] : role === 'institution' ? ['每个机构拥有独立工作台', '仅展示本机构业务与解决方案', '无法访问其他机构后台'] : ['通俗易懂的法律服务路径', '案例、文书与援助指引集中查询', '支持大字号与高对比度']).map((text) => <li key={text} className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{text}</li>)}
          </ul>
        </aside>
      </div>
    </main>
  )
}
