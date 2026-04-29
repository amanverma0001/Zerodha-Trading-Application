import React, { useState, useEffect } from "react";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";
import { watchlist as initialWatchlist, holdings as initialHoldings } from "../data/data";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, price) => {},
  closeBuyWindow: () => {},
  openSellWindow: (uid, price) => {},
  closeSellWindow: () => {},
  refreshContext: () => {},
  stocks: [],
  lastUpdated: 0,
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const calculateStocks = (prevStocks = []) => {
    const localOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
    const inventoryMap = new Map();

    // 1. Calculate real-time Net Quantity for ALL stocks
    initialHoldings.forEach(h => inventoryMap.set(h.name.trim().toUpperCase(), parseInt(h.qty)));
    localOrders.forEach(order => {
      const name = order.name.trim().toUpperCase();
      const current = inventoryMap.get(name) || 0;
      inventoryMap.set(name, order.mode === "BUY" ? current + parseInt(order.qty) : Math.max(0, current - parseInt(order.qty)));
    });

    // 2. Build a UNIQUE list of all possible stocks (Watchlist + Holdings)
    const uniqueStocksMap = new Map();
    
    // Add Watchlist items first
    initialWatchlist.forEach(s => {
      const name = s.name.trim().toUpperCase();
      uniqueStocksMap.set(name, { ...s, name });
    });

    // Add/Merge Holdings items (even if they were session buys)
    inventoryMap.forEach((qty, name) => {
      if (!uniqueStocksMap.has(name)) {
        const holdingData = initialHoldings.find(h => h.name.trim().toUpperCase() === name);
        const startPrice = holdingData ? holdingData.price : 100;
        uniqueStocksMap.set(name, { name, price: startPrice, percent: "+0.00%", isDown: false });
      }
    });

    // 3. Map to final stock objects with inherited prices and history
    return Array.from(uniqueStocksMap.values()).map(stock => {
      const existing = prevStocks.find(ps => ps.name === stock.name);
      
      // Inject the baseline mathematical offset for TCS globally so Watchlist and Holdings perfectly match
      let rawBasePrice = existing ? existing.price : parseFloat(stock.price || 100);
      if (!existing && stock.name === "TCS") rawBasePrice -= 1680.42;

      // Extract original average cost for P&L color syncing
      const holding = initialHoldings.find(h => h.name.toUpperCase() === stock.name);
      let avgCost = holding ? parseFloat(holding.avg || holding.price) : null;
      if (stock.name === "TCS") avgCost = 3166.15; // 30k baseline fix
      
      return {
        ...stock,
        price: rawBasePrice,
        initialPrice: existing ? existing.initialPrice : rawBasePrice,
        avgCost: avgCost,
        pnlColor: (avgCost && rawBasePrice < avgCost) ? "#f44336" : "#4caf50",
        isOwned: (inventoryMap.get(stock.name) || 0) > 0,
        history: existing ? existing.history : Array.from({ length: 40 }, () => rawBasePrice + (Math.random() * 20 - 10))
      };
    });
  };

  const [stocks, setStocks] = useState(() => calculateStocks());

  const refreshContext = () => {
    setLastUpdated(Date.now());
    setStocks(prev => calculateStocks(prev));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(Date.now()); // FORCE RE-RENDER PULSE
      setStocks((currentStocks) =>
        currentStocks.map((stock) => {
          // Bounded random walk with a slight positive drift (70% profit bias)
          let fluctuation = (Math.random() * 10 - 4); // Skewed positive (-4 to +6)
          
          // Mean reversion to prevent walking to infinity
          const initialP = stock.initialPrice || stock.price;
          const diffFromInitial = stock.price - initialP;
          if (diffFromInitial > 50) fluctuation -= 3; // cap massive gains
          if (diffFromInitial < -20) fluctuation += 3; // cap massive losses
          
          const newPrice = Math.max(1, stock.price + fluctuation);
          
          const percentChange = (((newPrice - initialP) / initialP) * 100).toFixed(2);
          const percentString = (percentChange >= 0 ? "+" : "") + percentChange + "%";

          return {
            ...stock,
            price: newPrice,
            isDown: parseFloat(fluctuation) < 0,
            percent: percentString,
            pnlColor: stock.avgCost ? (newPrice < stock.avgCost ? "#f44336" : "#4caf50") : (parseFloat(fluctuation) < 0 ? "#f44336" : "#4caf50"),
            history: [...(stock.history || []).slice(-39), newPrice],
          };
        })
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <GeneralContext.Provider value={{
      openBuyWindow: (u, p) => { setSelectedStockUID(u); setSelectedStockPrice(p); setIsBuyWindowOpen(true); },
      closeBuyWindow: () => setIsBuyWindowOpen(false),
      openSellWindow: (u, p) => { setSelectedStockUID(u); setSelectedStockPrice(p); setIsSellWindowOpen(true); },
      closeSellWindow: () => setIsSellWindowOpen(false),
      refreshContext,
      stocks,
      lastUpdated
    }}>
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} price={selectedStockPrice} />}
      {isSellWindowOpen && <SellActionWindow uid={selectedStockUID} price={selectedStockPrice} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
