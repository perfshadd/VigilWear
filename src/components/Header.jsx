function Header({ onToggle, isOpen }) {
  return (
    <header className="header">
      <button className={`menu-btn ${isOpen ? "active" : ""}`} onClick={onToggle}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}

export default Header;
