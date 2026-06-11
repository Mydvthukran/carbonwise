import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Sidebar from '../Sidebar'

describe('Sidebar', () => {
  const mockPages = {
    dashboard: { label: 'Dashboard', icon: '📊' },
    logger: { label: 'Activity Log', icon: '📝' }
  }

  it('renders correctly with given pages', () => {
    render(<Sidebar pages={mockPages} currentPage="dashboard" isOpen={true} />)
    expect(screen.getByText('CarbonWise')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Activity Log')).toBeInTheDocument()
  })

  it('calls onNavigate when a link is clicked', () => {
    const onNavigate = vi.fn()
    render(<Sidebar pages={mockPages} currentPage="dashboard" onNavigate={onNavigate} isOpen={true} />)
    
    fireEvent.click(screen.getByText('Activity Log'))
    expect(onNavigate).toHaveBeenCalledWith('logger')
  })

  it('toggles theme when theme button is clicked', () => {
    const onThemeToggle = vi.fn()
    render(<Sidebar pages={mockPages} currentPage="dashboard" isOpen={true} theme="dark" onThemeToggle={onThemeToggle} />)
    
    // The theme button displays "☀️ Light Mode" when in dark theme
    const themeBtn = screen.getByText(/Light Mode/i)
    fireEvent.click(themeBtn)
    expect(onThemeToggle).toHaveBeenCalled()
  })
})
