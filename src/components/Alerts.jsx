import { useMemo, useState } from "react";
import "../Styles/Alerts.css";

const buildAlerts = (products) => {
  const alerts = [];

  const parseBattery = (battery) => {
    const num = Number(String(battery || "").replace("%", ""));
    return Number.isNaN(num) ? null : num;
  };

  const parseLastSyncMinutes = (lastSync) => {
    const value = String(lastSync || "").toLowerCase();
    const match = value.match(/(\d+)\s*(min|mins|minute|minutes|hr|hrs|hour|hours|day|days)/);
    if (!match) return null;
    const amount = Number(match[1]);
    const unit = match[2];
    if (unit.startsWith("hr")) return amount * 60;
    if (unit.startsWith("day")) return amount * 1440;
    return amount;
  };

  products.forEach((product) => {
    const battery = parseBattery(product.battery);
    const lastSyncMin = parseLastSyncMinutes(product.lastSync);

    if (product.stock === 0) {
      alerts.push({
        id: `${product.id}-out-of-stock`,
        productId: product.id,
        productName: product.name,
        type: "Out of stock",
        severity: "critical",
        detail: "No inventory available",
        time: product.lastSync,
      });
    } else if (product.stock <= 2) {
      alerts.push({
        id: `${product.id}-low-stock`,
        productId: product.id,
        productName: product.name,
        type: "Low stock",
        severity: "warning",
        detail: `Only ${product.stock} left`,
        time: product.lastSync,
      });
    }

    if (battery !== null && battery <= 15) {
      alerts.push({
        id: `${product.id}-battery-low`,
        productId: product.id,
        productName: product.name,
        type: "Battery low",
        severity: "critical",
        detail: `Battery at ${battery}%`,
        time: product.lastSync,
      });
    }

    if (product.status && product.status !== "Connected") {
      alerts.push({
        id: `${product.id}-disconnected`,
        productId: product.id,
        productName: product.name,
        type: "Disconnected",
        severity: "critical",
        detail: "Device is offline",
        time: product.lastSync,
      });
    }

    if (Number(product.alerts) > 0) {
      alerts.push({
        id: `${product.id}-alerts`,
        productId: product.id,
        productName: product.name,
        type: "Active alerts",
        severity: Number(product.alerts) > 2 ? "critical" : "warning",
        detail: `${product.alerts} active alerts`,
        time: product.lastSync,
      });
    }

    if (lastSyncMin !== null && lastSyncMin > 30) {
      alerts.push({
        id: `${product.id}-stale`,
        productId: product.id,
        productName: product.name,
        type: "Sync delayed",
        severity: "warning",
        detail: `Last sync ${product.lastSync}`,
        time: product.lastSync,
      });
    }
  });

  return alerts;
};

function Alerts({ products }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [showSnoozed, setShowSnoozed] = useState(false);
  const [snoozedIds, setSnoozedIds] = useState(new Set());
  const [resolvedIds, setResolvedIds] = useState(new Set());

  const baseAlerts = useMemo(() => buildAlerts(products || []), [products]);

  const filteredAlerts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return baseAlerts.filter((alert) => {
      if (resolvedIds.has(alert.id)) return false;
      if (!showSnoozed && snoozedIds.has(alert.id)) return false;

      const matchesSearch =
        alert.productName.toLowerCase().includes(term) ||
        alert.type.toLowerCase().includes(term) ||
        alert.detail.toLowerCase().includes(term);

      const matchesType = typeFilter === "All" || alert.type === typeFilter;
      const matchesSeverity =
        severityFilter === "All" || alert.severity === severityFilter;

      return matchesSearch && matchesType && matchesSeverity;
    });
  }, [baseAlerts, search, typeFilter, severityFilter, showSnoozed, snoozedIds, resolvedIds]);

  const stats = useMemo(() => {
    const unresolved = baseAlerts.filter((alert) => !resolvedIds.has(alert.id));
    const total = unresolved.length;
    const critical = unresolved.filter((a) => a.severity === "critical").length;
    const warning = unresolved.filter((a) => a.severity === "warning").length;
    const snoozed = unresolved.filter((a) => snoozedIds.has(a.id)).length;
    return { total, critical, warning, snoozed };
  }, [baseAlerts, snoozedIds, resolvedIds]);

  const acknowledgeAlert = (id) => {
    setResolvedIds((prev) => new Set(prev).add(id));
  };

  const toggleSnooze = (id) => {
    setSnoozedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const acknowledgeAll = () => {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      filteredAlerts.forEach((alert) => next.add(alert.id));
      return next;
    });
  };

  return (
    <div className="alerts-page">
      <div className="alerts-header">
        <div className="alerts-stats">
          <div className="stat-card">
            <span>Total Alerts</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card danger">
            <span>Critical</span>
            <strong>{stats.critical}</strong>
          </div>
          <div className="stat-card warning">
            <span>Warning</span>
            <strong>{stats.warning}</strong>
          </div>
          <div className="stat-card">
            <span>Snoozed</span>
            <strong>{stats.snoozed}</strong>
          </div>
        </div>

        <div className="alerts-actions">
          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Out of stock">Out of stock</option>
            <option value="Low stock">Low stock</option>
            <option value="Battery low">Battery low</option>
            <option value="Disconnected">Disconnected</option>
            <option value="Active alerts">Active alerts</option>
            <option value="Sync delayed">Sync delayed</option>
          </select>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="All">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
          </select>
          <label className="toggle-pill">
            <input
              type="checkbox"
              checked={showSnoozed}
              onChange={(e) => setShowSnoozed(e.target.checked)}
            />
            <span>Show Snoozed</span>
          </label>
          <button className="bulk-btn" onClick={acknowledgeAll}>Acknowledge All</button>
        </div>
      </div>

      <div className="alerts-grid">
        {filteredAlerts.length === 0 && (
          <div className="empty-state">All clear. No alerts to show.</div>
        )}

        {filteredAlerts.map((alert) => (
          <div key={alert.id} className={`alert-card ${alert.severity}`}>
            <div className="alert-top">
              <div>
                <h3>{alert.productName}</h3>
                <p>{alert.type}</p>
              </div>
              <span className={`badge ${alert.severity}`}>{alert.severity}</span>
            </div>
            <div className="alert-body">
              <p>{alert.detail}</p>
              <small>Last sync: {alert.time}</small>
            </div>
            <div className="alert-actions">
              <button onClick={() => acknowledgeAlert(alert.id)}>Acknowledge</button>
              <button onClick={() => toggleSnooze(alert.id)}>
                {snoozedIds.has(alert.id) ? "Unsnooze" : "Snooze"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;
