import { useState } from 'react'

const STEPS = [
  {
    icon: '🌍',
    title: 'Welcome to CarbonWise',
    subtitle:
      "Your personal carbon footprint tracker & advisor. Let's set up your profile to get started with personalized insights.",
  },
  {
    icon: '👤',
    title: 'Tell us about yourself',
    subtitle: 'This helps us personalize your experience and set meaningful goals.',
    form: true,
  },
  {
    icon: '🎯',
    title: 'Set your eco goal',
    subtitle: "Choose an annual carbon target. Don't worry — you can change this anytime.",
    goals: true,
  },
]

const COUNTRIES = [
  { value: 'world', label: '🌍 Global Average (4.7 tonnes)' },
  { value: 'india', label: '🇮🇳 India (1.9 tonnes)' },
  { value: 'usa', label: '🇺🇸 USA (14.7 tonnes)' },
  { value: 'eu', label: '🇪🇺 EU (6.5 tonnes)' },
  { value: 'uk', label: '🇬🇧 UK (5.2 tonnes)' },
  { value: 'china', label: '🇨🇳 China (7.7 tonnes)' },
]

const GOAL_OPTIONS = [
  {
    value: 2500,
    label: 'Ambitious',
    desc: '2.5 tonnes/year – Paris Agreement target',
    icon: '🌟',
    color: '#10B981',
  },
  {
    value: 4000,
    label: 'Moderate',
    desc: '4.0 tonnes/year – Below world average',
    icon: '🎯',
    color: '#0EA5E9',
  },
  {
    value: 6000,
    label: 'Gradual',
    desc: '6.0 tonnes/year – Steady improvement',
    icon: '📈',
    color: '#F59E0B',
  },
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [country, setCountry] = useState('india')
  const [goal, setGoal] = useState(4000)

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      onComplete({
        name: name.trim() || 'Eco Warrior',
        country,
        goal,
        unit: 'metric',
        theme: 'dark',
        createdAt: new Date().toISOString(),
      })
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const canProceed = step === 0 || (step === 1 && name.trim().length > 0) || step === 2

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container animate-fade-in-up">
        <div className="onboarding-icon">{STEPS[step].icon}</div>
        <h1 className="onboarding-title">{STEPS[step].title}</h1>
        <p className="onboarding-subtitle">{STEPS[step].subtitle}</p>

        {/* Step indicators */}
        <div
          className="onboarding-steps"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin="1"
          aria-valuemax={STEPS.length}
        >
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`onboarding-step ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* Step 2: Profile Form */}
        {step === 1 && (
          <div className="onboarding-form animate-fade-in-up">
            <div className="form-group">
              <label className="form-label" htmlFor="onboard-name">
                Your Name
              </label>
              <input
                id="onboard-name"
                type="text"
                className="form-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="onboard-country">
                Your Country / Region
              </label>
              <select
                id="onboard-country"
                className="form-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Goal Selection */}
        {step === 2 && (
          <div className="onboarding-form animate-fade-in-up">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className="card"
                  onClick={() => setGoal(opt.value)}
                  style={{
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderColor: goal === opt.value ? opt.color : undefined,
                    boxShadow: goal === opt.value ? `0 0 20px ${opt.color}33` : undefined,
                  }}
                  aria-pressed={goal === opt.value}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontSize: '28px' }}>{opt.icon}</span>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 'var(--font-size-lg)',
                          color: goal === opt.value ? opt.color : 'var(--text-primary)',
                        }}
                      >
                        {opt.label}
                      </div>
                      <div
                        style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}
                      >
                        {opt.desc}
                      </div>
                    </div>
                    {goal === opt.value && (
                      <span style={{ marginLeft: 'auto', fontSize: '20px' }}>✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            justifyContent: 'center',
            marginTop: 'var(--space-6)',
          }}
        >
          {step > 0 && (
            <button className="btn btn-secondary btn-lg" onClick={handleBack}>
              ← Back
            </button>
          )}
          <button
            className="btn btn-primary btn-lg"
            onClick={handleNext}
            disabled={!canProceed}
            id="onboard-next"
            style={{ opacity: canProceed ? 1 : 0.5 }}
          >
            {step === STEPS.length - 1 ? '🚀 Get Started' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}
