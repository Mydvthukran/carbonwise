import { useState, useMemo } from 'react'
import { CalendarHeatmap } from '../components/Charts'
import { EMISSION_FACTORS, CATEGORIES } from '../data/emissionFactors'
import { getActivities, addActivity, removeActivity, formatDate, getToday } from '../utils/storage'

export default function Logger({ addToast }) {
  const [activities, setActivities] = useState(() => getActivities())
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('transport')
  const [selectedType, setSelectedType] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(getToday())
  const [notes, setNotes] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [viewMode, setViewMode] = useState('list')

  const categoryItems = EMISSION_FACTORS[selectedCategory] || {}
  const selectedItem = categoryItems[selectedType]

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat)
    const items = EMISSION_FACTORS[cat]
    const firstKey = Object.keys(items)[0]
    setSelectedType(firstKey)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedItem || !amount || Number(amount) <= 0) {
      addToast({
        type: 'warning',
        title: 'Invalid Input',
        message: 'Please select an activity and enter a valid amount.',
      })
      return
    }

    const emissions = Number(amount) * selectedItem.factor
    addActivity({
      type: selectedType,
      category: selectedCategory,
      amount: Number(amount),
      emissions,
      unit: selectedItem.unit,
      label: selectedItem.label,
      icon: selectedItem.icon,
      date,
      notes,
    })

    setActivities(getActivities())
    setAmount('')
    setNotes('')
    setShowForm(false)

    addToast({
      type: 'success',
      title: 'Activity Logged!',
      message: `${selectedItem.label}: ${emissions.toFixed(2)} kg CO₂`,
    })
  }

  const handleDelete = (id) => {
    removeActivity(id)
    setActivities(getActivities())
    addToast({ type: 'info', title: 'Activity Removed' })
  }

  const filteredActivities = useMemo(() => {
    if (filterCategory === 'all') return activities
    return activities.filter((a) => a.category === filterCategory)
  }, [activities, filterCategory])

  // Heatmap data
  const heatmapData = useMemo(() => {
    const map = {}
    activities.forEach((a) => {
      if (!map[a.date]) map[a.date] = 0
      map[a.date] += a.emissions
    })
    return map
  }, [activities])

  // Group activities by date
  const groupedByDate = useMemo(() => {
    const groups = {}
    filteredActivities.forEach((a) => {
      if (!groups[a.date]) groups[a.date] = []
      groups[a.date].push(a)
    })
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  }, [filteredActivities])

  return (
    <div className="animate-fade-in-up">
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <h1>Activity Logger</h1>
          <p>Track your daily carbon-emitting activities</p>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => setShowForm(!showForm)}
          id="toggle-log-form"
        >
          {showForm ? '✕ Close' : '+ Log Activity'}
        </button>
      </div>

      {/* Log Form */}
      {showForm && (
        <div className="card animate-scale-in" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
            Log New Activity
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Category Picker */}
            <div className="form-group" role="group" aria-labelledby="category-label">
              <div id="category-label" className="form-label">Category</div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    type="button"
                    className={`btn ${selectedCategory === key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => handleCategoryChange(key)}
                    id={`cat-btn-${key}`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Type */}
            <div className="form-group">
              <label className="form-label" htmlFor="activity-type">
                Activity
              </label>
              <select
                id="activity-type"
                className="form-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Select activity...</option>
                {Object.entries(categoryItems).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.icon} {item.label} ({item.factor} kg/{item.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount & Date */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="activity-amount">
                  Amount {selectedItem ? `(${selectedItem.unit})` : ''}
                </label>
                <input
                  id="activity-amount"
                  type="number"
                  className="form-input"
                  placeholder={`Enter ${selectedItem?.unit || 'amount'}...`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.1"
                  required
                  aria-required="true"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="activity-date">
                  Date
                </label>
                <input
                  id="activity-date"
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={getToday()}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label" htmlFor="activity-notes">
                Notes (optional)
              </label>
              <input
                id="activity-notes"
                type="text"
                className="form-input"
                placeholder="e.g., Commute to office"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={200}
              />
            </div>

            {/* Live calculation */}
            {selectedItem && amount > 0 && (
              <div
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  background:
                    'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(14,165,233,0.05))',
                  marginBottom: 'var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Emissions:</span>
                <span
                  style={{
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                  }}
                >
                  {(Number(amount) * selectedItem.factor).toFixed(2)} kg CO₂
                </span>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg w-full" id="submit-activity">
              📝 Log Activity
            </button>
          </form>
        </div>
      )}

      {/* View Toggle & Filters */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        <div className="tabs" style={{ marginBottom: 0, flex: 'unset' }}>
          <button
            className={`tab ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List
          </button>
          <button
            className={`tab ${viewMode === 'heatmap' ? 'active' : ''}`}
            onClick={() => setViewMode('heatmap')}
          >
            📅 Heatmap
          </button>
        </div>
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: 160 }}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          aria-label="Filter by category"
          id="filter-category"
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Heatmap View */}
      {viewMode === 'heatmap' && (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
            Emissions Heatmap (12 weeks)
          </h2>
          <CalendarHeatmap data={heatmapData} weeks={12} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginTop: 'var(--space-3)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-tertiary)',
            }}
          >
            <span>Less</span>
            {[
              'var(--bg-tertiary)',
              'rgba(16,185,129,0.25)',
              'rgba(16,185,129,0.45)',
              'rgba(16,185,129,0.65)',
              'rgba(16,185,129,0.9)',
            ].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
            ))}
            <span>More</span>
          </div>
        </div>
      )}

      {/* Activity List */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {groupedByDate.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <div className="empty-state-title">No activities logged yet</div>
                <div className="empty-state-text">
                  Start tracking your carbon footprint by logging your daily activities.
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                  + Log Your First Activity
                </button>
              </div>
            </div>
          ) : (
            groupedByDate.map(([dateStr, items]) => {
              const dayTotal = items.reduce((sum, a) => sum + a.emissions, 0)
              return (
                <div key={dateStr} className="card">
                  <div className="card-header">
                    <div>
                      <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600 }}>
                        {formatDate(dateStr)}
                      </h3>
                      <span
                        style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}
                      >
                        {items.length} {items.length === 1 ? 'activity' : 'activities'}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        {dayTotal.toFixed(2)} kg
                      </div>
                      <span
                        style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}
                      >
                        CO₂
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {items.map((activity) => (
                      <div
                        key={activity.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-3)',
                          padding: 'var(--space-3)',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-secondary)',
                          transition: 'background var(--transition-fast)',
                        }}
                      >
                        <span style={{ fontSize: '24px', flexShrink: 0 }}>{activity.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                            {activity.label}
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-xs)',
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            {activity.amount} {activity.unit}
                            {activity.notes && ` · ${activity.notes}`}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                            {activity.emissions.toFixed(2)} kg
                          </div>
                        </div>
                        <button
                          className="btn btn-sm"
                          style={{
                            color: 'var(--color-danger)',
                            fontSize: '16px',
                            padding: 'var(--space-1)',
                          }}
                          onClick={() => handleDelete(activity.id)}
                          aria-label={`Delete ${activity.label} activity`}
                          title="Delete activity"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Summary */}
      {activities.length > 0 && (
        <div
          style={{
            marginTop: 'var(--space-6)',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          Total: {activities.length} activities ·{' '}
          {activities.reduce((s, a) => s + a.emissions, 0).toFixed(1)} kg CO₂
        </div>
      )}
    </div>
  )
}
