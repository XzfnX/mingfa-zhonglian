import { Accessibility, Contrast, ZoomIn, MousePointerClick, Zap, RotateCcw, Check } from 'lucide-react'
import { useA11y, type FontSize } from '../context/AccessibilityContext'
import { useToast } from '../context/ToastContext'
import { cx } from '../lib/utils'

const fontOptions: { id: FontSize; label: string; sample: string }[] = [
  { id: 'normal', label: '标准字号', sample: 'A' },
  { id: 'large', label: '大字号', sample: 'A' },
  { id: 'xlarge', label: '特大字号', sample: 'A' },
]

/**
 * 适老化 / 无障碍控制面板
 * 所有设置仅保存在本地浏览器，不上传任何数据。
 */
export function AccessibilityControls() {
  const a11y = useA11y()
  const { push } = useToast()

  const toggles = [
    {
      key: 'highContrast' as const,
      label: '高对比度模式',
      desc: '加深文字与边框对比，便于弱视用户阅读。',
      icon: Contrast,
      active: a11y.highContrast,
      onClick: a11y.toggleContrast,
    },
    {
      key: 'largeHit' as const,
      label: '大点击区域',
      desc: '加大按钮尺寸，降低误触概率。',
      icon: MousePointerClick,
      active: a11y.largeHit,
      onClick: a11y.toggleHit,
    },
    {
      key: 'reducedMotion' as const,
      label: '减弱动效',
      desc: '关闭页面过渡与动画，减少视觉干扰。',
      icon: Zap,
      active: a11y.reducedMotion,
      onClick: a11y.toggleMotion,
    },
  ]

  return (
    <section
      id="accessibility"
      aria-labelledby="a11y-title"
      className="scroll-mt-24 rounded-xl2 border border-line bg-white p-5 shadow-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mf-eyebrow mb-1.5">适老与无障碍</p>
          <h2 id="a11y-title" className="flex items-center gap-2 font-serif text-[19px] font-semibold text-ink">
            <Accessibility className="h-5 w-5 text-brand" aria-hidden="true" />
            适老化与无障碍设置
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
            让不同年龄和使用习惯的群众都能顺畅使用。设置仅保存在当前浏览器，不会上传任何信息。
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            a11y.reset()
            push('已恢复默认显示设置。', 'info')
          }}
          className="mf-btn-outline gap-1.5 px-3.5 text-[13px]"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          恢复默认
        </button>
      </div>

      {/* 字号 */}
      <div className="mt-5">
        <p className="mb-2.5 flex items-center gap-2 text-[14px] font-medium text-ink">
          <ZoomIn className="h-4 w-4 text-brand" aria-hidden="true" />
          页面字号
        </p>
        <div className="grid grid-cols-3 gap-2.5" role="group" aria-label="页面字号">
          {fontOptions.map((f) => {
            const active = a11y.fontSize === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  a11y.setFontSize(f.id)
                  push(`已切换为「${f.label}」。`, 'info')
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
        {toggles.map((t) => {
          const Icon = t.icon
          return (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => {
                  t.onClick()
                  push(`${t.active ? '已关闭' : '已开启'}「${t.label}」。`, 'info')
                }}
                aria-pressed={t.active}
                className={cx(
                  'flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-colors',
                  t.active ? 'border-brand bg-brand/5' : 'border-line bg-white hover:border-brand/40',
                )}
              >
                <span
                  className={cx(
                    'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border',
                    t.active ? 'border-brand/30 bg-white text-brand' : 'border-line bg-cream text-ink-soft',
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
                    t.active ? 'bg-brand' : 'bg-line',
                  )}
                  aria-hidden="true"
                >
                  <span
                    className={cx(
                      'absolute h-5 w-5 rounded-full bg-white shadow transition-transform',
                      t.active ? 'translate-x-[22px]' : 'translate-x-0.5',
                    )}
                  />
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="mt-4 flex items-start gap-2 rounded-lg border border-line bg-cream-soft px-3.5 py-2.5 text-[12px] leading-relaxed text-ink-soft">
        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
        本页同时支持键盘操作（Tab 切换、Enter / 空格确认），并提供可见的焦点样式；页面已适配系统的「减弱动态效果」偏好。
      </p>
    </section>
  )
}
