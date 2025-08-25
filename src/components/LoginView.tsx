import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User as UserIcon, Shield } from 'lucide-react'
import type { User, UserRole } from '../App'

interface LoginViewProps {
  onLogin: (user: User) => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [loginType, setLoginType] = useState<'admin' | 'client'>('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const demoUsers: Record<UserRole, User> = {
    admin: {
      id: '1',
      name: 'GKM Admin',
      email: 'admin@gkm.com',
      role: 'admin' as UserRole,
    },
    client: {
      id: '2', 
      name: 'Demo Client',
      email: 'client@demo.com',
      role: 'client' as UserRole,
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    const user = Object.values(demoUsers).find(u => u.email === email)
    if (user && password === 'demo') {
      onLogin(user)
    } else {
      alert('Ongeldige inloggegevens')
    }
    setIsLoading(false)
  }

  const handleDemoLogin = (type: UserRole) => {
    onLogin(demoUsers[type])
  }

  const handleCreateAccount = () => {
    alert('Account aanmaken feature komt binnenkort!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <Card className="glass-modal p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              GKM Portal
            </h1>
            <p className="text-muted-foreground">
              Social Media Management Platform
            </p>
          </div>

          {/* Login Type Toggle */}
          <div className="flex bg-muted rounded-xl p-1">
            <button
              onClick={() => setLoginType('client')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                loginType === 'client'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserIcon size={16} className="inline mr-2" />
              Client
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                loginType === 'admin'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield size={16} className="inline mr-2" />
              Admin
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="je@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600"
              disabled={isLoading}
            >
              {isLoading ? 'Inloggen...' : 'Inloggen'}
            </Button>
          </form>

          <div className="flex items-center gap-4">
            <span className="flex-1 h-px bg-border"></span>
            <span className="text-muted-foreground text-sm">of</span>
            <span className="flex-1 h-px bg-border"></span>
          </div>

          {/* Demo Login */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Demo toegang:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleDemoLogin('admin')}
                className="py-3 bg-white/50 backdrop-blur-sm hover:bg-white/70"
              >
                Admin Demo
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDemoLogin('client')}
                className="py-3 bg-white/50 backdrop-blur-sm hover:bg-white/70"
              >
                Client Demo
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-border">
            <button
              onClick={handleCreateAccount}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Nog geen account? Maak er een aan
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}