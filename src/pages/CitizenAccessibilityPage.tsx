import { Accessibility, ArrowLeft, Check, RotateCcw } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { A11yOptions } from '../components/AccessibilitySettings'
import { Disclaimer } from '../components/Disclaimer'
import { useA11y } from '../context/AccessibilityContext'
import { useToast } from '../context/ToastContext'
import { CITIZEN_DISCLAIMER } from '../data/citizenServices'

export default function CitizenAccessibilityPage() {
  const a11y = useA11y()
  const { push } = useToast()
  const navigate = useNavigate()

  const current = {
    fontSize: a11y.fontSize,
    highContrast: a11y.highContrast,
    reducedMotion: a11y.reducedMotion,
    largeHit: a11y.largeHit,
  }

  return (
    <div className="mf-container py-8 sm:py-10">
      <Link to="/citizen/settings" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft hover:text-brand">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        返回设置
      </Link>

      <section id="accessibility" aria-labelledby="a11y-title" className="mt-4 rounded-xl2 border border-line bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mf-eyebrow mb-1.5">显示设置</p>
            <h1 id="a11y-title" className="flex items-center gap-2 font-serif text-[19px] font-semibold text-ink">
              <Accessibility className="h-5 w-5 text-brand" aria-hidden="true" />
              适老化与无障碍设置
            </h1>
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

        <div className="mt-5">
          <A11yOptions value={current} onChange={a11y.update} />
        </div>

        <div className="mt-5 flex flex-col gap-2.5 border-t border-line pt-4 sm:flex-row-reverse sm:items-center">
          <button
            type="button"
            onClick={() => {
              push('适老化与无障碍设置已保存。', 'success')
              navigate('/citizen/settings')
            }}
            className="mf-btn-primary sm:px-7"
          >
            保存设置
          </button>
          <Link to="/citizen/settings" className="mf-btn-outline sm:px-7">
            返回设置
          </Link>
          <p className="text-[12px] leading-relaxed text-ink-soft sm:mr-auto">改动会立即生效，点击「保存设置」确认并返回。</p>
        </div>

        <p className="mt-4 flex items-start gap-2 rounded-lg border border-line bg-cream-soft px-3.5 py-2.5 text-[12px] leading-relaxed text-ink-soft">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
          本页同时支持键盘操作（Tab 切换、Enter / 空格确认），并提供可见的焦点样式；页面已适配系统的「减弱动态效果」偏好。
        </p>
      </section>

      <div className="mt-6"><Disclaimer text={CITIZEN_DISCLAIMER} /></div>
    </div>
  )
}
