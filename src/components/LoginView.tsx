import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { User, UserRole } from '../App'
import { User as UserIcon, Shield } from 'lucide-react'

interface LoginViewProps {
  onLogin: (user: User) => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [loginType, setLoginType] = useState<UserRole>('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Demo users for testing
  const demoUsers = {
    admin: {
      id: '1',
      name: 'GKM Admin',
      email: 'admin@gkm.com',
      avatar: 'https://ui-avatars.com/api/?name=GKM+Admin&background=f59e0b&color=fff',
      role: 'admin' as UserRole,
      isOnline: true
    },
    client: {
      id: '2', 
      name: 'Demo Client',
      email: 'client@demo.com',
      avatar: 'https://ui-avatars.com/api/?name=Demo+Client&background=3b82f6&color=fff',
      role: 'client' as UserRole,
      isOnline: true
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = Object.values(demoUsers).find(u => u.email === email)
    if (user && user.role === loginType) {
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
    alert('Account aanmaken functionaliteit komt binnenkort!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <Card className="glass-card p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-4">
              <span className="text-2xl font-bold text-white">G</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-foreground">
              GKM Portal
            </h1>
            <p className="text-muted-foreground">
              Welkom terug bij het social media management platform
            </p>
          </div>

          {/* Login Type Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setLoginType('client')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginType === 'client'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserIcon size={16} className="inline mr-2" />
              Client
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginType === 'admin'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield size={16} className="inline mr-2" />
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="je@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Wachtwoord
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Voer je wachtwoord in"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium"
            >
              {isLoading ? 'Inloggen...' : 'Inloggen'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            <span className="text-sm text-muted-foreground">of</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>

          {/* Demo Login */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Demo toegang:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleDemoLogin('admin')}
                className="h-12 border-2 hover:bg-primary/5"
              >
                <Shield size={16} className="mr-2" />
                Admin Demo
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDemoLogin('client')}
                className="h-12 border-2 hover:bg-primary/5"
              >
                <UserIcon size={16} className="mr-2" />
                Client Demo
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4">
            <button
              onClick={handleCreateAccount}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Nog geen account? Maak er een aan
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}