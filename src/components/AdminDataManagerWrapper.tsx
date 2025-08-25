import React from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '../App'
import ClientDataDialog from './AdminDataManager'

interface AdminDataManagerProps {
  onClose: () => void
}

export function AdminDataManagerWrapper({ onClose }: AdminDataManagerProps) {
  const [allUsers] = useKV<User[]>('system-users', [])
  
  // Filter only client users for the data manager
  const clientUsers = allUsers.filter(user => user.role === 'client').map(user => ({
    id: user.id,
    name: user.name,
    email: user.email
  }))

  return (
    <ClientDataDialog
      open={true}
      onClose={(open) => !open && onClose()}
      clients={clientUsers}
    />
  )
}