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
    try {
      login(user)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = () => {
    try {
      logout()
      setActiveView('dashboard')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleUserUpdate = (updatedUser: User) => {
    try {
      updateUser(updatedUser)
    } catch (error) {
      console.error('User update failed:', error)
    }
  }

  const renderActiveView = () => {
    if (!currentUser) {
      return <LoginView onLogin={handleLogin} />
    }
    
    try {
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
    } catch (error) {
      console.error('View rendering failed:', error)
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">Please try refreshing the page</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
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
