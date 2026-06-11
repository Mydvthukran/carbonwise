import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { BarChart, DonutChart, Sparkline, AreaChart } from '../Charts'

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock
})

describe('Charts', () => {
  it('renders BarChart without crashing', () => {
    const data = [{ label: 'Mon', value: 10 }, { label: 'Tue', value: 20 }]
    const { container } = render(<BarChart data={data} barColor="red" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders DonutChart without crashing', () => {
    const data = [{ label: 'Food', value: 10, color: 'blue' }]
    const { container } = render(<DonutChart data={data} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders Sparkline without crashing', () => {
    const { container } = render(<Sparkline data={[1, 2, 3, 4]} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders AreaChart without crashing', () => {
    const data = [
      { label: 'Jan', value1: 10, value2: 5 },
      { label: 'Feb', value1: 15, value2: 8 }
    ]
    const { container } = render(<AreaChart data={data} lines={[{ key: 'value1', color: 'red' }, { key: 'value2', color: 'blue' }]} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
