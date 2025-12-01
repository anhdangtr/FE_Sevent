import React from 'react';
import LoginForm from '../components/LoginForm';
import './SignUp.css';
import logo from '../assets/logo.png';

const LogIn = () => {
    return (
        <div className="signup-container">
            <div className="signup-left-panel">
                <img src={logo} alt="logo" className="signup-logo" />
                <h1 className="signup-title">
                    Discover & <br /> Stay organized
                </h1>
            </div>

            <div className="signup-right-panel">
                <div className="right-card">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default LogIn;