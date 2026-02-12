import { useMemo } from "react";
import "../Styles/Dashboard.css";

function Dashboard({ products = [], orders = [], formatCurrency }) {
  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const avgOrder = totalOrders ? revenue / totalOrders : 0;
    const lowStock = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 2).length;
    const outOfStock = products.filter((p) => Number(p.stock) <= 0).length;
    const inStock = products.filter((p) => Number(p.stock) > 2).length;
    const activeAlerts = products.reduce((sum, p) => sum + Number(p.alerts || 0), 0);
    return { revenue, totalOrders, avgOrder, lowStock, outOfStock, inStock, activeAlerts };
  }, [orders, products]);

  const revenueSeries = useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      if (!o.date) return;
      map.set(o.date, (map.get(o.date) || 0) + Number(o.totalPrice || 0));
    });
    const items = Array.from(map.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .slice(-7);
    if (items.length === 0) {
      return Array.from({ length: 7 }).map((_, i) => ({ date: `Day ${i + 1}`, value: 0 }));
    }
    return items;
  }, [orders]);

  const statusBreakdown = useMemo(() => {
    const counts = orders.reduce(
      (acc, o) => {
        const status = o.status || "Pending";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { Pending: 0, Processing: 0, Completed: 0, Cancelled: 0 },
    );
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return { counts, total };
  }, [orders]);

  const format = (value) => (formatCurrency ? formatCurrency(value) : value);

  const maxRevenue = Math.max(...revenueSeries.map((d) => d.value), 1);
  const points = revenueSeries
    .map((d, i) => {
      const x = (i / (revenueSeries.length - 1 || 1)) * 280 + 10;
      const y = 110 - (d.value / maxRevenue) * 90;
      return `${x},${y}`;
    })
    .join(" ");

  const donutSegments = Object.entries(statusBreakdown.counts).map(([label, count], index) => {
    const percent = (count / statusBreakdown.total) * 100;
    return { label, count, percent, index };
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-stats">
        <div className="stat-card primary">
          <span>Total Revenue</span>
          <strong>{format(stats.revenue)}</strong>
          <p>Avg order {format(stats.avgOrder)}</p>
        </div>
        <div className="stat-card">
          <span>Total Orders</span>
          <strong>{stats.totalOrders}</strong>
          <p>Active alerts {stats.activeAlerts}</p>
        </div>
        <div className="stat-card accent">
          <span>Low Stock</span>
          <strong>{stats.lowStock}</strong>
          <p>Out of stock {stats.outOfStock}</p>
        </div>
        <div className="stat-card highlight">
          <span>Devices Online</span>
          <strong>{products.length - stats.outOfStock}</strong>
          <p>Active catalog {products.length}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h3>Revenue Trend</h3>
          <svg className="line-chart" viewBox="0 0 300 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7f5aff" />
                <stop offset="100%" stopColor="#4cc9f0" />
              </linearGradient>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(127, 90, 255, 0.4)" />
                <stop offset="100%" stopColor="rgba(127, 90, 255, 0)" />
              </linearGradient>
            </defs>
            <g className="chart-grid">
              <line x1="10" y1="20" x2="290" y2="20" />
              <line x1="10" y1="50" x2="290" y2="50" />
              <line x1="10" y1="80" x2="290" y2="80" />
              <line x1="10" y1="110" x2="290" y2="110" />
            </g>
            <polyline
              points={`${points} 290,110 10,110`}
              fill="url(#areaFill)"
              stroke="none"
              className="line-area"
            />
            <polyline
              points={points}
              fill="none"
              stroke="url(#lineGlow)"
              strokeWidth="3"
              strokeLinecap="round"
              className="line-path"
            />
            <g className="chart-dots">
              {revenueSeries.map((d, i) => {
                const x = (i / (revenueSeries.length - 1 || 1)) * 280 + 10;
                const y = 110 - (d.value / maxRevenue) * 90;
                return (
                  <circle key={d.date} cx={x} cy={y} r="4" className="chart-dot">
                    <title>{`${d.date}: ${format(d.value)}`}</title>
                  </circle>
                );
              })}
            </g>
          </svg>
          <div className="chart-labels">
            {revenueSeries.map((d) => (
              <span key={d.date}>{d.date}</span>
            ))}
          </div>
        </section>

        <section className="dashboard-card">
          <h3>Order Status</h3>
          <div className="donut">
            <svg viewBox="0 0 120 120">
              {donutSegments.reduce(
                (acc, seg, idx) => {
                  const radius = 46;
                  const circumference = 2 * Math.PI * radius;
                  const offset = acc.offset;
                  const dash = (seg.percent / 100) * circumference;
                  acc.elements.push(
                    <circle
                      key={seg.label}
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      strokeWidth="12"
                      strokeDasharray={`${dash} ${circumference - dash}`}
                      strokeDashoffset={-offset}
                      className={`donut-segment seg-${idx}`}
                    />,
                  );
                  acc.offset += dash;
                  return acc;
                },
                { elements: [], offset: 0 },
              ).elements}
            </svg>
            <div className="donut-center">
              <strong>{stats.totalOrders}</strong>
              <span>Orders</span>
            </div>
          </div>
          <div className="legend">
            {donutSegments.map((seg, idx) => (
              <div key={seg.label} className="legend-item">
                <span className={`dot seg-${idx}`} />
                <span>{seg.label}</span>
                <strong>{seg.count}</strong>
              </div>
            ))}
          </div>
          <div className="status-bar" aria-hidden="true">
            {donutSegments.map((seg, idx) => (
              <span
                key={seg.label}
                className={`seg-${idx}`}
                style={{ width: `${seg.percent}%` }}
              />
            ))}
          </div>
        </section>

        <section className="dashboard-card">
          <h3>Inventory Health</h3>
          <div className="bar-row">
            <span>In Stock</span>
            <div className="bar">
              <span style={{ width: `${(stats.inStock / (products.length || 1)) * 100}%` }} />
            </div>
            <strong>{stats.inStock}</strong>
          </div>
          <div className="bar-row">
            <span>Low Stock</span>
            <div className="bar warning">
              <span style={{ width: `${(stats.lowStock / (products.length || 1)) * 100}%` }} />
            </div>
            <strong>{stats.lowStock}</strong>
          </div>
          <div className="bar-row">
            <span>Out of Stock</span>
            <div className="bar danger">
              <span style={{ width: `${(stats.outOfStock / (products.length || 1)) * 100}%` }} />
            </div>
            <strong>{stats.outOfStock}</strong>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
