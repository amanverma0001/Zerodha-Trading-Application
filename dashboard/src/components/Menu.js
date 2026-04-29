import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  ReceiptLongOutlined,
  WorkOutline,
  ShowChartOutlined,
  AccountBalanceWalletOutlined,
  AppsOutlined,
  DarkModeOutlined,
  LightModeOutlined,
} from "@mui/icons-material";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      window.location.href = "http://localhost:3000/signup"; // Redirect to Signup/Login Page
    }
    setIsProfileDropdownOpen(false);
  };

  const handleDropdownItemClick = (name) => {
    if (name === "Console") {
      window.open("https://console.zerodha.com", "_blank");
    } else {
      alert(`Opening ${name}...`);
    }
    setIsProfileDropdownOpen(false);
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "25px", marginLeft: "20px" }} alt="Logo" />
      <div className="menus">
        <ul>
          <li>
            <Link style={{ textDecoration: "none" }} to="/" onClick={() => handleMenuClick(0)}>
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass} style={{ display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
                <DashboardOutlined style={{ fontSize: "1.1rem" }} /> Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/orders" onClick={() => handleMenuClick(1)}>
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass} style={{ display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
                <ReceiptLongOutlined style={{ fontSize: "1.1rem" }} /> Orders
              </p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/holdings" onClick={() => handleMenuClick(2)}>
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass} style={{ display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
                <WorkOutline style={{ fontSize: "1.1rem" }} /> Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/positions" onClick={() => handleMenuClick(3)}>
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass} style={{ display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
                <ShowChartOutlined style={{ fontSize: "1.1rem" }} /> Positions
              </p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/funds" onClick={() => handleMenuClick(4)}>
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass} style={{ display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
                <AccountBalanceWalletOutlined style={{ fontSize: "1.1rem" }} /> Funds
              </p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/apps" onClick={() => handleMenuClick(6)}>
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass} style={{ display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
                <AppsOutlined style={{ fontSize: "1.1rem" }} /> Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <button 
          onClick={toggleDarkMode}
          className="theme-toggle-btn"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '20px',
            marginRight: '10px',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-color)',
            opacity: 0.8,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = 1}
          onMouseOut={(e) => e.currentTarget.style.opacity = 0.8}
        >
          {isDarkMode ? <LightModeOutlined style={{ color: '#f39c12' }} /> : <DarkModeOutlined />}
        </button>
        <div 
          className="profile-container" 
          onMouseLeave={() => setIsProfileDropdownOpen(false)}
          style={{ position: 'relative', paddingBottom: '10px' }}
        >
          <div className="profile" onClick={handleProfileClick}>
            <div className="avatar">AV</div>
            <p className="username">AV3001</p>
          </div>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown" style={{ top: '50px' }}>
              <ul>
                <li onClick={() => handleDropdownItemClick("Profile")}><Link to="#">Profile</Link></li>
                <li onClick={() => handleDropdownItemClick("Settings")}><Link to="#">Settings</Link></li>
                <li onClick={() => handleDropdownItemClick("Console")}><Link to="#">Console</Link></li>
                <li onClick={handleLogout}><Link to="#">Logout</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
