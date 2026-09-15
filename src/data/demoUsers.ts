import type { DemoUser } from '../types'

/**
 * 演示账号（纯前端身份区分，不具备任何真实安全能力）
 * 所有账号密码均为演示用固定值。
 */
export const CITIZEN_DEMO: DemoUser = {
  username: '13800000001',
  password: '123456',
  userType: 'citizen',
  displayName: '演示群众用户',
  hint: '手机号登录 · 演示环境',
}

export const INSTITUTION_DEMO_USERS: DemoUser[] = [
  {
    username: 'justice@demo.cn',
    password: 'demo123',
    userType: 'institution',
    institutionType: 'justice',
    displayName: '演示司法局用户',
    orgName: '示范市司法局（演示）',
    orgRole: '普法与依法治理科',
  },
  {
    username: 'street@demo.cn',
    password: 'demo123',
    userType: 'institution',
    institutionType: 'street',
    displayName: '演示街道用户',
    orgName: '示范街道办（演示）',
    orgRole: '综合治理中心',
  },
  {
    username: 'school@demo.cn',
    password: 'demo123',
    userType: 'institution',
    institutionType: 'school',
    displayName: '演示学校用户',
    orgName: '示范中学（演示）',
    orgRole: '学生发展中心 / 法治教育组',
  },
  {
    username: 'enterprise@demo.cn',
    password: 'demo123',
    userType: 'institution',
    institutionType: 'enterprise',
    displayName: '演示企业用户',
    orgName: '示范科技企业（演示）',
    orgRole: '人力资源与合规部',
  },
]

export const ALL_DEMO_USERS: DemoUser[] = [CITIZEN_DEMO, ...INSTITUTION_DEMO_USERS]

/** 按机构类型取快捷填入的演示账号 */
export function getInstitutionDemo(type: 'justice' | 'street' | 'school' | 'enterprise') {
  return INSTITUTION_DEMO_USERS.find((u) => u.institutionType === type)!
}

export const DEMO_ENV_NOTICE =
  '本页面为参赛路演演示环境，登录仅用于区分群众端与机构端，不涉及真实账号体系、短信验证与个人信息采集。'
