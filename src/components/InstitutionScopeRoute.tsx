import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { InstitutionType } from '../types'

export function InstitutionScopeRoute({ institutionType, children }: { institutionType: InstitutionType; children: React.ReactNode }) {
  const { user } = useAuth()
  if (user?.userType !== 'institution' || user.institutionType !== institutionType) {
    return <Navigate to="/institution" replace state={{ reason: 'institution-scope' }} />
  }
  return children
}
