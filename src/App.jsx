import React, { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import MobileHeader from './components/MobileHeader'
import Dashboard from './pages/Dashboard'
import Calculator from './pages/Calculator'
import Logger from './pages/Logger'
import Insights from './pages/Insights'
import Challenges from './pages/Challenges'
import Settings from './pages/Settings'
import Onboarding from './components/Onboarding'
import ToastContainer from './components/ToastContainer'
import { getUserProfile, setUserProfile } from './utils/storage'

const PAGES = {
  dashboard: { component: Dashboard, label: 'Dashboard', icon: '📊' },
  calculator: { component: Calculator, label: 'Calculator', icon: '🧮' },
  logger: { component: Logger, label: 'Activity Log', icon: '📝' },
  insights: { component: Insights, label: 'Insights', icon: '💡' },
  challenges: { component: Challenges, label: 'Challenges', icon: '🏆' },
  settings: { component: Settings, label: 'Settings', icon: '⚙️' },
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [toasts, setToasts] = useState([])
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const saved = getUserProfile()
    if (saved) {
      setProfile(saved)
      setTheme(saved.theme || 'dark')
    } else {
      setShowOnboarding(true)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const addToast = useCallback((toast) => {
    const id = Date.now().toString(36)
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const handleOnboardingComplete = (newProfile) => {
    setUserProfile(newProfile)
    setProfile(newProfile)
    setTheme(newProfile.theme || 'dark')
    setShowOnboarding(false)
    addToast({
      type: 'success',
      title: 'Welcome to CarbonWise!',
      message: 'Your profile has been set up. Start tracking your carbon footprint!',
    })
  }

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile)
    setProfile(updatedProfile)
    setTheme(updatedProfile.theme || 'dark')
  }

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    if (profile) {
      const updatedProfile = { ...profile, theme: newTheme }
      setUserProfile(updatedProfile)
      setProfile(updatedProfile)
    }
  }

  const navigateTo = (page) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  const PageComponent = PAGES[currentPage]?.component || Dashboard

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigateTo}
        pages={PAGES}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      
      <MobileHeader
        title={PAGES[currentPage]?.label || 'Dashboard'}
        onMenuClick={() => setSidebarOpen(true)}
      />
      
      <main className="main-content" role="main">
        <PageComponent
          profile={profile}
          addToast={addToast}
          navigateTo={navigateTo}
          onProfileUpdate={handleProfileUpdate}
          theme={theme}
          onThemeToggle={handleThemeToggle}
        />
      </main>
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
