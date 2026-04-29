import React from "react";
import Menu from "./Menu";
import { RestartAltOutlined } from "@mui/icons-material";

const TopBar = () => {
  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the app? This will clear all your session orders and margins."
    );

    if (confirmReset) {
      localStorage.removeItem("localOrders");
      // Optional: if you have other items like theme preferences, you can clear them too
      // localStorage.clear(); 
      alert("✅ App has been reset to default values!");
      window.location.reload();
    }
  };

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-percentage">18,245.32</p>
        </div>

      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button 
          onClick={handleReset}
          style={{
            background: "rgba(255, 87, 34, 0.1)",
            color: "#ff5722",
            border: "1px solid #ff5722",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "#ff5722" + "e"}
          onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 87, 34, 0.1)"}
        >
          <RestartAltOutlined style={{ fontSize: "1rem" }} /> RESET APP
        </button>
        <Menu />
      </div>
    </div>
  );
};

export default TopBar;
