import { useState } from "react";
const productImages = Array.from(
  { length: 21 },
  (_, i) => `/src/assets/Products-images/${i + 1}.png`,
);

function Products({ products, setProducts, onAddToCart, formatCurrency }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    battery: "",
    status: "",
    alerts: 0,
    lastSync: "",
    stock: 0,
    active: "",
    price: 0,
    imageUrl: "",
  });

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "imageFile") {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setFormData({ ...formData, imageUrl: previewUrl });
      }
      return;
    }
    if (e.target.name === "active") {
      value = value === "true" ? true : false;
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (editingProduct) {
      setProducts(
        products.map((item) =>
          item.id === editingProduct
            ? {
                ...item,
                name: formData.name,
                category: formData.category,
                battery: formData.battery,
                status: formData.status,
                alerts: formData.alerts,
                lastSync: formData.lastSync,
                stock: formData.stock,
                active: formData.active,
                price: formData.price,
                imageUrl: formData.imageUrl,
              }
            : item,
        ),
      );
    } else {
      const newProduct = {
        id: formData.id,
        name: formData.name,
        category: formData.category,
        battery: formData.battery,
        status: formData.status,
        alerts: formData.alerts,
        lastSync: formData.lastSync,
        stock: formData.stock,
        active: formData.active,
        price: formData.price,
        imageUrl: formData.imageUrl,
      };
      setProducts([...products, newProduct]);
    }

    closeForm();
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData({
      id: "",
      name: "",
      category: "",
      battery: "",
      status: "",
      alerts: 0,
      lastSync: "",
      stock: 0,
      active: "",
      price: 0,
      imageUrl: "",
    });
    setShowForm(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product.id);
    setFormData(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>

            <form onSubmit={handleFormSubmit}>
              <div className="form-field upload-field">
                <label>Upload Photo:</label>
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="upload-preview"
                  />
                )}
              </div>

              <div className="form-group">
                <div className="form-field">
                  <label>Product ID:</label>
                  <input
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="Product ID"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Name:</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Category:</label>
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Battery:</label>
                  <input
                    name="battery"
                    value={formData.battery}
                    onChange={handleInputChange}
                    placeholder="Battery"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Status:</label>
                  <input
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    placeholder="Status"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Alerts:</label>
                  <input
                    type="number"
                    name="alerts"
                    value={formData.alerts}
                    onChange={handleInputChange}
                    placeholder="Alerts"
                  />
                </div>

                <div className="form-field">
                  <label>Last Sync:</label>
                  <input
                    name="lastSync"
                    value={formData.lastSync}
                    onChange={handleInputChange}
                    placeholder="Last Sync"
                  />
                </div>

                <div className="form-field">
                  <label>Price (SAR):</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Stock:</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="Stock"
                  />
                </div>

                <div className="form-field">
                  <label>Active:</label>
                  <select
                    name="active"
                    value={formData.active}
                    onChange={handleInputChange}
                  >
                    <option value="">Select status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>

                <button type="submit">
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button type="button" onClick={closeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-page">
        <button className="add-btn" onClick={openAddForm}>
          Add Product +
        </button>

        {/* ====== CARDS VIEW (بدل الجدول) ====== */}
        <div className="products-grid">
          {products.map((item) => (
            <div key={item.id} className="product-card">
              {/* صورة المنتج */}
              <img
                src={item.imageUrl || productImages[item.imageId % productImages.length]}
                alt={item.name}
              />
              <p>{item.id}</p>
              <h3>{item.name}</h3>
              <p>{item.category}</p>
              <p className="price">
                {formatCurrency ? formatCurrency(item.price) : item.price}
              </p>

              <p>🔋 {item.battery}</p>
              <p>{item.status}</p>

              <p>Alerts: {item.alerts}</p>
              <p>{item.lastSync}</p>

              <div className={item.stock > 0 ? "in-stock" : "out-of-stock"}>
                {item.stock > 0 ? "Stock: " + item.stock : "Out Of Stock"}
              </div>

              <div className={item.active ? "active" : "inactive"}>
                {item.active ? "Active" : " Inactive"}
              </div>

              <div className="actions">
                <button onClick={() => openEditProduct(item)}>Edit</button>
                <button onClick={() => deleteProduct(item.id)}>Delete</button>
              </div>
              <button 
                className="add-cart-btn" 
                type="button" 
                disabled={item.stock <= 0}
                onClick={() => onAddToCart && onAddToCart(item)}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;
