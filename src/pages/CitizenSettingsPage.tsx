import { Accessibility, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Disclaimer } from '../components/Disclaimer'
import { useA11y, type FontSize } from '../context/AccessibilityContext'
import { CITIZEN_DISCLAIMER } from '../data/citizenServices'

const fontSizeLabel: Record<FontSize, string> = {
  normal: '标准字号',
  large: '大字号',
  xlarge: '特大字号',
}

export default function CitizenSettingsPage() {
  const a11y = useA11y()

  const activeLabels = [
    fontSizeLabel[a11y.fontSize],
    a11y.highContrast ? '高对比度模式' : null,
    a11y.largeHit ? '大点击区域' : null,
    a11y.reducedMotion ? '减弱动效' : null,
  ].filter((label): label is string => label !== null)

  return (
    <div className="mf-container py-8 sm:py-10">
      <div className="border-b border-line pb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">个人中心</p>
        <h1 className="mt-1 text-xl font-bold text-ink">设置</h1>
        <p className="mt-2 text-sm text-ink-soft">调整与本机使用体验相关的选项，设置仅保存在当前浏览器，不上传任何信息。</p>
      </div>

      <section aria-labelledby="display-settings-title" className="mt-6">
        <h2 id="display-settings-title" className="text-base font-bold text-ink">显示设置</h2>
        <ul className="mt-3 border border-line bg-white">
          <li>
            <Link to="/citizen/settings/accessibility" className="group flex min-h-[96px] items-center gap-4 p-5 hover:bg-[#FAFAFB]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#E7CACA] bg-[#FFF7F7] text-brand">
                <Accessibility className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-ink">适老化与无障碍</span>
                <span className="mt-1 block text-sm leading-5 text-ink-soft">调整页面字号、高对比度、大点击区域与动效，降低使用门槛。</span>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {activeLabels.map((label) => (
                    <span key={label} className="mf-tag">{label}</span>
                  ))}
                </span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-brand" aria-hidden="true" />
            </Link>
          </li>
        </ul>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">当前生效状态会同步显示在上方标签中，修改后立即应用到全部页面。</p>
      </section>

      <div className="mt-6"><Disclaimer text={CITIZEN_DISCLAIMER} /></div>
    </div>
  )
}
