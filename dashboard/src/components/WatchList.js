import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
  SearchOutlined,
} from "@mui/icons-material";

import { DoughnutChart } from "./DoughnoutChart";
import LineGraph from "./LineGraph";

const WatchList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGraphStock, setSelectedGraphStock] = useState(null);
  const { stocks } = useContext(GeneralContext);

  const filteredWatchlist = (stocks || [])
    .filter((stock) => stock.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      // Show owned stocks at the top
      if (a.isOwned && !b.isOwned) return -1;
      if (!a.isOwned && b.isOwned) return 1;
      
      // Secondary sort alphabetically to exactly match the Holdings list
      return a.name.localeCompare(b.name);
    });

  const data = {
    labels: filteredWatchlist.map((stock) => stock.name),
    datasets: [
      {
        label: "Market Price",
        data: filteredWatchlist.map((stock) => stock.price),
        backgroundColor: filteredWatchlist.map((_, i) => `hsla(${i * 45}, 70%, 60%, 0.6)`),
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <div className="search-wrapper">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search eg: infy, bse..."
            className="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <span className="counts"> {filteredWatchlist.length} / 50</span>
      </div>

      {selectedGraphStock && (
        <LineGraph 
          stock={stocks.find(s => s.name === selectedGraphStock)} 
        />
      )}

      <ul className="list">
        {filteredWatchlist.map((stock, index) => {
          return <WatchListItem 
            stock={stock} 
            key={index} 
            onGraphClick={() => setSelectedGraphStock(stock.name === selectedGraphStock ? null : stock.name)}
          />;
        })}
      </ul>
      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, onGraphClick }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  // LOGO MAPPING
  const getLogoUrl = (name) => {
    const symbol = name.split(" ")[0].toUpperCase();
    
    const iconMap = {
      // Working Wikipedia SVGs
      "INFY": "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
      "TCS": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
      "WIPRO": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg",
      "ZOMATO": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg",
      "ASIANPAINT": "https://upload.wikimedia.org/wikipedia/en/e/e4/Asian_Paints_Logo.svg",
      "AXISBANK": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Axis_Bank_logo.svg",
      "PAYTM": "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg",
      "JIOFIN": "https://upload.wikimedia.org/wikipedia/commons/5/50/Reliance_Jio_Logo_%28October_2015%29.svg",
      "HDFCBANK": "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
      "SBIN": "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg",
      
      // Highly reliable Google Favicons for the rest
      "ONGC": "https://www.google.com/s2/favicons?domain=ongcindia.com&sz=128",
      "KPITTECH": "https://www.google.com/s2/favicons?domain=kpit.com&sz=128",
      "QUICKHEAL": "https://www.google.com/s2/favicons?domain=quickheal.co.in&sz=128",
      "M&M": "https://www.google.com/s2/favicons?domain=mahindra.com&sz=128",
      "RELIANCE": "https://www.google.com/s2/favicons?domain=ril.com&sz=128",
      "HUL": "https://www.google.com/s2/favicons?domain=hul.co.in&sz=128",
      "HINDUNILVR": "https://www.google.com/s2/favicons?domain=hul.co.in&sz=128",
      "TATASTEEL": "https://www.google.com/s2/favicons?domain=tatasteel.com&sz=128",
      "TATAPOWER": "https://www.google.com/s2/favicons?domain=tatapower.com&sz=128",
      "TITAN": "https://www.google.com/s2/favicons?domain=titancompany.in&sz=128",
      "BAJAJ-FIN": "https://www.google.com/s2/favicons?domain=bajajfinserv.in&sz=128",
      "ADANIENT": "https://www.google.com/s2/favicons?domain=adanienterprises.com&sz=128",
      "SUNPHARMA": "https://www.google.com/s2/favicons?domain=sunpharma.com&sz=128",
      "AIRTEL": "https://www.google.com/s2/favicons?domain=airtel.in&sz=128",
      "BHARTIARTL": "https://www.google.com/s2/favicons?domain=airtel.in&sz=128",
      "ITC": "https://www.google.com/s2/favicons?domain=itcportal.com&sz=128",
      "EVEREADY": "https://www.google.com/s2/favicons?domain=evereadyindia.com&sz=128",
      "JUBLFOOD": "https://www.google.com/s2/favicons?domain=jubilantfoodworks.com&sz=128",
      "SGBMAY29": "https://www.google.com/s2/favicons?domain=rbi.org.in&sz=128"
    };

    if (symbol.includes("NIFTY")) return "https://www.nseindia.com/assets/images/favicon.ico";
    
    // Use the exact logo URL, otherwise fallback to high-res Google Favicon
    return iconMap[symbol] || `https://www.google.com/s2/favicons?domain=${symbol.toLowerCase()}.com&sz=128`;
  };

  return (
    <li 
      onClick={() => setShowWatchlistActions(!showWatchlistActions)} 
      className="watchlist-item-li"
      style={{ position: "relative", padding: "12px 20px", cursor: "pointer" }}
    >
      <div className="item" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <img 
          src={getLogoUrl(stock.name)} 
          onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${stock.name}&background=random&color=fff`; }}
          alt={stock.name} 
          style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "contain" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <p className={stock.isDown ? "down" : "up"} style={{ margin: 0, fontWeight: "700", fontSize: "0.95rem" }}>{stock.name}</p>
            {stock.isOwned && (
              <span style={{ 
                fontSize: "0.6rem", 
                background: "rgba(56, 142, 255, 0.1)", 
                color: "#388eff", 
                padding: "2px 6px", 
                borderRadius: "4px", 
                fontWeight: "900",
                letterSpacing: "0.5px"
              }}>OWNED</span>
            )}
          </div>
        </div>
        <div className="item-info" style={{ textAlign: "right", display: "flex", alignItems: "center" }}>
          <span className="percent" style={{ 
            fontSize: "0.85rem", 
            fontWeight: "600",
            color: stock.isOwned ? stock.pnlColor : ((stock.percent && stock.percent.includes("-")) ? "#f44336" : "#4caf50")
          }}>
            {stock.percent || "+0.00%"}
          </span>
          {stock.isDown ? (
            <KeyboardArrowDown style={{ color: stock.isOwned ? stock.pnlColor : "#f44336" }} />
          ) : (
            <KeyboardArrowUp style={{ color: stock.isOwned ? stock.pnlColor : "#4caf50" }} />
          )}
          <span className="price" style={{ 
            fontWeight: "700", 
            color: stock.isOwned ? stock.pnlColor : "inherit" 
          }}>${stock.price.toFixed(2)}</span>
        </div>
      </div>
      {showWatchlistActions && <WatchListActions stock={stock} uid={stock.name} onGraphClick={onGraphClick} />}
    </li>
  );
};

const WatchListActions = ({ stock, uid, onGraphClick }) => {
  const generalContext = useContext(GeneralContext);

  return (
    <span className="actions">
      <span style={{ display: "flex", gap: "5px", padding: "0 10px" }}>
        <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
          <button className="buy" onClick={() => generalContext.openBuyWindow(uid, stock.price)}>Buy</button>
        </Tooltip>
        <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
          <button className="sell" onClick={() => generalContext.openSellWindow(uid, stock.price)}>Sell</button>
        </Tooltip>
        <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
          <button className="action" onClick={onGraphClick}>
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <button className="action">
          <MoreHoriz className="icon" />
        </button>
      </span>
    </span>
  );
};
