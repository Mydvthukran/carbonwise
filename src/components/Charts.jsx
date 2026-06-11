import React, { useState } from 'react'

/**
 * SVG Bar Chart component
 */
export function BarChart({ data, width = 600, height = 250, barColor = 'var(--color-primary)' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  if (!data || data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
        <div className="empty-state-icon">📊</div>
        <div className="empty-state-title">No data yet</div>
        <div className="empty-state-text">Start logging activities to see your trends</div>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1)
  const barWidth = Math.min(30, (chartWidth / data.length) * 0.6)
  const barGap = chartWidth / data.length

  // Y-axis gridlines
  const yTicks = 5
  const yStep = maxValue / yTicks

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Bar chart showing emissions over time"
      style={{ overflow: 'visible' }}
    >
      {/* Y-axis gridlines */}
      {Array.from({ length: yTicks + 1 }, (_, i) => {
        const y = padding.top + chartHeight - (i / yTicks) * chartHeight
        return (
          <g key={`grid-${i}`}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="var(--border-color)"
              strokeDasharray="4,4"
            />
            <text
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              fill="var(--text-tertiary)"
              fontSize="11"
              fontFamily="var(--font-family)"
            >
              {(yStep * i).toFixed(1)}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const barHeight = (d.value / maxValue) * chartHeight
        const x = padding.left + i * barGap + (barGap - barWidth) / 2
        const y = padding.top + chartHeight - barHeight
        const isHovered = hoveredIndex === i

        return (
          <g
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill={barColor}
              opacity={isHovered ? 1 : 0.8}
              style={{
                transition: 'all 200ms ease',
                filter: isHovered ? `drop-shadow(0 0 8px ${barColor})` : 'none',
              }}
            />

            {/* Label */}
            <text
              x={x + barWidth / 2}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fill="var(--text-tertiary)"
              fontSize="10"
              fontFamily="var(--font-family)"
            >
              {d.label}
            </text>

            {/* Hover tooltip */}
            {isHovered && (
              <g>
                <rect
                  x={x + barWidth / 2 - 30}
                  y={y - 30}
                  width={60}
                  height={24}
                  rx={6}
                  fill="var(--bg-secondary)"
                  stroke="var(--border-color)"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 14}
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="var(--font-family)"
                >
                  {d.value.toFixed(1)} kg
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/**
 * SVG Donut Chart component
 */
export function DonutChart({ data, size = 200, strokeWidth = 28 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
          No data
        </span>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth={strokeWidth}
        />

        {/* Segments */}
        {data.map((d, i) => {
          const previousTotal = data.slice(0, i).reduce((sum, item) => sum + item.value, 0)
          const cumulativePercent = previousTotal / total
          const percent = d.value / total
          const dashLength = percent * circumference
          const dashOffset = -cumulativePercent * circumference
          const isHovered = hoveredIndex === i

          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${center} ${center})`}
              style={{
                transition: 'stroke-width 200ms ease',
                cursor: 'pointer',
                filter: isHovered ? `drop-shadow(0 0 6px ${d.color})` : 'none',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          )
        })}
      </svg>

      {/* Center label */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        {hoveredIndex !== null ? (
          <>
            <div
              style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 700,
                color: data[hoveredIndex].color,
              }}
            >
              {((data[hoveredIndex].value / total) * 100).toFixed(0)}%
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
              {data[hoveredIndex].label}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>
              {total.toFixed(1)}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
              kg CO₂
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * SVG Area Chart / Line Chart component
 */
export function AreaChart({
  data,
  width = 600,
  height = 200,
  color = 'var(--color-primary)',
  showArea = true,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const padding = { top: 20, right: 20, bottom: 30, left: 45 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  if (!data || data.length === 0) {
    return null
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1)
  const xStep = chartWidth / (data.length - 1 || 1)

  const points = data.map((d, i) => ({
    x: padding.left + i * xStep,
    y: padding.top + chartHeight - (d.value / maxValue) * chartHeight,
    ...d,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const y = padding.top + chartHeight * (1 - pct)
        return (
          <g key={`grid-${i}`}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="var(--border-color)"
              strokeDasharray="4,4"
            />
            <text
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              fill="var(--text-tertiary)"
              fontSize="10"
              fontFamily="var(--font-family)"
            >
              {(maxValue * pct).toFixed(1)}
            </text>
          </g>
        )
      })}

      {/* Area fill */}
      {showArea && <path d={areaPath} fill="url(#areaGrad)" />}

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {points.map((p, i) => (
        <g
          key={i}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <circle
            cx={p.x}
            cy={p.y}
            r={hoveredIndex === i ? 6 : 3}
            fill={color}
            style={{ transition: 'r 200ms ease', cursor: 'pointer' }}
          />
          {hoveredIndex === i && (
            <>
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x}
                y2={padding.top + chartHeight}
                stroke={color}
                strokeDasharray="3,3"
                opacity="0.4"
              />
              <rect
                x={p.x - 35}
                y={p.y - 32}
                width={70}
                height={24}
                rx={6}
                fill="var(--bg-secondary)"
                stroke="var(--border-color)"
              />
              <text
                x={p.x}
                y={p.y - 16}
                textAnchor="middle"
                fill="var(--text-primary)"
                fontSize="11"
                fontWeight="600"
                fontFamily="var(--font-family)"
              >
                {p.value.toFixed(1)} kg
              </text>
            </>
          )}
        </g>
      ))}

      {/* X-axis labels */}
      {points
        .filter((_, i) => data.length <= 10 || i % Math.ceil(data.length / 8) === 0)
        .map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.x}
            y={height - 5}
            textAnchor="middle"
            fill="var(--text-tertiary)"
            fontSize="10"
            fontFamily="var(--font-family)"
          >
            {p.label}
          </text>
        ))}
    </svg>
  )
}

/**
 * Mini sparkline chart for stat cards
 */
export function Sparkline({ data, width = 120, height = 40, color = 'var(--color-primary)' }) {
  if (!data || data.length < 2) return null

  const maxVal = Math.max(...data, 1)
  const minVal = Math.min(...data, 0)
  const range = maxVal - minVal || 1
  const xStep = width / (data.length - 1)

  const points = data.map((v, i) => ({
    x: i * xStep,
    y: height - ((v - minVal) / range) * (height - 4) - 2,
  }))

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={path + ` L ${points[points.length - 1].x} ${height} L 0 ${height} Z`}
        fill={`url(#spark-${color})`}
      />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3"
        fill={color}
      />
    </svg>
  )
}

/**
 * Calendar Heatmap
 */
export function CalendarHeatmap({ data, weeks = 12 }) {
  const cellSize = 14
  const cellGap = 3
  const totalSize = cellSize + cellGap

  const maxValue = Math.max(...Object.values(data || {}), 1)

  const days = []
  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const date = new Date()
      date.setDate(date.getDate() - (w * 7 + (6 - d)))
      const dateStr = date.toISOString().split('T')[0]
      const value = data?.[dateStr] || 0
      days.push({ date: dateStr, value, week: weeks - 1 - w, day: d })
    }
  }

  const getColor = (value) => {
    if (value === 0) return 'var(--bg-tertiary)'
    const intensity = Math.min(value / maxValue, 1)
    if (intensity < 0.25) return 'rgba(16, 185, 129, 0.25)'
    if (intensity < 0.5) return 'rgba(16, 185, 129, 0.45)'
    if (intensity < 0.75) return 'rgba(16, 185, 129, 0.65)'
    return 'rgba(16, 185, 129, 0.9)'
  }

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={weeks * totalSize + 30} height={7 * totalSize + 10}>
        {/* Day labels */}
        {dayLabels.map(
          (label, i) =>
            label && (
              <text
                key={i}
                x={0}
                y={i * totalSize + cellSize + 2}
                fill="var(--text-tertiary)"
                fontSize="9"
                fontFamily="var(--font-family)"
              >
                {label}
              </text>
            )
        )}

        {/* Cells */}
        {days.map((d, i) => (
          <rect
            key={i}
            x={d.week * totalSize + 30}
            y={d.day * totalSize}
            width={cellSize}
            height={cellSize}
            rx={3}
            fill={getColor(d.value)}
            style={{ cursor: 'pointer', transition: 'fill 200ms' }}
          >
            <title>{`${d.date}: ${d.value.toFixed(1)} kg CO₂`}</title>
          </rect>
        ))}
      </svg>
    </div>
  )
}
