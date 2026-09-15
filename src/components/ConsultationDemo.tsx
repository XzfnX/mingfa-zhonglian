import { useMemo, useRef, useState } from 'react'
import {
  Search,
  Loader2,
  MessagesSquare,
  ListChecks,
  FolderOpen,
  Phone,
  TriangleAlert,
  Mic,
  Volume2,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { consultAnswers, CITIZEN_DISCLAIMER } from '../data/citizenServices'
import { Disclaimer } from './Disclaimer'
import { useToast } from '../context/ToastContext'
import { cx } from '../lib/utils'
import type { ConsultAnswer } from '../types'

/**
 * 智能普法咨询（演示）
 *
 * ⚠️ 不调用任何真实 AI 接口或后端服务。
 * 回答来自 src/data/citizenServices.ts 中的本地静态数据，
 * 通过关键词匹配返回最相近的一条结果，用于展示产品交互与内容结构。
 */
export function ConsultationDemo({ initialQuestion = '' }: { initialQuestion?: string }) {
  const [input, setInput] = useState(initialQuestion)
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState<ConsultAnswer | null>(null)
  const [matchedBy, setMatchedBy] = useState<'exact' | 'keyword' | 'fallback' | null>(null)

  // 模拟语音输入状态机：idle → listening → recognizing → done
  const [voice, setVoice] = useState<'idle' | 'listening' | 'recognizing' | 'done'>('idle')
  const [speaking, setSpeaking] = useState(false)
  const resultRef = useRef<HTMLDivElement | null>(null)
  const { push } = useToast()

  const presets = useMemo(() => consultAnswers.map((a) => a.question), [])

  function runQuery(q: string) {
    const text = q.trim()
    if (!text) {
      push('请先输入你遇到的问题，或点击下方预设问题。', 'error')
      return
    }
    setLoading(true)
    setAnswer(null)
    setMatchedBy(null)

    // 模拟检索延迟（纯前端演示）
    window.setTimeout(() => {
      const lower = text.toLowerCase()

      // 1. 精确匹配预设问题
      const exact = consultAnswers.find((a) => a.question === text)
      if (exact) {
        finish(exact, 'exact')
        return
      }

      // 2. 关键词命中数量最多的答案
      let best: ConsultAnswer | null = null
      let bestScore = 0
      for (const a of consultAnswers) {
        let score = 0
        for (const k of a.keywords) {
          if (lower.includes(k.toLowerCase())) score += 2
        }
        if (lower.includes(a.id)) score += 1
        if (score > bestScore) {
          bestScore = score
          best = a
        }
      }
      if (best && bestScore > 0) {
        finish(best, 'keyword')
        return
      }

      // 3. 无匹配 → 回退到最相关的一条并明确说明为示例
      finish(consultAnswers[0], 'fallback')
    }, 780)
  }

  function finish(a: ConsultAnswer, by: 'exact' | 'keyword' | 'fallback') {
    setLoading(false)
    setAnswer(a)
    setMatchedBy(by)
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  /** 模拟语音输入：不申请真实麦克风权限 */
  function simulateVoice() {
    if (voice === 'listening' || voice === 'recognizing') return
    const demoQuestion = presets[Math.floor(Math.random() * presets.length)]
    setVoice('listening')
    window.setTimeout(() => setVoice('recognizing'), 1100)
    window.setTimeout(() => {
      setInput(demoQuestion)
      setVoice('done')
      push('已识别演示问题（模拟语音输入，未使用麦克风）。', 'info')
      window.setTimeout(() => setVoice('idle'), 1800)
    }, 2300)
  }

  /** 模拟语音播报：不调用任何 TTS 接口 */
  function simulateSpeak() {
    if (!answer) {
      push('请先获取一条咨询回复，再使用语音播报。', 'error')
      return
    }
    setSpeaking(true)
    push('正在播报（模拟语音播报，不调用真实语音接口）。', 'info')
    window.setTimeout(() => setSpeaking(false), 2600)
  }

  function reset() {
    setInput('')
    setAnswer(null)
    setMatchedBy(null)
    setVoice('idle')
  }

  return (
    <div className="space-y-5">
      {/* 输入区 */}
      <div className="rounded-xl2 border border-line bg-white p-5 shadow-card">
        <label htmlFor="consult-input" className="mf-label text-[15px]">
          描述你遇到的法律相关问题
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <input
              id="consult-input"
              type="text"
              className="mf-input pl-10"
              placeholder="例如：老板拖欠工资怎么办？"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') runQuery(input)
              }}
              aria-describedby="consult-hint"
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => runQuery(input)} className="mf-btn-primary flex-1 sm:flex-none" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  正在检索
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  获取指引
                </>
              )}
            </button>
            <button
              type="button"
              onClick={simulateVoice}
              className={cx('mf-btn-outline gap-1.5 px-3.5', (voice === 'listening' || voice === 'recognizing') && 'border-brand text-brand')}
              aria-label="模拟语音输入"
            >
              <Mic className={cx('h-4 w-4', voice === 'listening' && 'animate-pulse')} aria-hidden="true" />
              <span className="hidden sm:inline">语音</span>
            </button>
          </div>
        </div>

        <p id="consult-hint" className="mt-2 text-[12px] text-ink-soft">
          回答依据平台普法知识库整理，仅供一般性参考，不构成针对具体案件的正式法律意见。
        </p>

        {/* 语音状态提示 */}
        {voice !== 'idle' && (
          <div
            className="mt-3 flex items-center gap-2 rounded-lg border border-line bg-cream-soft px-3.5 py-2.5 text-[13px] text-brand"
            role="status"
            aria-live="polite"
          >
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-70 animate-pulse-ring" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
            </span>
            {voice === 'listening' && '正在聆听……（模拟语音输入，未使用麦克风）'}
            {voice === 'recognizing' && '正在识别……'}
            {voice === 'done' && '已识别演示问题，已自动填入输入框。'}
          </div>
        )}

        {/* 预设问题 */}
        <div className="mt-5">
          <p className="mb-2.5 text-[13px] font-medium text-ink">常见问题（点击直接查看）</p>
          <ul className="flex flex-wrap gap-2">
            {presets.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => {
                    setInput(q)
                    runQuery(q)
                  }}
                  className="rounded-full border border-line bg-cream-soft px-3.5 py-2 text-[13px] text-ink-soft transition-colors hover:border-brand hover:bg-white hover:text-brand"
                >
                  {q}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 加载骨架 */}
      {loading && (
        <div className="rounded-xl2 border border-line bg-white p-5" aria-busy="true" aria-live="polite">
          <p className="flex items-center gap-2 text-[14px] text-ink-soft">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            正在从演示数据库中匹配相关指引……
          </p>
          <div className="mt-4 space-y-2.5">
            {[92, 78, 85, 64].map((w) => (
              <div key={w} className="h-3 animate-pulse rounded-full bg-cream" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      )}

      {/* 回答结果 */}
      <div ref={resultRef}>
        {answer && !loading && (
          <article className="rounded-xl2 border border-line bg-white shadow-card animate-fade-up">
            {/* 头部 */}
            <header className="border-b border-line bg-cream-soft px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="mf-eyebrow mb-1">模拟回答</p>
                  <h2 className="font-serif text-[19px] font-semibold leading-snug text-ink">{answer.question}</h2>
                  {matchedBy === 'fallback' && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-warning">
                      <TriangleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      未匹配到完全对应的问题，以下展示最接近的一条示例内容。
                    </p>
                  )}
                  {matchedBy === 'keyword' && (
                    <p className="mt-1.5 text-[12px] text-ink-soft">已根据你输入的关键词匹配到最相关的指引。</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={simulateSpeak}
                    className={cx('mf-btn-outline gap-1.5 px-3 text-[13px]', speaking && 'border-brand text-brand')}
                  >
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                    {speaking ? '播报中' : '语音播报'}
                  </button>
                  <button type="button" onClick={reset} className="mf-btn-ghost gap-1.5 px-3 text-[13px]">
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    清空
                  </button>
                </div>
              </div>
            </header>

            <div className="space-y-6 p-5">
              {/* 问题概括 */}
              <Block icon={MessagesSquare} title="问题概括">
                <p className="text-[14px] leading-relaxed text-ink-soft">{answer.summary}</p>
              </Block>

              {/* 一般处理步骤 */}
              <Block icon={ListChecks} title="一般处理步骤">
                <ol className="space-y-2.5">
                  {answer.steps.map((s, i) => (
                    <li key={s} className="flex gap-3 text-[14px] leading-relaxed text-ink-soft">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cream text-[12px] font-semibold text-brand"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </Block>

              {/* 需要准备的材料 */}
              <Block icon={FolderOpen} title="需要准备的材料">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {answer.materials.map((m) => (
                    <li key={m} className="flex gap-2 rounded-lg border border-line bg-cream-soft px-3 py-2 text-[13px] text-ink-soft">
                      <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" aria-hidden="true" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </Block>

              {/* 可以联系的机构 */}
              <Block icon={Phone} title="可以联系的机构">
                <ul className="space-y-2">
                  {answer.contacts.map((c) => (
                    <li
                      key={c.name}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line px-3.5 py-2.5"
                    >
                      <span className="text-[14px] font-medium text-ink">{c.name}</span>
                      <span className="text-[12px] text-ink-soft">{c.note}</span>
                    </li>
                  ))}
                </ul>
              </Block>

              {/* 风险提醒 */}
              <Block icon={TriangleAlert} title="风险提醒" tone="warning">
                <ul className="space-y-2">
                  {answer.risks.map((r) => (
                    <li key={r} className="flex gap-2 text-[14px] leading-relaxed text-ink-soft">
                      <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-warning" aria-hidden="true" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </Block>

              {/* 法律声明 */}
              <Disclaimer text={CITIZEN_DISCLAIMER} />
            </div>
          </article>
        )}
      </div>

      {/* 未检索时的提示 */}
      {!answer && !loading && (
        <div className="rounded-xl2 border border-dashed border-line bg-white/70 px-6 py-12 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-cream text-brand">
            <MessagesSquare className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 font-serif text-[17px] font-semibold text-ink">输入问题或点击上方预设问题开始</p>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-soft">
            系统会从演示内容库中匹配相关指引，展示「问题概括—处理步骤—所需材料—求助渠道—风险提醒」的完整结构。
          </p>
        </div>
      )}
    </div>
  )
}

/* 小节块 */
function Block({
  icon: Icon,
  title,
  children,
  tone = 'brand',
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
  tone?: 'brand' | 'warning'
}) {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 font-serif text-[16px] font-semibold text-ink">
        <Icon className={cx('h-4 w-4 shrink-0', tone === 'warning' ? 'text-warning' : 'text-brand')} aria-hidden="true" />
        {title}
      </h3>
      {children}
    </section>
  )
}
