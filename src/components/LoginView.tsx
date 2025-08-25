import { useState } from 'react'
import { Button } from '@/components/ui
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
  onLogin: (user: User) => void


  const [password, setPass
  onLogin: (user: User) => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [loginType, setLoginType] = useState<UserRole>('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

    },
      id: '3',
     
      avatar: 
    }

    e.preventDefault

      // Simulate AP

     
      if (user
      } else {
      }
      alert('Er is ee
      setIsLoadin
  }
  cons
  }
  const handle
    if (demoUser) {
    }

    <div classNam
        {/* Main Log
     
   

              GKM Portal
            <p classNa
            </p>

         
              <button
                onClick={() => setLoginType('client')}

                    : 'text-gray-700
              >
      
              <bu
                onCli
              
                    : 'text-gray-700 hov
       
                Admin
            </div>

          <form onSubmit=
     
   

                value={email}
                placeholder="je@example.com"
   

            <div>
                Wachtwoord
              <Inpu
                type="p
     
   


              type="submit" 
              className="w-full h-12 bg
              {isLoading ? 'Inl
          </form>
          {/* Divider */
            <div className="flex-1 h-px bg-g
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

          <div cla
              Demo toegang:
            <div classNa
                t
                onClick={() => handleDemoLogin('a
              >
                
              <B

                className="w-full h
                <UserIcon size={
              </Button>
          </div>
          {/* Footer */}
            <button
              onClick={handleCreateAccount}
            >
            </button>
        </div>
    </div>
}











































































































