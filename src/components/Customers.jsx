import { useMemo, useState } from "react";
import { customersData } from "../data/customersData.js";
import "../Styles/Customers.css";

function Customers({ formatCurrency }) {
  const [customers, setCustomers] = useState(customersData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    status: "Active",
    joined: "",
    totalOrders: 0,
    totalSpend: 0,
    lastOrderDate: "",
    notes: "",
  });

  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === "Active").length;
    const vip = customers.filter((c) => c.status === "VIP").length;
    const totalSpend = customers.reduce((sum, c) => sum + Number(c.totalSpend || 0), 0);
    return { total, active, vip, totalSpend };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      id: "",
      name: "",
      email: "",
      phone: "",
      status: "Active",
      joined: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpend: 0,
      lastOrderDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setShowForm(true);
  };

  const openEdit = (customer) => {
    setEditingId(customer.id);
    setFormData(customer);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingId ? { ...formData, id: editingId } : c))
      );
    } else {
      const nextId = `CUST-${String(customers.length + 1).padStart(3, "0")}`;
      setCustomers((prev) => [...prev, { ...formData, id: nextId }]);
    }

    setShowForm(false);
  };

  const deleteCustomer = (id) => {
    if (window.confirm("Delete this customer?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
    }
  };

  const toggleStatus = (customer) => {
    const newStatus = customer.status === "Inactive" ? "Active" : "Inactive";
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div className="customers-stats">
          <div className="stat-card">
            <span>Total</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card">
            <span>Active</span>
            <strong>{stats.active}</strong>
          </div>
          <div className="stat-card">
            <span>VIP</span>
            <strong>{stats.vip}</strong>
          </div>
          <div className="stat-card">
            <span>Total Spend</span>
            <strong>
              {formatCurrency
                ? formatCurrency(stats.totalSpend)
                : stats.totalSpend.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="customers-actions">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="VIP">VIP</option>
            <option value="Risk">Risk</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="add-btn" onClick={openAdd}>
            Add Customer +
          </button>
        </div>
      </div>

      <div className="customers-grid">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <div className="customer-card-header">
              <div>
                <h3>{customer.name}</h3>
                <p>{customer.email}</p>
              </div>
              <span className={`status ${customer.status.toLowerCase()}`}>
                {customer.status}
              </span>
            </div>

            <div className="customer-info">
              <p><strong>ID:</strong> {customer.id}</p>
              <p><strong>Phone:</strong> {customer.phone}</p>
              <p><strong>Orders:</strong> {customer.totalOrders}</p>
              <p><strong>Spend:</strong> {formatCurrency ? formatCurrency(customer.totalSpend) : customer.totalSpend}</p>
              <p><strong>Last Order:</strong> {customer.lastOrderDate}</p>
            </div>

            <div className="customer-actions">
              <button onClick={() => setSelectedCustomer(customer)}>View</button>
              <button onClick={() => openEdit(customer)}>Edit</button>
              <button onClick={() => toggleStatus(customer)}>
                {customer.status === "Inactive" ? "Activate" : "Block"}
              </button>
              <button className="danger" onClick={() => deleteCustomer(customer.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="customers-modal-overlay">
          <div className="customers-modal">
            <h3>{editingId ? "Edit Customer" : "Add Customer"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Name</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Phone</label>
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                  <option value="Risk">Risk</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="field">
                <label>Joined</label>
                <input
                  type="date"
                  value={formData.joined}
                  onChange={(e) => setFormData({ ...formData, joined: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Total Orders</label>
                <input
                  type="number"
                  value={formData.totalOrders}
                  onChange={(e) => setFormData({ ...formData, totalOrders: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Total Spend</label>
                <input
                  type="number"
                  value={formData.totalSpend}
                  onChange={(e) => setFormData({ ...formData, totalSpend: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Last Order Date</label>
                <input
                  type="date"
                  value={formData.lastOrderDate}
                  onChange={(e) => setFormData({ ...formData, lastOrderDate: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingId ? "Update" : "Add"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div className="customers-modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="customer-drawer" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedCustomer.name}</h3>
            <p><strong>Email:</strong> {selectedCustomer.email}</p>
            <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
            <p><strong>Status:</strong> {selectedCustomer.status}</p>
            <p><strong>Joined:</strong> {selectedCustomer.joined}</p>
            <p><strong>Total Orders:</strong> {selectedCustomer.totalOrders}</p>
            <p><strong>Total Spend:</strong> {formatCurrency ? formatCurrency(selectedCustomer.totalSpend) : selectedCustomer.totalSpend}</p>
            <p><strong>Last Order:</strong> {selectedCustomer.lastOrderDate}</p>
            <p><strong>Notes:</strong> {selectedCustomer.notes}</p>
            <button onClick={() => setSelectedCustomer(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
