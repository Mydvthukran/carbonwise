
export default function Sidebar({
  currentPage,
  onNavigate,
  pages,
  isOpen,
  theme,
  onThemeToggle,
}) {
  return (
    <aside
      className={`sidebar ${isOpen ? 'open' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" aria-hidden="true">
          🌿
        </div>
        <h1>CarbonWise</h1>
      </div>

      <nav className="sidebar-nav">
        {Object.entries(pages).map(([key, page]) => (
          <button
            key={key}
            id={`nav-${key}`}
            className={`sidebar-nav-item ${currentPage === key ? 'active' : ''}`}
            onClick={() => onNavigate(key)}
            aria-current={currentPage === key ? 'page' : undefined}
            aria-label={`Navigate to ${page.label}`}
          >
            <span className="nav-icon" aria-hidden="true">
              {page.icon}
            </span>
            <span className="nav-label">{page.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-nav-item"
          onClick={onThemeToggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          id="theme-toggle"
        >
          <span className="nav-icon" aria-hidden="true">
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>
          <span className="nav-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  )
}
