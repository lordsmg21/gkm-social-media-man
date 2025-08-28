import { useKV } from '@github/spark/hooks'
import type { User } from '@/types'

export function useAuth() {
  const [currentUser, setCurrentUser] = useKV<User | null>('current-user', null)

  const login = (user: User) => {
    setCurrentUser(user)
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser)
  }

  const isAuthenticated = currentUser !== null
  const isAdmin = currentUser?.role === 'admin'
  const isClient = currentUser?.role === 'client'

  return {
    currentUser,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
    isClient
  }
}