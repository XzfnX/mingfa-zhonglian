import { useEffect, useRef, useState } from 'react'
import { Accessibility, Check, Contrast, MousePointerClick, Search, Zap, ZoomIn } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useA11y, type A11ySettings, type FontSize } from '../context/AccessibilityContext'
import { useToast } from '../context/ToastContext'
import { cx } from '../lib/utils'

const fontOptions: { id: FontSize; label: string; sample: string }[] = [
  { id: 'normal', label: '标准字号', sample: 'A' },
  { id: 'large', label: '大字号', sample: 'A' },
  { id: 'xlarge', label: '特大字号', sample: 'A' },
]

const toggleOptions: {
  key: 'highContrast' | 'largeHit' | 'reducedMotion'
  label: string
  desc: string
  icon: LucideIcon
  patch: (on: boolean) => Partial<A11ySettings>
}[] = [
  {
    key: 'highContrast',
    label: '高对比度模式',
    desc: '加深文字与边框对比，便于弱视用户阅读。',
    icon: Contrast,
    patch: (on) => ({ highContrast: on }),
  },
  {
    key: 'largeHit',
    label: '大点击区域',
    desc: '加大按钮尺寸，降低误触概率。',
    icon: MousePointerClick,
    patch: (on) => ({ largeHit: on }),
  },
  {
    key: 'reducedMotion',
    label: '减弱动效',
    desc: '关闭页面过渡与动画，减少视觉干扰。',
    icon: Zap,
    patch: (on) => ({ reducedMotion: on }),
  },
]

interface A11yOptionsProps {
  value: A11ySettings
  onChange: (patch: Partial<A11ySettings>) => void
  /** 改动时是否弹出轻提示（首次引导弹窗内保持安静，避免遮挡） */
  notify?: boolean
}

/**
 * 适老化 / 无障碍设置项（受控组件）
 * 首页首次引导弹窗与「设置 → 适老化与无障碍」界面共用同一套设置项。
 */
export function A11yOptions({ value, onChange, notify = true }: A11yOptionsProps) {
  const { push } = useToast()

  return (
    <div>
      {/* 字号 */}
      <div>
        <p className="mb-2.5 flex items-center gap-2 text-[14px] font-medium text-ink">
          <ZoomIn className="h-4 w-4 text-brand" aria-hidden="true" />
          页面字号
        </p>
        <div className="grid grid-cols-3 gap-2.5" role="group" aria-label="页面字号">
          {fontOptions.map((f) => {
            const active = value.fontSize === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  onChange({ fontSize: f.id })
                  if (notify) push(`已切换为「${f.label}」。`, 'info')
                }}
                aria-pressed={active}
                className={cx(
                  'flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-xl border transition-colors',
                  active ? 'border-brand bg-brand text-white' : 'border-line bg-cream-soft text-ink hover:border-brand/40',
                )}
              >
                <span className={cx('font-serif leading-none', f.id === 'normal' ? 'text-[16px]' : f.id === 'large' ? 'text-[21px]' : 'text-[26px]')}>
                  {f.sample}
                </span>
                <span className="text-[12px] font-medium">{f.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 开关项 */}
      <ul className="mt-5 space-y-2.5">
        {toggleOptions.map((t) => {
          const Icon = t.icon
          const active = value[t.key]
          return (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => {
                  onChange(t.patch(!active))
                  if (notify) push(`${active ? '已关闭' : '已开启'}「${t.label}」。`, 'info')
                }}
                aria-pressed={active}
                className={cx(
                  'flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-colors',
                  active ? 'border-brand bg-brand/5' : 'border-line bg-white hover:border-brand/40',
                )}
              >
                <span
                  className={cx(
                    'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border',
                    active ? 'border-brand/30 bg-white text-brand' : 'border-line bg-cream text-ink-soft',
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium text-ink">{t.label}</span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-soft">{t.desc}</span>
                </span>
                {/* 开关视觉 */}
                <span
                  className={cx(
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
                    active ? 'bg-brand' : 'bg-line',
                  )}
                  aria-hidden="true"
                >
                  <span
                    className={cx(
                      'absolute h-5 w-5 rounded-full bg-white shadow transition-transform',
                      active ? 'translate-x-[22px]' : 'translate-x-0.5',
                    )}
                  />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** 预览用字号缩放比例：与全局 css 中 html[data-font] 的倍率保持一致 */
const previewFontScale: Record<FontSize, number> = { normal: 1, large: 1.18, xlarge: 1.34 }

/**
 * 效果预览
 *
 * 用与个人端一致的视觉语言模拟一张简化网页卡片，随弹窗内的草稿设置实时变化。
 * 这里刻意不使用 Tailwind 的固定 px 字号，而是用 em 相对单位 + 内联样式，
 * 保证预览只跟随弹窗草稿，不受全局 html[data-*] 已保存设置的影响。
 */
function AccessibilityPreview({ settings }: { settings: A11ySettings }) {
  const scale = previewFontScale[settings.fontSize]
  const hc = settings.highContrast
  const hit = settings.largeHit
  const still = settings.reducedMotion

  const tone = {
    shell: hc ? '#E4E4E4' : '#F3F5F7',
    card: '#FFFFFF',
    ink: hc ? '#000000' : '#172033',
    soft: hc ? '#1A1A1A' : '#667085',
    line: hc ? '#1A1A1A' : '#DCE1E7',
    brand: hc ? '#741313' : '#9B1C1C',
    border: hc ? 2 : 1,
  }

  const controlHeight = hit ? '3.4em' : '2.5em'
  const controlPadding = hit ? '0 1.6em' : '0 1.15em'
  const motion = still ? 'transition-none' : 'transition-colors duration-150'

  return (
    <div
      role="img"
      aria-label="效果预览示意图：模拟个人端页面在当前设置下的显示效果"
      data-preview-font={settings.fontSize}
      data-preview-contrast={hc ? 'high' : 'normal'}
      data-preview-hit={hit ? 'large' : 'normal'}
      data-preview-motion={still ? 'reduced' : 'normal'}
      className="flex flex-col rounded-xl2 p-3"
      style={{ backgroundColor: tone.shell, border: `${tone.border}px solid ${tone.line}`, fontSize: `${14 * scale}px` }}
    >
      {/* 模拟浏览器标题栏 */}
      <div className="flex items-center justify-between gap-2" style={{ paddingBottom: '0.6em', borderBottom: `1px solid ${tone.line}` }}>
        <span className="truncate font-semibold" style={{ color: tone.ink, fontSize: '0.82em' }}>明法众联 · 群众普法服务中心</span>
        <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="rounded-full" style={{ width: '0.42em', height: '0.42em', backgroundColor: tone.line }} />
          ))}
        </span>
      </div>

      {/* 内嵌网页卡片 */}
      <div
        className="mf-scrollbar mt-3 flex-1 overflow-y-auto rounded-lg p-3"
        style={{ backgroundColor: tone.card, border: `${tone.border}px solid ${tone.line}` }}
      >
        <h3 style={{ color: tone.ink, fontSize: '1.3em', fontWeight: 700, lineHeight: 1.35 }}>遇到法律问题，从这里开始</h3>
        <p style={{ color: tone.soft, fontSize: '0.86em', lineHeight: 1.7, marginTop: '0.55em' }}>
          用生活化语言描述你的情况，我们会提供一般处理步骤、材料提醒和可联系的公共服务渠道。
        </p>

        {/* 输入框 */}
        <div
          className="mt-3 flex items-center gap-2 rounded-md"
          style={{
            backgroundColor: tone.card,
            border: `${tone.border}px solid ${tone.line}`,
            minHeight: hit ? '3.6em' : '2.8em',
            padding: `0 ${hit ? '1em' : '0.75em'}`,
          }}
        >
          <Search className="shrink-0" style={{ color: tone.soft, width: '1em', height: '1em' }} aria-hidden="true" />
          <span className="truncate" style={{ color: tone.soft, fontSize: '0.84em' }}>例如：公司拖欠工资，我该怎么办？</span>
        </div>

        {/* 按钮组：主按钮 + 次级按钮 */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={cx('inline-flex flex-1 items-center justify-center rounded-md font-semibold text-white', motion, !still && 'hover:brightness-95')}
            style={{
              backgroundColor: tone.brand,
              minHeight: controlHeight,
              padding: controlPadding,
              fontSize: '0.86em',
              border: hc ? `2px solid ${tone.line}` : '1px solid transparent',
            }}
          >
            开始咨询
          </span>
          <span
            className={cx('inline-flex flex-1 items-center justify-center rounded-md font-medium', motion, !still && 'hover:border-brand')}
            style={{
              backgroundColor: tone.card,
              color: tone.ink,
              border: `${tone.border}px solid ${tone.line}`,
              minHeight: controlHeight,
              padding: controlPadding,
              fontSize: '0.86em',
            }}
          >
            查看援助指引
          </span>
        </div>

        {/* 信息列表项 */}
        <ul className="mt-3 space-y-1.5">
          {['公司拖欠工资，我应该先准备哪些材料？', '遭遇网络诈骗后，第一时间该怎么处理？'].map((item, index) => (
            <li
              key={item}
              className="flex items-center gap-2.5 rounded-md"
              style={{
                backgroundColor: tone.card,
                border: `${tone.border}px solid ${tone.line}`,
                minHeight: hit ? '3.2em' : '2.4em',
                padding: `0 ${hit ? '1em' : '0.75em'}`,
              }}
            >
              <span className="font-semibold" style={{ color: tone.soft, fontSize: '0.8em' }}>{String(index + 1).padStart(2, '0')}</span>
              <span className="truncate" style={{ color: tone.ink, fontSize: '0.84em' }}>{item}</span>
            </li>
          ))}
        </ul>

        {/* 信息卡片 */}
        <div className="mt-3 rounded-md p-2.5" style={{ backgroundColor: hc ? '#FFFFFF' : '#F9FAFB', border: `${tone.border}px solid ${tone.line}` }}>
          <p className="font-semibold" style={{ color: tone.ink, fontSize: '0.84em' }}>需要人工帮助？</p>
          <p style={{ color: tone.soft, fontSize: '0.8em', lineHeight: 1.7, marginTop: '0.25em' }}>可拨打 12348 公共法律服务热线，或查看法律援助申请条件。</p>
        </div>
      </div>

      <p className="mt-2.5 text-center" style={{ color: tone.soft, fontSize: '0.76em' }}>
        以上为示意效果，保存后应用到全部页面
      </p>
    </div>
  )
}

interface AccessibilityOnboardingModalProps {
  /** 点击「保存并进入」时回调，携带弹窗内选定的设置 */
  onConfirm: (settings: A11ySettings) => void
  /** 点击「没有需要更改的」时回调，不改变任何设置 */
  onSkip: () => void
}

/**
 * 首次进入个人端的适老化与无障碍引导弹窗
 *
 * 弹窗内的改动先保存为草稿，点击「保存并进入」后才写入偏好设置；
 * 点击「没有需要更改的」则保持当前设置不变。两条路径都会记录已完成首次设置。
 */
export function AccessibilityOnboardingModal({ onConfirm, onSkip }: AccessibilityOnboardingModalProps) {
  const a11y = useA11y()
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const [draft, setDraft] = useState<A11ySettings>({
    fontSize: a11y.fontSize,
    highContrast: a11y.highContrast,
    reducedMotion: a11y.reducedMotion,
    largeHit: a11y.largeHit,
  })

  // 打开时把焦点移入弹窗，便于键盘用户直接操作
  useEffect(() => {
    const t = window.setTimeout(() => dialogRef.current?.focus(), 30)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center" role="presentation">
      <div className="absolute inset-0 bg-ink/40" aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-onboarding-title"
        tabIndex={-1}
        className="mf-scrollbar relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-xl2 border border-line bg-white shadow-panel animate-fade-up sm:max-w-lg sm:rounded-xl2 lg:max-w-4xl xl:max-w-5xl"
      >
        {/* 头部 */}
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <p className="mf-eyebrow mb-1.5">首次使用设置</p>
          <h2 id="a11y-onboarding-title" className="flex items-center gap-2 font-serif text-[19px] font-semibold text-ink">
            <Accessibility className="h-5 w-5 text-brand" aria-hidden="true" />
            适老化与无障碍设置
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
            让不同年龄和使用习惯的群众都能顺畅使用。设置仅保存在当前浏览器，不会上传任何信息。
          </p>
        </div>

        {/* 左：设置项；右：效果预览（小屏自动上下排列） */}
        <div className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[45fr_55fr] lg:gap-6">
          <div className="lg:border-r lg:border-line lg:pr-5">
            <A11yOptions value={draft} onChange={(patch) => setDraft((p) => ({ ...p, ...patch }))} notify={false} />
            <p className="mt-4 flex items-start gap-2 rounded-lg border border-line bg-cream-soft px-3.5 py-2.5 text-[12px] leading-relaxed text-ink-soft">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
              保存后仍可随时在「设置 → 适老化与无障碍」中修改。
            </p>
          </div>

          <section aria-labelledby="a11y-preview-title" className="flex flex-col">
            <h3 id="a11y-preview-title" className="text-[14px] font-semibold text-ink">效果预览</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">调整左侧设置，可在此实时查看页面显示效果。</p>
            <div className="mt-3 flex flex-1 flex-col">
              <AccessibilityPreview settings={draft} />
            </div>
          </section>
        </div>

        {/* 底部操作 */}
        <div className="flex flex-col gap-2.5 border-t border-line bg-cream-soft px-5 py-4 sm:flex-row-reverse sm:px-6">
          <button type="button" onClick={() => onConfirm(draft)} className="mf-btn-primary sm:flex-1">
            保存并进入
          </button>
          <button type="button" onClick={onSkip} className="mf-btn-outline sm:flex-1">
            没有需要更改的
          </button>
        </div>
      </div>
    </div>
  )
}
