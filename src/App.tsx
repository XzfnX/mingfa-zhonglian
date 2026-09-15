import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { PublicShell, CitizenShell, InstitutionShell, AdminShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { InstitutionScopeRoute } from './components/InstitutionScopeRoute'

import LoginGatewayPage from './pages/LoginGatewayPage'
import CitizenHomePage from './pages/CitizenHomePage'
import CitizenConsultPage from './pages/CitizenConsultPage'
import CitizenCasesPage from './pages/CitizenCasesPage'
import CitizenDocumentsPage from './pages/CitizenDocumentsPage'
import CitizenAidPage from './pages/CitizenAidPage'
import CitizenSettingsPage from './pages/CitizenSettingsPage'
import CitizenAccessibilityPage from './pages/CitizenAccessibilityPage'
import InstitutionHomePage from './pages/InstitutionHomePage'
import InstitutionSolutionPage from './pages/InstitutionSolutionPage'
import ResultsPage from './pages/ResultsPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminHomePage from './pages/AdminHomePage'

/**
 * 明法众联 · 应用路由
 *
 * 该文件只负责路由与整体组合，具体页面逻辑分散在 src/pages 下，
 * 通用组件在 src/components 下，模拟数据在 src/data 下。
 *
 * 关于「路由保护」：这里的 ProtectedRoute 只是前端演示用的身份区分，
 * sessionStorage 中的标记可以被随意修改，不构成任何真实安全能力。
 */
export default function App() {
  return (
    <AccessibilityProvider>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginGatewayPage />} />

            {/* ---------- 登录后可见的项目信息 ---------- */}
            <Route element={<ProtectedRoute allow="any" />}>
              <Route element={<PublicShell />}>
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/about" element={<AboutPage />} />
              </Route>
            </Route>

            {/* ---------- 旧登录链接兼容 ---------- */}
            <Route path="/login/citizen" element={<Navigate to="/?role=citizen" replace />} />
            <Route path="/login/institution" element={<Navigate to="/?role=institution" replace />} />
            <Route path="/login/admin" element={<Navigate to="/?role=admin" replace />} />

            {/* ---------- C 端群众服务（需群众身份） ---------- */}
            <Route element={<ProtectedRoute allow="citizen" />}>
              <Route element={<CitizenShell />}>
                <Route path="/citizen" element={<CitizenHomePage />} />
                <Route path="/citizen/consult" element={<CitizenConsultPage />} />
                <Route path="/citizen/cases" element={<CitizenCasesPage />} />
                <Route path="/citizen/documents" element={<CitizenDocumentsPage />} />
                <Route path="/citizen/aid" element={<CitizenAidPage />} />
                <Route path="/citizen/settings" element={<CitizenSettingsPage />} />
                <Route path="/citizen/settings/accessibility" element={<CitizenAccessibilityPage />} />
              </Route>
            </Route>

            {/* ---------- B 端机构方案（需机构身份） ---------- */}
            <Route element={<ProtectedRoute allow="institution" />}>
              <Route element={<InstitutionShell />}>
                <Route path="/institution" element={<InstitutionHomePage />} />
                <Route path="/institution/justice" element={<InstitutionScopeRoute institutionType="justice"><InstitutionSolutionPage solutionId="justice" /></InstitutionScopeRoute>} />
                <Route path="/institution/street" element={<InstitutionScopeRoute institutionType="street"><InstitutionSolutionPage solutionId="street" /></InstitutionScopeRoute>} />
                <Route path="/institution/school" element={<InstitutionScopeRoute institutionType="school"><InstitutionSolutionPage solutionId="school" /></InstitutionScopeRoute>} />
                <Route path="/institution/enterprise" element={<InstitutionScopeRoute institutionType="enterprise"><InstitutionSolutionPage solutionId="enterprise" /></InstitutionScopeRoute>} />
              </Route>
            </Route>

            {/* ---------- 平台管理（可查看全部机构） ---------- */}
            <Route element={<ProtectedRoute allow="admin" />}>
              <Route element={<AdminShell />}>
                <Route path="/admin" element={<AdminHomePage />} />
                <Route path="/admin/justice" element={<InstitutionHomePage viewType="justice" adminView />} />
                <Route path="/admin/street" element={<InstitutionHomePage viewType="street" adminView />} />
                <Route path="/admin/school" element={<InstitutionHomePage viewType="school" adminView />} />
                <Route path="/admin/enterprise" element={<InstitutionHomePage viewType="enterprise" adminView />} />
                <Route path="/admin/justice/solution" element={<InstitutionSolutionPage solutionId="justice" adminView />} />
                <Route path="/admin/street/solution" element={<InstitutionSolutionPage solutionId="street" adminView />} />
                <Route path="/admin/school/solution" element={<InstitutionSolutionPage solutionId="school" adminView />} />
                <Route path="/admin/enterprise/solution" element={<InstitutionSolutionPage solutionId="enterprise" adminView />} />
              </Route>
            </Route>

            {/* 兼容旧链接：/institution/:solutionId 之外的拼写错误统一回到总览 */}
            <Route path="/institution/solutions" element={<Navigate to="/institution" replace />} />

            {/* ---------- 404 ---------- */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </AccessibilityProvider>
  )
}
