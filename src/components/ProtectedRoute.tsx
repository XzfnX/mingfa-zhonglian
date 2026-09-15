import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  /** 允许访问的身份 */
  allow: 'citizen' | 'institution' | 'any'
}

/**
 * 前端路由守卫
 *
 * ⚠️ 这**不是**真实的安全鉴权：仅根据 sessionStorage 中的标记控制前端跳转，
 * 目的是在路演时清晰区分「群众端」和「机构端」两条产品线。
 * 真实系统中必须由服务端做鉴权与权限校验。
 */
export function ProtectedRoute({ allow }: ProtectedRouteProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    const params = new URLSearchParams()
    if (allow !== 'any') params.set('role', allow)
    params.set('from', `${location.pathname}${location.search}${location.hash}`)
    return <Navigate to={`/?${params.toString()}`} replace state={{ reason: 'unauthenticated' }} />
  }

  if (allow !== 'any' && user.userType !== allow) {
    // 越权访问：C 端账号访问 B 端（或反向）时，跳回自己身份的首页并提示
    const home = user.userType === 'citizen' ? '/citizen' : '/institution'
    return <Navigate to={home} replace state={{ reason: 'cross-role' }} />
  }

  return <Outlet />
}
