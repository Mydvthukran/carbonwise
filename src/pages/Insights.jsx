import React, { useMemo } from 'react'
import { AreaChart } from '../components/Charts'
import { CATEGORIES } from '../data/emissionFactors'
import { getPersonalizedTips, generateWhatIfScenarios, ECO_TIPS } from '../data/tips'
import {
  getActivities,
  getDailyEmissions,
  getCategoryBreakdown,
  getDateDaysAgo,
  getToday,
} from '../utils/storage'

export default function Insights({ profile }) {
  const activities = useMemo(() => getActivities(), [])
  const today = getToday()

  // This month vs last month
  const thisMonthStart = getDateDaysAgo(30)
  const lastMonthStart = getDateDaysAgo(60)
  const thisMonthActivities = activities.filter((a) => a.date >= thisMonthStart && a.date <= today)
  const lastMonthActivities = activities.filter(
    (a) => a.date >= lastMonthStart && a.date < thisMonthStart
  )

  const thisMonthTotal = thisMonthActivities.reduce((s, a) => s + a.emissions, 0)
  const lastMonthTotal = lastMonthActivities.reduce((s, a) => s + a.emissions, 0)
  const monthChange =
    lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

  // Daily trend (30 days)
  const dailyData = useMemo(
    () =>
      getDailyEmissions(30).map((d) => ({
        value: d.total,
        label: d.date.slice(5),
      })),
    []
  )

  // Category comparison
  const thisMonthBreakdown = useMemo(
    () => getCategoryBreakdown(thisMonthStart, today),
    [thisMonthStart, today]
  )
  const lastMonthBreakdown = useMemo(
    () => getCategoryBreakdown(lastMonthStart, thisMonthStart),
    [lastMonthStart, thisMonthStart]
  )

  // Personalized tips
  const tips = useMemo(() => getPersonalizedTips(thisMonthActivities, 6), [thisMonthActivities])

  // What-if scenarios
  const scenarios = useMemo(
    () => generateWhatIfScenarios(thisMonthActivities),
    [thisMonthActivities]
  )

  // Category deep dive - find highest emission category
  const sortedCategories = Object.entries(thisMonthBreakdown).sort(([, a], [, b]) => b - a)

  const highestCategory = sortedCategories[0]
  const lowestCategory = sortedCategories[sortedCategories.length - 1]

  // Daily average
  const activeDays = new Set(thisMonthActivities.map((a) => a.date)).size || 1
  const dailyAverage = thisMonthTotal / activeDays

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1>Insights & Recommendations</h1>
        <p>Personalized analysis based on your carbon footprint patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid-3 stagger-children" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
            📊
          </div>
          <div className="stat-card-value" style={{ color: 'var(--color-primary)' }}>
            {thisMonthTotal.toFixed(1)}
          </div>
          <div className="stat-card-label">This Month (kg CO₂)</div>
          {lastMonthTotal > 0 && (
            <div className={`stat-card-trend ${monthChange <= 0 ? 'down' : 'up'}`}>
              {monthChange <= 0 ? '↓' : '↑'} {Math.abs(monthChange).toFixed(1)}% vs last month
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(14, 165, 233, 0.15)' }}>
            📅
          </div>
          <div className="stat-card-value" style={{ color: 'var(--color-secondary)' }}>
            {dailyAverage.toFixed(1)}
          </div>
          <div className="stat-card-label">Daily Average (kg CO₂)</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
            🎯
          </div>
          <div className="stat-card-value" style={{ color: 'var(--color-accent)' }}>
            {activeDays}
          </div>
          <div className="stat-card-label">Active Tracking Days</div>
        </div>
      </div>

      {/* 30-Day Trend */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">30-Day Emissions Trend</h2>
          {monthChange !== 0 && (
            <span className={`badge ${monthChange <= 0 ? 'badge-success' : 'badge-danger'}`}>
              {monthChange <= 0 ? '↓' : '↑'} {Math.abs(monthChange).toFixed(1)}%
            </span>
          )}
        </div>
        <AreaChart data={dailyData} color="var(--color-primary)" />
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Category Month-over-Month */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
            Category Analysis
          </h2>
          {sortedCategories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {sortedCategories.map(([cat, val]) => {
                const lastVal = lastMonthBreakdown[cat] || 0
                const change = lastVal > 0 ? ((val - lastVal) / lastVal) * 100 : 0
                const catInfo = CATEGORIES[cat] || {}
                const maxVal = sortedCategories[0]?.[1] || 1

                return (
                  <div key={cat}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-1)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span>{catInfo.icon}</span>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                          {catInfo.label || cat}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                          {val.toFixed(1)} kg
                        </span>
                        {lastVal > 0 && (
                          <span
                            className={`badge ${change <= 0 ? 'badge-success' : 'badge-danger'}`}
                            style={{ fontSize: '10px' }}
                          >
                            {change <= 0 ? '↓' : '↑'}
                            {Math.abs(change).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="progress-bar" style={{ height: 6 }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${(val / maxVal) * 100}%`,
                          background: catInfo.color || 'var(--color-primary)',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div
              style={{
                color: 'var(--text-tertiary)',
                textAlign: 'center',
                padding: 'var(--space-8)',
              }}
            >
              No data yet. Start logging activities!
            </div>
          )}

          {/* Key Insight */}
          {highestCategory && (
            <div
              style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              💡 <strong>{CATEGORIES[highestCategory[0]]?.label}</strong> is your biggest
              contributor at{' '}
              <strong>{((highestCategory[1] / thisMonthTotal) * 100).toFixed(0)}%</strong> of total
              emissions.
              {lowestCategory && highestCategory[0] !== lowestCategory[0] && (
                <span>
                  {' '}
                  Great job keeping <strong>{CATEGORIES[lowestCategory[0]]?.label}</strong> low!
                </span>
              )}
            </div>
          )}
        </div>

        {/* What-if Scenarios */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
            What If Scenarios
          </h2>
          {scenarios.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {scenarios.map((scenario, i) => (
                <div
                  key={i}
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{scenario.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                      {scenario.title}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}
                      >
                        Monthly savings
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--font-size-lg)',
                          fontWeight: 800,
                          color: 'var(--color-primary)',
                        }}
                      >
                        -{scenario.savedKg.toFixed(1)} kg CO₂
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}
                      >
                        Annual impact
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 600,
                          color: 'var(--color-secondary)',
                        }}
                      >
                        -{(scenario.savedKg * 12).toFixed(0)} kg/year
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <div className="progress-bar" style={{ height: 4 }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${Math.min(100, (scenario.savedKg / scenario.currentKg) * 100)}%`,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-tertiary)',
                        marginTop: 'var(--space-1)',
                      }}
                    >
                      {((scenario.savedKg / scenario.currentKg) * 100).toFixed(0)}% reduction in{' '}
                      {CATEGORIES[scenario.category]?.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                color: 'var(--text-tertiary)',
                textAlign: 'center',
                padding: 'var(--space-8)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>🔮</div>
              <p>Log more activities to unlock personalized scenarios!</p>
            </div>
          )}
        </div>
      </div>

      {/* Personalized Tips */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Personalized Recommendations</h2>
          <span className="badge badge-success">Based on your data</span>
        </div>
        <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
          {tips.map((tip) => (
            <div
              key={tip.id}
              style={{
                display: 'flex',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span style={{ fontSize: '28px', flexShrink: 0 }}>{tip.icon}</span>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{tip.tip}</div>
                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-2)',
                    flexWrap: 'wrap',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  <span
                    className={`badge ${tip.impact === 'high' ? 'badge-success' : tip.impact === 'medium' ? 'badge-warning' : 'badge-info'}`}
                  >
                    {tip.impact} impact
                  </span>
                  <span className="badge badge-info">~{tip.savingsKg} kg/week</span>
                  <span
                    className={`badge ${tip.difficulty === 'easy' ? 'badge-success' : tip.difficulty === 'medium' ? 'badge-warning' : 'badge-danger'}`}
                  >
                    {tip.difficulty}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                  Annual savings: ~{(tip.savingsKg * 52).toFixed(0)} kg CO₂
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
