import React from "react";

const Apps = () => {
  const apps = [
    { 
      name: "Sensibull", 
      desc: "India's largest options trading platform", 
      icon: "https://www.google.com/s2/favicons?sz=128&domain=sensibull.com",
      link: "https://sensibull.com" 
    },
    { 
      name: "GoldenPi", 
      desc: "India's first online platform for bonds", 
      icon: "https://www.google.com/s2/favicons?sz=128&domain=goldenpi.com",
      link: "https://goldenpi.com" 
    },
    { 
      name: "Streak", 
      desc: "Create and backtest trading strategies", 
      icon: "https://www.google.com/s2/favicons?sz=128&domain=streak.tech",
      link: "https://www.streak.tech" 
    },
    { 
      name: "Smallcase", 
      desc: "Modern thematic investing platform", 
      icon: "https://www.google.com/s2/favicons?sz=128&domain=smallcase.com",
      link: "https://www.smallcase.com" 
    },
    { 
      name: "Ditto", 
      desc: "Insurance advisor you can trust", 
      icon: "https://www.google.com/s2/favicons?sz=128&domain=joinditto.in",
      link: "https://joinditto.in" 
    },
  ];

  const handleLaunch = (link) => {
    window.open(link, "_blank");
  };

  return (
    <div className="apps-container">
      <h1>Apps</h1>
      <div className="apps-grid">
        {apps.map((app, index) => (
          <div key={index} className="app-card" onClick={() => handleLaunch(app.link)}>
            <img src={app.icon} alt={app.name} className="app-logo" />
            <h3>{app.name}</h3>
            <p>{app.desc}</p>
            <button className="btn btn-blue">Launch</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apps;
