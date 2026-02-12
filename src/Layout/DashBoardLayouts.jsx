import SideBar from "../components/SideBar";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import { useState } from "react";
import { productData } from "../data/data.js";
import { ordersData } from "../data/ordersData.js";
import "../styles/sidebar.css";
import "../styles/Products.css";
import { useNavigate } from "react-router-dom"


function DashBoardLayouts() {
  const [showSideBar, setShowSideBar] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [theme, setTheme] = useState("dark");
  const [currency, setCurrency] = useState("SAR");
  const [products, setProducts] = useState(productData);
  const [orders, setOrders] = useState(ordersData);
  const navigate = useNavigate();

  const handleLogOut = () => {
    navigate("/login"); 
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const getNextOrderId = (currentOrders) => {
    const nextNum = currentOrders.length + 1;
    return `ORD-${String(nextNum).padStart(3, "0")}`;
  };

  const handleAddToCart = (product) => {
    if (!product || product.stock <= 0) return;

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? { ...item, stock: Math.max(0, item.stock - 1) }
          : item,
      ),
    );

    setOrders((prev) => {
      const existing = prev.find((order) => order.productId === product.id);

      if (existing) {
        const updated = prev.map((order) =>
          order.productId === product.id
            ? {
                ...order,
                quantity: Number(order.quantity) + 1,
                unitPrice: Number(order.unitPrice ?? product.price),
                totalPrice:
                  (Number(order.unitPrice ?? product.price)) *
                  (Number(order.quantity) + 1),
              }
            : order,
        );
        return updated;
      }

      return [
        ...prev,
        {
          id: getNextOrderId(prev),
          customerName: "Guest Customer",
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: Number(product.price),
          totalPrice: Number(product.price),
          status: "Pending",
          date: new Date().toISOString().split("T")[0],
        },
      ];
    });
  };

  return (
    <div className={`dashboard-layout ${theme}-theme`}>
      <Header
        onToggle={() => setShowSideBar(!showSideBar)}
        isOpen={showSideBar}
      />

      <div className="dashboard-body">
        <SideBar
          isOpen={showSideBar}
          activePage={activePage}
          onPageChange={setActivePage}
          onLogOut={handleLogOut}
        />

        <main className="dashboard-content">
          <h2>{activePage}</h2>
          <MainContent
            activePage={activePage}
            products={products}
            setProducts={setProducts}
            orders={orders}
            setOrders={setOrders}
            onAddToCart={handleAddToCart}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onLogOut={handleLogOut}
            currency={currency}
            onCurrencyChange={setCurrency}
            formatCurrency={formatCurrency}
          />
        </main>
      </div>
    </div>
  );
}

export default DashBoardLayouts;
