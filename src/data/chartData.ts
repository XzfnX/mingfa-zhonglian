/**
 * 首页「线上 + 线下双轨服务模式」与商业模式相关展示数据
 */

export const dualTrack: {
  id: string
  track: '线下' | '线上'
  title: string
  desc: string
  items: { title: string; desc: string }[]
}[] = [
  {
    id: 'offline',
    track: '线下',
    title: '沉浸式普法实践',
    desc: '把法律知识放回真实生活场景，用可参与、可体验的方式建立法治意识。',
    items: [
      { title: '模拟法庭', desc: '学生与居民分饰角色，完整走一遍庭审流程并复盘法律要点。' },
      { title: '法治情景剧', desc: '将反诈、邻里纠纷等场景改编为短剧，演出后组织讨论。' },
      { title: '社区法治集市', desc: '以展板、问答、咨询台组合形式在社区广场集中开展普法。' },
      { title: '法治议事角', desc: '围绕居民实际纠纷议题组织协商议事，边议边普法。' },
    ],
  },
  {
    id: 'online',
    track: '线上',
    title: '数智化普法服务',
    desc: '把普法内容与服务流程线上化，让群众随时可以获得清晰指引。',
    items: [
      { title: '智能普法咨询', desc: '输入问题即可获得一般处理步骤、材料清单与求助渠道。' },
      { title: '生活案例库', desc: '按主题分类的真实场景解析，支持关键词检索。' },
      { title: '文书与援助指引', desc: '常见法律文书的准备说明与法律援助办理指引。' },
      { title: '机构成效看板', desc: '为机构客户提供普法运营与服务成效的可视化展示。' },
    ],
  },
]

export const solutionOverview: {
  id: string
  to: string
  name: string
  product: string
  desc: string
  icon: string
  points: string[]
}[] = [
  {
    id: 'justice',
    to: '/institution/justice',
    name: '司法行政',
    product: '智慧普法运营与成效评估平台',
    desc: '面向司法行政系统的普法内容统一管理、精准触达与成效量化评估。',
    icon: 'Landmark',
    points: ['内容统一管理', '活动计划管理', '成效评估报告'],
  },
  {
    id: 'street',
    to: '/institution/street',
    name: '街道治理',
    product: '基层法治需求与矛盾预防服务包',
    desc: '需求采集、高频矛盾分析与反诈宣传任务协同的一体化服务。',
    icon: 'Building2',
    points: ['需求采集分析', '矛盾预防专题', '任务执行跟踪'],
  },
  {
    id: 'school',
    to: '/institution/school',
    name: '学校法治教育',
    product: '校园法治教育与模拟法庭课程体系',
    desc: '成体系课程、模拟法庭课程包与学习效果测评工具。',
    icon: 'School',
    points: ['六大专题课程', '模拟法庭课程包', '效果测评报告'],
  },
  {
    id: 'enterprise',
    to: '/institution/enterprise',
    name: '企业合规宣教',
    product: '企业合规宣教与员工法律风险培训',
    desc: '劳动用工、合同风险、反诈与数据合规的定制化培训服务。',
    icon: 'Briefcase',
    points: ['定制课程包', '培训组织工具', '测评与成果报告'],
  },
]

/** 首页展示用的小型指标（与项目成果口径一致） */
export const heroStats: { value: string; label: string }[] = [
  { value: '15 个', label: '覆盖社区' },
  { value: '8 个', label: '深入乡村' },
  { value: '100+ 场', label: '普法活动' },
  { value: '10000+', label: '线上服务人次' },
]
