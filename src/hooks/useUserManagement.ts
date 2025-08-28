import { useKV } from '@github/spark/hooks'
import type { User, ClientData } from '@/types'

export function useUserManagement() {
  const [users, setUsers] = useKV<User[]>('all-users', [])
  const [clientData, setClientData] = useKV<ClientData[]>('client-data', [])

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      isOnline: false
    }
    setUsers(currentUsers => [...currentUsers, newUser])
    
    // If it's a client, create initial client data
    if (user.role === 'client') {
      const newClientData: ClientData = {
        id: newUser.id,
        monthlyRevenue: 0,
        activeProjects: 0,
        leadGeneration: 0,
        facebookReach: 0,
        instagramEngagement: 0,
        messagesReceived: 0,
        growthRate: 0
      }
      setClientData(current => [...current, newClientData])
    }
    
    return newUser
  }

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(currentUsers => 
      currentUsers.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    )
  }

  const deleteUser = (userId: string) => {
    setUsers(currentUsers => currentUsers.filter(user => user.id !== userId))
    setClientData(current => current.filter(data => data.id !== userId))
  }

  const getClientUsers = () => {
    return users.filter(user => user.role === 'client')
  }

  const getAdminUsers = () => {
    return users.filter(user => user.role === 'admin')
  }

  const updateClientData = (clientId: string, data: Partial<ClientData>) => {
    setClientData(current => {
      const existingIndex = current.findIndex(item => item.id === clientId)
      if (existingIndex >= 0) {
        return current.map((item, index) => 
          index === existingIndex ? { ...item, ...data } : item
        )
      } else {
        return [...current, { id: clientId, ...data } as ClientData]
      }
    })
  }

  const getClientData = (clientId: string) => {
    return clientData.find(data => data.id === clientId)
  }

  return {
    users,
    clientData,
    addUser,
    updateUser,
    deleteUser,
    getClientUsers,
    getAdminUsers,
    updateClientData,
    getClientData
  }
}