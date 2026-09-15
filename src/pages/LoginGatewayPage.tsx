import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Building2, CheckCircle2, Eye, EyeOff, Landmark, Loader2, LockKeyhole, School, ShieldCheck, Smartphone, UsersRound } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { useAuth, verifyDemoLogin } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { CITIZEN_DEMO, DEMO_ENV_NOTICE, getInstitutionDemo } from '../data/demoUsers'
import type { InstitutionType, UserType } from '../types'
import { cx } from '../lib/utils'

const institutionTypes: { id: InstitutionType; label: string; icon: typeof Landmark }[] = [
  { id: 'justice', label: '司法局', icon: Landmark },
  { id: 'street', label: '街道政府', icon: Building2 },
  { id: 'school', label: '学校', icon: School },
  { id: 'enterprise', label: '企业', icon: ShieldCheck },
]

function safeTarget(from: string | null, role: UserType) {
  if (!from?.startsWith('/')) return role === 'citizen' ? '/citizen' : '/institution'
  if (from.startsWith('/results') || from.startsWith('/about')) return from
  if (role === 'citizen' && from.startsWith('/citizen')) return from
  if (role === 'institution' && from.startsWith('/institution')) return from
  return role === 'citizen' ? '/citizen' : '/institution'
}

export default function LoginGatewayPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialRole = searchParams.get('role') === 'institution' ? 'institution' : 'citizen'
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

  const currentDemo = useMemo(
    () => (role === 'citizen' ? CITIZEN_DEMO : getInstitutionDemo(institutionType)),
    [role, institutionType],
  )

  useEffect(() => {
    if (user) navigate(user.userType === 'citizen' ? '/citizen' : '/institution', { replace: true })
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

  function fillDemo() {
    setUsername(currentDemo.username)
    setPassword(currentDemo.password)
    setError('')
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    verifyDemoLogin(
      username,
      password,
      currentDemo.username,
      currentDemo.password,
      {
        userType: currentDemo.userType,
        institutionType: currentDemo.institutionType,
        displayName: currentDemo.displayName,
        orgName: currentDemo.orgName,
        orgRole: currentDemo.orgRole,
      },
      login,
      setLoading,
      setError,
      () => {
        push(`已进入${role === 'citizen' ? '群众服务中心' : '机构工作台'}。`, 'success')
        navigate(safeTarget(searchParams.get('from'), role), { replace: true })
      },
    )
  }

  return (
    <main className="min-h-screen bg-[#F3F5F7]">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex min-h-[76px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <BrandMark size={38} subtitle="智慧普法服务平台" />
          <p className="hidden text-sm text-ink-soft sm:block">身份分区入口 · 路演演示版</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,650px)_minmax(300px,1fr)] lg:py-14">
        <section className="border border-line bg-white p-6 shadow-card sm:p-9" aria-labelledby="login-title">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-brand">明法众联服务入口</p>
            <h1 id="login-title" className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-[30px]">
              登录后进入对应服务系统
            </h1>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              群众端提供免费普法服务；机构端展示面向司法局、街道、学校和企业的产品能力。
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 border-b border-line" role="tablist" aria-label="选择登录身份">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'citizen'}
              onClick={() => changeRole('citizen')}
              className={cx(
                'flex min-h-[52px] items-center justify-center gap-2 border-b-2 px-4 text-sm font-semibold',
                role === 'citizen' ? 'border-brand text-brand' : 'border-transparent text-ink-soft hover:text-ink',
              )}
            >
              <UsersRound className="h-4 w-4" aria-hidden="true" />
              群众端
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'institution'}
              onClick={() => changeRole('institution')}
              className={cx(
                'flex min-h-[52px] items-center justify-center gap-2 border-b-2 px-4 text-sm font-semibold',
                role === 'institution' ? 'border-brand text-brand' : 'border-transparent text-ink-soft hover:text-ink',
              )}
            >
              <Building2 className="h-4 w-4" aria-hidden="true" />
              机构端
            </button>
          </div>

          {role === 'institution' && (
            <fieldset className="mt-6">
              <legend className="mb-3 text-sm font-semibold text-ink">选择机构类型</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {institutionTypes.map((item) => {
                  const Icon = item.icon
                  const active = institutionType === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setInstitutionType(item.id)
                        setUsername('')
                        setPassword('')
                        setError('')
                      }}
                      className={cx(
                        'flex min-h-[62px] flex-col items-center justify-center gap-1 border px-2 text-xs font-medium',
                        active ? 'border-brand bg-[#FFF7F7] text-brand' : 'border-line bg-white text-ink-soft hover:border-gray-400',
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          <form className="mt-6" onSubmit={submit} noValidate>
            <div>
              <label htmlFor="gateway-account" className="mf-label">
                {role === 'citizen' ? '手机号' : '机构账号'}
              </label>
              <div className="relative">
                {role === 'citizen' ? (
                  <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                ) : (
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                )}
                <input
                  id="gateway-account"
                  autoComplete="username"
                  className="mf-input pl-10"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder={role === 'citizen' ? '请输入演示手机号' : '请输入机构演示账号'}
                  aria-invalid={Boolean(error)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="gateway-password" className="mf-label">密码</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  id="gateway-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="mf-input px-10"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="请输入演示密码"
                  aria-invalid={Boolean(error)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-ink-soft hover:text-ink"
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="mt-3 border-l-2 border-brand bg-[#FFF7F7] px-3 py-2 text-sm text-brand" role="alert">{error}</p>}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={loading} className="mf-btn-primary min-h-[46px] flex-1">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />正在验证</> : '登录并进入系统'}
              </button>
              <button type="button" onClick={fillDemo} className="mf-btn-outline min-h-[46px] flex-1">
                一键填入演示账号
              </button>
            </div>
          </form>
        </section>

        <aside className="border border-line bg-[#F9FAFB] p-6 sm:p-8" aria-label="演示说明">
          <div className="flex h-11 w-11 items-center justify-center bg-brand text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-lg font-bold text-ink">当前演示身份</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {role === 'citizen'
              ? '群众端面向普通群众，提供普惠、免费、易理解的法律服务路径。'
              : `${institutionTypes.find((item) => item.id === institutionType)?.label}账号将进入机构工作台，并优先展示对应行业方案。`}
          </p>

          <dl className="mt-6 border-y border-line py-4 text-sm">
            <div className="flex items-center justify-between gap-4 py-1.5">
              <dt className="text-ink-soft">演示账号</dt>
              <dd className="font-mono font-semibold text-ink">{currentDemo.username}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-1.5">
              <dt className="text-ink-soft">演示密码</dt>
              <dd className="font-mono font-semibold text-ink">{currentDemo.password}</dd>
            </div>
          </dl>

          <ul className="mt-6 space-y-3 text-sm text-ink-soft">
            {['身份分区后进入独立业务界面', '页面指标与咨询回答均为本地演示数据', '不采集个人信息，不产生真实交易'].map((text) => (
              <li key={text} className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-7 border-l-2 border-gray-300 pl-3 text-xs leading-5 text-ink-soft">{DEMO_ENV_NOTICE}</p>
        </aside>
      </div>
    </main>
  )
}
