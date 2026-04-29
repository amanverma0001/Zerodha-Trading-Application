import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineGraph = ({ stock }) => {
  if (!stock) return null;

  // Dynamic status check (Compare last price with previous one)
  const history = stock.history || [];
  const currentPrice = history[history.length - 1];
  const prevPrice = history[history.length - 2] || currentPrice;
  const isCurrentlyUp = currentPrice >= prevPrice;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeInOutSine'
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `${stock.name} - Live Price Tracking`,
        align: 'start',
        color: "#333",
        font: { size: 18, weight: 'bold', family: "'Inter', sans-serif" },
        padding: { bottom: 20 }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#666',
        bodyColor: '#000',
        borderColor: isCurrentlyUp ? '#4caf50' : '#f44336',
        borderWidth: 1,
        padding: 12,
        bodyFont: { size: 14, weight: 'bold' },
        callbacks: {
          label: (context) => ` Price: $${context.parsed.y.toFixed(2)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "rgba(0, 0, 0, 0.05)", drawBorder: false },
        ticks: { 
          color: "#999",
          callback: (value) => "$" + value.toFixed(0)
        }
      },
      x: {
        display: false, // Keep it clean, only show the line trend
        grid: { display: false }
      },
    },
  };

  // Generate a smooth gradient
  const getGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    if (isCurrentlyUp) {
      gradient.addColorStop(0, "rgba(76, 175, 80, 0)");
      gradient.addColorStop(1, "rgba(76, 175, 80, 0.2)");
    } else {
      gradient.addColorStop(0, "rgba(244, 67, 54, 0)");
      gradient.addColorStop(1, "rgba(244, 67, 54, 0.2)");
    }
    return gradient;
  };

  const data = {
    labels: Array.from({ length: history.length }, (_, i) => i),
    datasets: [
      {
        label: "Price",
        data: history,
        borderColor: isCurrentlyUp ? "#4caf50" : "#f44336",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          return getGradient(ctx, chartArea);
        },
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: isCurrentlyUp ? "#4caf50" : "#f44336",
        fill: true,
        tension: 0.4, // Smooth curve
      },
    ],
  };

  return (
    <div className="line-graph-wrapper" style={{ 
      height: "400px",
      padding: "30px", 
      background: "#fff", 
      marginBottom: "20px", 
      borderRadius: "24px", 
      border: "1px solid #eee",
      boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
      position: "relative"
    }}>
      <div style={{ position: "absolute", top: "30px", right: "30px", textAlign: "right" }}>
        <p style={{ margin: 0, color: "#999", fontSize: "0.8rem", textTransform: "uppercase" }}>Current Price</p>
        <h2 style={{ margin: 0, color: isCurrentlyUp ? "#4caf50" : "#f44336", fontSize: "1.8rem", fontWeight: "800" }}>
          ${currentPrice.toFixed(2)}
        </h2>
      </div>
      <Line options={options} data={data} />
    </div>
  );
};

export default LineGraph;
