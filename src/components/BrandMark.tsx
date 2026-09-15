import { Scale, BookOpen, Network } from 'lucide-react'
import { cx } from '../lib/utils'

interface BrandMarkProps {
  className?: string
  /** 图标尺寸 */
  size?: number
  /** 是否显示文字 */
  showText?: boolean
  /** 深色底（浅色文字） / 浅色底（深色文字） */
  tone?: 'light' | 'dark'
  /** 副标题 */
  subtitle?: string
}

/**
 * 明法众联品牌标识
 * 由「天平 + 书页 + 连接节点」抽象组合而成，不使用任何机关徽标或律所 Logo 元素。
 */
export function BrandMark({
  className,
  size = 36,
  showText = true,
  tone = 'dark',
  subtitle,
}: BrandMarkProps) {
  const textColor = tone === 'light' ? 'text-white' : 'text-ink'
  const subColor = tone === 'light' ? 'text-white/70' : 'text-ink-soft'

  return (
    <div className={cx('flex items-center gap-3', className)}>
      <BrandGlyph size={size} tone={tone} />
      {showText && (
        <div className="leading-tight">
          <div className={cx('font-sans text-[17px] font-bold tracking-[0.06em] sm:text-[19px]', textColor)}>
            明法众联
          </div>
          <div className={cx('mt-0.5 text-[11px] tracking-wide', subColor)}>
            {subtitle ?? '数智化法治实践平台'}
          </div>
        </div>
      )}
    </div>
  )
}

/** 图形部分：天平（主）+ 书页底座 + 连接节点 */
export function BrandGlyph({ size = 36, tone = 'dark' }: { size?: number; tone?: 'light' | 'dark' }) {
  const primary = tone === 'light' ? '#FFFFFF' : '#9B1C1C'
  const secondary = tone === 'light' ? '#FFFFFF' : '#667085'

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        background: tone === 'light' ? 'rgba(255,255,255,0.1)' : '#FFF7F7',
        border: tone === 'light' ? '1px solid rgba(255,255,255,0.35)' : '1px solid #E6BDBD',
      }}
      aria-hidden="true"
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        {/* 立柱 */}
        <path d="M12 3.2v14.4" stroke={primary} strokeWidth="1.6" strokeLinecap="round" />
        {/* 天平横梁 */}
        <path d="M5.4 6.4h13.2" stroke={primary} strokeWidth="1.6" strokeLinecap="round" />
        {/* 左托盘 */}
        <path d="M5.4 6.4l-2 4.2h4l-2-4.2z" stroke={secondary} strokeWidth="1.4" strokeLinejoin="round" />
        {/* 右托盘 */}
        <path d="M18.6 6.4l-2 4.2h4l-2-4.2z" stroke={secondary} strokeWidth="1.4" strokeLinejoin="round" />
        {/* 书页底座 */}
        <path
          d="M6.4 20.2c1.9-1.1 3.7-1.1 5.6 0 1.9-1.1 3.7-1.1 5.6 0"
          stroke={primary}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 连接节点 */}
        <circle cx="12" cy="6.4" r="1.5" fill={secondary} stroke={primary} strokeWidth="1.1" />
      </svg>
    </span>
  )
}

/** 用于「关于我们」等页面的品牌图标组合说明 */
export const brandIconLegend = [
  { icon: Scale, name: '天平', desc: '代表依法、客观、中立的内容立场。' },
  { icon: BookOpen, name: '书页', desc: '代表高校智力支持与普法内容生产。' },
  { icon: Network, name: '连接节点', desc: '代表连接高校、机构与群众的协同网络。' },
]
