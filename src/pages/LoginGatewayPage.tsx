import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Building2, Eye, EyeOff, Landmark, Loader2, LockKeyhole, School, ShieldCheck, Smartphone, UserCog, UsersRound } from 'lucide-react'
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
  citizen: { label: '个人端', icon: UsersRound, accountLabel: '手机号' },
  institution: { label: '机构端', icon: Building2, accountLabel: '机构账号' },
  admin: { label: '管理员', icon: UserCog, accountLabel: '管理员账号' },
} satisfies Record<UserType, { label: string; icon: typeof UsersRound; accountLabel: string }>

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
      {/* 登录表单：单卡片居中，横向长方形比例 */}
      <div className="mx-auto flex min-h-[calc(100vh-77px)] w-full max-w-[1180px] items-center justify-center px-5 py-10 sm:px-8">
        <section className="w-full max-w-[760px] rounded-lg border border-line bg-white p-6 shadow-card sm:p-9" aria-labelledby="login-title">
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
            {/* 账号在上、密码在下，单列纵向排布 */}
            <div className="grid gap-4">
              <div>
                <label htmlFor="gateway-account" className="mf-label">{roleMeta[role].accountLabel}</label>
                <div className="relative">
                  {role === 'citizen' ? <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /> : <CurrentRoleIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />}
                  <input id="gateway-account" autoComplete="username" className="mf-input pl-10" value={username} onChange={(event) => setUsername(event.target.value)} placeholder={`请输入${roleMeta[role].accountLabel}`} aria-invalid={Boolean(error)} />
                </div>
              </div>
              <div>
                <label htmlFor="gateway-password" className="mf-label">密码</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input id="gateway-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" className="mf-input px-10" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="请输入密码" aria-invalid={Boolean(error)} />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-ink-soft hover:text-ink" aria-label={showPassword ? '隐藏密码' : '显示密码'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
            </div>
            {error && <p className="mt-3 border-l-2 border-brand bg-[#FFF7F7] px-3 py-2 text-sm text-brand" role="alert">{error}</p>}
            <div className="mt-6 grid gap-3">
              <button type="submit" disabled={loading} className="mf-btn-primary min-h-[46px] w-full">{loading ? <><Loader2 className="h-4 w-4 animate-spin" />正在验证</> : '登录并进入系统'}</button>
              <button type="button" onClick={fillAccount} className="mf-btn-outline min-h-[46px] w-full">快捷填入账号</button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
