// src/components/LoginView.tsx
import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User as UserIcon, Shield } from 'lucide-react'

type UserRole = 'admin' | 'client'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

type Props = { onLogin?: (user: User) => void }

const demoUsers: Record<UserRole, User> = {
  admin: { id: '1', name: 'GKM Admin', email: 'admin@gkm.com', role: 'admin' },
  client: { id: '2', name: 'Demo Client', email: 'client@demo.com', role: 'client' },
}

export function LoginView({ onLogin }: Props) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loginType, setLoginType] = useState<UserRole>('client')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const selected = loginType === 'admin' ? demoUsers.admin : demoUsers.client
    if (email === selected.email) {
      onLogin?.(selected)
    } else {
      alert('Ongeldige inloggegevens')
    }

    setIsLoading(false)
  }

  const handleCreateAccount = () => {
    alert('Account aanmaken is nog niet beschikbaar in deze demo.')
  }

  const autofill = (role: UserRole) => {
    setLoginType(role)
    setEmail(demoUsers[role].email)
    setPassword('password')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield size={20} />
            <CardTitle>GKM Portal</CardTitle>
          </div>
          <CardDescription>Log in of gebruik een demo-account.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex bg-muted rounded-xl p-1 mb-4">
            <button
              type="button"
              className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                loginType === 'admin' ? 'bg-background shadow' : ''
              }`}
              onClick={() => setLoginType('admin')}
            >
              Admin
            </button>
            <button
              type="button"
              className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                loginType === 'client' ? 'bg-background shadow' : ''
              }`}
              onClick={() => setLoginType('client')}
            >
              Client
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-input bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-input bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Bezig met inloggen…' : 'Inloggen'}
            </Button>
          </form>

          <div className="space-y-2 mt-6">
            <p className="text-sm text-muted-foreground">Demo</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => autofill('admin')}>
                Admin Demo
              </Button>
              <Button variant="outline" onClick={() => autofill('client')}>
                Client Demo
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <button className="text-sm text-muted-foreground" onClick={handleCreateAccount}>
            Nog geen account? Maak er een aan
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}