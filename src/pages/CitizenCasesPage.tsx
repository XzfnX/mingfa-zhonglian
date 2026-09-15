import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, BookOpenText, X, SlidersHorizontal, Tag } from 'lucide-react'
import { caseCategories, demoCases } from '../data/demoCases'
import { CITIZEN_DISCLAIMER } from '../data/citizenServices'
import { Disclaimer } from '../components/Disclaimer'
import { EmptyState, Pill } from '../components/Ui'
import { highlightParts, cx } from '../lib/utils'
import type { CaseCategory, LifeCase } from '../types'

export default function CitizenCasesPage() {
  const [category, setCategory] = useState<'全部' | CaseCategory>('全部')
  const [keyword, setKeyword] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase()
    return demoCases.filter((c) => {
      const catOk = category === '全部' || c.category === category
      if (!catOk) return false
      if (!k) return true
      const haystack = [c.title, c.category, c.scene, ...c.keyPoints, ...c.path, ...c.tips, ...c.relatedLaws, ...c.audience]
        .join(' ')
        .toLowerCase()
      return haystack.includes(k)
    })
  }, [category, keyword])

  const active = filtered.find((c) => c.id === activeId) ?? null

  return (
    <div className="mf-container py-8">
      <nav className="mb-5">
        <Link to="/citizen" className="mf-btn-ghost gap-1.5 px-3 text-[13px]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回服务中心
        </Link>
      </nav>

      <header className="mb-6 rounded-xl2 border border-line bg-white p-6 shadow-card">
        <p className="mf-eyebrow mb-2">核心模块二</p>
        <h1 className="flex items-center gap-2.5 font-serif text-[26px] font-semibold leading-snug text-ink">
          <BookOpenText className="h-6 w-6 text-brand" aria-hidden="true" />
          生活法律案例解读
        </h1>
        <p className="mt-2.5 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          按主题分类浏览贴近生活的法律场景，了解法律要点、一般处理路径与常见风险。支持分类筛选和关键词搜索。
        </p>
      </header>

      {/* 筛选区 */}
      <section className="mb-6 rounded-xl2 border border-line bg-white p-5" aria-label="案例筛选">
        {/* 搜索 */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
          <input
            type="search"
            className="mf-input pl-10 pr-10"
            placeholder="搜索关键词，例如：物业费、拖欠工资、校园欺凌、保健品"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="按关键词搜索案例"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2.5 text-ink-soft hover:text-brand"
              aria-label="清除关键词"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* 分类 */}
        <div className="mt-4">
          <p className="mb-2.5 flex items-center gap-1.5 text-[13px] font-medium text-ink">
            <SlidersHorizontal className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
            案例分类
          </p>
          <ul className="flex flex-wrap gap-2" role="group" aria-label="案例分类筛选">
            {caseCategories.map((c) => {
              const isActive = category === c
              return (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => {
                      setCategory(c)
                      setActiveId(null)
                    }}
                    aria-pressed={isActive}
                    className={cx(
                      'min-h-[40px] rounded-full border px-4 text-[13px] font-medium transition-colors',
                      isActive
                        ? 'border-brand bg-brand text-white'
                        : 'border-line bg-cream-soft text-ink-soft hover:border-brand/40 hover:text-brand',
                    )}
                  >
                    {c}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 结果统计 */}
        <p className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-[13px] text-ink-soft" role="status">
          共找到 <span className="font-semibold text-brand">{filtered.length}</span> 条案例
          {category !== '全部' && (
            <Pill tone="brand">
              <Tag className="h-3 w-3" aria-hidden="true" />
              {category}
            </Pill>
          )}
          {keyword && <span>· 关键词「{keyword}」</span>}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* 案例列表 */}
        <section aria-label="案例列表">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="没有找到匹配的案例"
              desc="试试更换关键词，例如「物业」「工资」「诈骗」，或切换到「全部」分类查看所有内容。"
              action={
                <button
                  type="button"
                  onClick={() => {
                    setKeyword('')
                    setCategory('全部')
                  }}
                  className="mf-btn-primary"
                >
                  重置筛选条件
                </button>
              }
            />
          ) : (
            <ul className="space-y-4">
              {filtered.map((c) => (
                <li key={c.id}>
                  <CaseCard
                    item={c}
                    keyword={keyword}
                    active={activeId === c.id}
                    onOpen={() => setActiveId(activeId === c.id ? null : c.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 侧栏：选中案例详情（桌面端） */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            {active ? (
              <CaseDetail item={active} />
            ) : (
              <div className="rounded-xl2 border border-dashed border-line bg-white/70 p-6 text-center">
                <p className="font-serif text-[16px] font-semibold text-ink">选择一个案例查看详情</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                  点击左侧案例卡片，这里会显示完整的法律要点、处理路径与风险提示。
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 移动端详情展开 */}
      {active && (
        <div className="mt-6 lg:hidden">
          <CaseDetail item={active} />
        </div>
      )}

      <div className="mt-8">
        <Disclaimer text={CITIZEN_DISCLAIMER} />
      </div>
    </div>
  )
}

function CaseCard({
  item,
  keyword,
  active,
  onOpen,
}: {
  item: LifeCase
  keyword: string
  active: boolean
  onOpen: () => void
}) {
  const render = (text: string) =>
    highlightParts(text, keyword).map((p, i) =>
      p.hit ? (
        <mark key={i} className="rounded bg-gold px-0.5 text-ink">
          {p.text}
        </mark>
      ) : (
        <span key={i}>{p.text}</span>
      ),
    )

  return (
    <article
      className={cx(
        'rounded-xl2 border p-5 transition-colors',
        active ? 'border-brand bg-white' : 'border-line bg-white hover:border-brand/40',
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="brand">{item.category}</Pill>
        {item.audience.map((a) => (
          <span key={a} className="text-[12px] text-ink-soft">
            {a}
          </span>
        ))}
      </div>
      <h2 className="mt-3 font-serif text-[17px] font-semibold leading-snug text-ink">{render(item.title)}</h2>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{render(item.scene)}</p>

      <ul className="mt-3.5 space-y-1.5 border-t border-line pt-3.5">
        {item.keyPoints.slice(0, 2).map((k) => (
          <li key={k} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
            <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" aria-hidden="true" />
            {render(k)}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onOpen}
        aria-expanded={active}
        className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-medium text-brand hover:underline"
      >
        {active ? '收起详情' : '查看完整解读'}
      </button>

      {/* 内联详情（用于移动端与展开状态） */}
      {active && (
        <div className="mt-4 border-t border-line pt-4 lg:hidden">
          <CaseDetailInner item={item} />
        </div>
      )}
    </article>
  )
}

function CaseDetail({ item }: { item: LifeCase }) {
  return (
    <div className="rounded-xl2 border border-line bg-white p-5 animate-fade-in">
      <CaseDetailInner item={item} />
    </div>
  )
}

function CaseDetailInner({ item }: { item: LifeCase }) {
  return (
    <div className="space-y-5">
      <div>
        <Pill tone="brand">{item.category}</Pill>
        <h3 className="mt-2.5 font-serif text-[18px] font-semibold leading-snug text-ink">{item.title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{item.scene}</p>
      </div>

      <section>
        <h4 className="mb-2.5 text-[14px] font-semibold text-ink">法律要点</h4>
        <ul className="space-y-2">
          {item.keyPoints.map((k) => (
            <li key={k} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
              <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {k}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="mb-2.5 text-[14px] font-semibold text-ink">一般处理路径</h4>
        <ol className="space-y-2">
          {item.path.map((p, i) => (
            <li key={p} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-soft">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cream text-[11px] font-semibold text-brand"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              {p}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h4 className="mb-2.5 text-[14px] font-semibold text-ink">实用提示</h4>
        <ul className="space-y-1.5">
          {item.tips.map((t) => (
            <li key={t} className="rounded-lg border border-line bg-cream-soft px-3 py-2 text-[12px] leading-relaxed text-ink-soft">
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="mb-2.5 text-[14px] font-semibold text-ink">相关法律依据（一般性提及）</h4>
        <ul className="space-y-1.5">
          {item.relatedLaws.map((l) => (
            <li key={l} className="text-[12px] leading-relaxed text-ink-soft">
              · {l}
            </li>
          ))}
        </ul>
      </section>

      <Disclaimer variant="inline" title="提示" text="以上内容为一般性普法解读，不针对具体案件给出结论。" />
    </div>
  )
}
