function SideBar({ isOpen, activePage, onPageChange, onLogOut }) {
  const navItems = [
    { id: "Dashboard", label: "Dashboard", iconKey: "dashboard" },
    { id: "Products", label: "Products", iconKey: "products" },
    { id: "Orders", label: "Orders", iconKey: "orders" },
    { id: "Customers", label: "Customers", iconKey: "customers" },
    { id: "Alerts", label: "Alerts", iconKey: "alerts" },
    { id: "Reports", label: "Reports", iconKey: "reports" },
    { id: "Settings", label: "Settings", iconKey: "settings" },
  ];

  const icons = {
    dashboard: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
      </svg>
    ),
    products: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M3 7v10l9 4 9-4V7" />
        <path d="M12 11v10" />
      </svg>
    ),
    orders: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v5h5" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    ),
    customers: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="8" r="2.5" />
        <path d="M3 20c0-3.3 3-6 6-6s6 2.7 6 6" />
        <path d="M14 20c.4-2.6 2.6-4.5 5.5-4.5" />
      </svg>
    ),
    alerts: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 18h12" />
        <path d="M8 18v-6a4 4 0 0 1 8 0v6" />
        <path d="M10 18a2 2 0 0 0 4 0" />
      </svg>
    ),
    reports: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 19h16" />
        <path d="M7 16V9" />
        <path d="M12 16V5" />
        <path d="M17 16v-7" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1l2-1.2-2-3.5-2.2.8a7 7 0 0 0-1.7-1l-.3-2.3H10l-.3 2.3a7 7 0 0 0-1.7 1l-2.2-.8-2 3.5 2 1.2a7 7 0 0 0 0 2l-2 1.2 2 3.5 2.2-.8a7 7 0 0 0 1.7 1L10 20h4l.3-2.3a7 7 0 0 0 1.7-1l2.2.8 2-3.5-2-1.2c.1-.3.1-.7.1-1z" />
      </svg>
    ),
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="logo">
        <span className="logo-badge" aria-hidden="true">
          <svg className="logo-icon" viewBox="0 0 48 48" role="img">
            <defs>
              <linearGradient id="sh-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <path
              d="M24 4l14 6v12c0 10.5-6.8 19.7-14 22-7.2-2.3-14-11.5-14-22V10l14-6z"
              fill="url(#sh-gradient)"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="1"
            />
            <path
              d="M15 19.5c1.8-3.4 6.3-4.8 10.1-3.2 1.6.7 2.7 1.8 3.4 3.1.6 1.1.3 2.5-.8 3.1-1.1.6-2.5.2-3.1-.9-.4-.7-1-1.2-1.8-1.5-1.7-.7-3.8-.1-4.7 1.3-.6.9-.5 2 .3 2.8l8.4 7.8c1.7 1.6 2.1 4 .9 5.8-1.9 2.9-5.7 4.1-9.1 3-1.8-.6-3.2-1.7-4.1-3.1-.6-1.1-.2-2.5.9-3.1 1.1-.6 2.5-.2 3.1.9.5.8 1.3 1.3 2.2 1.6 1.6.5 3.3.1 4.2-1 .5-.7.4-1.7-.3-2.3l-8.4-7.9c-2.1-2-2.7-5.1-1.3-7.7z"
              transform="translate(1.5 -6)"
              fill="rgba(255,255,255,0.92)"
            />
          </svg>
        </span>
        VigilWear
      </h2>

      <ul>
        {navItems.map((item) => (
          <li
            key={item.id}
            className={activePage === item.id ? "active" : ""}
            onClick={() => onPageChange(item.id)}
          >
            <span className="nav-icon" aria-hidden="true">
              {icons[item.iconKey]}
            </span>
            {item.label}
          </li>
        ))}
        <button className="logout-btn" onClick={onLogOut}>
          Log Out
        </button>
      </ul>
    </aside>
  );
}

export default SideBar;
