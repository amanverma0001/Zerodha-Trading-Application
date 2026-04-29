import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Custom plugin to draw price labels on top of bars with better visibility
const priceLabelsPlugin = {
  id: "priceLabels",
  afterDatasetsDraw(chart, args, options) {
    const { ctx, data } = chart;
    const isDarkMode = document.body.classList.contains("dark-mode");

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.font = "bold 13px 'Inter', sans-serif";
    
    // Use bright white in dark mode, dark grey in light mode
    ctx.fillStyle = isDarkMode ? "#ffffff" : "#333333"; 

    // Optional subtle shadow for extra crispness
    ctx.shadowColor = isDarkMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)";
    ctx.shadowBlur = 4;

    data.datasets[0].data.forEach((value, index) => {
      const bar = chart.getDatasetMeta(0).data[index];
      if (bar && !bar.hidden) {
        ctx.fillText(`$${value.toFixed(0)}`, bar.x, bar.y - 8);
      }
    });
    ctx.restore();
  }
};

export const VerticalGraph = ({ data }) => {
  // Listen for dark mode toggle explicitly to force chart re-render
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains("dark-mode"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const titleColor = isDarkMode ? "#ffffff" : "#444444";
  const tickColor = isDarkMode ? "#cccccc" : "#666666";
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Portfolio Real-time Distribution (Price Tracker)",
        color: titleColor,
        font: {
          size: 22,
          weight: "700",
          family: "'Inter', sans-serif"
        },
        padding: {
          bottom: 40
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.85)",
        titleColor: isDarkMode ? "#000" : "#fff",
        bodyColor: isDarkMode ? "#000" : "#fff",
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        displayColors: false,
        callbacks: {
          label: (context) => ` Current Value: $${context.parsed.y.toFixed(2)}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: gridColor,
        },
        ticks: {
          color: tickColor,
          font: {
            size: 11,
            weight: "600"
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
          lineWidth: 1,
        },
        ticks: {
          color: tickColor,
          stepSize: 500,
          callback: (value) => `$${value}`
        },
        border: {
          dash: [4, 4]
        }
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 10,
        right: 10
      }
    },
    elements: {
      bar: {
        borderWidth: 2,
        borderRadius: 0,
        borderSkipped: false,
      }
    }
  };

  return (
    <div style={{ height: "500px", width: "100%", position: "relative", padding: "10px" }}>
      <Bar options={options} data={data} plugins={[priceLabelsPlugin]} />
    </div>
  );
};
