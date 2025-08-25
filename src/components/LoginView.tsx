import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Shield, Users } from 'lucide-react'
import { toast } from 'sonner'
import type { User as UserType, UserRole } from '../App'

interface LoginViewProps {
  onLogin: (user: UserType) => void
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
      name: 'Mike Peters',
      email: 'mike@gkm.nl', 
      avatar: '',
      role: 'admin' as UserRole,
      isOnline: true
    }
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Find user by email and role
      const user = mockUsers.find(u => u.email === email && u.role === loginType)
      
      if (user) {
        onLogin(user)
        toast.success(`Welkom terug, ${user.name}!`)
      } else {
        toast.error('Ongeldige inloggegevens')
      }
    } catch (error) {
      toast.error('Er is een fout opgetreden bij het inloggen')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAccount = () => {
    toast.info('Account aanmaken functionaliteit komt binnenkort beschikbaar')
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
              <Button
                type="button"
                variant={loginType === 'client' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLoginType('client')}
                className={`flex items-center gap-2 ${
                  loginType === 'client' 
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <User className="w-4 h-4" />
                Klant
              </Button>
              <Button
                type="button"
                variant={loginType === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLoginType('admin')}
                className={`flex items-center gap-2 ${
                  loginType === 'admin'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="je@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/80 border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/80 border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? 'Inloggen...' : 'Inloggen'}
              </Button>
            </form>

            {/* Create Account */}
            <Button
              type="button"
              variant="outline"
              onClick={handleCreateAccount}
              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Account aanmaken
            </Button>

            <div className="text-center text-sm text-gray-500 mt-4">
              Voor klanten van GKM. Maak een account aan of log in met je bestaande gegevens.
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-4 glass-card border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Demo Inloggegevens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-gray-700">Admin:</div>
                <div className="text-gray-600">alex@gkm.nl</div>
                <div className="text-gray-600">mike@gkm.nl</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Klant:</div>
                <div className="text-gray-600">sarah@client.com</div>
              </div>
            </div>
            <div className="text-gray-500 text-center pt-2 border-t">
              Wachtwoord: willekeurig (demo)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}