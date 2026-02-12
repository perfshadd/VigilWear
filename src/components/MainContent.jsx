import Products from "./Products";
import Orders from "./Orders";
import Customers from "./Customers";
import Settings from "./Settings";
import Alerts from "./Alerts";
import Reports from "./Reports";
import Dashboard from "./Dashboard";
function MainContent({ activePage, products, setProducts, orders, setOrders, onAddToCart, theme, onToggleTheme, onLogOut, currency, onCurrencyChange, formatCurrency }) {
    return (
        <div>
            {activePage === "Products" && (
                <Products
                    products={products}
                    setProducts={setProducts}
                    onAddToCart={onAddToCart}
                    formatCurrency={formatCurrency}
                />
            )}
            {activePage === "Dashboard" && (
                <Dashboard products={products} orders={orders} formatCurrency={formatCurrency} />
            )}
            {activePage === "Orders" && (
                <Orders
                    orders={orders}
                    setOrders={setOrders}
                    products={products}
                    setProducts={setProducts}
                    formatCurrency={formatCurrency}
                />
            )}
            {activePage === "Alerts" && <Alerts products={products} />}
            {activePage === "Reports" && (
                <Reports products={products} orders={orders} formatCurrency={formatCurrency} />
            )}
            {activePage === "Customers" && <Customers formatCurrency={formatCurrency} />}
            {activePage === "Settings" && (
                <Settings
                    theme={theme}
                    onToggleTheme={onToggleTheme}
                    onLogOut={onLogOut}
                    currency={currency}
                    onCurrencyChange={onCurrencyChange}
                />
            )}
        </div>
    )
}

export default MainContent;