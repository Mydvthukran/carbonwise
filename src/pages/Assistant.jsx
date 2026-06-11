import { useState, useRef, useEffect, useMemo } from 'react'
import { ECO_TIPS, CHALLENGES } from '../data/tips'
import { EMISSION_FACTORS } from '../data/emissionFactors'
import {
  getActivities,
  getUserProfile,
  getCategoryBreakdown,
  getToday,
  getDateDaysAgo,
} from '../utils/storage'

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      text: "Hello! I am your CarbonWise Eco-Assistant. 🌿 I'm here to help you understand, track, and reduce your carbon footprint. You can ask me questions about your footprint, ask for reduction tips, or request calculator advice. Try one of the quick prompts below!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  const activities = useMemo(() => getActivities(), [])
  const profile = useMemo(() => getUserProfile(), [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const quickPrompts = [
    { label: '📊 Analyze my emissions', action: 'analyze' },
    { label: '💡 Give me a daily tip', action: 'tip' },
    { label: '🏆 Suggest a challenge', action: 'challenge' },
    { label: '🥩 Impact of eating beef?', action: 'beef' },
    { label: '🚗 Impact of driving a car?', action: 'car' },
  ]

  const getSystemResponse = (userInput) => {
    const query = userInput.toLowerCase().trim()

    // 1. Analyze emissions
    if (
      query.includes('analyze') ||
      query.includes('highest') ||
      query.includes('source') ||
      query.includes('footprint')
    ) {
      if (!activities || activities.length === 0) {
        return "You haven't logged any daily activities yet! Go to the **Activity Log** tab to start logging, or use the **Calculator** to estimate your annual footprint. Once you log some activities, I can analyze your patterns and show your biggest emission sources."
      }

      const breakdown = getCategoryBreakdown(getDateDaysAgo(30), getToday())
      const sorted = Object.entries(breakdown).sort(([, a], [, b]) => b - a)
      const total = sorted.reduce((sum, [, val]) => sum + val, 0)

      if (total === 0) {
        return "Your logged emissions for the last 30 days are 0 kg! That's amazing, but if you drive, use electricity, or eat meals, make sure to log them in the **Activity Log** to get an accurate representation of your footprint."
      }

      const [topCat, topVal] = sorted[0]
      const percentage = ((topVal / total) * 100).toFixed(0)
      const catTips = ECO_TIPS[topCat] || []
      const recommendedTip = catTips[0]
        ? `\n\n**Actionable Tip:**\n- ${recommendedTipText(catTips[0])}`
        : ''

      return `Based on your logs over the last 30 days, your total emissions are **${total.toFixed(1)} kg CO₂**.\n\nYour highest emission source is **${topCat.toUpperCase()}**, accounting for **${topVal.toFixed(1)} kg CO₂ (${percentage}%)** of your total footprint.${recommendedTip}\n\nWould you like me to recommend a challenge to help reduce this?`
    }

    // Helper for tip formatting
    function recommendedTipText(tipObj) {
      return `_${tipObj.tip}_ (Saves ~${tipObj.savingsKg} kg/week, Difficulty: **${tipObj.difficulty}**)`
    }

    // 2. Daily Tip
    if (
      query.includes('tip') ||
      query.includes('advice') ||
      query.includes('recommendation') ||
      query.includes('suggest')
    ) {
      const allCategories = Object.keys(ECO_TIPS)
      const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)]
      const categoryTips = ECO_TIPS[randomCategory]
      const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)]

      return `Here is a daily green tip for you:\n\n**${randomTip.icon} Category: ${randomCategory.toUpperCase()}**\n- **Tip:** ${randomTip.tip}\n- **Estimated Impact:** Saves **~${randomTip.savingsKg} kg CO₂/week**\n- **Difficulty:** ${randomTip.difficulty.toUpperCase()}\n\nSmall changes like this, when done consistently, can make a huge impact over a year (saving ~${(randomTip.savingsKg * 52).toFixed(0)} kg CO₂)!`
    }

    // 3. Suggest a Challenge
    if (query.includes('challenge') || query.includes('badge') || query.includes('xp')) {
      const available = CHALLENGES.slice(0, 3)
      const randomChallenge = available[Math.floor(Math.random() * available.length)]

      return `I recommend starting the **${randomChallenge.title}** challenge!\n\n- **Goal:** ${randomChallenge.description}\n- **Duration:** ${randomChallenge.duration} Days\n- **Impact:** Saves ~${randomChallenge.targetSavings} kg CO₂\n- **XP Reward:** ${randomChallenge.xp} XP\n- **Badge Reward:** ${randomChallenge.badge}\n\nYou can activate this challenge in the **Challenges** tab to earn your badge and level up!`
    }

    // 4. Beef Carbon Footprint
    if (
      query.includes('beef') ||
      query.includes('meat') ||
      query.includes('lamb') ||
      query.includes('steak')
    ) {
      const beefFactor = EMISSION_FACTORS.food.beef.factor
      const tofuFactor = EMISSION_FACTORS.food.tofu.factor
      return `Eating beef has one of the highest carbon footprints of any food item. 🥩\n\n- **Emissions:** **${beefFactor} kg CO₂** per kg of beef consumed.\n- **Comparison:** Tofu emits just **${tofuFactor} kg CO₂** per kg — that's a **92% reduction**!\n- **Action:** Swapping just one beef meal a week for a vegetarian meal (like lentils, beans, or tofu) saves about **3.5 kg CO₂/week**.`
    }

    // 5. Driving / Car Footprint
    if (
      query.includes('car') ||
      query.includes('drive') ||
      query.includes('driving') ||
      query.includes('petrol') ||
      query.includes('diesel')
    ) {
      const petrolFactor = EMISSION_FACTORS.transport.car_petrol.factor
      const electricFactor = EMISSION_FACTORS.transport.car_electric.factor
      const trainFactor = EMISSION_FACTORS.transport.train.factor

      return `Driving a standard petrol car emits about **${petrolFactor} kg CO₂** per kilometer. 🚗\n\n- **A 20 km drive** contributes **4.2 kg CO₂** to the atmosphere.\n- **Electric Car Alternative:** Emits only **${electricFactor} kg CO₂/km** (based on grid averages).\n- **Train Alternative:** Emits only **${trainFactor} kg CO₂/km**.\n- **Action:** For trips under 3 km, walking or biking has **0 kg CO₂** emissions and keeps you active!`
    }

    // 6. Generic Calculator query (Parsing numbers + keywords)
    const kmMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:km|kilometers?)/)
    const hrsMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:hr|hrs|hours?)/)

    if (kmMatch) {
      const dist = parseFloat(kmMatch[1])
      const emissionsPetrol = dist * EMISSION_FACTORS.transport.car_petrol.factor
      const emissionsElectric = dist * EMISSION_FACTORS.transport.car_electric.factor
      return `Let's calculate the transport emissions for **${dist} km**:\n\n- **Petrol Car:** ${emissionsPetrol.toFixed(2)} kg CO₂\n- **Electric Car:** ${emissionsElectric.toFixed(2)} kg CO₂\n- **Bus:** ${(dist * EMISSION_FACTORS.transport.bus.factor).toFixed(2)} kg CO₂\n- **Train:** ${(dist * EMISSION_FACTORS.transport.train.factor).toFixed(2)} kg CO₂\n- **Bicycle/Walking:** 0.00 kg CO₂\n\nChoosing public transit or active travel for this distance makes a big difference!`
    }

    if (hrsMatch) {
      const hrs = parseFloat(hrsMatch[1])
      const emissionsAC = hrs * EMISSION_FACTORS.energy.ac_usage.factor
      const emissionsStream = hrs * EMISSION_FACTORS.digital.video_streaming.factor
      return `Let's calculate the energy/digital emissions for **${hrs} hours**:\n\n- **Air Conditioning:** ${emissionsAC.toFixed(2)} kg CO₂\n- **Video Streaming (HD):** ${emissionsStream.toFixed(2)} kg CO₂\n- **Online Gaming:** ${(hrs * EMISSION_FACTORS.digital.gaming.factor).toFixed(2)} kg CO₂\n- **Ceiling Fan:** ${(hrs * EMISSION_FACTORS.energy.fan_usage.factor).toFixed(2)} kg CO₂`
    }

    if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      return `Hi there! 👋 I'm your CarbonWise Eco-Assistant. I can answer sustainability questions, calculate footprints of daily activities (e.g. try typing "50 km" or "3 hours"), and help analyze your current logs. Ask me anything!`
    }

    if (query.includes('score') || query.includes('grade')) {
      if (profile && profile.annualEstimate) {
        return `Your calculated annual footprint is **${profile.annualEstimate.toFixed(0)} kg CO₂/year**. Based on this, your eco grade is **${profile.ecoGrade || 'Pending'}**.\n\nYou can improve your grade by completing challenges and reducing daily logs. Try asking for a "daily tip" to get started!`
      }
      return "You haven't completed the carbon calculator setup yet! Go to the **Calculator** tab to find out your starting Eco Score and grade."
    }

    // Default response
    return 'I\'m not sure about that specific request, but I can help you with your carbon footprint! Try asking:\n- "Analyze my highest emissions"\n- "Give me a daily tip"\n- "Suggest a challenge"\n- "Impact of eating beef"\n- "Impact of driving a car"\n- Or type a distance/duration to calculate (e.g., "15 km" or "4 hours AC")'
  }

  const handleSend = (textToSend) => {
    const text = textToSend || input
    if (!text.trim()) return

    const userMsg = {
      id: `m_${Date.now()}_u`,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const responseText = getSystemResponse(text)
      const assistantMsg = {
        id: `m_${Date.now()}_a`,
        sender: 'assistant',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, assistantMsg])
      setIsTyping(false)
    }, 800)
  }

  return (
    <div
      className="animate-fade-in-up"
      style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}
    >
      <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
        <h1>Eco Assistant 💬</h1>
        <p>
          Chat with your personal sustainability advisor for instant calculations and smart
          recommendations
        </p>
      </div>

      {/* Chat Box */}
      <div
        className="card"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
        }}
      >
        {/* Messages Screen */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  background:
                    msg.sender === 'user' ? 'var(--color-primary)' : 'var(--bg-secondary)',
                  color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  whiteSpace: 'pre-line',
                  fontSize: 'var(--font-size-sm)',
                  boxShadow: 'var(--shadow-sm)',
                  lineHeight: '1.5',
                }}
              >
                {/* Safe text formatting with markdown-like bold parsing */}
                {msg.text.split('\n').map((line, i) => {
                  // Simple bold parser
                  const parts = line.split('**')
                  return (
                    <div key={i} style={{ minHeight: '1em' }}>
                      {parts.map((part, pi) =>
                        pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
                      )}
                    </div>
                  )
                })}
              </div>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  marginTop: '4px',
                  padding: '0 4px',
                }}
              >
                {msg.time}
              </span>
            </div>
          ))}

          {isTyping && (
            <div
              style={{
                alignSelf: 'flex-start',
                display: 'flex',
                gap: '4px',
                padding: 'var(--space-2) var(--space-4)',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
              }}
            >
              <span
                className="typing-dot"
                style={{
                  width: '6px',
                  height: '6px',
                  background: 'var(--text-secondary)',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'bounce 1s infinite',
                }}
              />
              <span
                className="typing-dot"
                style={{
                  width: '6px',
                  height: '6px',
                  background: 'var(--text-secondary)',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'bounce 1s infinite 0.2s',
                }}
              />
              <span
                className="typing-dot"
                style={{
                  width: '6px',
                  height: '6px',
                  background: 'var(--text-secondary)',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'bounce 1s infinite 0.4s',
                }}
              />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Chips */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.01)',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            display: 'flex',
            gap: 'var(--space-2)',
          }}
        >
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              className="badge badge-info"
              onClick={() =>
                handleSend(
                  p.label.replace(
                    /^[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]\s*/g,
                    ''
                  )
                )
              }
              style={{
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: '20px',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(16, 185, 129, 0.08)'
                e.target.style.borderColor = 'var(--color-primary)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--bg-secondary)'
                e.target.style.borderColor = 'var(--border-color)'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          style={{
            display: 'flex',
            padding: 'var(--space-3)',
            borderTop: '1px solid var(--border-color)',
            gap: 'var(--space-2)',
            background: 'var(--bg-secondary)',
          }}
        >
          <input
            type="text"
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or ask a question (e.g. 'How can I reduce waste?' or '20 km by bus')..."
            style={{ flex: 1, margin: 0 }}
            aria-label="Chat input message"
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: '0 var(--space-5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Send message"
          >
            Send ✈️
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  )
}
