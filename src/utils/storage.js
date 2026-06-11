/**
 * CarbonWise - LocalStorage Abstraction Layer
 * Handles all data persistence with sanitization and validation
 */

const STORAGE_PREFIX = 'carbonwise_'

/**
 * Sanitize string input to prevent XSS
 */
export function sanitize(input) {
  if (typeof input !== 'string') return input
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}

/**
 * Safe JSON parse
 */
function safeParse(str, fallback = null) {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

/**
 * Get item from storage
 */
export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (raw === null) return fallback
    return safeParse(raw, fallback)
  } catch {
    return fallback
  }
}

/**
 * Set item in storage
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    console.warn('CarbonWise: Storage quota exceeded')
    return false
  }
}

/**
 * Remove item from storage
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
  } catch {
    // silently fail
  }
}

/**
 * Clear all CarbonWise data
 */
export function clearAll() {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_PREFIX))
    keys.forEach((k) => localStorage.removeItem(k))
  } catch {
    // silently fail
  }
}

// --- User Profile ---
export function getUserProfile() {
  return getItem('profile', null)
}

export function setUserProfile(profile) {
  return setItem('profile', {
    name: sanitize(profile.name || ''),
    country: sanitize(profile.country || 'world'),
    goal: Number(profile.goal) || 4700,
    unit: profile.unit || 'metric',
    theme: profile.theme || 'dark',
    createdAt: profile.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

// --- Activities ---
export function getActivities() {
  return getItem('activities', [])
}

export function addActivity(activity) {
  const activities = getActivities()
  const newActivity = {
    id: generateId(),
    type: sanitize(activity.type),
    category: sanitize(activity.category),
    amount: Math.max(0, Number(activity.amount) || 0),
    emissions: Math.max(0, Number(activity.emissions) || 0),
    unit: sanitize(activity.unit || ''),
    label: sanitize(activity.label || ''),
    icon: activity.icon || '📌',
    date: activity.date || new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    notes: sanitize(activity.notes || ''),
  }
  activities.unshift(newActivity)
  setItem('activities', activities)
  updateStreak(newActivity.date)
  return newActivity
}

export function removeActivity(id) {
  const activities = getActivities().filter((a) => a.id !== id)
  setItem('activities', activities)
}

export function getActivitiesByDate(date) {
  return getActivities().filter((a) => a.date === date)
}

export function getActivitiesByDateRange(startDate, endDate) {
  return getActivities().filter((a) => a.date >= startDate && a.date <= endDate)
}

export function getActivitiesByCategory(category) {
  return getActivities().filter((a) => a.category === category)
}

// --- Streak ---
export function getStreak() {
  return getItem('streak', { current: 0, best: 0, lastDate: null })
}

function updateStreak(dateStr) {
  const streak = getStreak()
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (dateStr === today || dateStr === yesterday) {
    if (streak.lastDate === yesterday || streak.lastDate === today) {
      if (dateStr !== streak.lastDate) {
        streak.current += 1
      }
    } else {
      streak.current = 1
    }
    streak.lastDate = dateStr
    streak.best = Math.max(streak.best, streak.current)
    setItem('streak', streak)
  }
}

// --- Challenges ---
export function getActiveChallenges() {
  return getItem('active_challenges', [])
}

export function startChallenge(challenge) {
  const actives = getActiveChallenges()
  if (actives.find((c) => c.id === challenge.id)) return false
  actives.push({
    ...challenge,
    startDate: new Date().toISOString().split('T')[0],
    progress: 0,
    completed: false,
  })
  setItem('active_challenges', actives)
  return true
}

export function updateChallengeProgress(challengeId, progress) {
  const actives = getActiveChallenges()
  const challenge = actives.find((c) => c.id === challengeId)
  if (challenge) {
    challenge.progress = Math.min(100, progress)
    if (challenge.progress >= 100) {
      challenge.completed = true
      challenge.completedDate = new Date().toISOString().split('T')[0]
      addCompletedChallenge(challenge)
    }
    setItem('active_challenges', actives)
  }
}

export function removeChallenge(challengeId) {
  const actives = getActiveChallenges().filter((c) => c.id !== challengeId)
  setItem('active_challenges', actives)
}

export function getCompletedChallenges() {
  return getItem('completed_challenges', [])
}

function addCompletedChallenge(challenge) {
  const completed = getCompletedChallenges()
  completed.push(challenge)
  setItem('completed_challenges', completed)
}

// --- Achievements ---
export function getUnlockedAchievements() {
  return getItem('achievements', [])
}

export function unlockAchievement(achievement) {
  const unlocked = getUnlockedAchievements()
  if (unlocked.find((a) => a.id === achievement.id)) return false
  unlocked.push({
    ...achievement,
    unlockedAt: new Date().toISOString(),
  })
  setItem('achievements', unlocked)
  return true
}

// --- Statistics ---
export function getTotalEmissions() {
  const activities = getActivities()
  return activities.reduce((sum, a) => sum + a.emissions, 0)
}

export function getEmissionsByPeriod(startDate, endDate) {
  const activities = getActivitiesByDateRange(startDate, endDate)
  return activities.reduce((sum, a) => sum + a.emissions, 0)
}

export function getCategoryBreakdown(startDate, endDate) {
  const activities = startDate ? getActivitiesByDateRange(startDate, endDate) : getActivities()

  const breakdown = {}
  activities.forEach((a) => {
    if (!breakdown[a.category]) breakdown[a.category] = 0
    breakdown[a.category] += a.emissions
  })
  return breakdown
}

export function getDailyEmissions(days = 30) {
  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
    const dayActivities = getActivitiesByDate(date)
    const total = dayActivities.reduce((sum, a) => sum + a.emissions, 0)
    result.push({ date, total, count: dayActivities.length })
  }
  return result
}

export function getWeeklyEmissions(weeks = 8) {
  const result = []
  for (let i = weeks - 1; i >= 0; i--) {
    const endDate = new Date(Date.now() - i * 7 * 86400000)
    const startDate = new Date(endDate - 7 * 86400000)
    const start = startDate.toISOString().split('T')[0]
    const end = endDate.toISOString().split('T')[0]
    const total = getEmissionsByPeriod(start, end)
    result.push({
      week: `W${weeks - i}`,
      startDate: start,
      endDate: end,
      total: Math.round(total * 100) / 100,
    })
  }
  return result
}

// --- Export/Import ---
export function exportData() {
  const data = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    profile: getUserProfile(),
    activities: getActivities(),
    challenges: {
      active: getActiveChallenges(),
      completed: getCompletedChallenges(),
    },
    achievements: getUnlockedAchievements(),
    streak: getStreak(),
  }
  return JSON.stringify(data, null, 2)
}

export function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString)
    if (!data.version) throw new Error('Invalid data format')

    if (data.profile) setItem('profile', data.profile)
    if (data.activities) setItem('activities', data.activities)
    if (data.challenges?.active) setItem('active_challenges', data.challenges.active)
    if (data.challenges?.completed) setItem('completed_challenges', data.challenges.completed)
    if (data.achievements) setItem('achievements', data.achievements)
    if (data.streak) setItem('streak', data.streak)

    return true
  } catch (e) {
    console.error('Import failed:', e)
    return false
  }
}

// --- Helpers ---
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatNumber(num, decimals = 1) {
  if (num >= 1000) return (num / 1000).toFixed(decimals) + 'k'
  return num.toFixed(decimals)
}

export function getDateDaysAgo(days) {
  return new Date(Date.now() - days * 86400000).toISOString().split('T')[0]
}

export function getToday() {
  return new Date().toISOString().split('T')[0]
}
