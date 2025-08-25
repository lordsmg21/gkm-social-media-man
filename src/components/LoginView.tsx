import { useState } from 'react'

// Define UserRole and UserType locally
type UserRole = 'admin' | 'client'

interface UserType {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  isOnline?: boolean
}

interface LoginViewProps {
  onLogin: (user: UserType) => void
}

// Mock Card components
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>
}

function CardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>
}

function CardTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h2 className={className}>{children}</h2>
}

function CardDescription({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={className}>{children}</p>
}

function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>
}

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
      email: 'alex@gkm.nl',
      avatar: '',
      role: 'admin' as UserRole,
      isOnline: true
    },
    {
      id: '2',
      name: 'Sarah Johnson', 
      email: 'sarah@client.com',
      avatar: '',
      role: 'client' as UserRole,
      isOnline: true
    },
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
        alert(`Welkom terug, ${user.name}!`)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="glass-modal shadow-2xl border-0">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <div className="text-white font-bold text-2xl">G</div>
            </div>
            <CardTitle className="font-heading text-2xl text-gray-800">
              GKM Client Portal
            </CardTitle>
            <CardDescription className="text-gray-600">
              Log in om toegang te krijgen tot je projecten en rapporten.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Login Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setLoginType('client')}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  loginType === 'client' 
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span>👤</span>
                Klant
              </button>
              
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  loginType === 'admin'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span>🛡️</span>
                Admin
              </button>
            </div>

            {/* Login Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="je@voorbeeld.nl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Wachtwoord
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-2 px-4 rounded-md font-medium shadow-lg hover:from-amber-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Inloggen...' : 'Inloggen'}
              </button>
            </div>

            {/* Demo Login Options */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Demo Inloggen</span>
                </div>
              </div>

              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('alex@gkm.nl')
                    setLoginType('admin')
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>🛡️</span>
                    <div>
                      <div className="font-medium">Admin - Alex van der Berg</div>
                      <div className="text-gray-500">alex@gkm.nl</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('sarah@client.com')
                    setLoginType('client')
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>👤</span>
                    <div>
                      <div className="font-medium">Client - Sarah Johnson</div>
                      <div className="text-gray-500">sarah@client.com</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Create Account */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleCreateAccount}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Nog geen account? Maak er een aan
              </button>
            </div>
          </CardContent>
        </Card>
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
    setUser(null)
  }

  if (user) {
    return (
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
}