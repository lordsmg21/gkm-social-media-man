import { useState } from 'react'
import { Toaster } from 'sonner'
import { 
  Sidebar, 
  Dashboard, 
  Messages, 
  Projects, 
  CalendarView, 
  FileManager, 
  SettingsView, 
  BillingView, 
  LoginView 
} from './components'
import { useAuth } from './hooks'
import type { User } from './types'

function App() {
  const { currentUser, login, logout, updateUser } = useAuth()
  const [activeView, setActiveView] = useState('dashboard')

  const handleLogin = (user: User) => {
    login(user)
  }

  const handleLogout = () => {
    logout()
    setActiveView('dashboard')
  }

  const handleUserUpdate = (updatedUser: User) => {
    updateUser(updatedUser)
  }

  const renderActiveView = () => {
    if (!currentUser) {
      return <LoginView onLogin={handleLogin} />
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
        return <SettingsView user={currentUser} onUserUpdate={handleUserUpdate} />
      default:
        return <Dashboard user={currentUser} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {!currentUser ? (
        renderActiveView()
      ) : (
        <div className="flex">
          <Sidebar 
            user={currentUser} 
            activeView={activeView}
            onViewChange={setActiveView}
            onLogout={handleLogout}
          />
          <main className="flex-1 p-6">
            {renderActiveView()}
          </main>
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  )
}

export default App