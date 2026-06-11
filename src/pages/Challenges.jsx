import { useState, useMemo } from 'react'
import { CHALLENGES, ACHIEVEMENTS } from '../data/tips'
import { CATEGORIES } from '../data/emissionFactors'
import {
  getActiveChallenges,
  startChallenge,
  removeChallenge,
  updateChallengeProgress,
  getCompletedChallenges,
  getUnlockedAchievements,
} from '../utils/storage'

export default function ChallengesPage({ addToast }) {
  const [activeChallenges, setActiveChallenges] = useState(() => getActiveChallenges())
  const [completedChallenges] = useState(() => getCompletedChallenges())
  const [achievements] = useState(() => getUnlockedAchievements())
  const [view, setView] = useState('available')
  const [filterDifficulty, setFilterDifficulty] = useState('all')

  const handleStartChallenge = (challenge) => {
    const success = startChallenge(challenge)
    if (success) {
      setActiveChallenges(getActiveChallenges())
      addToast({
        type: 'success',
        title: 'Challenge Started!',
        message: `${challenge.title} – Good luck! 🌟`,
      })
    } else {
      addToast({
        type: 'warning',
        title: 'Already Active',
        message: 'This challenge is already in progress.',
      })
    }
  }

  const handleProgressUpdate = (challengeId, newProgress) => {
    updateChallengeProgress(challengeId, newProgress)
    setActiveChallenges(getActiveChallenges())
    if (newProgress >= 100) {
      addToast({
        type: 'success',
        title: '🎉 Challenge Completed!',
        message: 'Amazing work! Check your achievements.',
      })
    }
  }

  const handleQuitChallenge = (challengeId) => {
    removeChallenge(challengeId)
    setActiveChallenges(getActiveChallenges())
    addToast({ type: 'info', title: 'Challenge removed' })
  }

  const activeIds = useMemo(() => new Set(activeChallenges.map((c) => c.id)), [activeChallenges])
  const completedIds = useMemo(() => new Set(completedChallenges.map((c) => c.id)), [completedChallenges])

  const availableChallenges = useMemo(() => {
    let filtered = CHALLENGES.filter((c) => !activeIds.has(c.id) && !completedIds.has(c.id))
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter((c) => c.difficulty === filterDifficulty)
    }
    return filtered
  }, [filterDifficulty, activeIds, completedIds])

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy':
        return 'badge-success'
      case 'medium':
        return 'badge-warning'
      case 'hard':
        return 'badge-danger'
      default:
        return 'badge-info'
    }
  }

  // Calculate total XP
  const totalXP = completedChallenges.reduce((sum, c) => sum + (c.xp || 0), 0)

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1>Eco Challenges 🏆</h1>
        <p>Take on challenges to reduce your carbon footprint and earn achievements</p>
      </div>

      {/* Stats Bar */}
      <div className="grid-3 stagger-children" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
            🎯
          </div>
          <div className="stat-card-value" style={{ color: 'var(--color-primary)' }}>
            {activeChallenges.length}
          </div>
          <div className="stat-card-label">Active Challenges</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
            ✅
          </div>
          <div className="stat-card-value" style={{ color: 'var(--color-accent)' }}>
            {completedChallenges.length}
          </div>
          <div className="stat-card-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
            ⚡
          </div>
          <div className="stat-card-value" style={{ color: '#8B5CF6' }}>
            {totalXP}
          </div>
          <div className="stat-card-label">Total XP Earned</div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="tabs" role="tablist">
        <button
          className={`tab ${view === 'available' ? 'active' : ''}`}
          onClick={() => setView('available')}
          role="tab"
          id="tab-available"
        >
          🎯 Available ({availableChallenges.length})
        </button>
        <button
          className={`tab ${view === 'active' ? 'active' : ''}`}
          onClick={() => setView('active')}
          role="tab"
          id="tab-active"
        >
          ⚡ Active ({activeChallenges.length})
        </button>
        <button
          className={`tab ${view === 'achievements' ? 'active' : ''}`}
          onClick={() => setView('achievements')}
          role="tab"
          id="tab-achievements"
        >
          🏅 Achievements
        </button>
      </div>

      {/* Available Challenges */}
      {view === 'available' && (
        <>
          {/* Difficulty Filter */}
          <div
            style={{
              marginBottom: 'var(--space-4)',
              display: 'flex',
              gap: 'var(--space-2)',
              flexWrap: 'wrap',
            }}
          >
            {['all', 'easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                className={`btn btn-sm ${filterDifficulty === d ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterDifficulty(d)}
              >
                {d === 'all'
                  ? '🌐 All'
                  : d === 'easy'
                    ? '🟢 Easy'
                    : d === 'medium'
                      ? '🟡 Medium'
                      : '🔴 Hard'}
              </button>
            ))}
          </div>

          <div className="grid-2 stagger-children">
            {availableChallenges.map((challenge) => (
              <div key={challenge.id} className="card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontSize: '36px' }}>{challenge.icon}</span>
                    <div>
                      <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-1)' }}>
                        {challenge.title}
                      </h3>
                      <p
                        style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}
                      >
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-2)',
                    flexWrap: 'wrap',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                  <span className="badge badge-info">{challenge.duration} days</span>
                  <span className="badge badge-warning">⚡ {challenge.xp} XP</span>
                  <span className="badge badge-success">-{challenge.targetSavings} kg CO₂</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    {CATEGORIES[challenge.category]?.icon} {CATEGORIES[challenge.category]?.label}
                  </span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    •
                  </span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    Badge: {challenge.badge}
                  </span>
                </div>

                <button
                  className="btn btn-primary w-full"
                  style={{ marginTop: 'var(--space-4)' }}
                  onClick={() => handleStartChallenge(challenge)}
                  id={`start-${challenge.id}`}
                >
                  🚀 Start Challenge
                </button>
              </div>
            ))}

            {availableChallenges.length === 0 && (
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <div className="empty-state">
                  <div className="empty-state-icon">🎉</div>
                  <div className="empty-state-title">All caught up!</div>
                  <div className="empty-state-text">
                    You've started or completed all available challenges. Check back for more!
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Active Challenges */}
      {view === 'active' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {activeChallenges.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🎯</div>
                <div className="empty-state-title">No Active Challenges</div>
                <div className="empty-state-text">
                  Browse available challenges and start one to begin your eco journey!
                </div>
                <button className="btn btn-primary" onClick={() => setView('available')}>
                  Browse Challenges
                </button>
              </div>
            </div>
          ) : (
            activeChallenges.map((challenge) => {
              const elapsed = Math.ceil(
                (Date.now() - new Date(challenge.startDate).getTime()) / 86400000
              )
              const remaining = Math.max(0, challenge.duration - elapsed)

              return (
                <div key={challenge.id} className="card">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                      <span style={{ fontSize: '36px' }}>{challenge.icon}</span>
                      <div>
                        <h3 style={{ fontWeight: 700 }}>{challenge.title}</h3>
                        <p
                          style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {challenge.description}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            gap: 'var(--space-2)',
                            marginTop: 'var(--space-2)',
                          }}
                        >
                          <span className="badge badge-info">
                            {remaining > 0 ? `${remaining} days left` : 'Time up!'}
                          </span>
                          <span className="badge badge-warning">⚡ {challenge.xp} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--space-2)',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      <span>Progress</span>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        {challenge.progress}%
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: 10 }}>
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Progress buttons */}
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        className={`btn btn-sm ${challenge.progress >= pct ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleProgressUpdate(challenge.id, pct)}
                        disabled={challenge.progress >= pct}
                        style={{ opacity: challenge.progress >= pct ? 0.5 : 1 }}
                      >
                        {pct}%
                      </button>
                    ))}
                    <button
                      className="btn btn-sm btn-danger"
                      style={{ marginLeft: 'auto' }}
                      onClick={() => handleQuitChallenge(challenge.id)}
                    >
                      Quit
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Achievements */}
      {view === 'achievements' && (
        <div className="grid-3 stagger-children">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = achievements.find((a) => a.id === achievement.id)
            return (
              <div
                key={achievement.id}
                className="card"
                style={{
                  opacity: unlocked ? 1 : 0.5,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '48px',
                    marginBottom: 'var(--space-3)',
                    filter: unlocked ? 'none' : 'grayscale(1)',
                    transition: 'filter var(--transition-base)',
                  }}
                >
                  {achievement.icon}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-1)' }}>
                  {achievement.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  {achievement.description}
                </p>
                {unlocked ? (
                  <span className="badge badge-success">✅ Unlocked</span>
                ) : (
                  <span className="badge badge-info" style={{ opacity: 0.6 }}>
                    🔒 Locked
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
