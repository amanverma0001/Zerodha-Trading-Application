import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { holdings as initialHoldingsData } from "../data/data";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Holdings = () => {
  const [baseHoldings, setBaseHoldings] = useState(initialHoldingsData);
  const { stocks, lastUpdated } = useContext(GeneralContext);

  useEffect(() => {
    axios.get("https://zerodha-backend-5f55.onrender.com/allHoldings")
      .then((res) => {
        if (res.data && res.data.length > 0) setBaseHoldings(res.data);
      })
      .catch(() => {
        setBaseHoldings(initialHoldingsData);
      });
  }, []);

  // RE-CALCULATE SYNCED DATA ON EVERY PULSE
  const getSyncedHoldings = () => {
    const localOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
    const inventoryMap = new Map();

    // 1. Initial holdings
    baseHoldings.forEach(h => {
      inventoryMap.set(h.name.trim().toUpperCase(), { ...h, qty: parseInt(h.qty) });
    });

    // 2. Session orders
    localOrders.forEach(order => {
      const name = order.name.trim().toUpperCase();
      if (inventoryMap.has(name)) {
        const current = inventoryMap.get(name);
        if (order.mode === "BUY") current.qty += parseInt(order.qty);
        else current.qty = Math.max(0, current.qty - parseInt(order.qty));
      } else if (order.mode === "BUY") {
        inventoryMap.set(name, {
          name: name,
          qty: parseInt(order.qty),
          avg: parseFloat(order.price),
          price: parseFloat(order.price),
        });
      }
    });

    // 3. Map to LIVE prices from context
    return Array.from(inventoryMap.values())
      .filter(h => h.qty > 0)
      .map(holding => {
        const live = (stocks || []).find(s => s.name === holding.name.toUpperCase());
        let ltp = live ? live.price : holding.price;
        let avg = holding.avg || holding.price;
        
        // Use global synced avg for TCS
        if (holding.name.toUpperCase() === "TCS") avg = 3166.15;
        
        const pnl = (ltp - avg) * holding.qty;
        
        return {
          ...holding,
          avg: avg,
          price: ltp,
          curVal: ltp * holding.qty,
          pnl: pnl,
          isDown: live ? live.isDown : false
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const syncedHoldings = getSyncedHoldings();

  const totalInv = 30000;
  const totalCur = syncedHoldings.reduce((acc, h) => acc + h.curVal, 0);
  const totalPnL = totalCur - totalInv;

  const formatPrice = (p) => p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const chartData = {
    labels: syncedHoldings.map((h) => h.name),
    datasets: [{
      label: "Current Value ($)",
      data: syncedHoldings.map((h) => h.curVal), 
      backgroundColor: syncedHoldings.map((h) => h.pnl >= 0 ? "rgba(67, 160, 71, 0.95)" : "rgba(229, 57, 53, 0.95)"),
      borderColor: syncedHoldings.map((h) => h.pnl >= 0 ? "#2e7d32" : "#c62828"),
      borderWidth: 2,
      borderRadius: 0,
    }],
  };

  return (
    <div className="holdings-container" style={{ padding: "20px" }}>
      {/* lastUpdated ensures this component re-renders even if references look same */}
      <div key={lastUpdated} style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div className="card" style={{ flex: 1, padding: "25px", background: "var(--card-bg)", borderRadius: "20px", border: "1px solid var(--border-color)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
          <p style={{ color: "var(--text-color)", opacity: 0.6, fontSize: "0.8rem", margin: 0, letterSpacing: "1px" }}>INVESTMENT</p>
          <h2 style={{ margin: "10px 0", fontSize: "2.2rem" }}>${formatPrice(totalInv)}</h2>
        </div>
        <div className="card" style={{ flex: 1, padding: "25px", background: "var(--card-bg)", borderRadius: "20px", border: "1px solid var(--border-color)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
          <p style={{ color: "var(--text-color)", opacity: 0.6, fontSize: "0.8rem", margin: 0, letterSpacing: "1px" }}>CURRENT VALUE</p>
          <h2 style={{ margin: "10px 0", fontSize: "2.2rem" }}>${formatPrice(totalCur)}</h2>
        </div>
        <div className="card" style={{ flex: 1, padding: "25px", background: totalPnL >= 0 ? "rgba(76,175,80,0.05)" : "rgba(244,67,54,0.05)", borderRadius: "20px", border: "1px solid var(--border-color)" }}>
          <p style={{ color: "var(--text-color)", opacity: 0.6, fontSize: "0.8rem", margin: 0, letterSpacing: "1px" }}>TOTAL P&L</p>
          <h2 style={{ margin: "10px 0", fontSize: "2.2rem", color: totalPnL >= 0 ? "#4caf50" : "#f44336" }}>
            {totalPnL >= 0 ? "+" : ""}${formatPrice(totalPnL)}
          </h2>
        </div>
      </div>

      <h3 className="title">Holdings ({syncedHoldings.length})</h3>

      <div className="order-table" style={{ background: "var(--card-bg)", borderRadius: "20px", border: "1px solid var(--border-color)", overflow: "hidden", boxShadow: "0 5px 20px rgba(0,0,0,0.02)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg-color)", borderBottom: "2px solid var(--border-color)" }}>
              <th style={{ padding: "18px", textAlign: "left", fontSize: "0.95rem", color: "var(--text-color)", opacity: 0.7, fontWeight: "600" }}>Instrument</th>
              <th style={{ padding: "18px", textAlign: "right", fontSize: "0.95rem", color: "var(--text-color)", opacity: 0.7, fontWeight: "600" }}>Qty.</th>
              <th style={{ padding: "18px", textAlign: "right", fontSize: "0.95rem", color: "var(--text-color)", opacity: 0.7, fontWeight: "600" }}>Avg. Cost</th>
              <th style={{ padding: "18px", textAlign: "right", fontSize: "0.95rem", color: "var(--text-color)", opacity: 0.7, fontWeight: "600" }}>LTP</th>
              <th style={{ padding: "18px", textAlign: "right", fontSize: "0.95rem", color: "var(--text-color)", opacity: 0.7, fontWeight: "600" }}>P&L</th>
            </tr>
          </thead>
          <tbody>
            {syncedHoldings.map((h, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "var(--bg-color)"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "18px", fontWeight: "700", color: "var(--text-color)", fontSize: "1rem" }}>{h.name}</td>
                <td style={{ padding: "18px", textAlign: "right", color: "var(--text-color)", opacity: 0.8, fontSize: "1rem", fontWeight: "500" }}>{h.qty}</td>
                <td style={{ padding: "18px", textAlign: "right", color: "var(--text-color)", opacity: 0.8, fontSize: "1rem", fontWeight: "500" }}>{formatPrice(h.avg || h.price)}</td>
                <td style={{ padding: "18px", textAlign: "right", fontWeight: "800", fontSize: "1.05rem", color: h.pnl >= 0 ? "#43a047" : "#e53935" }}>
                  {formatPrice(h.price)}
                </td>
                <td style={{ padding: "18px", textAlign: "right", fontWeight: "800", fontSize: "1.05rem", color: h.pnl >= 0 ? "#43a047" : "#e53935" }}>
                  {formatPrice(h.pnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "40px", padding: "30px", background: "var(--card-bg)", borderRadius: "25px", border: "1px solid var(--border-color)", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
           <span className="live-dot" style={{ width: "10px", height: "10px", background: "#4caf50", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 10px #4caf50" }}></span>
           <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-color)", opacity: 0.7 }}>LIVE PORTFOLIO PERFORMANCE</span>
        </div>
        <VerticalGraph data={chartData} />
      </div>
    </div>
  );
};

export default Holdings;
