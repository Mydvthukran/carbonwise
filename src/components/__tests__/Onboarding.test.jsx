import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Onboarding from '../Onboarding'

describe('Onboarding Flow', () => {
  it('renders welcome step first', () => {
    render(<Onboarding onComplete={() => {}} />)
    expect(screen.getByText('Welcome to CarbonWise')).toBeInTheDocument()
  })

  it('completes the 3-step onboarding process', async () => {
    const handleComplete = vi.fn()
    render(<Onboarding onComplete={handleComplete} />)

    // Step 1: Welcome
    const nextBtn = screen.getByRole('button', { name: /Continue/i })
    fireEvent.click(nextBtn)

    // Step 2: Profile Form
    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument()

    // Enter name
    const nameInput = screen.getByLabelText(/Your Name/i)
    await userEvent.type(nameInput, 'John Doe')

    // Go to next step
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))

    // Step 3: Goal Selection
    expect(screen.getByText('Set your eco goal')).toBeInTheDocument()

    // Select a goal
    const ambitiousGoal = screen.getByRole('button', { name: /Ambitious/i })
    fireEvent.click(ambitiousGoal)

    // Complete
    fireEvent.click(screen.getByRole('button', { name: /Get Started/i }))

    expect(handleComplete).toHaveBeenCalledTimes(1)
    expect(handleComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        goal: 2500,
      })
    )
  })
})
