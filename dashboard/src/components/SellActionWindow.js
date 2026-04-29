import React, { useState, useContext, useEffect } from "react";
import "./BuyActionWindow.css"; 
import GeneralContext from "./GeneralContext";
import { holdings as initialHoldings } from "../data/data";

const SellActionWindow = ({ uid, price }) => {
  const [qty, setQty] = useState(1);
  const [availableQty, setAvailableQty] = useState(0);
  const { closeSellWindow, refreshContext } = useContext(GeneralContext);

  useEffect(() => {
    const localOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
    const initial = initialHoldings.find(h => h.name.trim().toUpperCase() === uid.trim().toUpperCase());
    let currentQty = initial ? parseInt(initial.qty) : 0;

    localOrders.forEach(order => {
      if (order.name.trim().toUpperCase() === uid.trim().toUpperCase()) {
        if (order.mode === "BUY") currentQty += parseInt(order.qty);
        if (order.mode === "SELL") currentQty -= parseInt(order.qty);
      }
    });

    setAvailableQty(currentQty);
  }, [uid]);

  const handleSellClick = () => {
    const sellQty = parseInt(qty);
    if (sellQty <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    if (sellQty > availableQty) {
      alert(`⚠️ INSUFFICIENT QUANTITY!\nYou only have ${availableQty} shares of ${uid}.`);
      return;
    }

    const order = {
      time: new Date().toLocaleTimeString(),
      name: uid,
      mode: "SELL",
      qty: sellQty,
      price: price,
      status: "Executed"
    };

    const existingOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
    localStorage.setItem("localOrders", JSON.stringify([order, ...existingOrders]));

    alert(`✅ Successfully Sold ${sellQty} shares of ${uid} at $${price}!`);
    refreshContext();
    closeSellWindow();
  };

  return (
    <div className="container" id="buy-window" style={{ borderTop: "5px solid #ff5722", minWidth: "350px" }}>
      <div className="header" style={{ marginBottom: "15px" }}>
        <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#444" }}>Sell {uid}</h3>
        <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem", color: availableQty > 0 ? "#4caf50" : "#f44336" }}>
          Available Quantity: <strong>{availableQty}</strong>
        </p>
      </div>

      <div className="inputs">
        <div className="fieldset" style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "4px", marginBottom: "15px" }}>
          <label htmlFor="qty" style={{ fontSize: "0.8rem", color: "#8c949e", display: "block" }}>Qty. to Sell</label>
          <input
            type="number"
            name="qty"
            id="qty"
            style={{ border: "none", width: "100%", fontSize: "1.1rem", fontWeight: "600", outline: "none" }}
            onChange={(e) => setQty(e.target.value)}
            value={qty}
          />
        </div>
        <div className="fieldset" style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "4px", background: "#f9f9f9" }}>
          <label htmlFor="price" style={{ fontSize: "0.8rem", color: "#8c949e", display: "block" }}>Market Price</label>
          <input
            type="number"
            name="price"
            id="price"
            style={{ border: "none", width: "100%", fontSize: "1.1rem", fontWeight: "600", outline: "none", background: "transparent" }}
            value={price}
            readOnly
          />
        </div>
      </div>

      <div className="buttons" style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ textAlign: "left" }}>
          <span style={{ fontSize: "0.75rem", color: "#8c949e", display: "block" }}>Total Credit</span>
          <span style={{ fontSize: "1rem", fontWeight: "700", color: "#ff5722" }}>${ (qty * price).toFixed(2) }</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            className="btn btn-sell" 
            onClick={handleSellClick}
            disabled={availableQty <= 0}
            style={{ 
              backgroundColor: availableQty <= 0 ? "#ccc" : "#ff5722", 
              border: "none", color: "white", padding: "10px 25px", 
              borderRadius: "4px", cursor: availableQty <= 0 ? "not-allowed" : "pointer", 
              fontWeight: "700" 
            }}
          >
            Sell
          </button>
          <button 
            className="btn btn-grey" 
            onClick={closeSellWindow}
            style={{ backgroundColor: "#eee", border: "none", color: "#666", padding: "10px 20px", borderRadius: "4px", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
