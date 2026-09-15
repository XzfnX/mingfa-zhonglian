import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Loader2,
  KeyRound,
  UserRound,
  ArrowLeft,
  CheckCircle2,
  TriangleAlert,
  Wand2,
  ShieldCheck,
  Landmark,
  Building2,
  School,
  Briefcase,
} from 'lucide-react'
import { BrandMark } from './BrandMark'
import { useAuth, firstRouteForInstitution } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  CITIZEN_DEMO,
  INSTITUTION_DEMO_USERS,
  getInstitutionDemo,
} from '../data/demoUsers'
import type { InstitutionType, SessionUser } from '../types'
import { cx } from '../lib/utils'

/* ============================================================
 * C 端群众登录
 * ============================================================ */
export function CitizenLoginForm() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { login } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  function fillDemo() {
    setPhone(CITIZEN_DEMO.username)
    setPassword(CITIZEN_DEMO.password)
    setError(null)
    push('已填入群众端演示账号。', 'info')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    window.setTimeout(() => {
      setLoading(false)
      if (!phone.trim() || !password) {
        setError('请输入手机号和密码，或点击「一键填入演示账号」。')
        return
      }
      if (phone.trim() === CITIZEN_DEMO.username && password === CITIZEN_DEMO.password) {
        const payload: SessionUser = {
          loggedIn: true,
          userType: 'citizen',
          displayName: CITIZEN_DEMO.displayName,
        }
        login(payload)
        setSuccess(true)
        push('登录成功，正在进入群众普法服务中心。', 'success')
        window.setTimeout(() => navigate(from && from.startsWith('/citizen') ? from : '/citizen', { replace: true }), 620)
      } else {
        setError('手机号或密码不正确。演示账号：13800000001 / 123456')
      }
    }, 620)
  }

  return (
    <LoginShell
      tone="citizen"
      title="群众普法服务中心登录"
      subtitle="登录后即可免费使用全部群众普法服务模块"
      side={<CitizenLoginSide />}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="citizen-phone" className="mf-label">
            手机号
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <input
              id="citizen-phone"
              className="mf-input pl-10"
              inputMode="numeric"
              autoComplete="off"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入演示手机号"
              aria-invalid={!!error}
              aria-describedby={error ? 'citizen-error' : undefined}
            />
          </div>
        </div>

        <div>
          <label htmlFor="citizen-password" className="mf-label">
            密码
          </label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <input
              id="citizen-password"
              type={showPwd ? 'text' : 'password'}
              className="mf-input px-10"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入演示密码"
              aria-invalid={!!error}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2.5 text-ink-soft transition-colors hover:text-brand"
              aria-label={showPwd ? '隐藏密码' : '显示密码'}
              aria-pressed={showPwd}
            >
              {showPwd ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <Feedback error={error} success={success} successText="登录成功，正在进入群众普法服务中心……" idPrefix="citizen" />

        <button type="button" onClick={fillDemo} className="mf-btn-outline w-full gap-2 text-[14px]">
          <Wand2 className="h-4 w-4" aria-hidden="true" />
          一键填入演示账号
        </button>

        <button type="submit" className="mf-btn-primary w-full" disabled={loading || success}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              正在登录
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              登录成功
            </>
          ) : (
            '登录 / 进入服务中心'
          )}
        </button>
      </form>

      <DemoAccountsCitizen />

      <nav className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-[13px]">
        <Link to="/" className="mf-btn-ghost gap-1.5 px-3">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回身份选择
        </Link>
        <Link to="/login/institution" className="mf-link">
          我是机构客户，前往机构登录
        </Link>
      </nav>

      <p className="mt-4 text-[12px] leading-relaxed text-ink-soft">
        说明：本页不发送任何短信验证码，不进行真实用户注册，不采集真实个人信息。登录仅用于演示区分「群众端」与「机构端」。
      </p>
    </LoginShell>
  )
}

/* ============================================================
 * B 端机构登录
 * ============================================================ */
const institutionTabs: { id: InstitutionType; label: string; icon: typeof Landmark }[] = [
  { id: 'justice', label: '司法局', icon: Landmark },
  { id: 'street', label: '街道政府', icon: Building2 },
  { id: 'school', label: '学校', icon: School },
  { id: 'enterprise', label: '企业', icon: Briefcase },
]

export function InstitutionLoginForm() {
  const [tab, setTab] = useState<InstitutionType>('justice')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { login } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const demo = useMemo(() => getInstitutionDemo(tab), [tab])

  function fillDemo(type: InstitutionType = tab) {
    const d = getInstitutionDemo(type)
    setTab(type)
    setAccount(d.username)
    setPassword(d.password)
    setError(null)
    push(`已填入${d.orgName ?? '机构'}演示账号。`, 'info')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    window.setTimeout(() => {
      setLoading(false)
      if (!account.trim() || !password) {
        setError('请输入机构账号和密码，或点击「一键填入演示账号」。')
        return
      }
      const matched = INSTITUTION_DEMO_USERS.find(
        (u) => u.username === account.trim() && u.password === password,
      )
      if (matched) {
        const payload: SessionUser = {
          loggedIn: true,
          userType: 'institution',
          institutionType: matched.institutionType,
          displayName: matched.displayName,
          orgName: matched.orgName,
          orgRole: matched.orgRole,
        }
        login(payload)
        setSuccess(true)
        push(`登录成功，正在打开${matched.orgName ?? '机构'}对应的解决方案。`, 'success')
        const target =
          from && from.startsWith('/institution') ? from : firstRouteForInstitution(matched.institutionType)
        window.setTimeout(() => navigate(target, { replace: true }), 640)
      } else {
        setError('账号或密码不正确。请选择机构类型后点击「一键填入演示账号」。')
      }
    }, 640)
  }

  return (
    <LoginShell
      tone="institution"
      title="机构解决方案中心登录"
      subtitle="登录后查看标准化产品能力、交付物清单与成效评估看板"
      side={<InstitutionLoginSide />}
    >
      {/* 机构类型切换 */}
      <div>
        <p className="mf-label">选择机构类型</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" role="tablist" aria-label="机构类型">
          {institutionTabs.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setTab(t.id)
                  setError(null)
                }}
                className={cx(
                  'flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-xl border transition-colors',
                  active ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink-soft hover:border-brand/40',
                )}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                <span className="text-[13px] font-medium">{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
        <div>
          <label htmlFor="inst-account" className="mf-label">
            机构账号
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <input
              id="inst-account"
              className="mf-input pl-10"
              autoComplete="off"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder={demo.username}
              aria-invalid={!!error}
            />
          </div>
        </div>

        <div>
          <label htmlFor="inst-password" className="mf-label">
            密码
          </label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <input
              id="inst-password"
              type={showPwd ? 'text' : 'password'}
              className="mf-input px-10"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入演示密码"
              aria-invalid={!!error}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2.5 text-ink-soft transition-colors hover:text-brand"
              aria-label={showPwd ? '隐藏密码' : '显示密码'}
              aria-pressed={showPwd}
            >
              {showPwd ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <Feedback error={error} success={success} successText="登录成功，正在打开对应行业解决方案……" idPrefix="inst" />

        <button type="button" onClick={() => fillDemo()} className="mf-btn-outline w-full gap-2 text-[14px]">
          <Wand2 className="h-4 w-4" aria-hidden="true" />
          一键填入演示账号
        </button>

        <button type="submit" className="mf-btn-primary w-full" disabled={loading || success}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              正在登录
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              登录成功
            </>
          ) : (
            '登录 / 进入方案中心'
          )}
        </button>
      </form>

      <DemoAccountsInstitution activeType={tab} onPick={fillDemo} />

      <nav className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-[13px]">
        <Link to="/" className="mf-btn-ghost gap-1.5 px-3">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回身份选择
        </Link>
        <Link to="/login/citizen" className="mf-link">
          我是普通群众，前往群众登录
        </Link>
      </nav>

      <p className="mt-4 text-[12px] leading-relaxed text-ink-soft">
        说明：机构端登录同样为演示用途，不具备真实的安全鉴权能力。不同机构账号登录后会默认打开对应行业的解决方案页面。
      </p>
    </LoginShell>
  )
}

/* ============================================================
 * 共用外壳与片段
 * ============================================================ */

function LoginShell({
  tone,
  title,
  subtitle,
  side,
  children,
}: {
  tone: 'citizen' | 'institution'
  title: string
  subtitle: string
  side: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-cream">
      {/* 顶部返回条 */}
      <div className={cx('border-b', tone === 'citizen' ? 'border-line bg-cream-soft' : 'border-line bg-white')}>
        <div className="mf-container flex h-16 items-center justify-between">
          <Link to="/" className="rounded-lg" aria-label="返回明法众联身份选择首页">
            <BrandMark subtitle={tone === 'citizen' ? '群众普法服务' : '机构解决方案'} />
          </Link>
          <Link to="/" className="mf-btn-ghost gap-1.5 px-3 text-[13px]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            返回身份选择
          </Link>
        </div>
      </div>

      <div className="mf-container grid gap-10 py-10 lg:grid-cols-[1.05fr_1fr] lg:py-16">
        {/* 左侧：说明区 */}
        <div className="order-2 lg:order-1">{side}</div>

        {/* 右侧：表单卡 */}
        <div className="order-1 lg:order-2">
          <div className="mx-auto w-full max-w-[520px] rounded-xl2 border border-line bg-white p-6 shadow-card sm:p-7">
            <div
              className={cx(
                'mb-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium',
                tone === 'citizen'
                  ? 'border-success/30 bg-success/5 text-success'
                  : 'border-brand/25 bg-brand/5 text-brand',
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {tone === 'citizen' ? '群众端 · 全部模块免费体验' : '机构端 · 演示工作区'}
            </div>
            <h1 className="font-serif text-[24px] font-semibold leading-snug text-ink">{title}</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>

        </div>
      </div>
    </div>
  )
}

function Feedback({
  error,
  success,
  successText,
  idPrefix,
}: {
  error: string | null
  success: boolean
  successText: string
  idPrefix: string
}) {
  if (success) {
    return (
      <p
        className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/5 px-3.5 py-2.5 text-[13px] leading-relaxed text-success"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {successText}
      </p>
    )
  }
  if (!error) return null
  return (
    <p
      id={`${idPrefix}-error`}
      className="flex items-start gap-2 rounded-lg border border-brand-accent/35 bg-brand-accent/5 px-3.5 py-2.5 text-[13px] leading-relaxed text-brand-accent"
      role="alert"
    >
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {error}
    </p>
  )
}

function DemoAccountsCitizen() {
  const { push } = useToast()
  return (
    <div className="mt-5 rounded-xl border border-line bg-cream-soft p-4">
      <p className="text-[13px] font-semibold text-ink">群众端演示账号</p>
      <dl className="mt-2 space-y-1.5 text-[13px]">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-soft">手机号</dt>
          <dd className="font-medium text-ink">13800000001</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-soft">密码</dt>
          <dd className="font-medium text-ink">123456</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText('13800000001 / 123456').then(
            () => push('演示账号已复制到剪贴板。', 'success'),
            () => push('当前环境无法自动复制，请手动记下演示账号。', 'info'),
          )
        }}
        className="mf-btn-ghost mt-2.5 h-9 min-h-0 px-2.5 text-[12px]"
      >
        复制演示账号
      </button>
    </div>
  )
}

function DemoAccountsInstitution({
  activeType,
  onPick,
}: {
  activeType: InstitutionType
  onPick: (t: InstitutionType) => void
}) {
  return (
    <div className="mt-5 rounded-xl border border-line bg-cream-soft p-4">
      <p className="text-[13px] font-semibold text-ink">机构端演示账号（点击即可填入）</p>
      <ul className="mt-2.5 space-y-1.5">
        {INSTITUTION_DEMO_USERS.map((u) => {
          const tabMeta = institutionTabs.find((t) => t.id === u.institutionType)
          const active = u.institutionType === activeType
          return (
            <li key={u.username}>
              <button
                type="button"
                onClick={() => onPick(u.institutionType!)}
                aria-pressed={active}
                className={cx(
                  'flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-[13px] transition-colors',
                  active ? 'border-brand bg-white' : 'border-line bg-white/70 hover:border-brand/40',
                )}
              >
                <span className="font-medium text-ink">{tabMeta?.label}</span>
                <span className="truncate text-ink-soft">{u.username} / {u.password}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ---------- 左侧说明区 ---------- */

function CitizenLoginSide() {
  const items = [
    { title: '智能普法咨询', desc: '输入问题即可获得处理步骤、材料清单与求助渠道指引。' },
    { title: '生活案例与文书指引', desc: '六大主题案例解析，常见法律文书的准备与填写说明。' },
    { title: '法律援助指引', desc: '申请条件、办理流程、材料清单与常见问题解答。' },
    { title: '适老与无障碍', desc: '大字号、高对比度、模拟语音输入与播报，降低使用门槛。' },
  ]
  return (
    <div>
      <p className="mf-eyebrow mb-2">群众端 · 免费普惠</p>
      <h2 className="font-serif text-[28px] font-semibold leading-snug text-ink sm:text-[32px]">
        用听得懂的语言
        <br className="hidden sm:block" />
        了解法律常识与维权路径
      </h2>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
        所有群众普法模块免费开放，不设门槛。内容仅作一般性指引，遇到紧急或复杂事项请咨询专业律师或当地法律援助机构。
      </p>
      <ul className="mt-6 space-y-3">
        {items.map((it) => (
          <li key={it.title} className="flex gap-3 rounded-xl border border-line bg-white p-4">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-ink">{it.title}</span>
              <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-soft">{it.desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function InstitutionLoginSide() {
  const items = [
    { name: '司法局', product: '智慧普法运营与成效评估平台', icon: Landmark },
    { name: '街道政府', product: '基层法治需求与矛盾预防服务包', icon: Building2 },
    { name: '学校', product: '校园法治教育与模拟法庭课程体系', icon: School },
    { name: '企业', product: '企业合规宣教与员工法律风险培训', icon: Briefcase },
  ]
  return (
    <div>
      <p className="mf-eyebrow mb-2">机构端 · 可复制可交付</p>
      <h2 className="font-serif text-[28px] font-semibold leading-snug text-ink sm:text-[32px]">
        四类标准化解决方案
        <br className="hidden sm:block" />
        支撑机构普法工作落地
      </h2>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
        从需求诊断到成果报告，形成完整交付链条。登录后可查看各方案的核心模块、成效看板与标准交付物。
      </p>
      <ul className="mt-6 space-y-3">
        {items.map((it) => {
          const Icon = it.icon
          return (
            <li key={it.name} className="flex items-center gap-3.5 rounded-xl border border-line bg-white p-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-cream text-brand">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-ink">{it.name}</span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-soft">{it.product}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
