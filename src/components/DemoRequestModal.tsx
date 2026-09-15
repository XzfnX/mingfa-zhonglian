import { useEffect, useRef, useState } from 'react'
import { X, CalendarCheck, Loader2, CheckCircle2, Info } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { demoRefId } from '../lib/utils'

interface DemoRequestModalProps {
  open: boolean
  onClose: () => void
  /** 预填的机构类型名称 */
  defaultOrg?: string
  defaultSolution?: string
}

const solutionOptions = [
  '智慧普法运营与成效评估平台',
  '基层法治需求与矛盾预防服务包',
  '校园法治教育与模拟法庭课程体系',
  '企业合规宣教与员工法律风险培训',
  '暂不确定，希望先沟通需求',
]

/**
 * 预约演示弹窗
 *
 * ⚠️ 纯前端演示：提交后仅在当前页面状态中生成一个演示编号，
 * 不会发送、不会保存、不会上传任何真实信息。
 */
export function DemoRequestModal({ open, onClose, defaultOrg, defaultSolution }: DemoRequestModalProps) {
  const { push } = useToast()
  const [org, setOrg] = useState(defaultOrg ?? '')
  const [contact, setContact] = useState('')
  const [solution, setSolution] = useState(defaultSolution ?? solutionOptions[0])
  const [scene, setScene] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<{ refId: string; time: string } | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (open) {
      setDone(null)
      setSubmitting(false)
      setOrg(defaultOrg ?? '')
      setSolution(defaultSolution ?? solutionOptions[0])
    }
  }, [open, defaultOrg, defaultSolution])

  // Esc 关闭 + 打开时把焦点移入弹窗
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => dialogRef.current?.focus(), 30)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [open, onClose])

  if (!open) return null

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!org.trim()) {
      push('请填写机构名称。', 'error')
      return
    }
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setDone({ refId: demoRefId('PLAN'), time: new Date().toLocaleString('zh-CN') })
      push('咨询摘要已生成。', 'success')
    }, 900)
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="presentation">
      <div className="absolute inset-0 bg-ink/45" onClick={onClose} aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
        tabIndex={-1}
        className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-xl2 border border-line bg-white shadow-panel animate-fade-up sm:max-w-lg sm:rounded-xl2 mf-scrollbar"
      >
        {/* 头部 */}
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-line bg-white px-5 py-4">
          <div>
            <h2 id="demo-modal-title" className="flex items-center gap-2 font-serif text-[18px] font-semibold text-ink">
              <CalendarCheck className="h-5 w-5 text-brand" aria-hidden="true" />
              方案咨询
            </h2>
            <p className="mt-1 text-[12px] text-ink-soft">填写需求信息，快速梳理适合所在机构的解决方案。</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-cream-soft"
            aria-label="关闭弹窗"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {done ? (
          /* 成功状态 */
          <div className="px-5 py-8 text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-xl2 border border-success/30 bg-success/5 text-success">
              <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-serif text-[18px] font-semibold text-ink">咨询摘要已生成</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              已根据当前填写内容形成需求摘要，可用于后续方案沟通。
            </p>
            <dl className="mt-5 space-y-2 rounded-xl border border-line bg-cream-soft p-4 text-left text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">摘要编号</dt>
                <dd className="font-medium text-ink">{done.refId}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">机构名称</dt>
                <dd className="max-w-[60%] truncate font-medium text-ink">{org}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">意向方案</dt>
                <dd className="max-w-[60%] text-right font-medium text-ink">{solution}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">记录时间</dt>
                <dd className="font-medium text-ink">{done.time}</dd>
              </div>
            </dl>
            <button type="button" onClick={onClose} className="mf-btn-primary mt-5 w-full">
              我知道了
            </button>
          </div>
        ) : (
          /* 表单 */
          <form onSubmit={submit} className="px-5 py-5">
            <p className="flex items-start gap-2 rounded-lg border border-line bg-cream-soft px-3.5 py-2.5 text-[12px] leading-relaxed text-ink-soft">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
              请勿填写身份证号、银行卡号、具体案情等敏感个人信息。
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="demo-org" className="mf-label">
                  机构名称 <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="demo-org"
                  className="mf-input"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="例如：某市司法局 / 某街道办 / 某中学 / 某企业"
                  required
                />
              </div>

              <div>
                <label htmlFor="demo-contact" className="mf-label">
                  联系方式（可留空）
                </label>
                <input
                  id="demo-contact"
                  className="mf-input"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="如需后续沟通可填写工作联系方式"
                />
              </div>

              <div>
                <label htmlFor="demo-solution" className="mf-label">
                  意向解决方案
                </label>
                <select
                  id="demo-solution"
                  className="mf-input"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                >
                  {solutionOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="demo-scene" className="mf-label">
                  希望了解的重点（选填）
                </label>
                <textarea
                  id="demo-scene"
                  className="mf-input min-h-[92px] resize-y"
                  value={scene}
                  onChange={(e) => setScene(e.target.value)}
                  placeholder="例如：希望了解课程包内容、活动执行方式、成效评估指标等"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onClose} className="mf-btn-outline flex-1">
                取消
              </button>
              <button type="submit" className="mf-btn-primary flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    正在生成
                  </>
                ) : (
                  '生成咨询摘要'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
