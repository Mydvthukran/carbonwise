import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll } from 'vitest'

import Assistant from '../Assistant'
import Calculator from '../Calculator'
import Challenges from '../Challenges'
import Dashboard from '../Dashboard'
import Insights from '../Insights'
import Logger from '../Logger'
import Settings from '../Settings'

// Mock ResizeObserver for Charts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  window.ResizeObserver = ResizeObserverMock
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

describe('Page Components Render Tests', () => {
  const mockProps = {
    addToast: vi.fn(),
    navigateTo: vi.fn(),
    profile: { name: 'Test', goal: 4000, theme: 'dark', unit: 'metric' },
    onProfileUpdate: vi.fn(),
    theme: 'dark',
    onThemeToggle: vi.fn()
  }

  it('renders Assistant without crashing', () => {
    const { container } = render(<Assistant {...mockProps} />)
    expect(container).toBeInTheDocument()
  })

  it('renders Calculator without crashing', () => {
    const { container } = render(<Calculator {...mockProps} />)
    expect(container).toBeInTheDocument()
  })

  it('renders Challenges without crashing', () => {
    const { container } = render(<Challenges {...mockProps} />)
    expect(container).toBeInTheDocument()
  })

  it('renders Dashboard without crashing', () => {
    const { container } = render(<Dashboard {...mockProps} />)
    expect(container).toBeInTheDocument()
  })

  it('renders Insights without crashing', () => {
    const { container } = render(<Insights {...mockProps} />)
    expect(container).toBeInTheDocument()
  })

  it('renders Logger without crashing', () => {
    const { container } = render(<Logger {...mockProps} />)
    expect(container).toBeInTheDocument()
  })

  it('renders Settings without crashing', () => {
    const { container } = render(<Settings {...mockProps} />)
    expect(container).toBeInTheDocument()
  })
})
