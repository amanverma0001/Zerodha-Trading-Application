import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
    setAllOrders(savedOrders);
  }, []);

  const formatCurrency = (val) => {
    return "$" + parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Helper to calculate P&L for a SELL order based on previous BUYs
  const calculateOrderPnL = (currentOrder, orderIndex, orders) => {
    if (currentOrder.mode === "BUY") return null;

    // For SELL, we look at all previous BUYs of the same stock
    const previousOrders = orders.slice(orderIndex + 1); // Orders are [newest ... oldest]
    let totalBuyQty = 0;
    let totalBuyCost = 0;

    previousOrders.forEach(order => {
      if (order.name === currentOrder.name && order.mode === "BUY") {
        totalBuyQty += parseInt(order.qty);
        totalBuyCost += (parseFloat(order.price) * parseInt(order.qty));
      }
    });

    if (totalBuyQty === 0) return 0; // No buy history found

    const avgBuyPrice = totalBuyCost / totalBuyQty;
    const pnl = (parseFloat(currentOrder.price) - avgBuyPrice) * parseInt(currentOrder.qty);
    return pnl;
  };

  if (allOrders.length === 0) {
    return (
      <div className="orders" style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="no-orders">
          <p style={{ color: "#8c949e", fontSize: "1.2rem", marginBottom: "20px" }}>You haven't placed any orders today</p>
          <Link to={"/"} className="btn" style={{ background: "#4184f3", color: "white", padding: "12px 30px", borderRadius: "4px", textDecoration: "none" }}>
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container" style={{ padding: "30px" }}>
      <h3 className="title" style={{ marginBottom: "20px", fontSize: "1.5rem", fontWeight: "600" }}>
        Orders History <span style={{ background: "rgba(0,0,0,0.05)", padding: "2px 10px", borderRadius: "12px", fontSize: "1rem" }}>{allOrders.length}</span>
      </h3>
      
      <div className="order-table" style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #f1f1f1" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f1f1f1", textAlign: "left" }}>
              <th style={{ padding: "15px", color: "#8c949e", fontWeight: "500", fontSize: "0.85rem", textTransform: "uppercase" }}>Time</th>
              <th style={{ padding: "15px", color: "#8c949e", fontWeight: "500", fontSize: "0.85rem", textTransform: "uppercase" }}>Instrument</th>
              <th style={{ padding: "15px", color: "#8c949e", fontWeight: "500", fontSize: "0.85rem", textTransform: "uppercase" }}>Type</th>
              <th style={{ padding: "15px", color: "#8c949e", fontWeight: "500", fontSize: "0.85rem", textTransform: "uppercase" }}>Qty.</th>
              <th style={{ padding: "15px", color: "#8c949e", fontWeight: "500", fontSize: "0.85rem", textTransform: "uppercase" }}>Trade Price</th>
              <th style={{ padding: "15px", color: "#8c949e", fontWeight: "500", fontSize: "0.85rem", textTransform: "uppercase" }}>Realized P&L</th>
              <th style={{ padding: "15px", color: "#8c949e", fontWeight: "500", fontSize: "0.85rem", textTransform: "uppercase" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order, index) => {
              const isBuy = order.mode === "BUY";
              const pnl = calculateOrderPnL(order, index, allOrders);
              
              return (
                <tr key={index} style={{ borderBottom: "1px solid #f9f9f9" }}>
                  <td style={{ padding: "15px", fontSize: "0.9rem", color: "#8c949e" }}>{order.time}</td>
                  <td style={{ padding: "15px", fontWeight: "700", color: "#444" }}>{order.name}</td>
                  <td style={{ padding: "15px" }}>
                    <span style={{ 
                      padding: "4px 10px", 
                      borderRadius: "4px", 
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      background: isBuy ? "rgba(65, 132, 243, 0.1)" : "rgba(255, 87, 34, 0.1)",
                      color: isBuy ? "#4184f3" : "#ff5722",
                    }}>
                      {order.mode}
                    </span>
                  </td>
                  <td style={{ padding: "15px", fontWeight: "600" }}>{order.qty}</td>
                  <td style={{ padding: "15px", fontWeight: "600" }}>{formatCurrency(order.price)}</td>
                  
                  {/* P&L COLUMN */}
                  <td style={{ padding: "15px", fontWeight: "700" }}>
                    {isBuy ? (
                      <span style={{ color: "#4184f3", fontSize: "0.8rem", opacity: 0.6 }}>Investment</span>
                    ) : (
                      <span style={{ color: pnl >= 0 ? "#4caf50" : "#f44336" }}>
                        {pnl >= 0 ? "+" : ""}{formatCurrency(pnl)}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: "15px" }}>
                    <span style={{ color: "#4caf50", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ width: "8px", height: "8px", background: "#4caf50", borderRadius: "50%" }}></span>
                      Executed
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
