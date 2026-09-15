import type { ActivityItem, CooperationMode, ResultMetric, TimelineItem } from '../types'

/** 项目阶段性成果（统一标注为阶段性数据，不代表实时后台数据） */
export const PROJECT_RESULT_LABEL = '项目阶段性成果'

export const resultMetrics: ResultMetric[] = [
  { id: 'community', label: '覆盖社区', value: 15, suffix: '个', desc: '与社区党群服务中心共建线下普法阵地', icon: 'Building2' },
  { id: 'village', label: '深入乡村', value: 8, suffix: '个', desc: '面向乡村振兴场景开展普法下乡实践', icon: 'Trees' },
  { id: 'events', label: '开展普法活动', value: 100, suffix: '余场', desc: '模拟法庭、情景剧、法治集市等形式', icon: 'CalendarCheck' },
  { id: 'online', label: '线上服务', value: 10000, suffix: '+人次', desc: '线上普法内容与咨询指引累计触达', icon: 'Users' },
  { id: 'satisfaction', label: '群众满意度', value: 96, suffix: '%', desc: '活动结束后现场问卷回收统计', icon: 'ThumbsUp' },
]

export const cooperationModes: CooperationMode[] = [
  {
    id: 'gov',
    name: '政府购买公益普法服务',
    target: '司法局 / 依法治理部门',
    desc: '按年度或专项形式采购标准化普法内容、活动执行与成效评估服务。',
    outputs: ['年度普法活动计划', '普法内容资源包', '服务成效评估报告'],
  },
  {
    id: 'justice-special',
    name: '司法行政专项项目合作',
    target: '司法行政系统',
    desc: '围绕重点人群、重点领域法治宣传需求开展专项项目共建。',
    outputs: ['专项需求分析简报', '重点人群触达方案', '专项成果报告'],
  },
  {
    id: 'street',
    name: '街道和社区年度普法共建',
    target: '街道办 / 社区党群服务中心',
    desc: '以法治议事角、网格普法为载体，形成常态化社区普法机制。',
    outputs: ['社区法治需求简报', '全年活动排期', '矛盾预防主题分析'],
  },
  {
    id: 'school',
    name: '学校法治课程与活动共建',
    target: '中小学 / 高校',
    desc: '提供法治课程体系与模拟法庭课程包，配套教师手册与活动方案。',
    outputs: ['课程体系方案', '模拟法庭活动方案', '课堂效果测评报告'],
  },
  {
    id: 'enterprise',
    name: '企业定制化普法培训',
    target: '企业人力资源 / 合规部门',
    desc: '面向员工提供劳动用工、合同风险、反诈与数据合规宣教培训。',
    outputs: ['定制课程包', '培训实施记录', '合规知识测评结果'],
  },
  {
    id: 'ngo',
    name: '公益组织与高校开放赋能合作',
    target: '公益组织 / 高校院系 / 志愿团队',
    desc: '开放普法内容与方法论，联合培养普法志愿者与法治实践团队。',
    outputs: ['志愿者培训手册', '普法方法论文档', '联合实践成果'],
  },
]

export const cooperationFlow: TimelineItem[] = [
  { id: 'f1', phase: '第 1 步', title: '需求诊断', desc: '走访调研，明确服务对象、重点议题与考核关注点。' },
  { id: 'f2', phase: '第 2 步', title: '方案设计', desc: '结合机构场景输出内容、活动与评估一体化方案。' },
  { id: 'f3', phase: '第 3 步', title: '专业内容审核', desc: '由法学专业师生与指导老师复核内容准确性与表述边界。' },
  { id: 'f4', phase: '第 4 步', title: '项目试点', desc: '选择 1—2 个社区、班级或部门开展小范围试点验证。' },
  { id: 'f5', phase: '第 5 步', title: '正式实施', desc: '按排期推进线下活动与线上服务，过程留痕可追溯。' },
  { id: 'f6', phase: '第 6 步', title: '数据反馈', desc: '收集参与数据、需求数据与满意度反馈。' },
  { id: 'f7', phase: '第 7 步', title: '成果报告', desc: '形成阶段性成果报告与可视化成效材料。' },
  { id: 'f8', phase: '第 8 步', title: '持续优化', desc: '依据反馈迭代内容与活动形式，滚动推进下一周期。' },
]

export const standardDeliverables: string[] = [
  '数智普法平台演示',
  '定制课程包',
  '模拟法庭活动方案',
  '法治情景剧脚本',
  '普法内容资源包',
  '法治需求分析简报',
  '服务成效报告',
  '年度合作总结',
]

/** 公益反哺闭环：B 端收入 → 内容与平台建设 → 扩大 C 端免费服务 → 社会影响力背书 → 更多机构合作 */
export const reinvestLoop: { step: string; title: string; desc: string }[] = [
  { step: '01', title: 'B 端机构合作', desc: '司法行政、街道、学校与企业形成项目合作。' },
  { step: '02', title: '形成项目运营收入', desc: '服务收入覆盖内容生产与团队运营成本。' },
  { step: '03', title: '支持内容与平台建设', desc: '投入普法内容打磨、平台维护与志愿者培训。' },
  { step: '04', title: '扩大 C 端免费服务', desc: '核心群众服务保持免费，服务范围持续扩展。' },
  { step: '05', title: '形成社会影响力与合作背书', desc: '沉淀实践成果与机构合作案例。' },
  { step: '06', title: '促进更多机构合作', desc: '形成可持续的自我循环与滚动发展能力。' },
]

export const reinvestStatement =
  '核心群众服务保持免费。机构合作收入主要用于平台维护、专业内容生产、志愿者培训和公益普法服务扩展。'

export const activities: ActivityItem[] = [
  {
    id: 'a1',
    title: '社区法治集市：反诈主题普法',
    type: '线下普法',
    place: '示范社区党群服务中心广场',
    date: '2025 年 3 月',
    scale: '现场参与约 300 人次',
    desc: '以情景演示、有奖问答、案例展板方式讲解常见电信诈骗套路与应对流程。',
    visual: 'community',
  },
  {
    id: 'a2',
    title: '校园模拟法庭：未成年人保护专题',
    type: '校园法治',
    place: '示范中学报告厅',
    date: '2025 年 4 月',
    scale: '覆盖 8 个班级',
    desc: '学生分饰审判、公诉、辩护与当事人角色，完整走一遍庭审流程并复盘法律要点。',
    visual: 'campus',
  },
  {
    id: 'a3',
    title: '乡村普法下乡：土地与劳务权益',
    type: '乡村普法',
    place: '示范乡镇 3 个行政村',
    date: '2025 年 5 月',
    scale: '累计走访 200 余户',
    desc: '结合方言讲解与图示手册，重点回应外出务工、土地流转等高频咨询。',
    visual: 'village',
  },
  {
    id: 'a4',
    title: '企业员工反诈与劳动用工合规课堂',
    type: '企业培训',
    place: '示范科技企业培训室',
    date: '2025 年 6 月',
    scale: '参训员工 120 人',
    desc: '围绕劳动合同、加班与休假、个人信息保护开展案例式培训与随堂测评。',
    visual: 'enterprise',
  },
  {
    id: 'a5',
    title: '法治议事角：物业与邻里纠纷共议',
    type: '社区服务',
    place: '示范社区议事厅',
    date: '2025 年 7 月',
    scale: '居民代表 40 人',
    desc: '以议事协商形式梳理物业费、公共收益、噪声扰民等问题的合法解决路径。',
    visual: 'community',
  },
  {
    id: 'a6',
    title: '老年人权益保护专题：养老诈骗识别',
    type: '线下普法',
    place: '示范街道养老服务中心',
    date: '2025 年 8 月',
    scale: '现场参与 150 人次',
    desc: '用大字版手册与慢速讲解，帮助老年居民识别保健品会销与养老理财骗局。',
    visual: 'institution',
  },
]

export const projectHighlights: { title: string; desc: string; icon: string }[] = [
  { title: '高校专业支撑', desc: '法学专业师生参与内容审核，保证表述准确与边界清晰。', icon: 'GraduationCap' },
  { title: '线下实践沉淀', desc: '社区、乡村、校园、企业四类场景形成可复用的活动方法论。', icon: 'Footprints' },
  { title: '线上服务扩面', desc: '普法内容与咨询指引线上化，降低群众获取法律知识的门槛。', icon: 'MonitorSmartphone' },
  { title: '数据化评估', desc: '以需求、参与、满意度三类数据支撑服务效果说明。', icon: 'BarChart3' },
]

export const brandValues: { title: string; desc: string; icon: string }[] = [
  { title: '普法为民', desc: '以群众听得懂、用得上为标准打磨内容。', icon: 'HeartHandshake' },
  { title: '专业严谨', desc: '内容以现行法律框架为依据，不确定的表述不做定论。', icon: 'Scale' },
  { title: '数智赋能', desc: '用产品化、数据化方式提升普法服务的可及性与效率。', icon: 'Cpu' },
  { title: '可持续', desc: '以机构合作反哺公益服务，形成自我循环。', icon: 'RefreshCw' },
]
