/**
 * CarbonWise - Eco Tips & Recommendations Engine
 * Personalized tips based on user activity patterns
 */

export const ECO_TIPS = {
  transport: [
    {
      id: 't1',
      tip: 'Bike or walk for trips under 3 km',
      impact: 'high',
      savingsKg: 1.5,
      difficulty: 'easy',
      icon: '🚲',
    },
    {
      id: 't2',
      tip: 'Use public transport instead of driving alone',
      impact: 'high',
      savingsKg: 3.2,
      difficulty: 'medium',
      icon: '🚌',
    },
    {
      id: 't3',
      tip: 'Carpool with colleagues for your daily commute',
      impact: 'medium',
      savingsKg: 2.1,
      difficulty: 'medium',
      icon: '🤝',
    },
    {
      id: 't4',
      tip: 'Work from home 2 days a week',
      impact: 'high',
      savingsKg: 4.5,
      difficulty: 'easy',
      icon: '🏠',
    },
    {
      id: 't5',
      tip: 'Maintain proper tire pressure to improve fuel efficiency',
      impact: 'low',
      savingsKg: 0.5,
      difficulty: 'easy',
      icon: '⛽',
    },
    {
      id: 't6',
      tip: 'Consider an electric or hybrid vehicle for your next car',
      impact: 'high',
      savingsKg: 8.0,
      difficulty: 'hard',
      icon: '⚡',
    },
    {
      id: 't7',
      tip: 'Take trains instead of flights for trips under 800 km',
      impact: 'high',
      savingsKg: 45,
      difficulty: 'medium',
      icon: '🚆',
    },
    {
      id: 't8',
      tip: 'Combine errands into a single trip to reduce driving',
      impact: 'medium',
      savingsKg: 1.2,
      difficulty: 'easy',
      icon: '📋',
    },
  ],
  food: [
    {
      id: 'f1',
      tip: 'Try Meatless Mondays – skip meat one day per week',
      impact: 'medium',
      savingsKg: 3.5,
      difficulty: 'easy',
      icon: '🥬',
    },
    {
      id: 'f2',
      tip: 'Replace beef with chicken or plant-based protein',
      impact: 'high',
      savingsKg: 6.0,
      difficulty: 'medium',
      icon: '🌱',
    },
    {
      id: 'f3',
      tip: 'Buy local and seasonal produce',
      impact: 'medium',
      savingsKg: 1.5,
      difficulty: 'easy',
      icon: '🥕',
    },
    {
      id: 'f4',
      tip: 'Reduce food waste by planning meals in advance',
      impact: 'high',
      savingsKg: 4.0,
      difficulty: 'easy',
      icon: '📝',
    },
    {
      id: 'f5',
      tip: 'Switch from dairy to plant-based milk',
      impact: 'medium',
      savingsKg: 1.8,
      difficulty: 'easy',
      icon: '🥛',
    },
    {
      id: 'f6',
      tip: 'Grow your own herbs and vegetables',
      impact: 'low',
      savingsKg: 0.8,
      difficulty: 'medium',
      icon: '🌿',
    },
    {
      id: 'f7',
      tip: 'Choose tap water over bottled water',
      impact: 'low',
      savingsKg: 0.3,
      difficulty: 'easy',
      icon: '💧',
    },
    {
      id: 'f8',
      tip: 'Compost food scraps instead of binning them',
      impact: 'medium',
      savingsKg: 2.2,
      difficulty: 'medium',
      icon: '🪱',
    },
  ],
  energy: [
    {
      id: 'e1',
      tip: 'Switch to LED bulbs throughout your home',
      impact: 'medium',
      savingsKg: 2.5,
      difficulty: 'easy',
      icon: '💡',
    },
    {
      id: 'e2',
      tip: 'Unplug devices when not in use to avoid phantom load',
      impact: 'low',
      savingsKg: 0.8,
      difficulty: 'easy',
      icon: '🔌',
    },
    {
      id: 'e3',
      tip: 'Set AC to 24°C instead of lower temperatures',
      impact: 'medium',
      savingsKg: 3.0,
      difficulty: 'easy',
      icon: '❄️',
    },
    {
      id: 'e4',
      tip: 'Use a smart thermostat to optimize energy usage',
      impact: 'high',
      savingsKg: 5.0,
      difficulty: 'medium',
      icon: '🌡️',
    },
    {
      id: 'e5',
      tip: 'Air-dry clothes instead of using a dryer',
      impact: 'medium',
      savingsKg: 2.0,
      difficulty: 'easy',
      icon: '👕',
    },
    {
      id: 'e6',
      tip: 'Install solar panels for renewable energy at home',
      impact: 'high',
      savingsKg: 15.0,
      difficulty: 'hard',
      icon: '☀️',
    },
    {
      id: 'e7',
      tip: 'Use cold water for washing clothes when possible',
      impact: 'low',
      savingsKg: 0.7,
      difficulty: 'easy',
      icon: '🧺',
    },
    {
      id: 'e8',
      tip: 'Improve home insulation to reduce heating/cooling needs',
      impact: 'high',
      savingsKg: 8.0,
      difficulty: 'hard',
      icon: '🏗️',
    },
  ],
  shopping: [
    {
      id: 's1',
      tip: 'Carry reusable bags when shopping',
      impact: 'low',
      savingsKg: 0.2,
      difficulty: 'easy',
      icon: '🛍️',
    },
    {
      id: 's2',
      tip: 'Buy secondhand clothes and accessories',
      impact: 'medium',
      savingsKg: 4.5,
      difficulty: 'easy',
      icon: '♻️',
    },
    {
      id: 's3',
      tip: 'Repair devices instead of buying new ones',
      impact: 'high',
      savingsKg: 15,
      difficulty: 'medium',
      icon: '🔧',
    },
    {
      id: 's4',
      tip: 'Choose products with minimal or recyclable packaging',
      impact: 'medium',
      savingsKg: 1.5,
      difficulty: 'easy',
      icon: '📦',
    },
    {
      id: 's5',
      tip: 'Consolidate online orders to reduce delivery trips',
      impact: 'low',
      savingsKg: 0.5,
      difficulty: 'easy',
      icon: '🚚',
    },
    {
      id: 's6',
      tip: 'Invest in durable, high-quality items that last longer',
      impact: 'medium',
      savingsKg: 5.0,
      difficulty: 'medium',
      icon: '⭐',
    },
  ],
  digital: [
    {
      id: 'd1',
      tip: 'Reduce video streaming quality when on mobile',
      impact: 'low',
      savingsKg: 0.3,
      difficulty: 'easy',
      icon: '📱',
    },
    {
      id: 'd2',
      tip: 'Unsubscribe from unwanted email newsletters',
      impact: 'low',
      savingsKg: 0.1,
      difficulty: 'easy',
      icon: '📧',
    },
    {
      id: 'd3',
      tip: 'Turn off camera during non-essential video calls',
      impact: 'low',
      savingsKg: 0.2,
      difficulty: 'easy',
      icon: '📷',
    },
    {
      id: 'd4',
      tip: 'Delete old files and emails from cloud storage',
      impact: 'low',
      savingsKg: 0.1,
      difficulty: 'easy',
      icon: '☁️',
    },
    {
      id: 'd5',
      tip: 'Enable dark mode to reduce screen energy use on OLED screens',
      impact: 'low',
      savingsKg: 0.2,
      difficulty: 'easy',
      icon: '🌙',
    },
  ],
  waste: [
    {
      id: 'w1',
      tip: 'Separate recyclables from general waste',
      impact: 'medium',
      savingsKg: 2.5,
      difficulty: 'easy',
      icon: '♻️',
    },
    {
      id: 'w2',
      tip: 'Start a home composting bin',
      impact: 'medium',
      savingsKg: 3.0,
      difficulty: 'medium',
      icon: '🌿',
    },
    {
      id: 'w3',
      tip: 'Use a reusable water bottle and coffee cup',
      impact: 'low',
      savingsKg: 0.5,
      difficulty: 'easy',
      icon: '🥤',
    },
    {
      id: 'w4',
      tip: 'Avoid single-use plastics whenever possible',
      impact: 'medium',
      savingsKg: 1.5,
      difficulty: 'easy',
      icon: '🚫',
    },
  ],
}

export const CHALLENGES = [
  {
    id: 'ch1',
    title: 'Meatless Week',
    description: 'Go without meat for 7 days straight',
    category: 'food',
    duration: 7,
    targetSavings: 25,
    difficulty: 'medium',
    icon: '🥬',
    xp: 150,
    badge: '🌱',
  },
  {
    id: 'ch2',
    title: 'Zero Car Week',
    description: 'Commute entirely without a car for one week',
    category: 'transport',
    duration: 7,
    targetSavings: 30,
    difficulty: 'hard',
    icon: '🚲',
    xp: 200,
    badge: '🏆',
  },
  {
    id: 'ch3',
    title: 'Energy Saver',
    description: 'Reduce electricity usage by 20% this week',
    category: 'energy',
    duration: 7,
    targetSavings: 15,
    difficulty: 'medium',
    icon: '💡',
    xp: 120,
    badge: '⚡',
  },
  {
    id: 'ch4',
    title: 'Zero Waste Day',
    description: 'Produce no landfill waste for one full day',
    category: 'waste',
    duration: 1,
    targetSavings: 3,
    difficulty: 'medium',
    icon: '♻️',
    xp: 80,
    badge: '🌍',
  },
  {
    id: 'ch5',
    title: 'Local Food Hero',
    description: 'Eat only locally sourced food for 5 days',
    category: 'food',
    duration: 5,
    targetSavings: 10,
    difficulty: 'medium',
    icon: '🥕',
    xp: 130,
    badge: '🌾',
  },
  {
    id: 'ch6',
    title: 'Digital Detox',
    description: 'Limit screen time to 2 hours/day for 3 days',
    category: 'digital',
    duration: 3,
    targetSavings: 2,
    difficulty: 'easy',
    icon: '📱',
    xp: 60,
    badge: '🧘',
  },
  {
    id: 'ch7',
    title: 'Eco Commuter',
    description: 'Use public transport or cycle for 14 days',
    category: 'transport',
    duration: 14,
    targetSavings: 50,
    difficulty: 'hard',
    icon: '🚌',
    xp: 300,
    badge: '🎖️',
  },
  {
    id: 'ch8',
    title: 'Plant-Based Explorer',
    description: 'Try 10 different plant-based meals in 2 weeks',
    category: 'food',
    duration: 14,
    targetSavings: 35,
    difficulty: 'medium',
    icon: '🌿',
    xp: 180,
    badge: '👨‍🍳',
  },
  {
    id: 'ch9',
    title: 'Secondhand Champion',
    description: 'Make 3 secondhand purchases instead of new',
    category: 'shopping',
    duration: 30,
    targetSavings: 28,
    difficulty: 'easy',
    icon: '🔄',
    xp: 100,
    badge: '🛒',
  },
  {
    id: 'ch10',
    title: 'No-Delivery Month',
    description: 'Avoid online deliveries for 30 days',
    category: 'shopping',
    duration: 30,
    targetSavings: 15,
    difficulty: 'hard',
    icon: '📦',
    xp: 250,
    badge: '🏅',
  },
]

export const ACHIEVEMENTS = [
  {
    id: 'a1',
    title: 'First Step',
    description: 'Log your first activity',
    icon: '👣',
    condition: 'first_log',
  },
  {
    id: 'a2',
    title: 'Week Warrior',
    description: 'Log activities for 7 consecutive days',
    icon: '🔥',
    condition: 'streak_7',
  },
  {
    id: 'a3',
    title: 'Month Master',
    description: 'Log activities for 30 consecutive days',
    icon: '🏆',
    condition: 'streak_30',
  },
  {
    id: 'a4',
    title: 'Carbon Cutter',
    description: 'Reduce monthly emissions by 10%',
    icon: '✂️',
    condition: 'reduce_10',
  },
  {
    id: 'a5',
    title: 'Green Machine',
    description: 'Reduce monthly emissions by 25%',
    icon: '💚',
    condition: 'reduce_25',
  },
  {
    id: 'a6',
    title: 'Challenge Accepted',
    description: 'Complete your first challenge',
    icon: '🎯',
    condition: 'first_challenge',
  },
  {
    id: 'a7',
    title: 'Eco Explorer',
    description: 'Log activities in all 6 categories',
    icon: '🗺️',
    condition: 'all_categories',
  },
  {
    id: 'a8',
    title: 'Tree Saver',
    description: 'Save 100 kg CO₂ equivalent',
    icon: '🌳',
    condition: 'save_100',
  },
  {
    id: 'a9',
    title: 'Climate Champion',
    description: 'Save 500 kg CO₂ equivalent',
    icon: '🌍',
    condition: 'save_500',
  },
  {
    id: 'a10',
    title: 'Zero Hero',
    description: 'Have a zero-emission day',
    icon: '🦸',
    condition: 'zero_day',
  },
]

/**
 * Get personalized tips based on user's activity patterns
 */
export function getPersonalizedTips(activities, limit = 5) {
  if (!activities || activities.length === 0) {
    // Return general high-impact tips for new users
    const allTips = Object.values(ECO_TIPS).flat()
    return allTips
      .filter((t) => t.impact === 'high')
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
  }

  // Analyze category breakdown
  const categoryEmissions = {}
  activities.forEach((a) => {
    if (!categoryEmissions[a.category]) categoryEmissions[a.category] = 0
    categoryEmissions[a.category] += a.emissions
  })

  // Sort categories by emission (highest first)
  const sortedCategories = Object.entries(categoryEmissions)
    .sort(([, a], [, b]) => b - a)
    .map(([cat]) => cat)

  // Get tips from highest-emission categories first
  const tips = []
  for (const cat of sortedCategories) {
    if (ECO_TIPS[cat]) {
      const catTips = ECO_TIPS[cat].filter((t) => !tips.find((et) => et.id === t.id))
      tips.push(...catTips)
    }
  }

  return tips.slice(0, limit)
}

/**
 * Generate "What if" scenarios based on user data
 */
export function generateWhatIfScenarios(activities) {
  const scenarios = []

  const categoryEmissions = {}
  activities.forEach((a) => {
    if (!categoryEmissions[a.category]) categoryEmissions[a.category] = 0
    categoryEmissions[a.category] += a.emissions
  })

  if (categoryEmissions.transport > 5) {
    scenarios.push({
      title: 'Switch to public transport twice a week',
      currentKg: categoryEmissions.transport,
      savedKg: categoryEmissions.transport * 0.3,
      icon: '🚌',
      category: 'transport',
    })
  }

  if (categoryEmissions.food > 3) {
    scenarios.push({
      title: 'Go vegetarian 3 days per week',
      currentKg: categoryEmissions.food,
      savedKg: categoryEmissions.food * 0.25,
      icon: '🥗',
      category: 'food',
    })
  }

  if (categoryEmissions.energy > 2) {
    scenarios.push({
      title: 'Switch to renewable energy provider',
      currentKg: categoryEmissions.energy,
      savedKg: categoryEmissions.energy * 0.6,
      icon: '☀️',
      category: 'energy',
    })
  }

  if (categoryEmissions.shopping > 1) {
    scenarios.push({
      title: 'Buy secondhand 50% of the time',
      currentKg: categoryEmissions.shopping,
      savedKg: categoryEmissions.shopping * 0.4,
      icon: '♻️',
      category: 'shopping',
    })
  }

  return scenarios
}
