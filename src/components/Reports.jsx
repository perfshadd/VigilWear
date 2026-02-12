import { useMemo } from "react";
import "../Styles/Reports.css";

function Reports({ products = [], orders = [], formatCurrency }) {
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;
    const inStock = products.filter((p) => Number(p.stock) > 0).length;
    const outOfStock = products.filter((p) => Number(p.stock) <= 0).length;
    return { totalRevenue, totalOrders, avgOrder, inStock, outOfStock };
  }, [orders, products]);

  const statusBreakdown = useMemo(() => {
    const counts = orders.reduce(
      (acc, o) => {
        const status = o.status || "Pending";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { Pending: 0, Processing: 0, Completed: 0, Cancelled: 0 },
    );
    const max = Math.max(...Object.values(counts), 1);
    const total = Object.values(counts).reduce((sum, v) => sum + v, 0) || 1;
    return { counts, max, total };
  }, [orders]);

  const revenueSeries = useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      if (!o.date) return;
      map.set(o.date, (map.get(o.date) || 0) + Number(o.totalPrice || 0));
    });
    const items = Array.from(map.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .slice(-8);
    if (items.length === 0) {
      return Array.from({ length: 8 }).map((_, i) => ({ date: `Day ${i + 1}`, value: 0 }));
    }
    return items;
  }, [orders]);

  const topProducts = useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      const key = o.productName || o.productId || "Unknown";
      map.set(key, (map.get(key) || 0) + Number(o.totalPrice || 0));
    });
    return Array.from(map.entries())
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, 5);
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
    <div className="reports-page">
      <div className="reports-stats">
        <div className="stat-card">
          <span>Total Revenue</span>
          <strong>{format(stats.totalRevenue)}</strong>
        </div>
        <div className="stat-card">
          <span>Total Orders</span>
          <strong>{stats.totalOrders}</strong>
        </div>
        <div className="stat-card">
          <span>Avg Order</span>
          <strong>{format(stats.avgOrder)}</strong>
        </div>
        <div className="stat-card">
          <span>In Stock</span>
          <strong>{stats.inStock}</strong>
        </div>
        <div className="stat-card">
          <span>Out of Stock</span>
          <strong>{stats.outOfStock}</strong>
        </div>
      </div>

      <div className="reports-grid">
        <section className="report-card">
          <h3>Revenue Trend</h3>
          <svg className="bar-chart" viewBox="0 0 300 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="reportBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7f5aff" />
                <stop offset="100%" stopColor="#4cc9f0" />
              </linearGradient>
            </defs>
            {revenueSeries.map((d, i) => {
              const barWidth = 280 / (revenueSeries.length || 1);
              const gap = 8;
              const actualWidth = Math.max(10, barWidth - gap);
              const x = 10 + i * barWidth + gap / 2;
              const height = (d.value / maxRevenue) * 90;
              const y = 110 - height;
              return (
                <rect
                  key={d.date}
                  className="bar-rect"
                  x={x}
                  y={y}
                  width={actualWidth}
                  height={height}
                  rx="6"
                  fill="url(#reportBar)"
                >
                  <title>{`${d.date}: ${format(d.value)}`}</title>
                </rect>
              );
            })}
          </svg>
          <div className="chart-labels">
            {revenueSeries.map((d) => (
              <span key={d.date}>{d.date}</span>
            ))}
          </div>
        </section>

        <section className="report-card">
          <h3>Status Breakdown</h3>
          <div className="status-stack" role="img" aria-label="Order status breakdown">
            {donutSegments.map((seg, idx) => (
              <span
                key={seg.label}
                className={`seg-${idx}`}
                style={{ width: `${seg.percent}%` }}
                title={`${seg.label}: ${seg.count}`}
              />
            ))}
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
        </section>

        <section className="report-card">
          <h3>Orders by Status</h3>
          <div className="meter-grid">
            {Object.entries(statusBreakdown.counts).map(([status, count], idx) => (
              <div key={status} className={`meter-card seg-${idx}`}>
                <div
                  className="meter-ring"
                  style={{ "--percent": `${(count / statusBreakdown.total) * 100}%` }}
                >
                  <strong>{count}</strong>
                </div>
                <span>{status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="report-card">
          <h3>Top Products</h3>
          <div className="list">
            {topProducts.length === 0 && <p className="muted">No sales data yet.</p>}
            {topProducts.map((item) => (
              <div key={item.name} className="list-row">
                <span>{item.name}</span>
                <strong>{format(item.revenue)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="report-card">
          <h3>Recent Orders</h3>
          <div className="list">
            {recentOrders.length === 0 && <p className="muted">No recent orders.</p>}
            {recentOrders.map((order) => (
              <div key={order.id} className="list-row">
                <span>{order.productName}</span>
                <strong>{format(order.totalPrice)}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;
