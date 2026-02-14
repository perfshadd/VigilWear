import { useState } from "react";
import "../Styles/Order.css";

function Orders({ orders, setOrders, products, setProducts, formatCurrency }) {
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    customerName: "",
    productId: "",
    productName: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    status: "Pending",
    date: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    if (name === "productId") {
      const selected = products.find(
        (item) => String(item.id) === String(value)
      );
      if (selected) {
        updated.productId = selected.id;
        updated.productName = selected.name;
        updated.unitPrice = Number(selected.price);
        updated.totalPrice = Number(
          (Number(updated.quantity) * Number(selected.price)).toFixed(2)
        );
      }
    }

    if (name === "quantity" || name === "unitPrice") {
      const qty = Number(name === "quantity" ? value : updated.quantity);
      const unit = Number(name === "unitPrice" ? value : updated.unitPrice);
      updated.totalPrice = Number((qty * unit).toFixed(2));
    }

    setFormData(updated);
  };

  const getNextOrderId = (currentOrders) => {
    const nextNum = currentOrders.length + 1;
    return `ORD-${String(nextNum).padStart(3, "0")}`;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.productId) {
      window.alert("Please select a product.");
      return;
    }

    const selectedProduct = products.find(
      (item) => String(item.id) === String(formData.productId)
    );

    if (!selectedProduct) {
      window.alert("Selected product not found.");
      return;
    }

    if (editingOrder) {
      const prevOrder = orders.find((order) => order.id === editingOrder);
      if (!prevOrder) return;

      const newQty = Number(formData.quantity);
      const prevQty = Number(prevOrder.quantity);
      const newProductId = String(formData.productId);
      const prevProductId = String(prevOrder.productId);

      const prevProduct = products.find(
        (item) => String(item.id) === prevProductId
      );

      const restoredStock = newProductId === prevProductId ? prevQty : 0;
      const availableStock = Number(selectedProduct.stock) + restoredStock;

      if (newQty > availableStock) {
        window.alert("Not enough stock for this quantity.");
        return;
      }

      setProducts((prev) =>
        prev.map((item) => {
          if (String(item.id) === prevProductId) {
            return { ...item, stock: Number(item.stock) + prevQty };
          }
          if (String(item.id) === newProductId) {
            return { ...item, stock: Number(item.stock) - newQty };
          }
          return item;
        })
      );

      setOrders(
        orders.map((order) =>
          order.id === editingOrder
            ? {
                ...formData,
                id: editingOrder,
                quantity: Number(formData.quantity),
                unitPrice: Number(formData.unitPrice),
                totalPrice: Number(formData.totalPrice),
              }
            : order
        )
      );
      setEditingOrder(null);
    } else {
      const newQty = Number(formData.quantity);
      if (newQty > Number(selectedProduct.stock)) {
        window.alert("Not enough stock for this quantity.");
        return;
      }

      setProducts((prev) =>
        prev.map((item) =>
          String(item.id) === String(formData.productId)
            ? { ...item, stock: Number(item.stock) - newQty }
            : item
        )
      );

      const newOrder = {
        ...formData,
        id: getNextOrderId(orders),
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
        totalPrice: Number(formData.totalPrice),
      };
      setOrders([...orders, newOrder]);
    }

    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: "",
      customerName: "",
      productId: "",
      productName: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const openAddForm = () => {
    setEditingOrder(null);
    resetForm();
    setShowForm(true);
  };

  const openEditOrder = (order) => {
    setEditingOrder(order.id);
    const unit = Number(order.unitPrice ?? order.totalPrice / order.quantity);
    setFormData({
      ...order,
      unitPrice: unit,
      totalPrice: Number((unit * Number(order.quantity)).toFixed(2)),
    });
    setShowForm(true);
  };

  const deleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter((order) => order.id !== orderId));
    }
  };

  return (
    <>
      <div className="orders-page">
        <button className="add-btn" onClick={openAddForm}>
          Add New Order
        </button>

        <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>{order.id}</h3>
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <div className="order-details">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Product:</strong> {order.productName}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Total:</strong> {formatCurrency ? formatCurrency(order.totalPrice) : order.totalPrice}</p>
              <p><strong>Date:</strong> {order.date}</p>
            </div>

            <div className="order-actions">
              <button
                className="edit-btn"
                onClick={() => openEditOrder(order)}
              >
                ✏️ Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteOrder(order.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingOrder ? "Edit Order" : "Add New Order"}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="field">
                <label>Customer Name:</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="field">
                <label>Product:</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">
                    {formData.productName ? formData.productName : "Select product"}
                  </option>
                  {products
                    .filter(
                      (item) =>
                        Number(item.stock) > 0 ||
                        String(item.id) === String(formData.productId)
                    )
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="field">
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="field">
                <label>Unit Price:</label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="field">
                <label>Total Price:</label>
                <input
                  type="number"
                  name="totalPrice"
                  value={formData.totalPrice}
                  readOnly
                />
              </div>

              <div className="field">
                <label>Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingOrder ? "Update Order" : "Add Order"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;