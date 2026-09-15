/** 全局类型定义：明法众联 */

export type UserType = 'citizen' | 'institution' | 'admin'

/** B 端机构类型 */
export type InstitutionType = 'justice' | 'street' | 'school' | 'enterprise'

/** sessionStorage 中保存的会话 */
export interface SessionUser {
  loggedIn: true
  userType: UserType
  /** 仅机构账号存在 */
  institutionType?: InstitutionType
  displayName: string
  /** 机构或管理员账号的组织名称 */
  orgName?: string
  /** 机构或管理员账号的岗位 */
  orgRole?: string
}

/** 演示账号定义 */
export interface DemoUser {
  username: string
  password: string
  userType: UserType
  institutionType?: InstitutionType
  displayName: string
  orgName?: string
  orgRole?: string
  hint?: string
}

/* ---------------- C 端 ---------------- */

export type CaseCategory =
  | '反诈'
  | '劳动权益'
  | '校园保护'
  | '婚姻家庭'
  | '物业纠纷'
  | '老年人权益'

export interface ConsultAnswer {
  id: string
  /** 预设问题（用于按钮） */
  question: string
  /** 关键词（用于模糊匹配自由输入） */
  keywords: string[]
  summary: string
  steps: string[]
  materials: string[]
  contacts: { name: string; note: string }[]
  risks: string[]
}

export interface LifeCase {
  id: string
  title: string
  category: CaseCategory
  audience: string[]
  scene: string
  /** 争议焦点 / 法律要点 */
  keyPoints: string[]
  /** 一般处理路径 */
  path: string[]
  tips: string[]
  relatedLaws: string[]
}

export interface DocumentGuide {
  id: string
  name: string
  category: '劳动维权' | '调解与援助' | '民事诉讼' | '工伤认定'
  scene: string
  materials: string[]
  writing: string[]
  notice: string
}

export interface AidStep {
  title: string
  desc: string
}

export interface FocusGroup {
  id: string
  name: string
  desc: string
  topics: { title: string; desc: string }[]
}

/* ---------------- B 端 ---------------- */

export interface ChartSpec {
  kind: 'line' | 'bar' | 'pie' | 'area' | 'radar' | 'hbar'
  title: string
  desc: string
  unit?: string
  /** 可切换的维度筛选，例如「近 6 个月 / 近 12 个月」 */
  filters?: { id: string; label: string; data: Record<string, any>[] }[]
  data?: Record<string, any>[]
  /** 饼图 / 雷达图使用的分类字段 */
  categoryKey?: string
  /** 数值字段 */
  valueKeys: string[]
  /** 图例名称映射 */
  seriesNames?: Record<string, string>
  colors?: string[]
}

export interface Deliverable {
  id: string
  name: string
  format: string
  scene: string
  detail: string[]
  audience: string
}

export interface SolutionModule {
  id: string
  name: string
  desc: string
  points: string[]
}

export interface InstitutionSolution {
  id: InstitutionType
  key: string
  productName: string
  tagline: string
  audience: string
  painPoints: string[]
  modules: SolutionModule[]
  charts: ChartSpec[]
  deliverables: Deliverable[]
  /** 该方案的特色展示块（热力图、排行榜、时间线等结构化内容） */
  highlights?: {
    title: string
    desc: string
    kind: 'heatmap' | 'ranking' | 'progress' | 'feedback' | 'awareness' | 'timeline'
    payload: any
  }[]
  statement?: string
  metrics: { label: string; value: string; sub: string }[]
}

/* ---------------- 通用 ---------------- */

export interface ResultMetric {
  id: string
  label: string
  value: number
  suffix?: string
  desc: string
  icon: string
}

export interface TimelineItem {
  id: string
  phase: string
  title: string
  desc: string
}

export interface CooperationMode {
  id: string
  name: string
  target: string
  desc: string
  outputs: string[]
}

export interface ActivityItem {
  id: string
  title: string
  type: '线下普法' | '校园法治' | '社区服务' | '企业培训' | '乡村普法'
  place: string
  date: string
  scale: string
  desc: string
  /** 抽象视觉主题（不生成虚假现场照片） */
  visual: 'community' | 'campus' | 'enterprise' | 'village' | 'institution'
}

export interface ToastMessage {
  id: number
  type: 'success' | 'error' | 'info'
  text: string
}
