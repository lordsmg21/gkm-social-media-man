import React from 'react'
import ClientDataDialog from './AdminDataManager'

interface AdminDataManagerProps {
  onClose: () => void
}

export function AdminDataManagerWrapper({ onClose }: AdminDataManagerProps) {
  return (
    <ClientDataDialog
      open={true}
      onClose={onClose}
    />
  )
}