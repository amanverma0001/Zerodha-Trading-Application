import React, { useState } from "react";
import "./Signup.css";

const Signup = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login and redirect back to dashboard
    alert(isLogin ? "Logged in successfully!" : "Account created successfully!");
    window.location.href = "http://localhost:3001"; // Redirect to Dashboard
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src="logo.png" alt="Logo" className="auth-logo" />
          <h1>{isLogin ? "Login to Kite" : "Open a new account"}</h1>
          <p>{isLogin ? "Enter your credentials to continue" : "Start your trading journey with Zerodha"}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your name" required />
            </div>
          )}
          <div className="form-group">
            <label>Email ID / User ID</label>
            <input type="text" placeholder="Enter your email or user ID" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="btn-auth">
            {isLogin ? "Login" : "Sign up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
              {isLogin ? "Sign up now" : "Login here"}
            </span>
          </p>
          <p className="forgot-password">Forgot user ID or password?</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
