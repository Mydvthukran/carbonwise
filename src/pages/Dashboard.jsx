import React, { useState, useEffect, useMemo } from 'react'
import EcoScoreRing from '../components/EcoScoreRing'
import { BarChart, DonutChart, Sparkline } from '../components/Charts'
import { getEcoRating, CATEGORIES, GLOBAL_AVERAGES } from '../data/emissionFactors'
import { getPersonalizedTips } from '../data/tips'
import {
  getActivities,
  getStreak,
  getDailyEmissions,
  getWeeklyEmissions,
  getCategoryBreakdown,
  getDateDaysAgo,
  getToday,
  getCompletedChallenges,
  getUnlockedAchievements,
} from '../utils/storage'

export default function Dashboard({ profile, navigateTo }) {
  const [period, setPeriod] = useState('week')
  const activities = useMemo(() => getActivities(), [])
  const streak = useMemo(() => getStreak(), [])

  const today = getToday()
  const periodDays = period === 'week' ? 7 : period === 'month' ? 30 : 365
  const startDate = getDateDaysAgo(periodDays)

  const periodActivities = useMemo(
    () => activities.filter(a => a.date >= startDate && a.date <= today),
    [activities, startDate, today]
  )

  const totalEmissions = periodActivities.reduce((sum, a) => sum + a.emissions, 0)
  const prevStartDate = getDateDaysAgo(periodDays * 2)
  const prevActivities = activities.filter(a => a.date >= prevStartDate && a.date < startDate)
  const prevTotal = prevActivities.reduce((sum, a) => sum + a.emissions, 0)
  const trendPercent = prevTotal > 0 ? ((totalEmissions - prevTotal) / prevTotal) * 100 : 0

  // Annualize for eco rating
  const annualized = (totalEmissions / periodDays) * 365
  const ecoRating = getEcoRating(annualized)

  // Category breakdown
  const breakdown = useMemo(() => getCategoryBreakdown(startDate, today), [startDate, today])
  const donutData = Object.entries(breakdown).map(([cat, val]) => ({
    label: CATEGORIES[cat]?.label || cat,
    value: val,
    color: CATEGORIES[cat]?.color || '#94A3B8',
  }))

  // Weekly trend data
  const weeklyData = useMemo(() => getWeeklyEmissions(8), [])
  const barData = weeklyData.map(w => ({
    label: w.week,
    value: w.total,
  }))

  // Daily sparkline
  const dailyData = useMemo(() => getDailyEmissions(14).map(d => d.total), [])

  // Today's emissions
  const todayEmissions = activities
    .filter(a => a.date === today)
    .reduce((sum, a) => sum + a.emissions, 0)

  // Tips
  const tips = useMemo(() => getPersonalizedTips(periodActivities, 3), [periodActivities])

  const completedChallenges = getCompletedChallenges()
  const achievements = getUnlockedAchievements()

  const periodLabel = period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'This Year'

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header">
        <h1>Welcome back, {profile?.name || 'Eco Warrior'} 👋</h1>
        <p>Here's your carbon footprint overview</p>
      </div>

      {/* Period Tabs */}
      <div className="tabs" role="tablist" aria-label="Time period">
        {['week', 'month', 'year'].map(p => (
          <button
            key={p}
            className={`tab ${period === p ? 'active' : ''}`}
            onClick={() => setPeriod(p)}
            role="tab"
            aria-selected={period === p}
            id={`tab-${p}`}
          >
            {p === 'week' ? 'Week' : p === 'month' ? 'Month' : 'Year'}
          </button>
        ))}
      </div>

      {/* Stat Cards Row */}
      <div className="grid-4 stagger-children" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>🌿</div>
          <div className="stat-card-value" style={{ color: 'var(--color-primary)' }}>
            {totalEmissions.toFixed(1)}
          </div>
          <div className="stat-card-label">kg CO₂ ({periodLabel})</div>
          {prevTotal > 0 && (
            <div className={`stat-card-trend ${trendPercent <= 0 ? 'down' : 'up'}`}>
              {trendPercent <= 0 ? '↓' : '↑'} {Math.abs(trendPercent).toFixed(1)}%
            </div>
          )}
          <div style={{ marginTop: 'var(--space-3)' }}>
            <Sparkline data={dailyData} color="#10B981" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(14, 165, 233, 0.15)' }}>📅</div>
          <div className="stat-card-value" style={{ color: 'var(--color-secondary)' }}>
            {todayEmissions.toFixed(1)}
          </div>
          <div className="stat-card-label">kg CO₂ Today</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
            {activities.filter(a => a.date === today).length} activities logged
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>🔥</div>
          <div className="stat-card-value" style={{ color: 'var(--color-accent)' }}>
            {streak.current}
          </div>
          <div className="stat-card-label">Day Streak</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
            Best: {streak.best} days
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>🏆</div>
          <div className="stat-card-value" style={{ color: '#8B5CF6' }}>
            {completedChallenges.length}
          </div>
          <div className="stat-card-label">Challenges Done</div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
            {achievements.length} badges earned
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Eco Score */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="card-header" style={{ justifyContent: 'center' }}>
            <h2 className="card-title">Eco Score</h2>
          </div>
          <EcoScoreRing
            score={ecoRating.score}
            grade={ecoRating.grade}
            label={ecoRating.label}
            color={ecoRating.color}
            size={200}
          />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Projected Annual: <strong style={{ color: ecoRating.color }}>{(annualized / 1000).toFixed(1)} tonnes</strong>
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
              Goal: {(profile?.goal / 1000 || 4).toFixed(1)} tonnes/year
            </div>
          </div>
          {/* Progress toward goal */}
          <div style={{ marginTop: 'var(--space-4)' }}>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(100, (annualized / (profile?.goal || 4700)) * 100)}%`,
                  background: annualized <= (profile?.goal || 4700)
                    ? 'linear-gradient(90deg, #10B981, #34D399)'
                    : 'linear-gradient(90deg, #EF4444, #F87171)',
                }}
              />
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-2)' }}>
              {annualized <= (profile?.goal || 4700) ? '✅ On track to meet your goal!' : '⚠️ Above your annual target'}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Category Breakdown</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <DonutChart data={donutData} size={180} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {donutData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
                  <span style={{ fontWeight: 600, marginLeft: 'auto', paddingLeft: 'var(--space-4)' }}>{d.value.toFixed(1)} kg</span>
                </div>
              ))}
              {donutData.length === 0 && (
                <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>No data yet. Start logging!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Trend Chart */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">Weekly Emissions Trend</h2>
          <span className="badge badge-info">Last 8 weeks</span>
        </div>
        <BarChart data={barData} barColor="var(--color-primary)" />
      </div>

      {/* Bottom Row */}
      <div className="grid-2">
        {/* Comparison */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Global Comparison</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {Object.entries(GLOBAL_AVERAGES).map(([key, avg]) => {
              const pct = Math.min(100, (avg.annual / 15000) * 100)
              const isUser = key === profile?.country
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
                    <span style={{ fontWeight: isUser ? 700 : 400, color: isUser ? 'var(--color-primary)' : 'var(--text-secondary)' }}>
                      {isUser ? '→ ' : ''}{avg.label}
                    </span>
                    <span style={{ fontWeight: 600 }}>{(avg.annual / 1000).toFixed(1)}t</span>
                  </div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: isUser ? 'var(--color-primary)' : 'var(--bg-tertiary)',
                        animationDelay: 'none',
                      }}
                    />
                  </div>
                </div>
              )
            })}
            {/* User's projected */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
                <span style={{ fontWeight: 700, color: ecoRating.color }}>
                  🎯 Your Projected
                </span>
                <span style={{ fontWeight: 700, color: ecoRating.color }}>{(annualized / 1000).toFixed(1)}t</span>
              </div>
              <div className="progress-bar" style={{ height: 6 }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(100, (annualized / 15000) * 100)}%`,
                    background: `linear-gradient(90deg, ${ecoRating.color}, ${ecoRating.color}88)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Personalized Tips</h2>
            <button className="btn btn-sm btn-outline" onClick={() => navigateTo('insights')} id="view-all-tips">
              View All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {tips.map((tip, i) => (
              <div
                key={tip.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-secondary)',
                  transition: 'transform var(--transition-fast)',
                }}
              >
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{tip.icon}</span>
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--space-1)' }}>{tip.tip}</div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <span className={`badge badge-${tip.impact === 'high' ? 'success' : tip.impact === 'medium' ? 'warning' : 'info'}`}>
                      {tip.impact} impact
                    </span>
                    <span className="badge badge-info">Save ~{tip.savingsKg} kg/week</span>
                  </div>
                </div>
              </div>
            ))}
            {tips.length === 0 && (
              <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-tertiary)' }}>
                <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>💡</div>
                <p>Log some activities to get personalized tips!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-lg" onClick={() => navigateTo('logger')} id="quick-log-activity">
          📝 Log Activity
        </button>
        <button className="btn btn-secondary btn-lg" onClick={() => navigateTo('calculator')} id="quick-calculator">
          🧮 Calculator
        </button>
        <button className="btn btn-outline btn-lg" onClick={() => navigateTo('challenges')} id="quick-challenges">
          🏆 Challenges
        </button>
      </div>
    </div>
  )
}
