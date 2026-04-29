import React, { useState, useCallback } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";
import PriceTicker from "./PriceTicker";

const Dashboard = () => {
  const [sidebarWidth, setSidebarWidth] = useState(450); // Initial width in pixels
  const location = useLocation();

  const handleMouseDown = useCallback((e) => {
    const startX = e.pageX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.pageX - startX);
      if (newWidth >= 50 && newWidth <= window.innerWidth - 5) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [sidebarWidth]);

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="dashboard-container" style={{ display: "flex" }}>
      <GeneralContextProvider>
        <div style={{ width: `${sidebarWidth}px`, height: "100%" }}>
          <WatchList />
        </div>
      
        <div
          className="resizer"
          onMouseDown={handleMouseDown}
          style={{
            width: "5px",
            cursor: "col-resize",
            height: "100%",
            backgroundColor: "var(--border-color)",
            transition: "background-color 0.2s",
            zIndex: 10
          }}
        />

        <div className="content" style={{ flex: 1, position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.2 }}
              style={{ height: '100%' }}
            >
              <Routes location={location}>
                <Route exact path="/" element={<Summary />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/holdings" element={<Holdings />} />
                <Route path="/positions" element={<Positions />} />
                <Route path="/funds" element={<Funds />} />
                <Route path="/apps" element={<Apps />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
        <PriceTicker />
      </GeneralContextProvider>
    </div>
  );
};

export default Dashboard;
