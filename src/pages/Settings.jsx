import React, { useState, useRef } from 'react'
import { getUserProfile, exportData, importData, clearAll } from '../utils/storage'

const COUNTRIES = [
  { value: 'world', label: '🌍 Global Average' },
  { value: 'india', label: '🇮🇳 India' },
  { value: 'usa', label: '🇺🇸 USA' },
  { value: 'eu', label: '🇪🇺 EU' },
  { value: 'uk', label: '🇬🇧 UK' },
  { value: 'china', label: '🇨🇳 China' },
]

export default function Settings({ profile, onProfileUpdate, addToast, theme, onThemeToggle }) {
  const [name, setName] = useState(profile?.name || '')
  const [country, setCountry] = useState(profile?.country || 'world')
  const [goal, setGoal] = useState(profile?.goal || 4700)
  const [unit, setUnit] = useState(profile?.unit || 'metric')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const fileInputRef = useRef(null)

  const handleSave = () => {
    if (!name.trim()) {
      addToast({ type: 'warning', title: 'Name Required', message: 'Please enter your name.' })
      return
    }

    onProfileUpdate({
      ...profile,
      name: name.trim(),
      country,
      goal: Number(goal),
      unit,
      theme,
    })

    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your profile has been updated.',
    })
  }

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `carbonwise-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    addToast({
      type: 'success',
      title: 'Data Exported',
      message: 'Your data has been downloaded as JSON.',
    })
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const success = importData(event.target.result)
      if (success) {
        const imported = getUserProfile()
        if (imported) {
          setName(imported.name || '')
          setCountry(imported.country || 'world')
          setGoal(imported.goal || 4700)
          onProfileUpdate(imported)
        }
        addToast({
          type: 'success',
          title: 'Data Imported',
          message: 'Your data has been restored successfully.',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Import Failed',
          message: 'Invalid data format. Please check the file.',
        })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleDeleteAll = () => {
    clearAll()
    addToast({
      type: 'info',
      title: 'Data Cleared',
      message: 'All data has been deleted. Refreshing...',
    })
    setTimeout(() => window.location.reload(), 1500)
  }

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your profile, preferences, and data</p>
      </div>

      {/* Profile Section */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <h2 className="card-title" style={{ marginBottom: 'var(--space-6)' }}>
          👤 Profile
        </h2>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="settings-name">
              Name
            </label>
            <input
              id="settings-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="settings-country">
              Country / Region
            </label>
            <select
              id="settings-country"
              className="form-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="settings-goal">
              Annual CO₂ Goal (kg)
            </label>
            <input
              id="settings-goal"
              type="number"
              className="form-input"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              min={500}
              max={20000}
              step={100}
            />
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-tertiary)',
                marginTop: 'var(--space-1)',
              }}
            >
              = {(goal / 1000).toFixed(1)} tonnes per year
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="settings-unit">
              Units
            </label>
            <select
              id="settings-unit"
              className="form-select"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="metric">Metric (kg, km)</option>
              <option value="imperial">Imperial (lbs, miles)</option>
            </select>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={handleSave}
          id="save-settings"
          style={{ marginTop: 'var(--space-4)' }}
        >
          💾 Save Changes
        </button>
      </div>

      {/* Appearance */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
          🎨 Appearance
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Theme</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              {theme === 'dark' ? 'Dark mode is active' : 'Light mode is active'}
            </div>
          </div>
          <label className="toggle" id="theme-toggle-switch">
            <input
              type="checkbox"
              checked={theme === 'light'}
              onChange={onThemeToggle}
              aria-label="Toggle light/dark theme"
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
          📁 Data Management
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Export */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-secondary)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Export Data</div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Download all your data as a JSON file
              </div>
            </div>
            <button className="btn btn-secondary" onClick={handleExport} id="export-data">
              📤 Export
            </button>
          </div>

          {/* Import */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-secondary)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Import Data</div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Restore data from a previously exported file
              </div>
            </div>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImport}
            />
            <button
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              id="import-data"
            >
              📥 Import
            </button>
          </div>

          {/* Delete All */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-danger)' }}>Delete All Data</div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Permanently delete all your data. This cannot be undone.
              </div>
            </div>
            {!showDeleteConfirm ? (
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
                id="delete-data"
              >
                🗑️ Delete
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleDeleteAll}
                  id="confirm-delete"
                >
                  Confirm Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
          ℹ️ About CarbonWise
        </h2>
        <div
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
          }}
        >
          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>CarbonWise</strong> is a personal carbon footprint tracker that helps you
            understand, monitor, and reduce your environmental impact through actionable insights
            and gamification.
          </p>
          <p style={{ marginBottom: 'var(--space-3)' }}>
            All data is stored locally on your device using localStorage. No data is sent to any
            server. Your privacy is fully respected.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-tertiary)',
            }}
          >
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Built with React + Vite</span>
            <span>•</span>
            <span>Data Sources: EPA, DEFRA, IEA</span>
          </div>
        </div>
      </div>
    </div>
  )
}
