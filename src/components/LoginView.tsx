import { useState } from 'react'
import { User, Shield } from 'lucide-react'
import { User as UserType, UserRole } from '../App'

interface LoginViewProps {
  onLogin: (user: UserType) => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [loginType, setLoginType] = useState<UserRole>('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock users for demonstration
  const mockUsers: UserType[] = [
    {
      id: '1',
      name: 'Alex van der Berg',
      email: 'admin@gkm.nl',
      avatar: '',
      role: 'admin',
      isOnline: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@client.com',
      avatar: '',
      role: 'client',
      isOnline: false
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@gkm.nl', 
      avatar: '',
      role: 'admin',
      isOnline: true
    }
  ]

  const handleLogin = async () => {
    setIsLoading(true)

    try {
      // Simulate authentication delay
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
                <User size={18} className="flex-shrink-0" />
                Klant
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
                <Shield size={18} className="flex-shrink-0" />
                Admin
              </button>
            </div>
          </div>

          {/* Login Form */}
          <div className="space-y-6 mb-8">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">
                E-mailadres
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-white/30 rounded-xl bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all"
                placeholder="jouw@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-3">
                Wachtwoord
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-white/30 rounded-xl bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Inloggen...' : 'Inloggen'}
          </button>

          {/* Demo Login Options */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-center text-sm text-gray-600 mb-4">Demo toegang:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('client')}
                className="px-4 py-2 bg-white/40 hover:bg-white/60 text-gray-700 text-sm font-medium rounded-lg border border-white/30 transition-all"
              >
                Demo Klant
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="px-4 py-2 bg-white/40 hover:bg-white/60 text-gray-700 text-sm font-medium rounded-lg border border-white/30 transition-all"
              >
                Demo Admin
              </button>
            </div>
          </div>

          {/* Create Account Link */}
          <div className="mt-6 text-center">
            <button
              onClick={handleCreateAccount}
              className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors"
            >
              Nog geen account? Neem contact op
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}