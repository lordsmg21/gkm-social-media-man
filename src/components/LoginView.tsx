import { useState } from 'react'


interface UserType {
  name: string

  isOnline?: boolean

  onLogin: (us

  const [loginTyp
  const [passwor

 

interface LoginViewProps {
  onLogin: (user: UserType) => void
}     email: 'alex@gkm.nl',
      avatar: '',
export function LoginView({ onLogin }: LoginViewProps) {
  const [loginType, setLoginType] = useState<UserRole>('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock users for demonstration
  const mockUsers = [
    {
      id: '1',
      name: 'Alex van der Berg',
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@gkm.nl', 
      avatar: '',
      role: 'admin' as UserRole,
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
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="je@voorbeeld.nl"
                className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-3">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                required
              />
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:from-amber-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? 'Inloggen...' : 'Inloggen'}
            </button>
          </div>

          {/* Demo Login Options */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white/80 backdrop-blur-sm px-4 py-1 text-gray-600 rounded-full">
                  Demo Accounts
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => {
                  setEmail('alex@gkm.nl')
                  setLoginType('admin')
                }}
                className="w-full text-left p-4 text-sm text-gray-700 hover:bg-white/40 rounded-xl border border-white/30 transition-all duration-200 backdrop-blur-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-amber-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-800">Admin - Alex van der Berg</div>
                    <div className="text-gray-600 text-xs">alex@gkm.nl</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('sarah@client.com')
                  setLoginType('client')
                }}
                className="w-full text-left p-4 text-sm text-gray-700 hover:bg-white/40 rounded-xl border border-white/30 transition-all duration-200 backdrop-blur-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <User size={16} className="text-blue-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-800">Client - Sarah Johnson</div>
                    <div className="text-gray-600 text-xs">sarah@client.com</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Create Account */}
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={handleCreateAccount}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              Nog geen account? Maak er een aan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState<UserType | null>(null)

  const handleLogin = (loggedInUser: UserType) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
}

export default function App() {
  const [user, setUser] = useState<UserType | null>(null)

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welkom, {user.name}!
                </h1>
                <p className="text-gray-600">
                  Je bent ingelogd als {user.role === 'admin' ? 'Administrator' : 'Client'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Uitloggen
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Projecten</h3>
                <p className="text-blue-700">Beheer je actieve projecten</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Rapporten</h3>
                <p className="text-green-700">Bekijk je maandelijkse rapporten</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Facturen</h3>
                <p className="text-purple-700">Download je facturen</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <LoginView onLogin={handleLogin} />
}}