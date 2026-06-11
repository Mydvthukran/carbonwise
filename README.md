# CarbonWise 🌿

**Your Personal Carbon Footprint Tracker & Advisor**

CarbonWise is a smart, dynamic web application that helps individuals understand, track, and reduce their carbon footprint through personalized insights, gamification, and actionable recommendations.

🔗 **Live Deployment:** [CarbonWise on Google Cloud](https://fifth-flame-495223-b4.uc.r.appspot.com)  
🔗 **GitHub Repository:** [Mydvthukran/carbonwise](https://github.com/Mydvthukran/carbonwise)

![CarbonWise Dashboard](https://img.shields.io/badge/CarbonWise-v1.0.0-10B981?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6IiBmaWxsPSIjMTBCOTgxIi8+PC9zdmc+)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🌍 Challenge Vertical

**Sustainability & Carbon Footprint Tracking**

> Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

---

## 🎯 Approach & Logic

### Core Philosophy

CarbonWise follows a **understand → track → reduce** approach:

1. **Understand**: Multi-category carbon calculator estimates your annual footprint based on lifestyle habits across 6 categories (Transport, Food, Energy, Shopping, Digital, Waste)
2. **Track**: Daily activity logger with real-time emission calculations and visual analytics (charts, heatmaps, trends)
3. **Reduce**: AI-style personalized recommendations, "What If" scenarios, and gamified eco-challenges drive behavioral change

### Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CarbonWise SPA                    │
├──────────┬──────────┬───────────┬───────────────────┤
│Dashboard │Calculator│  Logger   │Insights/Challenges│
├──────────┴──────────┴───────────┴───────────────────┤
│              React Components Layer                  │
│   (EcoScoreRing, Charts, Toast, Modal, Onboarding)  │
├─────────────────────────────────────────────────────┤
│               Data & Business Logic                  │
│  (Emission Factors DB, Tips Engine, Storage Layer)   │
├─────────────────────────────────────────────────────┤
│              localStorage Persistence                │
│         (Sanitized, JSON-serialized data)            │
└─────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **Client-side only**: No backend required — all data lives in `localStorage`. This ensures privacy, offline capability, and zero infrastructure costs.
- **React + Vite**: Modern, fast development with hot module replacement. Minimal dependencies for clean, maintainable code.
- **Custom SVG Charts**: Zero external chart library dependencies. All visualizations (bar charts, donut charts, area charts, sparklines, calendar heatmaps) are built with pure SVG.
- **Scientific Emission Factors**: Data sourced from EPA, DEFRA, IEA, and IPCC for accurate CO₂ calculations.
- **Gamification**: Challenges, achievements, XP system, and streaks to drive long-term engagement and behavior change.

---

## 🚀 How the Solution Works

### Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Real-time overview with eco score ring, stat cards with sparklines, category donut chart, weekly trend bar chart, global comparison, and personalized tips |
| 🧮 **Calculator** | Multi-step lifestyle questionnaire covering 5 categories (Transport, Food, Energy, Shopping, Digital) with live running estimate and detailed results with global comparison |
| 📝 **Activity Logger** | Log daily activities with real-time emission calculation, calendar heatmap view, list view grouped by date, category filtering, and delete functionality |
| 💡 **Insights** | 30-day trend analysis, category month-over-month comparison, personalized "What If" scenarios, and AI-style recommendations ranked by impact |
| 💬 **Eco Assistant** | Interactive sustainability chatbot that analyzes your logged emissions, calculates carbon footprints on-the-fly (e.g. "20 km by train"), and suggests actions |
| 🏆 **Challenges** | 10 curated eco-challenges with difficulty levels, XP rewards, progress tracking, and 10 unlockable achievement badges |
| ⚙️ **Settings** | Profile management, dark/light theme toggle, metric/imperial units, data export/import (JSON), and data deletion with confirmation |

### User Flow

```
Onboarding (3 steps) → Dashboard → Log Activities → View Insights → Take Challenges → Achieve Goals
```

1. **First-time users** see a guided 3-step onboarding: welcome, profile setup (name + country), and eco-goal selection
2. **Dashboard** provides an at-a-glance summary with actionable quick-access buttons
3. **Activity Logger** allows daily tracking with per-unit emission calculations from a database of 50+ activity types
4. **Insights** page generates personalized recommendations based on the user's actual patterns
5. **Challenges** gamify the reduction journey with trackable goals and rewards

### Emission Categories & Data Points

| Category | Activities Tracked | Data Source |
|----------|-------------------|-------------|
| 🚗 Transport | 14 modes (car types, bus, train, flight, bicycle, etc.) | EPA, DEFRA |
| 🍽️ Food | 19 items (meats, dairy, plant-based, meal types) | IPCC, DEFRA |
| ⚡ Energy | 7 sources (electricity, gas, LPG, solar, AC) | IEA |
| 🛒 Shopping | 7 items (clothing, electronics, deliveries) | DEFRA |
| 💻 Digital | 6 activities (streaming, calls, social media, gaming) | IEA, Research papers |
| 🗑️ Waste | 4 types (landfill, recycling, composting, food waste) | EPA |

---

## 🛡️ Security & Privacy

- **Zero data transmission**: All data stays on the user's device in `localStorage`
- **Input sanitization**: All user inputs are sanitized using DOM-based escaping to prevent XSS
- **No eval()**: No dynamic code execution anywhere in the codebase
- **No innerHTML with user data**: Safe rendering via React's built-in XSS protection
- **CSP-friendly**: No inline scripts in HTML
- **Safe imports**: Only validated JSON accepted during data import

---

## ♿ Accessibility

- WCAG 2.1 AA color contrast compliance
- Full keyboard navigation support
- ARIA labels on all interactive elements (`aria-label`, `aria-current`, `role`)
- Screen reader-friendly structure with semantic HTML (`nav`, `main`, `header`, `button`)
- `prefers-reduced-motion` media query support for users sensitive to animations
- Unique IDs on all interactive elements for testing
- Proper form labels and `aria-required` attributes

---

## ⚡ Performance & Efficiency

- **Zero external runtime dependencies** beyond React itself
- **Custom SVG charts** instead of heavy chart libraries (saves ~200KB+)
- **Lazy computation** with React `useMemo` for expensive calculations
- **Efficient localStorage** access with caching and batch operations
- **Minimal re-renders** via proper React state management
- **CSS-only animations** with hardware-accelerated transforms
- **Google Fonts preconnect** for faster font loading

---

## 🧪 Testing & Validation

### Manual Testing Checklist

- [x] Onboarding flow completes successfully (3 steps)
- [x] Dashboard displays all stats, charts, and eco score
- [x] Calculator produces accurate results across all categories
- [x] Activity Logger: add, view (list + heatmap), filter, and delete activities
- [x] Insights page shows trends, category analysis, and recommendations
- [x] Challenges: start, track progress, and complete challenges
- [x] Settings: update profile, toggle theme, export/import data, delete data
- [x] Dark/light theme toggle works globally
- [x] Responsive design works on mobile, tablet, desktop
- [x] Keyboard navigation works throughout
- [x] Data persists across page reloads

### Input Validation

- Number inputs clamped to valid ranges (min/max)
- String inputs limited by `maxLength` attribute
- Date inputs restricted to past/present (`max={today}`)
- Empty/invalid submissions show warning toasts
- Import validates JSON structure before applying

---

## 📦 Project Structure

```
├── index.html                    # Entry HTML with SEO meta tags
├── public/
│   └── favicon.svg               # Custom SVG favicon
├── src/
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Main app with routing & state
│   ├── components/
│   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   ├── MobileHeader.jsx      # Mobile responsive header
│   │   ├── Onboarding.jsx        # 3-step onboarding flow
│   │   ├── EcoScoreRing.jsx      # Animated SVG eco score
│   │   ├── Charts.jsx            # BarChart, DonutChart, AreaChart, Sparkline, CalendarHeatmap
│   │   └── ToastContainer.jsx    # Toast notification system
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── Calculator.jsx        # Carbon footprint calculator
│   │   ├── Logger.jsx            # Activity logger
│   │   ├── Insights.jsx          # Insights & recommendations
│   │   ├── Assistant.jsx         # Interactive chatbot & calculator
│   │   ├── Challenges.jsx        # Eco challenges & achievements
│   │   └── Settings.jsx          # Profile & data management
│   ├── data/
│   │   ├── emissionFactors.js    # Emission factors database
│   │   └── tips.js               # Tips, challenges, achievements
│   ├── utils/
│   │   └── storage.js            # localStorage abstraction
│   └── styles/
│       └── index.css             # Complete design system
├── package.json
├── vite.config.js
└── README.md
```

---

## 🏗️ Setup & Running

```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📝 Assumptions

1. **Emission factors** are approximate averages sourced from reputable organizations (EPA, DEFRA, IEA, IPCC). Actual values may vary by region, provider, and time.
2. **Data persistence** uses `localStorage` (typically 5-10MB limit). For production use, a backend database would be recommended.
3. **Calculator estimates** are based on annualized projections from user-provided lifestyle data. They represent approximations, not exact measurements.
4. **"What If" scenarios** use simplified reduction percentages based on research averages.
5. **No user authentication** is implemented since all data is local. Multi-device sync would require a backend.
6. The app targets **modern evergreen browsers** (Chrome, Firefox, Safari, Edge).

---

## 🧰 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI component framework |
| Vite 8 | Build tool & dev server |
| Vanilla CSS | Design system with custom properties |
| SVG | Custom chart visualizations |
| localStorage | Client-side data persistence |
| Google Fonts (Inter) | Typography |

---

## 📄 License

MIT License — Built for Virtual Prompt War Challenge 3
