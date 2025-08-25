import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from 'sonner'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { Messages } from './components/Messages'
import { Projects } from './components/Projects'
import { CalendarView } from './components/CalendarView'
import { FileManager } from './components/FileManager'
import { SettingsView } from './components/SettingsView'
import { BillingView } from './components/BillingView'

export type UserRole = 'admin' | 'client'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  isOnline?: boolean
}

function App() {
  const [currentUser] = useKV<User>('current-user', {
    id: '1',
    name: 'Alex van der Berg',
    email: 'alex@gkm.nl',
    avatar: '',
    role: 'admin',
    isOnline: true
  })

  const [activeView, setActiveView] = useState('dashboard')

  const renderActiveView = () => {
    if (!currentUser) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>
    }
    
    switch (activeView) {
      case 'dashboard':
        return <Dashboard user={currentUser} />
      case 'messages':
        return <Messages user={currentUser} />
      case 'projects':
        return <Projects user={currentUser} />
      case 'calendar':
        return <CalendarView user={currentUser} />
      case 'files':
        return <FileManager user={currentUser} />
      case 'billing':
        return <BillingView user={currentUser} />
      case 'settings':
        return <SettingsView user={currentUser} />
      default:
        return <Dashboard user={currentUser} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {currentUser && (
          <Sidebar 
            user={currentUser} 
            activeView={activeView}
            onViewChange={setActiveView}
          />
        )}
        <main className="flex-1 p-6">
          {renderActiveView()}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

export default App