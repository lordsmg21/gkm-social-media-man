// src/components/LoginView.tsx
import React, { useState } from 'react'
import type { User, UserRole } from '@/types'

type Props = { onLogin?: (user: User) => void }

const defaultUsers: User[] = [
  { id: 'admin-1', name: 'GKM Admin', email: 'admin@gkm.com', role: 'admin', isOnline: false },
  { id: 'client-1', name: 'Demo Client', email: 'client@demo.com', role: 'client', isOnline: false },
]

export function LoginView({ onLogin }: Props) {
  const handleAdminLogin = () => {
    onLogin?.(defaultUsers[0])
  }

  const handleClientLogin = () => {
    onLogin?.(defaultUsers[1])
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GKM Portal</h1>
          <p className="text-gray-600">Choose your login type</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleAdminLogin}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
          >
            Login as Admin
          </button>
          
          <button
            onClick={handleClientLogin}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Login as Client
          </button>
        </div>
      </div>
    </div>
  )
}
