import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { InstitutionType, SessionUser, UserType } from '../types'

/**
 * 纯前端登录状态管理
 *
 * ⚠️ 说明：这里只是用 sessionStorage 做「前端身份区分」，用于路演演示。
 * 它不构成任何真实的安全鉴权 —— 没有后端校验、没有密码加密、没有权限服务。
 * 任何人都可以直接修改 sessionStorage 来改变身份。
 */

const SESSION_KEY = 'mfzl.session'

interface AuthContextValue {
  user: SessionUser | null
  isCitizen: boolean
  isInstitution: boolean
  isAdmin: boolean
  /** 登录（前端校验演示账号表） */
  login: (payload: SessionUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SessionUser
    if (parsed && parsed.loggedIn === true && ['citizen', 'institution', 'admin'].includes(parsed.userType)) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => readSession())

  // 刷新页面后，在当前标签页内保持登录状态（sessionStorage 特性）
  useEffect(() => {
    setUser(readSession())
  }, [])

  const login = useCallback((payload: SessionUser) => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload))
    } catch {
      /* 忽略存储异常（隐私模式等） */
    }
    setUser(payload)
  }, [])

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* 忽略 */
    }
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isCitizen: user?.userType === 'citizen',
      isInstitution: user?.userType === 'institution',
      isAdmin: user?.userType === 'admin',
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用')
  return ctx
}

/** 供登录页做前端账号校验（模拟账号表比对） */
export function verifyDemoLogin(
  inputUser: string,
  inputPass: string,
  expectedUser: string,
  expectedPass: string,
  payload: Omit<SessionUser, 'loggedIn'>,
  login: (u: SessionUser) => void,
  setLoading: (b: boolean) => void,
  onError: (msg: string) => void,
  onSuccess: () => void,
) {
  setLoading(true)
  // 模拟网络延迟，让加载状态可见（纯前端演示）
  window.setTimeout(() => {
    setLoading(false)
    if (inputUser.trim() === expectedUser && inputPass === expectedPass) {
      login({ ...payload, loggedIn: true })
      onSuccess()
    } else if (!inputUser.trim() || !inputPass) {
      onError('请输入账号和密码')
    } else {
      onError('账号或密码不正确，请使用快捷填入后重试')
    }
  }, 620)
}

export function firstRouteForInstitution(t: InstitutionType | undefined) {
  switch (t) {
    case 'justice':
      return '/institution/justice'
    case 'street':
      return '/institution/street'
    case 'school':
      return '/institution/school'
    case 'enterprise':
      return '/institution/enterprise'
    default:
      return '/institution'
  }
}

export function userTypeLabel(t?: UserType) {
  if (t === 'citizen') return '个人端'
  if (t === 'institution') return '机构端'
  if (t === 'admin') return '管理员端'
  return '未登录'
}
