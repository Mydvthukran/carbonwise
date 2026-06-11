import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getUserProfile,
  setUserProfile,
  getActivities,
  addActivity,
  getStreak,
  getDailyEmissions,
  getDateDaysAgo,
  getToday,
} from '../storage'

describe('storage.js utilities', () => {
  beforeEach(() => {
    localStorage.clear()
    // Mock the date so `getToday` is deterministic
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-10-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('getUserProfile and saveUserProfile work correctly', () => {
    expect(getUserProfile()).toBeNull()
    const profile = { name: 'Test User', goal: 4000 }
    setUserProfile(profile)
    expect(getUserProfile()).toMatchObject(profile)
  })

  it('addActivity and getActivities work correctly', () => {
    expect(getActivities()).toEqual([])
    
    const activity = { type: 'transport', emissions: 10 }
    const saved = addActivity(activity)
    
    expect(saved.id).toBeDefined()
    expect(saved.date).toBe(getToday())
    
    const all = getActivities()
    expect(all).toHaveLength(1)
    expect(all[0].emissions).toBe(10)
  })

  it('getStreak calculates streak correctly', () => {
    const today = getToday()
    const yesterday = getDateDaysAgo(1)
    const twoDaysAgo = getDateDaysAgo(2)

    // Log for 2 days ago
    addActivity({ date: twoDaysAgo, type: 'food', emissions: 5 })
    
    // Streak should be 0 because yesterday is missing and today is missing (wait, if yesterday is missing it's 0)
    expect(getStreak().current).toBe(0)

    // Log for yesterday
    addActivity({ date: yesterday, type: 'food', emissions: 5 })
    expect(getStreak().current).toBe(1)
    
    // Log for today
    addActivity({ date: today, type: 'food', emissions: 5 })
    expect(getStreak().current).toBe(2)
  })

  it('getDailyEmissions aggregates correctly', () => {
    const today = getToday()
    addActivity({ date: today, emissions: 10 })
    addActivity({ date: today, emissions: 15 })
    
    const daily = getDailyEmissions(7)
    const todayData = daily.find(d => d.date === today)
    expect(todayData.total).toBe(25)
  })
})
