import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { holdings } from "../data/data";
import { AccountBalanceWallet, PieChart } from "@mui/icons-material";
import GeneralContext from "./GeneralContext";

const Summary = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [marginUsed, setMarginUsed] = useState(0);
  const { stocks } = useContext(GeneralContext);

  useEffect(() => {
    // Load holdings
    axios.get("https://zerodha-backend-5f55.onrender.com/allHoldings")
      .then((res) => {
        setAllHoldings(res.data);
      })
      .catch((err) => {
        setAllHoldings(holdings);
      });

    // CALCULATE MARGIN FROM LOCAL ORDERS
    const calculateMargin = () => {
      const localOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
      const total = localOrders.reduce((acc, order) => {
        return acc + (parseFloat(order.price) * parseInt(order.qty));
      }, 0);
      setMarginUsed(total);
    };

    calculateMargin();
    window.addEventListener('storage', calculateMargin);
    return () => window.removeEventListener('storage', calculateMargin);
  }, []);

  // SYNC PRICES FOR P&L CALCULATION
  const getSyncedValue = () => {
    return allHoldings.reduce((acc, holding) => {
      const globalStock = (stocks || []).find(s => s.name === holding.name);
      let currentPrice = globalStock ? globalStock.price : (holding.price || holding.avg);
      return acc + (currentPrice * holding.qty);
    }, 0);
  };

  const totalInvestment = 30000;
  const initialBalance = 30000;
  const availableMargin = initialBalance - marginUsed;

  const currentValue = getSyncedValue();
  const totalPnL = currentValue - totalInvestment;
  const isProfit = totalPnL >= 0;

  const formatCurrency = (val) => {
    return "$" + val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="summary-container" style={{ padding: "30px 0", display: "flex", gap: "30px", flexWrap: "wrap" }}>

      {/* Equity Card */}
      <div className="summary-card glass-card" style={{
        flex: "1", minWidth: "350px", padding: "40px", borderRadius: "20px",
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <p style={{ fontSize: "1.1rem", fontWeight: "600", color: "#8c949e", textTransform: "uppercase", margin: 0 }}>Equity Balance</p>
          <AccountBalanceWallet style={{ color: "#4481eb" }} />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "700", color: "#4caf50", margin: "0" }}>
            {formatCurrency(availableMargin)}
          </h1>
          <p style={{ color: "#8c949e", marginTop: "5px" }}>Available Margin</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
          <div>
            <p style={{ color: "#8c949e", fontSize: "0.9rem" }}>Margins used</p>
            <p style={{ fontSize: "1.3rem", fontWeight: "700", color: marginUsed > 0 ? "#f44336" : "#fff" }}>
              {formatCurrency(marginUsed)}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#8c949e", fontSize: "0.9rem" }}>Opening balance</p>
            <p style={{ fontSize: "1.3rem", fontWeight: "600" }}>$30,000.00</p>
          </div>
        </div>
      </div>

      {/* Holdings Card */}
      <div className="summary-card glass-card" style={{
        flex: "1", minWidth: "350px", padding: "40px", borderRadius: "20px",
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <p style={{ fontSize: "1.1rem", fontWeight: "600", color: "#8c949e", textTransform: "uppercase", margin: 0 }}>Holdings ({allHoldings.length})</p>
          <PieChart style={{ color: isProfit ? "#4caf50" : "#f44336" }} />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h1 style={{
            fontSize: "3rem",
            fontWeight: "700",
            margin: "0",
            color: isProfit ? "#4caf50" : "#f44336"
          }}>
            {isProfit ? "+" : ""}{formatCurrency(totalPnL)}
            <span style={{ fontSize: "1.2rem", marginLeft: "15px", fontWeight: "500", opacity: 0.8 }}>
              ({((totalPnL / totalInvestment) * 100 || 0).toFixed(2)}%)
            </span>
          </h1>
          <p style={{ color: "#8c949e", marginTop: "5px" }}>Total Profit & Loss</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
          <div>
            <p style={{ color: "#8c949e", fontSize: "0.9rem" }}>Current Value</p>
            <p style={{ fontSize: "1.3rem", fontWeight: "700" }}>{formatCurrency(currentValue)}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#8c949e", fontSize: "0.9rem" }}>Investment</p>
            <p style={{ fontSize: "1.3rem", fontWeight: "600" }}>{formatCurrency(totalInvestment)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
