import React from "react";
import SignUpForm from "../components/SignUpForm";
import logo from "../assets/logo.png";
import './SignUp.css';

const SignUp = () => {
  return (
    <div className="signup-container">
      {/* Left Panel */}
      <div className="signup-left-panel">
        {/* <img src={logo} alt="logo" className="signup-logo" /> */}
        <h1 className="signup-title">
          Discover & <br /> Stay organized
        </h1>
      </div>

      {/* Right Panel */}
      <div className="signup-right-panel">
        <div className="right-card">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
