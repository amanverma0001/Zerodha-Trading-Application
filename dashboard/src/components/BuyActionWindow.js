import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import confetti from "canvas-confetti";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, price }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(price);

  useEffect(() => {
    setStockPrice(price);
  }, [price]);

  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    const newOrder = {
      name: uid,
      qty: stockQuantity,
      price: stockPrice,
      mode: "BUY",
      time: new Date().toLocaleTimeString(),
    };

    // Save to localStorage for instant UI feedback
    const savedOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
    localStorage.setItem("localOrders", JSON.stringify([newOrder, ...savedOrders]));

    axios
      .post("http://localhost:3002/newOrder", newOrder)
      .then(() => {
        // Trigger Confetti Celebration!
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#4caf50", "#4184f3", "#ffffff"],
        });

        generalContext.refreshContext();
        generalContext.closeBuyWindow();
      })
      .catch(() => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#4caf50", "#4184f3", "#ffffff"],
        });
        generalContext.refreshContext();
        generalContext.closeBuyWindow();
      });
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="header">
        <h3>Buy {uid} <span>NSE</span></h3>
      </div>
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
