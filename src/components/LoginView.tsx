import { useState } from 'react'
import { User as UserType, UserRole } from 
interface LoginViewProps {

interface LoginViewProps {
  onLogin: (user: UserType) => void
}

    {
      name: 'Alex van der Berg',
      avatar: '',
      isOnline: true
    {

      avatar: '',
      isOnline: false
    {
      name: 'M
      avatar: '',
      isOnline: true
  ]
  const handleLogin 

      

      const us
      if (user) {
      } else {
      }
      alert('Er is ee
      setIsLoading(fa
  }
  con
  }
  const handleDemoLogin 
    if (demoUser) {
    }

    <div className="
     
   

            </div>
              GKM Port

         

          <div className="mb-8">

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
          {/* L




























































































