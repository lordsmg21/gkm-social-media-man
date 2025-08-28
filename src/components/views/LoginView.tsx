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
import { useKV } from '@github/spark/hooks'
import { User, UserRole } from '../App'
import GKMLogo from '@/assets/images/gkm-logo.svg'

type Props = { onLogin?: (user: User) => void }

const defaultUsers: User[] = [
  { id: 'admin-1', name: 'GKM Admin', email: 'admin@gkm.com', role: 'admin', isOnline: false },
  { id: 'client-1', name: 'Demo Client', email: 'client@demo.com', role: 'client', isOnline: false },
]

export function LoginView({ onLogin }: Props) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loginType, setLoginType] = useState<UserRole>('client')
  const [allUsers, setAllUsers] = useKV<User[]>('system-users', defaultUsers)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const foundUser = allUsers.find(user => user.email === email && user.role === loginType)
    if (foundUser) {
      const loginUser = { ...foundUser, isOnline: true }
      onLogin?.(loginUser)
    } else {
      alert('Ongeldige inloggegevens of gebruiker bestaat niet')
    }
    setIsLoading(false)
  }

  const handleCreateAccount = () => {
    alert('Account aanmaken is nog niet beschikbaar in deze demo.')
  }

  const autofill = (role: UserRole) => {
    setLoginType(role)
    const demoUser = allUsers.find(user => user.role === role)
    if (demoUser) {
      setEmail(demoUser.email)
      setPassword('demo')
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* --- Achtergrond: zachte gele gradient + vage blobs voor zichtbare blur --- */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* basis zachte gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-amber-50/60 to-orange-50" />
        {/* blobs (lichtgeel) */}
        <div className="absolute -top-24 -left-24 w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.35)_0%,rgba(251,191,36,0)_60%)] blur-3xl" />
        <div className="absolute -bottom-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.28)_0%,rgba(245,158,11,0)_60%)] blur-3xl" />
      </div>

      {/* --- Kaart met sterk glas-effect --- */}
      <Card className="w-full max-w-md bg-white/25 backdrop-blur-2xl backdrop-saturate-150 border border-white/30 shadow-[0_8px_32px_rgba(31,38,135,0.15)]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={GKMLogo} alt="GKM Logo" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-center">GKM Portal</CardTitle>
          <CardDescription className="text-center">Log in of gebruik een demo-account.</CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          {/* Rol-toggle */}
          <div className="flex bg-muted rounded-xl p-1 mb-4">
            <button
              type="button"
              className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                loginType === 'admin' ? 'bg-background/80 backdrop-blur-sm shadow' : ''
              }`}
              onClick={() => setLoginType('admin')}
            >
              Admin
            </button>
            <button
              type="button"
              className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                loginType === 'client' ? 'bg-background/80 backdrop-blur-sm shadow' : ''
              }`}
              onClick={() => setLoginType('client')}
            >
              Client
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-input rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring text-left"
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
                className="w-full px-3 py-2 border border-input rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring text-left"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Bezig met inloggen…' : 'Inloggen'}
            </Button>
          </form>

          {/* Demo-accounts */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2">Demo accounts:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="text-xs" onClick={() => autofill('admin')}>
                <UserIcon className="w-3 h-3 mr-2" />
                Admin Demo
              </Button>
              <Button type="button" variant="outline" className="text-xs" onClick={() => autofill('client')}>
                <UserIcon className="w-3 h-3 mr-2" />
                Client Demo
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:underline"
            onClick={handleCreateAccount}
          >
            Nog geen account? Maak er een aan
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
