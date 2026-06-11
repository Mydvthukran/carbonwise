import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import EcoScoreRing from '../EcoScoreRing'

describe('EcoScoreRing', () => {
  beforeAll(() => {
    vi.stubGlobal('requestAnimationFrame', (cb) => cb(performance.now() + 1200))
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  it('renders with the correct text and grade', () => {
    render(<EcoScoreRing score={85} grade="A" label="Excellent" color="#10B981" />)

    expect(screen.getByText(/A • Excellent/i)).toBeInTheDocument()
  })

  it('animates to the target score', async () => {
    render(<EcoScoreRing score={85} grade="A" label="Excellent" color="#10B981" />)

    // It should eventually show the target score due to the requestAnimationFrame logic
    await waitFor(
      () => {
        expect(screen.getByText('85')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })
})
