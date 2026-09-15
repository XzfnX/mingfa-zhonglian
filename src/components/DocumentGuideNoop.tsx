import { Link } from 'react-router-dom'
import { ArrowRight, Layers, RefreshCw, ShieldCheck } from 'lucide-react'
import { reinvestLoop, reinvestStatement } from '../data/projectResults'

/**
 * 机构端首页的补充信息块：展示可复制性与公益反哺机制。
 * 命名保持独立，便于后续替换为其他展示形态。
 */
export function DocumentGuideNoop() {
  return (
    <section aria-labelledby="replicable-title" className="rounded-xl2 border border-line bg-white p-6">
      <h2 id="replicable-title" className="flex items-center gap-2 font-serif text-[19px] font-semibold text-ink">
        <RefreshCw className="h-5 w-5 text-brand" aria-hidden="true" />
        为什么具备可复制、可持续发展的能力
      </h2>
      <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-ink-soft">
        产品能力、内容体系与活动方法论都做了标准化封装，换一个区域或机构时只需替换本地案例与人群数据，
        无需从零重建。机构合作收入同时反哺群众端的免费服务，形成正向循环。
      </p>

      <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reinvestLoop.map((s) => (
          <li key={s.step} className="rounded-xl border border-line bg-cream-soft p-4">
            <p className="font-serif text-[20px] font-semibold leading-none text-gold-deep" aria-hidden="true">
              {s.step}
            </p>
            <p className="mt-2 text-[14px] font-semibold text-ink">{s.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{s.desc}</p>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-cream px-4 py-3.5">
        <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          <span>
            <span className="font-semibold text-brand">公益承诺：</span>
            {reinvestStatement}
          </span>
        </p>
        <Link to="/results" className="mf-btn-outline gap-1.5 text-[13px]">
          <Layers className="h-4 w-4" aria-hidden="true" />
          查看项目成果
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
