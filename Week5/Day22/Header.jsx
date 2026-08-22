/**
 * Header takes three props and doesn't reach outside of them for anything —
 * it doesn't know it's being used for a "team" page specifically, which is
 * exactly what makes it reusable. Drop it onto a different page with a
 * different title, subtitle, and count, and it works without modification.
 */
function Header({ title, subtitle, memberCount }) {
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <span className="site-header__mark" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 20L10 4H14L20 20M7 14H17"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="site-header__name">Northlight</span>
      </div>

      <div className="site-header__titleblock">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="site-header__stat">
        <span className="site-header__stat-number">{memberCount}</span>
        <span className="site-header__stat-label">
          {memberCount === 1 ? "person" : "people"} on the team
        </span>
      </div>
    </header>
  );
}

export default Header;
