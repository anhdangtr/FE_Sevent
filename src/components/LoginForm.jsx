import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import FormInput from './FormInput';

const containerStyle = {
  width: '100%',
  maxWidth: '420px',
  margin: '0 auto'
};

const buttonStyle = {
  backgroundColor: '#2D2C3C',
  color: 'white',
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer'
};

const smallLinkStyle = {
  display: 'block',
  marginTop: '6px',
  color: '#0088FF',
  textDecoration: 'none',
  fontSize: '13px'
};

const registerLink = {
   color: '#333',
    font: '14px Arial, Helvetica, sans-serif',
    textAlign: 'center',
    marginTop: '40px',
}

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined, api: undefined });
  };

  const validate = () => {
    const tempErrors = {};
    if (!form.email) tempErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) tempErrors.email = 'Invalid email format';

    if (!form.password) tempErrors.password = 'Password is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;

    try {
      const payload = { email: form.email, password: form.password };
      const res = await axios.post('http://localhost:5000/api/auth/login', payload, { withCredentials: true });
      setSuccess(res.data.message || 'Login successful');
      // Persist token and user to localStorage
      if (res.data.token) {
        localStorage.setItem('authToken', res.data.token);
        console.log(res.data.token);
      }
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        console.log(res.data.user);
      }
      // Optionally save token: localStorage.setItem('token', res.data.token)
      // Redirect to original page if provided, otherwise to home
      const returnTo = location.state?.from || '/';
      setTimeout(() => navigate(returnTo, { replace: true }), 600);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Server error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={containerStyle} className="signup-form">
      <div className="create-heading">Log in</div>

      {errors.api && <div style={{ color: '#6b6b6b', fontStyle: 'italic', marginBottom: '8px' }}>{errors.api}</div>}
      {location.state?.message && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '8px', borderRadius: 6, marginBottom: 8 }}>
          {location.state.message}
        </div>
      )}
      {success && <div style={{ color: 'green', marginBottom: '8px' }}>{success}</div>}

      <FormInput
        label="Email Address"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
        error={errors.email}
      />

      <FormInput
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Enter your password"
        error={errors.password}
      />

      <a href="/forgot" style={smallLinkStyle}>Forgot password?</a>

      <button type="submit" style={buttonStyle}>Log in</button>
      <br />
       <p style={registerLink}>
         Don't have an account? <a href="/auth/SignUp">Sign up</a>
        </p>
    </form>
  );
};

export default LoginForm;
