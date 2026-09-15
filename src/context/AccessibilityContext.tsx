import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * 无障碍 / 适老化偏好（仅作用于当前浏览器标签页，不上传任何数据）
 * - 字号：标准 / 大 / 特大
 * - 高对比度
 * - 减弱动效
 * - 大点击区域
 */
export type FontSize = 'normal' | 'large' | 'xlarge'

export interface A11ySettings {
  fontSize: FontSize
  highContrast: boolean
  reducedMotion: boolean
  largeHit: boolean
}

interface A11yContextValue extends A11ySettings {
  setFontSize: (s: FontSize) => void
  toggleContrast: () => void
  toggleMotion: () => void
  toggleHit: () => void
  /** 一次性写入多项偏好，供引导弹窗保存草稿使用 */
  update: (patch: Partial<A11ySettings>) => void
  reset: () => void
  /** 是否已完成首次适老化与无障碍引导（仅影响是否自动弹出引导弹窗） */
  hasCompletedOnboarding: boolean
  completeOnboarding: () => void
}

const DEFAULTS: A11ySettings = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  largeHit: false,
}

const STORAGE_KEY = 'mfzl.a11y'
const ONBOARDING_KEY = 'mfzl.a11y.onboarded'

const A11yContext = createContext<A11yContextValue | null>(null)

function applyToDocument(s: A11ySettings) {
  const html = document.documentElement
  html.dataset.font = s.fontSize
  if (s.highContrast) html.dataset.contrast = 'high'
  else delete html.dataset.contrast
  if (s.reducedMotion) html.dataset.motion = 'reduced'
  else delete html.dataset.motion
  if (s.largeHit) html.dataset.hit = 'large'
  else delete html.dataset.hit
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<A11ySettings>) }
    } catch {
      /* 忽略 */
    }
    return DEFAULTS
  })

  // 首次引导标记与偏好分开存储：恢复默认设置不会让引导弹窗重新弹出
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDING_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    applyToDocument(settings)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* 忽略 */
    }
  }, [settings])

  const completeOnboarding = useCallback(() => {
    setHasCompletedOnboarding(true)
    try {
      localStorage.setItem(ONBOARDING_KEY, '1')
    } catch {
      /* 忽略 */
    }
  }, [])

  const setFontSize = useCallback((fontSize: FontSize) => setSettings((p) => ({ ...p, fontSize })), [])
  const toggleContrast = useCallback(() => setSettings((p) => ({ ...p, highContrast: !p.highContrast })), [])
  const toggleMotion = useCallback(() => setSettings((p) => ({ ...p, reducedMotion: !p.reducedMotion })), [])
  const toggleHit = useCallback(() => setSettings((p) => ({ ...p, largeHit: !p.largeHit })), [])
  const update = useCallback((patch: Partial<A11ySettings>) => setSettings((p) => ({ ...p, ...patch })), [])
  const reset = useCallback(() => setSettings(DEFAULTS), [])

  const value = useMemo<A11yContextValue>(
    () => ({
      ...settings,
      setFontSize,
      toggleContrast,
      toggleMotion,
      toggleHit,
      update,
      reset,
      hasCompletedOnboarding,
      completeOnboarding,
    }),
    [settings, setFontSize, toggleContrast, toggleMotion, toggleHit, update, reset, hasCompletedOnboarding, completeOnboarding],
  )

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>
}

export function useA11y() {
  const ctx = useContext(A11yContext)
  if (!ctx) throw new Error('useA11y 必须在 AccessibilityProvider 内使用')
  return ctx
}
