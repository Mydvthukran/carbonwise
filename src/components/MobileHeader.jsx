
export default function MobileHeader({ onMenuClick }) {
  return (
    <header className="mobile-header" role="banner">
      <button
        className="hamburger-btn"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        id="mobile-menu-btn"
      >
        ☰
      </button>
      <span className="mobile-header-title">CarbonWise</span>
      <div style={{ width: 40 }} aria-hidden="true" />
    </header>
  )
}
