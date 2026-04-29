import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function DoughnutChart({ data }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%", // Thicker donut ring for better visibility of colors
    plugins: {
      legend: {
        display: true,
        position: "right",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 25, // More space between names
          font: {
            size: 14, // Significantly bigger font
            weight: "700", // Extra bold for clarity
            family: "'Inter', sans-serif"
          },
          color: "#333",
          filter: (legendItem, data) => {
            return data.labels.indexOf(legendItem.text) < 20; // Show more items now that we have more space
          }
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: 15,
        titleFont: { size: 16, weight: "bold" },
        bodyFont: { size: 14 },
        cornerRadius: 10,
        displayColors: true
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1800,
      easing: "easeOutQuart",
    }
  };

  return (
    <div className="doughnut-wrapper" style={{
      height: "500px", // Much bigger height
      width: "100%",
      padding: "30px",
      background: "#fff",
      borderRadius: "24px",
      marginTop: "30px",
      border: "1px solid #eee",
      boxShadow: "0 10px 40px rgba(0,0,0,0.03)"
    }}>
      <h4 style={{ margin: "0 0 20px 0", color: "#666", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Portfolio Allocation</h4>
      <div style={{ height: "400px" }}>
        <Doughnut data={data} options={options} />
      </div>
      <p style={{ fontSize: "0.8rem", color: "#999", textAlign: "center", marginTop: "15px" }}>
        Interactive Graph: Hover for details
      </p>
    </div>
  );
}
