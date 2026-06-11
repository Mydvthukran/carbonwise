/**
 * CarbonWise - Emission Factors Database
 * All values in kg CO₂ equivalent per unit specified
 * Sources: EPA, DEFRA, IEA, IPCC
 */

export const EMISSION_FACTORS = {
  transport: {
    car_petrol: {
      factor: 0.21,
      unit: 'km',
      label: 'Car (Petrol)',
      icon: '🚗',
      category: 'transport',
    },
    car_diesel: {
      factor: 0.27,
      unit: 'km',
      label: 'Car (Diesel)',
      icon: '🚙',
      category: 'transport',
    },
    car_electric: {
      factor: 0.05,
      unit: 'km',
      label: 'Electric Car',
      icon: '⚡',
      category: 'transport',
    },
    car_hybrid: {
      factor: 0.12,
      unit: 'km',
      label: 'Hybrid Car',
      icon: '🔋',
      category: 'transport',
    },
    bus: { factor: 0.089, unit: 'km', label: 'Bus', icon: '🚌', category: 'transport' },
    train: { factor: 0.041, unit: 'km', label: 'Train', icon: '🚆', category: 'transport' },
    metro: { factor: 0.033, unit: 'km', label: 'Metro/Subway', icon: '🚇', category: 'transport' },
    bicycle: { factor: 0, unit: 'km', label: 'Bicycle', icon: '🚲', category: 'transport' },
    walking: { factor: 0, unit: 'km', label: 'Walking', icon: '🚶', category: 'transport' },
    motorcycle: {
      factor: 0.103,
      unit: 'km',
      label: 'Motorcycle',
      icon: '🏍️',
      category: 'transport',
    },
    flight_short: {
      factor: 0.255,
      unit: 'km',
      label: 'Flight (<1500km)',
      icon: '✈️',
      category: 'transport',
    },
    flight_long: {
      factor: 0.195,
      unit: 'km',
      label: 'Flight (>1500km)',
      icon: '🛫',
      category: 'transport',
    },
    taxi: { factor: 0.31, unit: 'km', label: 'Taxi/Ride-share', icon: '🚕', category: 'transport' },
    auto_rickshaw: {
      factor: 0.08,
      unit: 'km',
      label: 'Auto Rickshaw',
      icon: '🛺',
      category: 'transport',
    },
  },

  food: {
    beef: { factor: 27.0, unit: 'kg', label: 'Beef', icon: '🥩', category: 'food' },
    lamb: { factor: 39.2, unit: 'kg', label: 'Lamb', icon: '🍖', category: 'food' },
    pork: { factor: 12.1, unit: 'kg', label: 'Pork', icon: '🥓', category: 'food' },
    chicken: { factor: 6.9, unit: 'kg', label: 'Chicken', icon: '🍗', category: 'food' },
    fish: { factor: 6.1, unit: 'kg', label: 'Fish', icon: '🐟', category: 'food' },
    eggs: { factor: 4.8, unit: 'kg', label: 'Eggs', icon: '🥚', category: 'food' },
    dairy_milk: { factor: 3.2, unit: 'L', label: 'Dairy Milk', icon: '🥛', category: 'food' },
    cheese: { factor: 13.5, unit: 'kg', label: 'Cheese', icon: '🧀', category: 'food' },
    rice: { factor: 2.7, unit: 'kg', label: 'Rice', icon: '🍚', category: 'food' },
    vegetables: { factor: 0.5, unit: 'kg', label: 'Vegetables', icon: '🥗', category: 'food' },
    fruits: { factor: 0.7, unit: 'kg', label: 'Fruits', icon: '🍎', category: 'food' },
    bread: { factor: 0.8, unit: 'kg', label: 'Bread', icon: '🍞', category: 'food' },
    coffee: { factor: 0.059, unit: 'cup', label: 'Coffee', icon: '☕', category: 'food' },
    plant_milk: { factor: 0.9, unit: 'L', label: 'Plant Milk', icon: '🌱', category: 'food' },
    tofu: { factor: 2.0, unit: 'kg', label: 'Tofu', icon: '🫘', category: 'food' },
    lentils: { factor: 0.9, unit: 'kg', label: 'Lentils/Dal', icon: '🫘', category: 'food' },
    meal_vegan: { factor: 0.7, unit: 'meal', label: 'Vegan Meal', icon: '🥬', category: 'food' },
    meal_vegetarian: {
      factor: 1.7,
      unit: 'meal',
      label: 'Vegetarian Meal',
      icon: '🥗',
      category: 'food',
    },
    meal_mixed: { factor: 3.5, unit: 'meal', label: 'Mixed Meal', icon: '🍽️', category: 'food' },
    meal_meat_heavy: {
      factor: 7.0,
      unit: 'meal',
      label: 'Meat-heavy Meal',
      icon: '🥩',
      category: 'food',
    },
  },

  energy: {
    electricity: { factor: 0.5, unit: 'kWh', label: 'Electricity', icon: '💡', category: 'energy' },
    natural_gas: { factor: 2.0, unit: 'm³', label: 'Natural Gas', icon: '🔥', category: 'energy' },
    lpg: { factor: 1.51, unit: 'kg', label: 'LPG', icon: '⛽', category: 'energy' },
    heating_oil: { factor: 2.54, unit: 'L', label: 'Heating Oil', icon: '🛢️', category: 'energy' },
    solar_panel: {
      factor: -0.5,
      unit: 'kWh',
      label: 'Solar (offset)',
      icon: '☀️',
      category: 'energy',
    },
    ac_usage: {
      factor: 1.5,
      unit: 'hour',
      label: 'Air Conditioning',
      icon: '❄️',
      category: 'energy',
    },
    fan_usage: { factor: 0.04, unit: 'hour', label: 'Fan/Cooler', icon: '🌀', category: 'energy' },
  },

  shopping: {
    clothing_new: {
      factor: 10,
      unit: 'item',
      label: 'New Clothing',
      icon: '👕',
      category: 'shopping',
    },
    clothing_second: {
      factor: 0.5,
      unit: 'item',
      label: 'Secondhand Clothing',
      icon: '♻️',
      category: 'shopping',
    },
    electronics_phone: {
      factor: 70,
      unit: 'item',
      label: 'Smartphone',
      icon: '📱',
      category: 'shopping',
    },
    electronics_laptop: {
      factor: 300,
      unit: 'item',
      label: 'Laptop',
      icon: '💻',
      category: 'shopping',
    },
    furniture: { factor: 50, unit: 'item', label: 'Furniture', icon: '🪑', category: 'shopping' },
    plastic_bag: {
      factor: 0.033,
      unit: 'item',
      label: 'Plastic Bag',
      icon: '🛍️',
      category: 'shopping',
    },
    online_delivery: {
      factor: 0.5,
      unit: 'package',
      label: 'Online Delivery',
      icon: '📦',
      category: 'shopping',
    },
  },

  digital: {
    video_streaming: {
      factor: 0.036,
      unit: 'hour',
      label: 'Video Streaming',
      icon: '📺',
      category: 'digital',
    },
    video_call: {
      factor: 0.047,
      unit: 'hour',
      label: 'Video Call',
      icon: '💻',
      category: 'digital',
    },
    email: { factor: 0.004, unit: 'email', label: 'Email', icon: '📧', category: 'digital' },
    cloud_storage: {
      factor: 0.013,
      unit: 'GB/month',
      label: 'Cloud Storage',
      icon: '☁️',
      category: 'digital',
    },
    social_media: {
      factor: 0.02,
      unit: 'hour',
      label: 'Social Media',
      icon: '📲',
      category: 'digital',
    },
    gaming: { factor: 0.06, unit: 'hour', label: 'Online Gaming', icon: '🎮', category: 'digital' },
  },

  waste: {
    landfill: { factor: 0.58, unit: 'kg', label: 'Landfill Waste', icon: '🗑️', category: 'waste' },
    recycling: {
      factor: 0.021,
      unit: 'kg',
      label: 'Recycled Waste',
      icon: '♻️',
      category: 'waste',
    },
    composting: {
      factor: 0.01,
      unit: 'kg',
      label: 'Composted Waste',
      icon: '🌿',
      category: 'waste',
    },
    food_waste: { factor: 2.53, unit: 'kg', label: 'Food Waste', icon: '🍌', category: 'waste' },
  },
}

export const CATEGORIES = {
  transport: {
    label: 'Transport',
    icon: '🚗',
    color: '#0EA5E9',
    description: 'Daily commute & travel',
  },
  food: {
    label: 'Food & Diet',
    icon: '🍽️',
    color: '#10B981',
    description: 'Meals & dietary choices',
  },
  energy: {
    label: 'Home Energy',
    icon: '⚡',
    color: '#F59E0B',
    description: 'Electricity, gas & heating',
  },
  shopping: {
    label: 'Shopping',
    icon: '🛒',
    color: '#8B5CF6',
    description: 'Products & purchases',
  },
  digital: {
    label: 'Digital',
    icon: '💻',
    color: '#EC4899',
    description: 'Internet & device usage',
  },
  waste: { label: 'Waste', icon: '🗑️', color: '#EF4444', description: 'Waste & recycling' },
}

export const GLOBAL_AVERAGES = {
  world: { annual: 4700, label: 'World Average' },
  usa: { annual: 14700, label: 'USA' },
  eu: { annual: 6500, label: 'EU Average' },
  india: { annual: 1900, label: 'India' },
  china: { annual: 7700, label: 'China' },
  uk: { annual: 5200, label: 'UK' },
  target_2030: { annual: 2500, label: '2030 Target' },
}

// Returns eco rating based on annual CO2 in kg
export function getEcoRating(annualKg) {
  if (annualKg <= 2000) return { score: 95, grade: 'A+', label: 'Exceptional', color: '#10B981' }
  if (annualKg <= 3000) return { score: 85, grade: 'A', label: 'Excellent', color: '#34D399' }
  if (annualKg <= 4500) return { score: 72, grade: 'B', label: 'Good', color: '#FBBF24' }
  if (annualKg <= 6500) return { score: 55, grade: 'C', label: 'Average', color: '#F59E0B' }
  if (annualKg <= 10000) return { score: 35, grade: 'D', label: 'Above Average', color: '#F97316' }
  return { score: 15, grade: 'F', label: 'High Impact', color: '#EF4444' }
}
