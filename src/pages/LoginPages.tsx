import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CitizenLoginForm, InstitutionLoginForm } from '../components/LoginForm'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { firstRouteForInstitution } from '../context/AuthContext'

export function CitizenLoginPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { push } = useToast()

  // 已登录的群众账号直接进入服务中心，避免重复登录
  useEffect(() => {
    if (user?.userType === 'citizen') {
      navigate('/citizen', { replace: true })
    } else if (user?.userType === 'institution') {
      // C/B 端越权访问：提示并跳转到机构端
      push('当前为机构端登录状态，已为你跳转到机构解决方案中心。', 'info')
      navigate(firstRouteForInstitution(user.institutionType), { replace: true })
    }
  }, [user, navigate, push])

  return <CitizenLoginForm />
}

export function InstitutionLoginPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { push } = useToast()
  const location = useLocation()

  useEffect(() => {
    if (user?.userType === 'institution') {
      const from = (location.state as { from?: string } | null)?.from
      navigate(from && from.startsWith('/institution') ? from : firstRouteForInstitution(user.institutionType), {
        replace: true,
      })
    } else if (user?.userType === 'citizen') {
      push('当前为群众端登录状态，已为你跳转到群众普法服务中心。', 'info')
      navigate('/citizen', { replace: true })
    }
  }, [user, navigate, push, location.state])

  return <InstitutionLoginForm />
}
