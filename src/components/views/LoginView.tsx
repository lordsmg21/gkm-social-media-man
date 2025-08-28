// src/components/LoginView.tsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LogIn, UserPlus, User as UserIcon, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks'
import type { User, UserRole } from '@/types'
import logoImg from '@/assets/images/gkm-logo.svg'

type Props = { onLogin?: (user: User) => void }

const defaultUsers: User[] = [
  { id: 'admin-1', name: 'GKM Admin', email: 'admin@gkm.com', role: 'admin', isOnline: false },
  { id: 'client-1', name: 'Demo Client', email: 'client@demo.com', role: 'client', isOnline: false },
]

export function LoginView({ onLogin }: Props) {
  const { registeredUsers, registerUser } = useAuth()
  const [activeTab, setActiveTab] = useState('login')
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  
  // Registration form state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regRole, setRegRole] = useState<UserRole>('client')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check both registered users and default users
    const allUsers = [...registeredUsers, ...defaultUsers]
    const user = allUsers.find(u => u.email === loginEmail)
    
    if (user) {
      toast.success(`Welcome back, ${user.name}!`)
      onLogin?.(user)
    } else {
      toast.error('User not found. Please check your email or register first.')
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Create new user
      const newUser: User = {
        id: `${regRole}-${Date.now()}`,
        name: regName,
        email: regEmail,
        role: regRole,
        isOnline: false
      }
      
      // Register user
      registerUser(newUser)
      
      toast.success(`Registration successful! Welcome, ${regName}!`)
      
      // Reset form
      setRegName('')
      setRegEmail('')
      setRegPassword('')
      setRegRole('client')
      
      // Auto login after registration
      onLogin?.(newUser)
      
    } catch (error) {
      toast.error('Email already registered. Please use a different email.')
    }
  }

  const handleDemoLogin = (userType: 'admin' | 'client') => {
    const demoUser = userType === 'admin' ? defaultUsers[0] : defaultUsers[1]
    onLogin?.(demoUser)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={logoImg} 
            alt="GKM Logo" 
            className="h-16 w-16 mx-auto mb-4 object-contain"
          />
          <h1 className="text-3xl font-bold font-heading text-foreground mb-2">
            GKM Portal
          </h1>
          <p className="text-muted-foreground">
            Log in of gebruik een demo-account
          </p>
        </div>

        <Card className="glass-card border-primary/20 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-center">Access Your Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="bg-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="bg-white/50"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      className="bg-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="Enter your email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      className="bg-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Create a password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="bg-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <Select value={regRole} onValueChange={(value: UserRole) => setRegRole(value)}>
                      <SelectTrigger className="bg-white/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            Client Account
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Admin Account
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or use demo accounts
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleDemoLogin('admin')}
                className="flex items-center gap-2 bg-white/50 hover:bg-white/70"
              >
                <Shield className="h-4 w-4" />
                Admin Demo
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDemoLogin('client')}
                className="flex items-center gap-2 bg-white/50 hover:bg-white/70"
              >
                <UserIcon className="h-4 w-4" />
                Client Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
