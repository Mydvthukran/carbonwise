import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MobileHeader from '../MobileHeader'

describe('MobileHeader', () => {
  it('renders correctly', () => {
    render(<MobileHeader onMenuClick={() => {}} />)
    expect(screen.getByText('CarbonWise')).toBeInTheDocument()
    expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument()
  })

  it('calls onMenuClick when hamburger is clicked', () => {
    const onMenuClick = vi.fn()
    render(<MobileHeader onMenuClick={onMenuClick} />)
    
    fireEvent.click(screen.getByLabelText('Open navigation menu'))
    expect(onMenuClick).toHaveBeenCalled()
  })
})
