import React from "react";

const PriceTicker = () => {
  const tickerData = [
    { name: "NIFTY 50", price: "18,245.32", change: "+0.52%", isLoss: false },
    { name: "SENSEX", price: "60,124.54", change: "+0.48%", isLoss: false },
    { name: "RELIANCE", price: "2,112.40", change: "+1.44%", isLoss: false },
    { name: "TCS", price: "3,210.15", change: "-0.25%", isLoss: true },
    { name: "INFY", price: "1,555.45", change: "-1.60%", isLoss: true },
    { name: "HDFC BANK", price: "1,678.90", change: "+0.35%", isLoss: false },
    { name: "TATA MOTORS", price: "645.20", change: "+2.10%", isLoss: false },
    { name: "WIPRO", price: "577.75", change: "+0.32%", isLoss: false },
  ];

  return (
    <div className="price-ticker-container">
      <div className="ticker-wrap">
        <div className="ticker-move">
          {tickerData.concat(tickerData).map((item, index) => (
            <div key={index} className="ticker-item">
              <span className="ticker-name">{item.name}</span>
              <span className="ticker-price">{item.price}</span>
              <span className={`ticker-change ${item.isLoss ? "loss" : "profit"}`}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;
