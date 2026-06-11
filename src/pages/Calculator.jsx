import { useState, useMemo } from 'react'
import { DonutChart } from '../components/Charts'
import {
  EMISSION_FACTORS,
  CATEGORIES,
  GLOBAL_AVERAGES,
  getEcoRating,
} from '../data/emissionFactors'

const LIFESTYLE_QUESTIONS = {
  transport: {
    title: '🚗 Transportation',
    questions: [
      {
        id: 'commute_type',
        label: 'Primary commute method',
        type: 'select',
        options: [
          { value: 'car_petrol', label: 'Car (Petrol)' },
          { value: 'car_diesel', label: 'Car (Diesel)' },
          { value: 'car_electric', label: 'Electric Car' },
          { value: 'car_hybrid', label: 'Hybrid Car' },
          { value: 'bus', label: 'Bus' },
          { value: 'train', label: 'Train' },
          { value: 'metro', label: 'Metro/Subway' },
          { value: 'motorcycle', label: 'Motorcycle' },
          { value: 'bicycle', label: 'Bicycle' },
          { value: 'walking', label: 'Walking' },
          { value: 'auto_rickshaw', label: 'Auto Rickshaw' },
        ],
      },
      {
        id: 'commute_km',
        label: 'Daily commute distance (km, round trip)',
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
        default: 20,
      },
      {
        id: 'work_days',
        label: 'Days per week you commute',
        type: 'range',
        min: 0,
        max: 7,
        step: 1,
        default: 5,
      },
      {
        id: 'flights_year',
        label: 'Flights per year',
        type: 'range',
        min: 0,
        max: 30,
        step: 1,
        default: 2,
      },
      {
        id: 'avg_flight_km',
        label: 'Average flight distance (km)',
        type: 'range',
        min: 500,
        max: 15000,
        step: 500,
        default: 2000,
      },
    ],
  },
  food: {
    title: '🍽️ Food & Diet',
    questions: [
      {
        id: 'diet_type',
        label: 'Primary diet type',
        type: 'select',
        options: [
          { value: 'meat_heavy', label: 'Meat-heavy (daily red meat)' },
          { value: 'mixed', label: 'Mixed (some meat, some veg)' },
          { value: 'vegetarian', label: 'Vegetarian' },
          { value: 'vegan', label: 'Vegan' },
        ],
      },
      {
        id: 'meals_per_day',
        label: 'Meals per day',
        type: 'range',
        min: 1,
        max: 5,
        step: 1,
        default: 3,
      },
      {
        id: 'food_waste_pct',
        label: 'Estimated food waste (%)',
        type: 'range',
        min: 0,
        max: 50,
        step: 5,
        default: 15,
      },
      {
        id: 'local_food_pct',
        label: 'Locally sourced food (%)',
        type: 'range',
        min: 0,
        max: 100,
        step: 10,
        default: 30,
      },
    ],
  },
  energy: {
    title: '⚡ Home Energy',
    questions: [
      {
        id: 'electricity_kwh',
        label: 'Monthly electricity usage (kWh)',
        type: 'range',
        min: 50,
        max: 1000,
        step: 10,
        default: 300,
      },
      {
        id: 'gas_m3',
        label: 'Monthly gas usage (m³)',
        type: 'range',
        min: 0,
        max: 200,
        step: 5,
        default: 30,
      },
      {
        id: 'has_solar',
        label: 'Do you have solar panels?',
        type: 'select',
        options: [
          { value: 'no', label: 'No' },
          { value: 'partial', label: 'Yes, covers some usage' },
          { value: 'full', label: 'Yes, covers most usage' },
        ],
      },
      {
        id: 'ac_hours',
        label: 'Daily AC/heater hours (avg)',
        type: 'range',
        min: 0,
        max: 16,
        step: 1,
        default: 4,
      },
    ],
  },
  shopping: {
    title: '🛒 Shopping & Consumption',
    questions: [
      {
        id: 'new_clothes_month',
        label: 'New clothing items per month',
        type: 'range',
        min: 0,
        max: 20,
        step: 1,
        default: 2,
      },
      {
        id: 'online_orders_month',
        label: 'Online deliveries per month',
        type: 'range',
        min: 0,
        max: 30,
        step: 1,
        default: 5,
      },
      {
        id: 'electronics_year',
        label: 'New electronics per year',
        type: 'range',
        min: 0,
        max: 10,
        step: 1,
        default: 1,
      },
    ],
  },
  digital: {
    title: '💻 Digital Life',
    questions: [
      {
        id: 'streaming_hours',
        label: 'Daily streaming hours',
        type: 'range',
        min: 0,
        max: 12,
        step: 0.5,
        default: 3,
      },
      {
        id: 'video_call_hours',
        label: 'Daily video call hours',
        type: 'range',
        min: 0,
        max: 8,
        step: 0.5,
        default: 1,
      },
      {
        id: 'social_media_hours',
        label: 'Daily social media hours',
        type: 'range',
        min: 0,
        max: 8,
        step: 0.5,
        default: 2,
      },
    ],
  },
}

function calculateFootprint(answers) {
  const result = { transport: 0, food: 0, energy: 0, shopping: 0, digital: 0 }

  // Transport
  const commuteType = answers.commute_type || 'car_petrol'
  const commuteFactor = EMISSION_FACTORS.transport[commuteType]?.factor || 0.21
  const dailyKm = answers.commute_km || 20
  const workDays = answers.work_days || 5
  result.transport += commuteFactor * dailyKm * workDays * 52 // Annual

  const flights = answers.flights_year || 2
  const flightKm = answers.avg_flight_km || 2000
  const flightFactor = flightKm > 1500 ? 0.195 : 0.255
  result.transport += flights * flightKm * flightFactor

  // Food
  const dietFactors = { meat_heavy: 7.0, mixed: 3.5, vegetarian: 1.7, vegan: 0.7 }
  const mealFactor = dietFactors[answers.diet_type || 'mixed'] || 3.5
  const meals = answers.meals_per_day || 3
  result.food += mealFactor * meals * 365

  const wastePercent = (answers.food_waste_pct || 15) / 100
  result.food += result.food * wastePercent * 0.3 // Waste penalty

  const localDiscount = (answers.local_food_pct || 30) / 100
  result.food *= 1 - localDiscount * 0.15 // Local food reduces transport

  // Energy
  const electricityKwh = (answers.electricity_kwh || 300) * 12
  result.energy += electricityKwh * EMISSION_FACTORS.energy.electricity.factor

  const gasM3 = (answers.gas_m3 || 30) * 12
  result.energy += gasM3 * EMISSION_FACTORS.energy.natural_gas.factor

  const solarReduction = { no: 0, partial: 0.3, full: 0.7 }
  result.energy *= 1 - (solarReduction[answers.has_solar] || 0)

  const acHours = (answers.ac_hours || 4) * 365
  result.energy += acHours * EMISSION_FACTORS.energy.ac_usage.factor

  // Shopping
  const clothes = (answers.new_clothes_month || 2) * 12
  result.shopping += clothes * EMISSION_FACTORS.shopping.clothing_new.factor

  const deliveries = (answers.online_orders_month || 5) * 12
  result.shopping += deliveries * EMISSION_FACTORS.shopping.online_delivery.factor

  const electronics = answers.electronics_year || 1
  result.shopping += electronics * 100 // Average electronic item

  // Digital
  const streamHours = (answers.streaming_hours || 3) * 365
  result.digital += streamHours * EMISSION_FACTORS.digital.video_streaming.factor

  const callHours = (answers.video_call_hours || 1) * 365
  result.digital += callHours * EMISSION_FACTORS.digital.video_call.factor

  const socialHours = (answers.social_media_hours || 2) * 365
  result.digital += socialHours * EMISSION_FACTORS.digital.social_media.factor

  return result
}

export default function Calculator() {
  const [currentCategory, setCurrentCategory] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const categories = Object.keys(LIFESTYLE_QUESTIONS)

  const updateAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const result = useMemo(() => calculateFootprint(answers), [answers])
  const totalAnnual = Object.values(result).reduce((sum, v) => sum + v, 0)
  const ecoRating = getEcoRating(totalAnnual)

  const donutData = Object.entries(result).map(([cat, val]) => ({
    label: CATEGORIES[cat]?.label || cat,
    value: Math.round(val),
    color: CATEGORIES[cat]?.color || '#94A3B8',
  }))

  const handleNext = () => {
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(currentCategory + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleBack = () => {
    if (showResults) {
      setShowResults(false)
    } else if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1)
    }
  }

  const handleReset = () => {
    setAnswers({})
    setCurrentCategory(0)
    setShowResults(false)
  }

  const cat = categories[currentCategory]
  const catData = LIFESTYLE_QUESTIONS[cat]

  if (showResults) {
    return (
      <div className="animate-fade-in-up">
        <div className="page-header">
          <h1>Your Carbon Footprint Results</h1>
          <p>Based on your lifestyle inputs, here's your estimated annual carbon footprint</p>
        </div>

        <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
          {/* Total & Rating */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: 'var(--space-2)' }}>
              {ecoRating.score >= 70 ? '🌿' : ecoRating.score >= 40 ? '🌤️' : '🏭'}
            </div>
            <div
              style={{ fontSize: 'var(--font-size-5xl)', fontWeight: 800, color: ecoRating.color }}
            >
              {(totalAnnual / 1000).toFixed(1)}
            </div>
            <div
              style={{
                fontSize: 'var(--font-size-lg)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-4)',
              }}
            >
              tonnes CO₂ per year
            </div>
            <div
              className={`badge ${ecoRating.score >= 70 ? 'badge-success' : ecoRating.score >= 40 ? 'badge-warning' : 'badge-danger'}`}
              style={{
                fontSize: 'var(--font-size-base)',
                padding: 'var(--space-2) var(--space-4)',
              }}
            >
              Grade: {ecoRating.grade} – {ecoRating.label}
            </div>
          </div>

          {/* Donut Breakdown */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
              Category Breakdown
            </h2>
            <DonutChart data={donutData} size={200} />
            <div
              style={{
                marginTop: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              {donutData.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: d.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
                  <span style={{ fontWeight: 600, marginLeft: 'auto' }}>
                    {(d.value / 1000).toFixed(1)}t
                  </span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>
                    ({((d.value / totalAnnual) * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
            How You Compare
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {Object.entries(GLOBAL_AVERAGES).map(([key, avg]) => {
              const isBelow = totalAnnual < avg.annual
              return (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  <span style={{ width: 120, color: 'var(--text-secondary)' }}>{avg.label}</span>
                  <div className="progress-bar" style={{ flex: 1, height: 8 }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, (avg.annual / 15000) * 100)}%`,
                        background: 'var(--bg-tertiary)',
                      }}
                    />
                  </div>
                  <span style={{ fontWeight: 600, width: 55, textAlign: 'right' }}>
                    {(avg.annual / 1000).toFixed(1)}t
                  </span>
                  <span style={{ width: 20 }}>{isBelow ? '✅' : ''}</span>
                </div>
              )
            })}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                fontSize: 'var(--font-size-sm)',
                borderTop: '1px solid var(--border-color)',
                paddingTop: 'var(--space-3)',
              }}
            >
              <span style={{ width: 120, fontWeight: 700, color: ecoRating.color }}>🎯 You</span>
              <div className="progress-bar" style={{ flex: 1, height: 8 }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(100, (totalAnnual / 15000) * 100)}%`,
                    background: `linear-gradient(90deg, ${ecoRating.color}, ${ecoRating.color}88)`,
                  }}
                />
              </div>
              <span
                style={{ fontWeight: 700, color: ecoRating.color, width: 55, textAlign: 'right' }}
              >
                {(totalAnnual / 1000).toFixed(1)}t
              </span>
              <span style={{ width: 20 }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <button className="btn btn-secondary btn-lg" onClick={handleBack}>
            ← Adjust Inputs
          </button>
          <button className="btn btn-primary btn-lg" onClick={handleReset}>
            🔄 Recalculate
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1>Carbon Footprint Calculator</h1>
        <p>Answer a few questions about your lifestyle to estimate your annual carbon footprint</p>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-2)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
          }}
        >
          <span>
            Step {currentCategory + 1} of {categories.length}
          </span>
          <span>{Math.round(((currentCategory + 1) / categories.length) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentCategory + 1) / categories.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Category Section */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }} key={cat}>
        <h2
          className="card-title"
          style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-2xl)' }}
        >
          {catData.title}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {catData.questions.map((q) => (
            <div key={q.id} className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor={q.id}>
                {q.label}
              </label>

              {q.type === 'select' && (
                <select
                  id={q.id}
                  className="form-select"
                  value={answers[q.id] || q.options[0].value}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                >
                  {q.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {q.type === 'range' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    <span
                      style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}
                    >
                      {q.min}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                      }}
                    >
                      {answers[q.id] ?? q.default}
                    </span>
                    <span
                      style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}
                    >
                      {q.max}
                    </span>
                  </div>
                  <input
                    id={q.id}
                    type="range"
                    className="range-slider"
                    min={q.min}
                    max={q.max}
                    step={q.step}
                    value={answers[q.id] ?? q.default}
                    onChange={(e) => updateAnswer(q.id, parseFloat(e.target.value))}
                    aria-label={q.label}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live preview */}
      <div
        className="card"
        style={{
          marginBottom: 'var(--space-6)',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(14,165,233,0.05))',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-1)',
              }}
            >
              Running Estimate
            </div>
            <div
              style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: ecoRating.color }}
            >
              {(totalAnnual / 1000).toFixed(1)} tonnes
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
              CO₂ per year
            </div>
          </div>
          <div
            className={`badge ${ecoRating.score >= 70 ? 'badge-success' : ecoRating.score >= 40 ? 'badge-warning' : 'badge-danger'}`}
            style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--font-size-sm)' }}
          >
            {ecoRating.grade} – {ecoRating.label}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        {currentCategory > 0 && (
          <button className="btn btn-secondary btn-lg" onClick={handleBack} id="calc-back">
            ← Back
          </button>
        )}
        <button className="btn btn-primary btn-lg" onClick={handleNext} id="calc-next">
          {currentCategory === categories.length - 1 ? '📊 See Results' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}
