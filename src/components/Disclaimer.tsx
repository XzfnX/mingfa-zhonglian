import { Link } from 'react-router-dom'
import { cx } from '../lib/utils'

interface DisclaimerProps {
  /** 展示形态 */
  variant?: 'block' | 'inline' | 'banner'
  title?: string
  text: string
  className?: string
}

/**
 * 法律声明组件
 * 用于 C 端各页面与 B 端标注说明，统一视觉与措辞位置。
 */
export function Disclaimer({ variant = 'block', title = '法律声明', text, className }: DisclaimerProps) {
  if (variant === 'inline') {
    return (
      <p className={cx('text-xs leading-relaxed text-ink-soft', className)}>
        <span className="font-medium text-ink-soft">{title}：</span>
        {text}
      </p>
    )
  }

  if (variant === 'banner') {
    return (
      <div
        className={cx(
          'border-y border-line bg-cream-soft px-4 py-3 text-center text-xs leading-relaxed text-ink-soft sm:text-[13px]',
          className,
        )}
      >
        <span className="font-medium">演示环境说明：</span>
        {text}
      </div>
    )
  }

  return (
    <div
      className={cx(
        'rounded border border-line bg-cream-soft px-5 py-4',
        'border-l-4 border-l-brand',
        className,
      )}
      role="note"
    >
      <p className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold text-ink">
        <span className="inline-block h-1.5 w-1.5 bg-brand" aria-hidden="true" />
        {title}
      </p>
      <p className="text-[13px] leading-relaxed text-ink-soft">{text}</p>
    </div>
  )
}

/** 页脚 */
export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mf-container py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-base font-semibold text-ink">明法众联</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              高校智力赋能基层治理的数智化法治实践平台，线上服务与线下实践双轨并行。
            </p>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-ink">群众服务</h4>
            <ul className="mt-2 space-y-1.5 text-[13px] text-ink-soft">
              <li>
                <Link className="mf-link" to="/citizen/consult">
                  智能普法咨询
                </Link>
              </li>
              <li>
                <Link className="mf-link" to="/citizen/cases">
                  生活案例解读
                </Link>
              </li>
              <li>
                <Link className="mf-link" to="/citizen/documents">
                  法律文书指引
                </Link>
              </li>
              <li>
                <Link className="mf-link" to="/citizen/aid">
                  法律援助指引
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-ink">机构方案</h4>
            <ul className="mt-2 space-y-1.5 text-[13px] text-ink-soft">
              <li>
                <Link className="mf-link" to="/institution/justice">
                  司法行政解决方案
                </Link>
              </li>
              <li>
                <Link className="mf-link" to="/institution/street">
                  街道治理解决方案
                </Link>
              </li>
              <li>
                <Link className="mf-link" to="/institution/school">
                  学校法治教育方案
                </Link>
              </li>
              <li>
                <Link className="mf-link" to="/institution/enterprise">
                  企业合规宣教方案
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-ink">项目信息</h4>
            <ul className="mt-2 space-y-1.5 text-[13px] text-ink-soft">
              <li>
                <Link className="mf-link" to="/results">
                  项目成果
                </Link>
              </li>
              <li>
                <Link className="mf-link" to="/about">
                  关于明法众联
                </Link>
              </li>
              <li>
                <Link className="mf-link" to="/">
                  返回首页
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <p className="text-xs leading-relaxed text-ink-soft">
            法律声明：本网站为大学生创新创业比赛参赛 Demo，全部内容仅用于公益普法宣传与产品能力演示，
            不构成针对具体案件的正式法律意见；网站不提供真实支付、真实购买、真实法律咨询、真实用户注册与真实信息采集功能。
            遇到紧急、复杂或正在诉讼中的事项，请咨询专业律师或当地法律援助机构。
          </p>
          <p className="mt-3 text-xs text-ink-soft">
            © {year} 明法众联项目组 · 参赛演示版本 · 页面数据均为项目阶段性成果或演示用模拟数据
          </p>
        </div>
      </div>
    </footer>
  )
}
