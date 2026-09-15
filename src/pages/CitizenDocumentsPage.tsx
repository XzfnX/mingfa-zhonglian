import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, ClipboardList, PenLine, Info, TriangleAlert } from 'lucide-react'
import { docGuides, CITIZEN_DISCLAIMER } from '../data/citizenServices'
import { Disclaimer } from '../components/Disclaimer'
import { Pill } from '../components/Ui'
import { cx } from '../lib/utils'
import type { DocumentGuide } from '../types'

const categories: DocumentGuide['category'][] = ['劳动维权', '调解与援助', '民事诉讼', '工伤认定']

export default function CitizenDocumentsPage() {
  const [category, setCategory] = useState<DocumentGuide['category']>('劳动维权')
  const [activeId, setActiveId] = useState<string>(docGuides.find((d) => d.category === '劳动维权')!.id)

  const list = docGuides.filter((d) => d.category === category)
  const active = docGuides.find((d) => d.id === activeId) ?? list[0]

  function switchCategory(c: DocumentGuide['category']) {
    setCategory(c)
    const first = docGuides.find((d) => d.category === c)
    if (first) setActiveId(first.id)
  }

  return (
    <div className="mf-container py-8">
      <nav className="mb-5">
        <Link to="/citizen" className="mf-btn-ghost gap-1.5 px-3 text-[13px]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回服务中心
        </Link>
      </nav>

      <header className="mb-6 rounded-xl2 border border-line bg-white p-6 shadow-card">
        <p className="mf-eyebrow mb-2">核心模块三</p>
        <h1 className="flex items-center gap-2.5 font-serif text-[26px] font-semibold leading-snug text-ink">
          <FileText className="h-6 w-6 text-brand" aria-hidden="true" />
          法律文书指引
        </h1>
        <p className="mt-2.5 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          了解常见法律文书的适用场景、需要准备的材料和填写说明。本模块<strong className="font-semibold">不生成</strong>
          具有法律效力的正式文件。
        </p>
        <div className="mt-4">
          <Disclaimer
            variant="inline"
            title="重要提示"
            text="本模块仅提供文书结构说明与材料准备指引，不能替代律师起草或法院、仲裁机构的正式文书要求。"
          />
        </div>
      </header>

      {/* 分类切换 */}
      <section className="mb-6" aria-label="文书分类切换">
        <ul className="flex flex-wrap gap-2" role="group" aria-label="文书分类">
          {categories.map((c) => {
            const isActive = category === c
            const count = docGuides.filter((d) => d.category === c).length
            return (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => switchCategory(c)}
                  aria-pressed={isActive}
                  className={cx(
                    'min-h-[44px] rounded-xl border px-4 text-[14px] font-medium transition-colors',
                    isActive
                      ? 'border-brand bg-brand text-white'
                      : 'border-line bg-white text-ink-soft hover:border-brand/40 hover:text-brand',
                  )}
                >
                  {c}
                  <span className={cx('ml-1.5 text-[12px]', isActive ? 'text-white/70' : 'text-ink-soft')}>
                    {count}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* 文书列表 */}
        <section aria-label="文书列表">
          <ul className="space-y-2.5">
            {list.map((d) => {
              const isActive = active?.id === d.id
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(d.id)}
                    aria-pressed={isActive}
                    className={cx(
                      'w-full rounded-xl border p-4 text-left transition-colors',
                      isActive ? 'border-brand bg-white shadow-card' : 'border-line bg-white hover:border-brand/40',
                    )}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-[15px] font-semibold text-ink">{d.name}</span>
                      <ClipboardList
                        className={cx('mt-0.5 h-4 w-4 shrink-0', isActive ? 'text-brand' : 'text-ink-soft')}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1.5 block text-[12px] leading-relaxed text-ink-soft">{d.scene}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 rounded-xl2 border border-line bg-white p-4">
            <p className="text-[13px] font-semibold text-ink">需要更多帮助？</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">
              如果你的情况较为复杂，建议先通过智能咨询梳理思路，再联系当地法律援助机构或专业律师。
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to="/citizen/consult" className="mf-btn-outline gap-1.5 text-[13px]">
                去咨询
              </Link>
              <Link to="/citizen/aid" className="mf-btn-ghost gap-1.5 text-[13px]">
                法律援助指引
              </Link>
            </div>
          </div>
        </section>

        {/* 详情 */}
        <section aria-label="文书指引详情">
          {active && (
            <article className="rounded-xl2 border border-line bg-white p-6 shadow-card">
              <header className="border-b border-line pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="brand">{active.category}</Pill>
                  <Pill tone="gold">不生成正式文书</Pill>
                </div>
                <h2 className="mt-3 font-serif text-[22px] font-semibold leading-snug text-ink">{active.name}</h2>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{active.scene}</p>
              </header>

              <div className="mt-5 space-y-6">
                <section>
                  <h3 className="mb-3 flex items-center gap-2 font-serif text-[16px] font-semibold text-ink">
                    <ClipboardList className="h-4 w-4 text-brand" aria-hidden="true" />
                    适用场景说明
                  </h3>
                  <p className="rounded-lg border border-line bg-cream-soft px-3.5 py-3 text-[14px] leading-relaxed text-ink-soft">
                    {active.scene}
                  </p>
                </section>

                <section>
                  <h3 className="mb-3 flex items-center gap-2 font-serif text-[16px] font-semibold text-ink">
                    <FileText className="h-4 w-4 text-brand" aria-hidden="true" />
                    需要准备的材料
                  </h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {active.materials.map((m) => (
                      <li
                        key={m}
                        className="flex gap-2 rounded-lg border border-line bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-soft"
                      >
                        <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" aria-hidden="true" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="mb-3 flex items-center gap-2 font-serif text-[16px] font-semibold text-ink">
                    <PenLine className="h-4 w-4 text-brand" aria-hidden="true" />
                    填写说明
                  </h3>
                  <ol className="space-y-2.5">
                    {active.writing.map((w, i) => (
                      <li key={w} className="flex gap-3 text-[14px] leading-relaxed text-ink-soft">
                        <span
                          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cream text-[12px] font-semibold text-brand"
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        {w}
                      </li>
                    ))}
                  </ol>
                </section>

                <div className="rounded-xl border-l-4 border border-line border-l-warning bg-cream-soft px-4 py-3.5">
                  <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                    <span>
                      <span className="font-semibold">使用提醒：</span>
                      {active.notice}
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-line bg-cream-soft px-4 py-3.5">
                  <p className="flex items-start gap-2 text-[12px] leading-relaxed text-ink-soft">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                    需要正式文书模板时，建议到当地法律援助中心、公共法律服务中心或人民法院诉讼服务中心获取规范版本与专业指导。
                  </p>
                </div>
              </div>
            </article>
          )}
        </section>
      </div>

      <div className="mt-8">
        <Disclaimer text={CITIZEN_DISCLAIMER} />
      </div>
    </div>
  )
}
