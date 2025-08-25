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
    <div className="min-h-screen w-full flex items-center justify-center p-4 glass-card">
      <Card className="w-full max-w-md glass-modal shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-heading text-center">GKM Portal</CardTitle>
          <CardDescription className="text-center">Log in of gebruik een demo-account.</CardDescription>
          
          <div className="flex bg-muted rounded-xl p-1">
            <button
              type="button"
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${
                loginType === 'admin' 
                  ? 'bg-background shadow-sm font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setLoginType('admin')}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Admin
            </button>
            <button
              type="button"
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${
                loginType === 'client' 
                  ? 'bg-background shadow-sm font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setLoginType('client')}
            >
              <UserIcon className="w-4 h-4 inline mr-2" />
              Client
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? 'Bezig met inloggen…' : 'Inloggen'}
            </Button>
          </form>

          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              Demo accounts:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => autofill('admin')}
                className="text-xs"
              >
                <Shield className="w-3 h-3 mr-2" />
                Admin Demo
              </Button>
              <Button 
                variant="outline" 
                onClick={() => autofill('client')}
                className="text-xs"
              >
                <UserIcon className="w-3 h-3 mr-2" />
                Client Demo
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-center">
          <button
            onClick={handleCreateAccount}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Nog geen account? Maak er een aan
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}