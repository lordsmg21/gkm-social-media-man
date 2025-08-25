import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Card } from '@/components/ui/card'

import { User as UserIcon, Shield } from 'lucide-react'

interface LoginViewProps {

 

      email: 'admin@gkm.com',
      role: 'admin' as UserRole,
    },
      id: '2', 
      email: 'client@demo.com',

    }

    e.preven

    await new Promise(re
    const user = Object.value
      onLogin(user)
      alert('Ongeldige inloggege
    setIsLoading(fal

    onLogin(d

    alert('Account aanmake

    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-
        {/* Main Login Card */}
          {/* Header
     
   

            <p className="text-muted-foreground">
            </p>


              onClick={(
                loginType === 'client'

            >
              Client
            <button
            
                  ? 'bg-primary text-p
     
              <Shield s
   

            <div>
                Email
   

                placeholder="je@examp
              />


          
                type="password"
                onChange={(e) => setPas
                required
            </div>
            <Button
              disabled={isLoading}
            >
            </Button>
            </div>
          <div className="flex items-center gap-4">
            <span classN
          </div>
          {/* Demo Login */}
            <p className="text-sm text-muted-foreground text-center
            </p>
              <B

              >
                Admin Demo
              <Butt
                onClick={() => handleDemoLogin('clie
              >
                Client Demo
            </div>

          <div cl
             
            >
            </button
        </Card>
    </div>
}


















                value={email}

                placeholder="je@example.com"




            <div>

                Wachtwoord

















          </form>











              Demo toegang:






              >


              </Button>









          </div>

          {/* Footer */}

            <button
              onClick={handleCreateAccount}

            >

            </button>



    </div>

}