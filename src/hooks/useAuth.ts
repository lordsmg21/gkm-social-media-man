import { useKV } from '@github/spark/hooks'
import type { User } from '@/types'

export function useAuth() {
  const [currentUser, setCurrentUser] = useKV<User | null>('current-user', null)
  const [registeredUsers, setRegisteredUsers] = useKV<User[]>('registered-users', [])

  const login = (user: User) => {
    // Update the user's online status
    const updatedUser = { ...user, isOnline: true }
    setCurrentUser(updatedUser)
    
    // Update the user in registered users list
    setRegisteredUsers(prev => 
      prev.map(u => u.id === user.id ? updatedUser : u)
    )
  }

  const logout = () => {
    // Update user's online status before logging out
    if (currentUser) {
      setRegisteredUsers(prev => 
        prev.map(u => u.id === currentUser.id ? { ...u, isOnline: false } : u)
      )
    }
    setCurrentUser(null)
  }

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser)
    
    // Also update in registered users list
    setRegisteredUsers(prev => 
      prev.map(u => u.id === updatedUser.id ? updatedUser : u)
    )
  }

  const registerUser = (user: User) => {
    setRegisteredUsers(prev => {
      // Check if user already exists
      const exists = prev.find(u => u.email === user.email)
      if (exists) {
        throw new Error('User already exists')
      }
      return [...prev, user]
    })
  }

  const isAuthenticated = currentUser !== null
  const isAdmin = currentUser?.role === 'admin'
  const isClient = currentUser?.role === 'client'

  return {
    currentUser,
    registeredUsers,
    login,
    logout,
    updateUser,
    registerUser,
    isAuthenticated,
    isAdmin,
    isClient
  }
}