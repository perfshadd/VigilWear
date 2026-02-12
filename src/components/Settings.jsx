import { useState } from "react";
import "../Styles/Settings.css";

function Settings({ theme, onToggleTheme, onLogOut, currency, onCurrencyChange }) {
  const [profile, setProfile] = useState({
    fullName: "Shahad Alotaibi",
    email: "shahad@mail.com",
    phone: "+966 5X XXX XXXX",
    company: "Alfa5men",
  });

  const [preferences, setPreferences] = useState({
    compactMode: false,
    language: "English",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    autoLogout: true,
  });

  return (
    <div className="settings-page">
      <div className="settings-grid">
        <section className="settings-card">
          <h3>Profile</h3>
          <div className="form-row">
            <label>Full Name</label>
            <input
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Phone</label>
            <input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Company</label>
            <input
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            />
          </div>
          <div className="actions">
            <button className="primary">Save Profile</button>
            <button className="ghost">Reset</button>
          </div>
        </section>

        <section className="settings-card">
          <h3>Security</h3>
          <div className="toggle-row">
            <div>
              <h4>Two-Factor Authentication</h4>
              <p>Secure your account with 2FA.</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={security.twoFactor}
                onChange={(e) =>
                  setSecurity({ ...security, twoFactor: e.target.checked })
                }
              />
              <span className="slider" />
            </label>
          </div>
          <div className="toggle-row">
            <div>
              <h4>Auto Logout</h4>
              <p>Sign out after inactivity.</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={security.autoLogout}
                onChange={(e) =>
                  setSecurity({ ...security, autoLogout: e.target.checked })
                }
              />
              <span className="slider" />
            </label>
          </div>
          <div className="actions">
            <button className="primary">Update Security</button>
            <button className="ghost">Reset</button>
          </div>
        </section>

        <section className="settings-card">
          <h3>Preferences</h3>
          <div className="toggle-row">
            <div>
              <h4>Dark Mode</h4>
              <p>Toggle theme preference.</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={onToggleTheme}
              />
              <span className="slider" />
            </label>
          </div>
          <div className="toggle-row">
            <div>
              <h4>Compact Layout</h4>
              <p>Reduce spacing for dense views.</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={preferences.compactMode}
                onChange={(e) =>
                  setPreferences({ ...preferences, compactMode: e.target.checked })
                }
              />
              <span className="slider" />
            </label>
          </div>
          <div className="form-row">
            <label>Language</label>
            <select
              value={preferences.language}
              onChange={(e) =>
                setPreferences({ ...preferences, language: e.target.value })
              }
            >
              <option>English</option>
              <option>Arabic</option>
              <option>French</option>
            </select>
          </div>
          <div className="form-row">
            <label>Currency</label>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
            >
              <option>SAR</option>
              <option>USD</option>
              <option>EUR</option>
            </select>
          </div>
          <div className="actions">
            <button className="primary">Save Preferences</button>
            <button className="ghost">Reset</button>
          </div>
        </section>

        <section className="settings-card">
          <h3>Notifications</h3>
          <div className="toggle-row">
            <div>
              <h4>Email Alerts</h4>
              <p>Order updates and weekly reports.</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({ ...notifications, email: e.target.checked })
                }
              />
              <span className="slider" />
            </label>
          </div>
          <div className="toggle-row">
            <div>
              <h4>SMS Alerts</h4>
              <p>Critical incidents and delivery status.</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) =>
                  setNotifications({ ...notifications, sms: e.target.checked })
                }
              />
              <span className="slider" />
            </label>
          </div>
          <div className="toggle-row">
            <div>
              <h4>Push Notifications</h4>
              <p>Live dashboard updates.</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) =>
                  setNotifications({ ...notifications, push: e.target.checked })
                }
              />
              <span className="slider" />
            </label>
          </div>
          <div className="actions">
            <button className="primary">Save Notifications</button>
            <button className="ghost">Reset</button>
          </div>
        </section>

        <section className="settings-card">
          <h3>System</h3>
          <div className="info-row">
            <span>Plan</span>
            <strong>Premium</strong>
          </div>
          <div className="info-row">
            <span>Storage</span>
            <strong>72% used</strong>
          </div>
          <div className="info-row">
            <span>Version</span>
            <strong>v2.6.0</strong>
          </div>
          <div className="actions">
            <button className="primary">Check Updates</button>
            <button className="danger" onClick={onLogOut}>Log Out</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
