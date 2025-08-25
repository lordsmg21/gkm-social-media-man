import { useState } from 'react'
import { User, UserRole } from '../App'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserIcon, ShieldIcon } from 'lucide-react'

interface LoginViewProps {
  onLogin: (user: User) => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [loginType, setLoginType] = useState<UserRole>('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock users for demo
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Admin GKM',
      email: 'admin@gkm.com',
      role: 'admin',
      avatar: '',
      isOnline: true
    },
    {
      id: '2',
      name: 'Client User',
      email: 'client@example.com',
      role: 'client',
      avatar: '',
      isOnline: false
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      email: 'maria@example.com',
      role: 'client',
      avatar: '',
      isOnline: true
    }
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Find user by email and role
      const user = mockUsers.find(u => u.email === email && u.role === loginType)
      
      if (user) {
        onLogin(user)
      } else {
        alert('Ongeldige inloggegevens')
      }
    } catch (error) {
      alert('Er is een fout opgetreden bij het inloggen')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAccount = () => {
    alert('Account aanmaken functionaliteit komt binnenkort beschikbaar')
  }

  const handleDemoLogin = (userType: UserRole) => {
    const demoUser = mockUsers.find(u => u.role === userType)
    if (demoUser) {
      onLogin(demoUser)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        {/* Main Login Card */}
        <div className="glass-modal rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <div className="text-white font-bold text-3xl">G</div>
            </div>
            <h1 className="font-heading text-3xl font-bold text-gray-800 mb-2">
              GKM Portal
            </h1>
            <p className="text-gray-600 text-lg">
              Log in om toegang te krijgen tot je projecten
            </p>
          </div>

          {/* Login Type Toggle */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-3 p-2 bg-white/30 rounded-xl backdrop-blur-sm border border-white/30">
              <button
                type="button"
                onClick={() => setLoginType('client')}
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  loginType === 'client' 
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg transform scale-[1.02]' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/40'
                }`}
              >
                <UserIcon size={18} />
                Client Login
              </button>
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  loginType === 'admin' 
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg transform scale-[1.02]' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/40'
                }`}
              >
                <ShieldIcon size={18} />
                Admin Login
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium text-base">
                E-mailadres
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="je@example.com"
                className="mt-2 h-12 px-4 bg-white/50 border-white/30 text-gray-800 placeholder-gray-500 backdrop-blur-sm text-base rounded-xl"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium text-base">
                Wachtwoord
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 h-12 px-4 bg-white/50 border-white/30 text-gray-800 placeholder-gray-500 backdrop-blur-sm text-base rounded-xl"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? 'Inloggen...' : 'Inloggen'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-4 text-gray-500 text-sm font-medium">of</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Demo Login Buttons */}
          <div className="space-y-4">
            <p className="text-center text-gray-600 text-sm font-medium">
              Demo toegang:
            </p>
            <div className="grid gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('admin')}
                className="w-full h-12 bg-white/30 border-white/40 text-gray-700 hover:bg-white/50 hover:text-gray-800 font-medium text-base rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                <ShieldIcon size={18} className="mr-3" />
                Demo Admin (admin@gkm.com)
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('client')}
                className="w-full h-12 bg-white/30 border-white/40 text-gray-700 hover:bg-white/50 hover:text-gray-800 font-medium text-base rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                <UserIcon size={18} className="mr-3" />
                Demo Client (client@example.com)
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <button
              type="button"
              onClick={handleCreateAccount}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
            >
              Nog geen account? Maak er een aan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}